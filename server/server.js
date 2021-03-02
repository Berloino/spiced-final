// Starting up your application
// Make sure you're cd'd inside adobo-socialnetwork
// Open up your terminal and split it into 2 screens
// import packages after git import             -> npm run build
// On one, run your Node server                 -> npm start
// On the other one, run your webpack server    -> npm run dev:client
// Kill all running servers §§§§§§              -> killall node
// kill current process                         -> CTRL+C
// clear console                                -> clear

const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

//////////////////////////////////////////////////////////////////////////////////////////
///////// MIDDLEWARE /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

/// Compression
const compression = require("compression"); // reduces size to improve performence
app.use(compression());

// AWS S3
const s3 = require("./s3");
const s3Url = require("./config").s3Url; //AWS Image bucket link

/// SES Email Handling

const { sendEmail } = require("./ses");

//////////////////////// HASHING PASSWORDS

const { hash, compare } = require("../client/src/Middleware/bc");

//////////////////////// creates Random string for Email Verification

const cryptoRandomString = require("crypto-random-string");

//////////////////////// Database Queries ///////////////

const db = require("./db"); // requiring our db module that holds all the db queries we want to run

//////////////////////// COOKIES

const cookieSession = require("cookie-session");

let cookieSessionScrt;
if (process.env.cookieSessionSecret) {
    // we are in production heroku
    cookieSessionScrt = process.env.cookieSessionSecret; // import PW from HEROKU
} else {
    // we are local and will get our secrets out of the secrets.json
    cookieSessionScrt = require("../secrets.json").cookieSessionSecret; // import PW from secrets.json
}

const cookieSessionMiddleware = cookieSession({
    name: "adobocookie",
    secret: cookieSessionScrt,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1000 milisec * 60 sec * 60 min * 24 hours *7  days -> 1 weeks cookie stays alive
});

app.use(cookieSessionMiddleware);

//////////////////////// SECURITY ////////////////////////

//Protect from CSRF attacks

const csurf = require("csurf");
app.use(csurf());
app.use((req, res, next) => {
    res.cookie("myaxioscsurftoken", req.csrfToken());
    next();
});

////

app.use((req, res, next) => {
    console.log("req.url", req.url);
    console.log("req.session:", req.session);

    next();
});

app.use(express.static(path.join(__dirname, "..", "client", "public"))); // normalising path and making it work for most OS

//////////////////////// UPLOADS ////////////////////////

