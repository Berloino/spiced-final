// this module holds all the queries we'll using to talk to our database

const spicedPg = require("spiced-pg");

// Code to show tables in POSTGRES SQL
// SELECT * FROM users;
// SELECT * FROM reset_codes;
// SELECT * FROM userrelations;
// SELECT * FROM chatmessages;

//////////////////////// HEROKU access to secrets.jspn varibales

// var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/petition");
// var dbUrl = process.env.DATABASE_URL || 'postgres://spicedling:password@localhost:5432/petition';

let db;
if (process.env.DATABASE_URL) {
    // this means we are in production on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // we are running locally
    // CAFREFUL your secrets require statement might look different
    //const { databaseUser, databasePassword } = require("./secrets.json");
    //db = spicedPg(`postgres:${databaseUser}:${databasePassword}@localhost:5432/petition`);
    db = spicedPg(`postgres:postgres:postgre@localhost:5432/finalproject`);
}

/////////////////////// DATABASES in databasestables.sql

//////////////////////// DATABASE FUNCTIONS

///////// REGISTER

module.exports.createNewUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email,password) 
                VALUES ($1, $2, $3,$4) 
                RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

///////// LOGIN, Also other routes that need to return data on key email

module.exports.getDataFromEmailKey = (email) => {
    const q = `SELECT * 
                FROM users 
                WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

exports.getPassword = (email) => {
    // password is hashed
    const q = `SELECT password 
                FROM users 
                WHERE email = $1;`;
    return db.query(q, [email]);
};

/// PART 3: RESET PASSWORD

// userId comes from req.seccion.userId cookie created in app.post("/password/reset/start") route
module.exports.storeSecretCode = (email, secretCode, userId) => {
    const q = `INSERT INTO reset_codes (email, code, user_id) 
                VALUES ($1,$2,$3)`;
    const params = [email, secretCode, userId];
    return db.query(q, params);
};

// PART 3: Verifying Secret Code sent by Email

module.exports.checkSecretCode = (userId, code) => {
    const q = `SELECT * 
                FROM reset_codes 
                WHERE user_id = ($1) AND code = ($2) AND (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 MINUTES')`;
    // we want to make sure the code is no more than 10 minutes old! We can use this query
    const params = [userId, code];
    return db.query(q, params);
};

//// PART 3: STORING OF NEW RESET-PW in "users" DB storeNewPassword(email, hashedPassword)

module.exports.storeNewPassword = (userId, password) => {
    const q = `UPDATE users 
                SET password = ($2) 
                WHERE id =($1)`;
    const params = [userId, password];
    return db.query(q, params);
};

//// PART 4: PROFILE

exports.getUserData = (userId) => {
    const q = `SELECT * 
                FROM users 
                WHERE id = ($1)`;
    // we want to make sure the code is no more than 10 minutes old! We can use this query
    const params = [userId];
    return db.query(q, params);
};

exports.addProfilePic = (url, userId) => {
    const q = ` UPDATE users
                SET profile_pic_url = $1
                WHERE id = $2
                RETURNING profile_pic_url`;
    const params = [url, userId];
    return db.query(q, params);
};

exports.addBio = (bio, userId) => {
    const q = `UPDATE users
                SET bio = $1
                WHERE id = $2
                RETURNING *`;

    const params = [bio, userId];
    return db.query(q, params);
};