const { uploader } = require("./uploads");
const { send } = require("process");
app.use(express.static(path.join(__dirname, "..", "server", "uploads")));

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// EXPRESS ROUTES ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET WELCOME ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.get("/welcome", (req, res) => {
    // if you don't have the cookie-session middelware this code will NOT work!
    console.log("GET WELCOME ROUTE, req.session: ", req.session);
    if (req.session.userId) {
        console.log("Landed in app.get(/welcome)");
        res.redirect("/");
    } else {
        // user is not logged in... don't redirect!
        // what happens after sendfile, after we send our HTML back as a response,
        // is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST REGISTRATION ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.post("/registration", (req, res) => {
    console.log("Landed in POST REGISTER");
    console.log("req.body", req.body);
    let { first, last, email, password } = req.body; // input name properties in form, register.js

    if (first == "" || last == "" || !email.includes("@") || password == "") {
        console.log("seems like not all input fields are filled");
        res.json({ error: true });
    } else {
        // Hash Password for user data protection first
        hash(password)
            .then((hashedPassword) => {
                console.log(
                    "hashed Password created for new user: ",
                    hashedPassword
                );

                return db
                    .createNewUser(first, last, email, hashedPassword)
                    .then((result) => {
                        console.log("NEW USER added to db, db.createNewUser()");
                        console.log("result.id: ", result.rows[0].id);
                        console.log("result: ", result.rows[0]);
                        req.session.userId = result.rows[0].id; // CREATE req.session.userId - Session Cookie
                        console.log("Session.iserId cookie set updated");
                        return res.json(result.rows[0].id);
                    })
                    .catch((err) => {
                        console.log(
                            "ERROR on POST REGISTER db.createNewUser()",
                            err
                        );
                        return res.json({ error: true });
                    });
            })
            .catch((err) => {
                console.log("Error in hash(password)", err);
                res.json({ error: true });
            });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST LOGIN ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
    console.log("on POST LOGIN route");
    const { email, password } = req.body;
    console.log("[/login]: req.body :", req.body);

    db.getDataFromEmailKey(email)
        .then(({ rows }) => {
            console.log("rows: ", rows);
            const hashedPw = rows[0].password;
            compare(password, hashedPw)
                .then((match) => {
                    if (match) {
                        req.session.userId = rows[0].id;
                        req.session.loggedIn = rows[0].id; // check if necessary
                        console.log(
                            "Session.iserId cookie set updated: ",
                            req.session
                        );
                        return res.json(req.session.userId);
                    } else {
                        console.log(
                            "[db.getDataFromEmailKey]: errorMessage: This email or password doesn't exist"
                        );
                    }
                })
                .catch((err) => {
                    console.log("err in compare:", err);
                });
        })
        .catch((err) => {
            console.log("Error in db.getDataFromEmailKey: ", err);
            res.json({ error: "Log In was rejected by server" });
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// PART 3 RESET PASSWORD ///////////////////////////////////////////
//////////////////////// Consists of two post request:///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////// app.post("/password/reset/start" & app.post("/password/reset/verify"///////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.post("/password/reset/start", (req, res) => {
    // this runs when the user enters their email in ResetPassword

    console.log("[server.js] Currently on post('/password/reset/start') route");
    console.log(
        "[server.js] post('/password/reset/start')  req.body ",
        req.body
    );
    // Import data definded in [resetpassword.js] component
    const { email } = req.body;
    console.log("Reset password for this email: ", email);

    // how to verify the email address?
    // query the users table to see if the email exists in it

    db.getDataFromEmailKey(email)
        .then(({ rows }) => {
            if (rows.length) {
                console.log(
                    "[server.js] db.getDataFromEmailKey(resetthisemail) -> Response {rows}: ",
                    rows
                );
                console.log("Identified Email in DB: ", rows[0].email);
                console.log("Email found in DB!");
                req.session.userId = rows[0].id; // CREATE req.session.userId - Session Cookie                                                      // IF the email from db and email from input field match
                req.session.email = rows[0].email; // CREATE SESSION COOKIE WITH EMAIL
                console.log("Session.userId cookie set updated");

                const secretCode = cryptoRandomString({ length: 10 }); // this generates a random string of 10 characters

                console.log(
                    `[server.js] Resetting password with secret code (${secretCode}) for ${email}`
                );

                // Secret Code will be stored in new table in DB

                db.storeSecretCode(email, secretCode, req.session.userId)
                    .then(() => {
                        //// FOR TESTING
                        let email = "aleksej.trubnikov@gmail.com";

                        ////
                        console.log("Inserting code into reset_codes DB");
                        const message =
                            "Please enter the following code: " + secretCode;
                        const subject = "Password reset for your account";

                        // use sendEmail to send an email to this user,
                        // remember to pass it the email of the recipient, secret code, and subject of email

                        sendEmail(email, message, subject);
                    })
                    .then(() => {
                        // send back a response to the client (ResetPassword) indicating either
                        // 1. everything went according to plan
                        // 2. something broke along the way :(

                        console.log("Email sent");
                        res.json({ error: false });
                    })
                    .catch((err) => {
                        // 2. something broke along the way :(
                        console.log("err in sendEmail", err);
                        res.json({
                            error: "2. something broke along the way :(",
                        });
                    });
            } else {
                console.log(
                    "[db.getDataFromEmailKey]: errorMessage: This email doesn't exist"
                );
                res.json({ error: "This email doesn't exist" });
            }
        })
        .catch((err) => {
            console.log(
                "[db.getDataFromEmailKey]: errorMessage: This email doesn't exist"
            );
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    /*
        big picture 
        1. verify the code the user entered is correct 
        2. take new password, hash it, and store it in users 
    */

    console.log("[server.js] on app.post('/password/reset/verify)'");
    console.log(req.body);
    const { verificationcode, confirmednewpassword } = req.body;
    console.log(req.session);
    // Current Id and email session cookies
    const { email, userId } = req.session;
    console.log("[server.js] req.session: ", req.session);

    // verifying the code
    // 1. go to reset_codes and retrieve the code stored there for the user
    // we want to make sure the code is no more than 10 minutes old! We can use this query
    /* !!! IMPLEMENT IN  db.checkSecretCode(verificationcode, email) !!!
        SELECT * FROM my_table
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
    */
    // if the code is expired - send back a message to React indicating that
    // (send back some sort of failure/error message)

    /// CHECK IF ALL INPUT FIELDS ARE FILLED IN! : verificationcode, confirmednewpassword

    if (verificationcode && confirmednewpassword) {
        console.log("✅ all inputfields are filled");
        /// checkSecretCode takes userId from Session cookie and checks if input verificationcode matches secretCode in DB
        console.log("session.cookie.userId: ", userId);
        db.checkSecretCode(userId, verificationcode)
            .then(({ rows }) => {
                console.log("[server.js] app.post('/password/reset/verify')");
                console.log("result for db.checkSecretCode()", rows);

                if (!rows) {
                    // if the verification code does not match
                    // send back a response to React indicating failure/error/lack of success in some way
                    // React should allow the user to enter their code again in this case
                    console.log(
                        "[server.js] app.post('/password/reset/verify') checkSecretCode()"
                    );
                    return res.json({ error: true });
                } else {
                    console.log(
                        "[server.js] db.checkSecretCode(userId, verificationcode)->result->rows: ",
                        rows
                    );
                    console.log(
                        "[server.js] verificationcode: ",
                        verificationcode
                    );
                    console.log("[server.js] rows[0].code: ", rows[0].code);
                    // if the code is NOT expired...
                    // check if the code we received from the user (in req.body) matches the code we received from the db
                    if (rows[0].code === verificationcode) {
                        console.log(
                            "✅ Verification code matches secretcode stored in reset-codes DB"
                        );

                        hash(confirmednewpassword)
                            .then((hashedPassword) => {
                                db.storeNewPassword(userId, hashedPassword)
                                    .then(() => {
                                        console.log(
                                            "✅ Password successfully updated in users DB after PW hashing and db.storeNewPassword()"
                                        );
                                        res.json({ error: false });
                                    })
                                    .catch((err) => {
                                        console.log(
                                            "❌ Password update unsuccessful after PW hashing and db.storeNewPassword()"
                                        );
                                        console.log(
                                            "[server.js] error code",
                                            err
                                        );
                                        res.json({ error: true });
                                    });
                            })
                            .catch((err) => {
                                console.log(
                                    "❌ [server.js] Password update unsuccessful after PW hashing: ",
                                    err
                                );
                                res.json({ error: true });
                            });
                    } else {
                        console.log(
                            "❌verification code does not match secretcode stored in reset-codes DB "
                        );
                    }
                }
            })
            .catch((err) => {
                console.log(
                    "[server.js] Err0r in db.checkSecretCode(userId, verificationcode)",
                    err
                );
                res.json({ error: "Error in verification" });
            });
    } else {
        console.log("❌not all input fields are filled out");
        console.log("err in checkCode", err);
        res.json({
            error:
                "[server.js] app.post('/password/reset/verify') detected empty input field",
        });
        res.json({ error: "detected empty input field" });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST USER ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// PART4 GET /user endpoint to fetch the user data when App mounts.

app.get("/api/user", (req, res) => {
    //see app.js: axios.get("/api/user")
    console.log(`req.session: ${req.session}`);

    db.getUserData(req.session.userId)
        .then(({ rows }) => {
            console.log("[server.js], Inside route: app.get('/api/user')");
            console.log("getUserData(req.session.userId) -> rows: ", rows);
            res.json({ rows: rows[0] });
        })
        .catch((err) => {
            console.log("Error fetching userData: ", err);
            res.json({ err: true });
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST PROFILE-PIC ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// PART 4 POST /profile-pic endpoint to upload a new profile picture. (When that happens you want to UPDATE the appropriate user row)

app.post("/profile-pic", uploader.single("file"), s3.upload, (req, res) => {
    console.log("[server.js], Inside route: app.post('/profile-pic')");
    console.log("req.file: ", req.file);
    const { filename } = req.file;
    let fileurl = `${s3Url}${filename}`;

    if (filename) {
        console.log("File detected!");
        console.log(
            "running: db.addProfilePic( fileurl: " +
                fileurl +
                " , req.session.userId: " +
                req.session.userId +
                " )"
        );
        db.addProfilePic(fileurl, req.session.userId)
            .then(({ rows }) => {
                console.log("✅ profile picture successfully added to db");
                console.log(
                    "addProfilePic(fileurl, req.session.userId) -> rows: ",
                    rows
                );
                res.json({ rows });
            })
            .catch((err) => {
                console.log(
                    "[server.js] Error in uploading profile picture: ",
                    err
                );
                res.json({ success: false });
            });
    } else {
        console.log(
            "❌ [server.js] failed to execute: addProfilePic(fileurl, req.session.userId)"
        );
        console.log("Check if file exceeds 3MB");
        res.json({ success: false });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST UPDATE-BIO ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

/// PART 5

app.post("/update-bio", (req, res) => {
    //, async (req, res) => {

    console.log("[server.js] Inside post'/update-bio': ", req.body.inputbio);

    db.addBio(req.body.inputbio, req.session.userId)
        .then(({ rows }) => {
            console.log(
                "[server.js] db.addBio(req.body.inputbio, req.session.userId) -> results ",
                rows
            );
            if (rows.length) {
                console.log("Rows in addBio: ", rows);
                console.log("results rows:", rows[0].bio);
                res.json({ success: true, bio: rows[0].bio });
            } else {
                console.log("[server.js] unable to write bio ");
                res.json({
                    success: false,
                    errorMessage: "unable to write bio",
                });
            }
        })
        .catch((err) => {
            console.log("[server.js] Error in addBio: ", err);
            res.json({ success: false, errorMessage: "Error in addBio" });
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET show-users/:userId ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//// PART 6 linked to otherProfile.js       Component: <OtherProfile />

app.get("/display-other-user-profile/:userId", (req, res) => {
    // // server route should not match route in client browser url: /users/:id
    console.log(
        "[server.js] <OtherProfile/> sent GET('/display-other-user-profile/:userId') request"
    );
    // DYNAMIC ROUTING! :userId !
    // console.log("dynamic user id route");
    const { userId } = req.params; // DYNAMIC ROUTING! :userId !

    console.log(
        "[server.js] Dynamic routing takes :userId' from url: ",
        userId
    );

    console.log(`[server.js] db.getUserData(userId: ${userId} )`);
    db.getUserData(userId)
        .then(({ rows }) => {
            // console.log("get user rows in 0", rows[0]);
            // is userid same as session id
            res.json({
                success: true,
                rows: rows[0],
                cookie: req.session.userId,
            });
            // res.json({ success: true, rows: rows[0] });
        })
        .catch((err) => {
            console.log(
                "[server.js] ERROR in Request from <OtherProfile/> sent GET('/display-other-user-profile/:userId')",
                err
            );
            res.json({ success: false });
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET users ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//// PART 7 linked to findProfile.js    Component: <FindPeople />

app.get("/api/users/", (req, res) => {
    console.log("[server.js] findProfile.js sent axios request GET/api/users");
    db.returnRecent4Users()
        .then(({ rows }) => {
            console.log("[server.js] INSIDE app.get(/api/users/) ROUTE");
            console.log("[server.js] -> db.returnRecent4Users()");
            console.log("rows: ", rows);
            res.json({ rows: rows });
        })
        .catch((err) => {
            console.log("Error: Failed to return 4 recent Users: ", err);
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET find/:users ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.get("/find/:users", (req, res) => {
    const user = req.params.users;

    db.getMatchingUsers(user)
        .then(({ rows }) => {
            // console.log("rows in find users: ", rows);
            if (rows.length === 0) {
                res.json({ success: false, rows: [] });
            } else {
                res.json({ success: true, rows: rows });
            }
        })
        .catch((err) => {
            console.log("there was an error ingetMatchingUsers ", err);
            res.json({ success: false });
        });
});

///// modified POST ROUTE FOR [action.js] <FRIENDS />

app.post("/friendships/:otherUserId", (req, res) => {
    console.log("[server.js] Friendships PART 9");
    console.log("[server.js] button was clicked in <FRIENDS/>");
    console.log("[server.js] Received axios request from [acion.js]");

    const { otherUserId } = req.params;
    console.log(
        `[server.js] inside app.post(/friendships/:otherUserId: ${otherUserId} )`
    );

    // console.log("post send friend request route");

    const loggedInUser = req.session.userId;
    // const requestedUser = req.body.otherProfileId;  // from handleSUbmit() in [friendButton.js]
    //dynamic - hence req.param for :status
    const requestedUser = otherUserId;
    const { status } = req.body; // [action.js]     axios.post(`/friendships/${otherId}`, { status: 'Accept Friendship Request'})

    console.log("[server.js] loggedInUser: ", loggedInUser);
    console.log("[server.js] req.body: ", req.body);
    console.log("[server.js] req.params: ", req.params); // [server.js] req.params:  { status: 'Send Friend Request' }
    console.log("[server.js] requestedUser: ", requestedUser);
    console.log("[server.js] Current Friendship status: ", status); // [server.js] Current Friendship status:  Send Friend Request

    console.log(
        "[server.js] PART 8: 7. What should I do when the button is clicked"
    );
    if (status == "Send Friend Request") {
        console.log("[server.js] if (req.params.status == 'SEND')");

        // INSERT query
        // [db.js] makeFriendRequest    = (senderId, receiverId)
        console.log("[server.js ] 👫 Friend Request Made");
        db.makeFriendRequest(loggedInUser, requestedUser)
            .then(({ rows }) => {
                console.log(
                    "[server.js] rows in db.makeFriendRequest(): ",
                    rows
                );
                res.json({
                    rows: rows,
                    // button: "Cancel Friendship Request" // when making friend request render button to Cancel Friendship Request
                });
            })
            .catch((err) => {
                console.log(
                    "[server.js] error in db.makeFriendRequest(): ",
                    err
                );
                res.json({ success: false });
            });
    } else if (status == "Accept Friendship Request") {
        console.log("[server.js] if (req.params.status == 'ACCEPT)");

        console.log("[server.js ] 👫  Friend Request Accepted");
        // UPDATE query
        // [db.js] acceptFriendRequest = (receiverId, senderId)
        console.log("[server.js ] requestedUser: ", requestedUser);
        // RENDER UNFRIEND AND OTHER PROFILE FIRSTNAME
        db.getUserData(requestedUser)
            .then(({ rows }) => {
                // console.log("get user rows in 0", rows[0]);
                // is userid same as session id
                console.log(
                    "[server.js] rows in db.getUserData(requestedUser)",
                    rows
                );
                console.log(
                    "[server.js] rows in db.getUserData(requestedUser)",
                    rows[0].first
                );

                // let otherProfileFirstName = rows[0].first;     // index[0] important!

                db.acceptFriendRequest(requestedUser, loggedInUser)
                    .then(({ rows }) => {
                        console.log(
                            "[server.js] rows in db.acceptFriendship",
                            rows
                        );

                        res.json({
                            rows: rows,
                            // button: `Unfriend ${otherProfileFirstName}`
                        });
                    })
                    .catch((err) => {
                        console.log("error in accept friendship", err);
                    });
            })
            .catch((err) => {
                console.log(
                    "[server.js] ERROR in db.getUserData(requestedUser)",
                    err
                );
                res.json({ success: false });
            });
    } else if (status == "Unfriend" || status == "Cancel Friendship Request") {
        console.log("[server.js] if (req.params.status == 'END' OR 'CANCEL')");

        console.log("[server.js ] ❌👫  Friendship revoked");
        // DELETE query
        // [db.js] deleteFriendRequest  = (receiverId, senderId)
        db.deleteFriendRequest(requestedUser, loggedInUser)
            .then(({ rows }) => {
                console.log("[server.js] db.deleteFriendRequest() made");
                console.log("[server.js] rows in db.deleteFriendRequest", rows);
                res.json({ rows: rows, button: "Send Friend Request" });
            })
            .catch((err) => {
                console.log("error in unfriend", err);
            });
    } else {
        console.log("[server.js ] Button Text doesn't match logic");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET /friendstatus/:userId/:otherId ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// EXPRESS ROUTES

// P8.1
// The GET route should send back to the client the information that is required for the FriendButton
// to render when it mounts.

// dynamic GET route that gets the status of the friendship between :
// the person viewing (id in the cookie) and the person viewed (other user profile)

app.get("/friendship/:otherUserId", async (req, res) => {
    console.log("[server.js] Friendships PART 8");
    console.log("[server.js] inside app.get('/relationship/:otherUserId')");
    console.log("[server.js] Received axios request from [friendButton.js]");

    const loggedInUser = req.session.userId; // PERSON VIEWING
    //dynamic - hence req.param for :someUserId
    const { otherUserId } = req.params; // PERSON VIEWED, params -> dynamic :otherUserId

    console.log(
        "loggedInUser with stored req.session.userId: ",
        req.session.userId
    );
    console.log("Checking relationship with user: ", req.params.otherUserId);

    // [db.js]  checkUserRelation(receiverId, senderId)
    // - gets initial status between logged in user and user who's page we're on
    // - runs when FriendButton mounts
    // - query the database and send it the sender_id and recipient_id

    console.log(
        `[server.js ] DBquery: db.checkUserRelation(otherUserId: ${otherUserId}, loggedInUser: ${loggedInUser})`
    );
    // db.checkUserRelation(receiver, sender)
    db.checkUserRelation(otherUserId, loggedInUser)
        .then(({ rows }) => {
            console.log("[server.js], db.checkUserRelation -> rows: ", rows);

            // if you get back an empty array, there's no friendship between the two users,
            // and we should render the make friend request button

            if (rows.length === 0) {
                console.log("[server.js ] 👫  buttonText: SEND");
                res.json({
                    button: "Send Friend Request", //changes [friendButton.js]: const buttonText = { send: "Make Friendship Request" }
                    // However, does this even show with an initial const [buttonText, setbuttonText] = useState("Send Friend Request"); ?
                    // YES because this runs when the site is opening. the POST requests runs when the FriendButton components is clicked
                    success: true,
                    action: "make",
                });

                // if accepted is set to false, then we'll have to figure whether to
                // render the cancel friend request or the accept friend request button
            } else if (!rows[0].accepted) {
                // = false
                console.log("[server.js ] 👫  buttonText: CANCEL");
                if (loggedInUser == rows[0].sender_id) {
                    // loggedInUser sent request, so button renders cancel after text
                    res.json({
                        button: "Cancel Friendship Request", //changes [friendButton.js]: const buttonText = { cancel: "Cancel Friendship Request" }
                        accepted: false,
                        success: true,
                        action: "cancel",
                    });
                } else if (loggedInUser == rows[0].receiver_id) {
                    // loggedInUser was recipient of freind request, so button renders accept after text
                    // alternatively loggedInUser != rows[0].sender_id)
                    console.log("[server.js ] 👫  buttonText: ACCEPT");
                    res.json({
                        button: "Accept Friendship Request", //changes [friendButton.js]: const buttonText = { accept: "Accept Friendship" }
                        accepted: true,
                        success: true,
                        action: "accept",
                    });
                }
            } else if (rows[0].accepted) {
                // True
                // if accepted is true the button for both users should say end friendship
                console.log("[server.js ] 👫  buttonText: END");
                console.log(
                    "[server.js ] 👫  TRUE? rows[0].accepted: ",
                    rows[0].accepted
                );

                db.getUserData(otherUserId)
                    .then(({ rows }) => {
                        // console.log("get user rows in 0", rows[0]);
                        // is userid same as session id
                        console.log(
                            "[server.js] rows in db.getUserData(requestedUser)",
                            rows
                        );
                        console.log(
                            "[server.js] rows in db.getUserData(requestedUser)",
                            rows[0].first
                        );

                        let otherProfileFirstName = rows[0].first; // inex[0] important!
                        res.json({
                            button: `Unfriend ${otherProfileFirstName}`, //changes [friendButton.js]: const buttonText = { end:    "End Friendship" }
                            success: true,
                            action: "end",
                        });
                    })
                    .catch((err) => {
                        console.log(
                            "[server.js] ERROR in db.getUserData(requestedUser)",
                            err
                        );
                        res.json({ success: false });
                    });
            }
            /*
                        // if accepted is true the button for both users should say end friendship
                        } else if (rows.length > 0 && rows[0].accepted) {
                            console.log("[server.js ] 👫  buttonText: END");
                            res.json({
                                button:             "Unfriend",      //changes [friendButton.js]: const buttonText = { end:    "End Friendship" }
                                success: true,
                                action:    "end",
                            });
                        }
                    */
        })
        .catch((err) => {
            console.log(
                "[server.js] Error in executing db.checkUserRelation ",
                err
            );
            res.json({ success: false });
        });
});

// P8.2
// The POST route(s) should send back a similar response after performing the appropriate
// INSERT, UPDATE, or DELETE query.
//app.post("/check-friendship/:status", (req, res) => {

app.post("/friendshipstatus/:status", (req, res) => {
    console.log("[server.js] Friendships PART 8");
    console.log("[server.js] <FriendButton/> was clicked in <OtherProfile/>");
    console.log("[server.js] Received axios request from [friendButton.js]");
    console.log("[server.js] inside app.post('/friendship/status/:status')");

    // console.log("post send friend request route");

    const loggedInUser = req.session.userId;
    const requestedUser = req.body.otherProfileId; // from handleSUbmit() in [friendButton.js]
    //dynamic - hence req.param for :status
    const { status } = req.params;

    console.log("[server.js] loggedInUser: ", loggedInUser);
    console.log("[server.js] req.body: ", req.body);
    console.log("[server.js] requestedUser: ", req.body.otherProfileId);
    console.log("[server.js] req.params: ", req.params); // [server.js] req.params:  { status: 'Send Friend Request' }
    console.log("[server.js] Current Friendship status: ", req.params.status); // [server.js] Current Friendship status:  Send Friend Request

    console.log(
        "[server.js] PART 8: 7. What should I do when the button is clicked"
    );
    if (status == "Send Friend Request") {
        console.log("[server.js] if (req.params.status == 'SEND')");

        // INSERT query
        // [db.js] makeFriendRequest    = (senderId, receiverId)
        console.log("[server.js ] 👫 Friend Request Made");
        db.makeFriendRequest(loggedInUser, requestedUser)
            .then(({ rows }) => {
                console.log(
                    "[server.js] rows in db.makeFriendRequest(): ",
                    rows
                );
                res.json({
                    rows: rows,
                    button: "Cancel Friendship Request", // when making friend request render button to Cancel Friendship Request
                });
            })
            .catch((err) => {
                console.log(
                    "[server.js] error in db.makeFriendRequest(): ",
                    err
                );
                res.json({ success: false });
            });
    } else if (status == "Accept Friendship Request") {
        console.log("[server.js] if (req.params.status == 'ACCEPT)");

        console.log("[server.js ] 👫  Friend Request Accepted");
        // UPDATE query
        // [db.js] acceptFriendRequest = (receiverId, senderId)
        console.log("[server.js ] requestedUser: ", requestedUser);
        // RENDER UNFRIEND AND OTHER PROFILE FIRSTNAME
        db.getUserData(requestedUser)
            .then(({ rows }) => {
                // console.log("get user rows in 0", rows[0]);
                // is userid same as session id
                console.log(
                    "[server.js] rows in db.getUserData(requestedUser)",
                    rows
                );
                console.log(
                    "[server.js] rows in db.getUserData(requestedUser)",
                    rows[0].first
                );

                let otherProfileFirstName = rows[0].first; // inex[0] important!

                db.acceptFriendRequest(requestedUser, loggedInUser)
                    .then(({ rows }) => {
                        console.log(
                            "[server.js] rows in db.acceptFriendship",
                            rows
                        );

                        res.json({
                            rows: rows,
                            button: `Unfriend ${otherProfileFirstName}`,
                        });
                    })
                    .catch((err) => {
                        console.log("error in accept friendship", err);
                    });
            })
            .catch((err) => {
                console.log(
                    "[server.js] ERROR in db.getUserData(requestedUser)",
                    err
                );
                res.json({ success: false });
            });

        /*
                db.acceptFriendRequest(requestedUser, loggedInUser)
                    .then(({ rows }) => {
                        console.log("[server.js] rows in db.acceptFriendship", rows);
                        res.json({  rows: rows, 
                                    button: `Unfriend ${props.first}` });
                    })
                    .catch((err) => {
                        console.log("error in accept friendship", err);
                    });
            */
    } else if (status == "Unfriend" || status == "Cancel Friendship Request") {
        console.log("[server.js] if (req.params.status == 'END' OR 'CANCEL')");

        console.log("[server.js ] ❌👫  Friendship revoked");
        // DELETE query
        // [db.js] deleteFriendRequest  = (receiverId, senderId)
        db.deleteFriendRequest(requestedUser, loggedInUser)
            .then(({ rows }) => {
                console.log("[server.js] db.deleteFriendRequest() made");
                console.log("[server.js] rows in db.deleteFriendRequest", rows);
                res.json({ rows: rows, button: "Send Friend Request" });
            })
            .catch((err) => {
                console.log("error in unfriend", err);
            });
    } else {
        console.log("[server.js ] Button Text doesn't match logic");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// GET SHOWFRIENDS ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

/*
//// PART 9
/*
Now we want to add a new screen that allows users to see all of the users who have sent them 
friend requests that they have not yet accepted as well as the full list of all their friends. 
A link to this screen should always be visible. The path for this screen should be /friends.
The friends and potential friends shown in these two lists should link to the appropriate profiles. 
Displayed with each friend should be a link or a button that allows the user to end the friendship. 
Displayed with each requester should be a link or button for accepting the request.
*/

app.get("/showfriends/", (req, res) => {
    console.log("[server.js] P9 👯‍♀️👯👯‍♂️ SHOW FRIENDSHIPS 👯‍♀️👯👯‍♂️");
    console.log(
        "[server.js] axios.get request made from getAllFriends() in [action.js]"
    );
    console.log("[server.js] on Route app.get(/showfriends");

    const loggedInUser = req.session.userId;

    console.log(
        `[server.js] making query request to db.getFriends(loggedInUser: ${loggedInUser} )`
    );
    db.getFriends(loggedInUser)
        .then(({ rows }) => {
            console.log(
                `[server.js] db.getFriends(loggedInUser: ${loggedInUser} ) -> rows: `,
                rows
            );
            console.log(
                `[server.js] return rows to [action.js] getAllFriends(): `,
                rows
            );
            res.json({
                success: true,
                rows: rows,
            });
        })
        .catch((err) => {
            console.log(
                `[server.js] ERROR making query request to db.getFriends(loggedInUser: ${loggedInUser} ): `,
                err
            );
            res.json({ success: false });
        });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// POST LOGOUT ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("User cookies deleted");
    res.redirect("/");
});

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////    *   CATCH ALL ROUTE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.get("*", function (req, res) {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
        // if they are logged in, send over the HTML
        // and once the client has the HTML, start.js will render the <p> tag onscreen
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
///////// ACCESS SERVER /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on port 3001.");
});
