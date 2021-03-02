// PART 9 REDUX SHOW FRIENDS

/// linked to [action.js], [redux.js] and exporting to [app.js]
/// for REDUX, setup Redux boilerplate in [start.js]

// REDUX ACTION component will be created here

//// 2) ACTION -> action.js i.e. increment (see start.js, in other application it could be called index.js)
import axios from "../Middleware/axios";

// an action is a function that returns an object
// this will contain al of our action creators
// an action creator is a function that returns an object

/*


You'll need THREE (3) action creator functions

(1) getList or receiveFriendsWannabes - will make a GET request to the server to retrieve the list of friends and wannabes

note - if you get back an empty array, that either means (1) the query is wrong, or (2) you have no friends or wannabes

should return an object with a type property and a friendsList property whose value is the array of friends and wannabes from the server
(2) acceptFriend - makes a POST request to the server to accept the friendship. The function should return an object with a type property and the id of the user whose friendship was accepted.

(3) unfriend - makes a POST request to the server to end the friendship. It should return an object with a type property and the id of the user whose friendship was ended.

*/

// (1) getAllFriends()
// will make a GET request to the server to retrieve the list of friends and wannabes
// note - if you get back an empty array, that either means
// (1) the query is wrong, or (2) you have no friends or wannabes

export async function getAllFriends() {
    // action creater function that returns an object  // receiveAllFriends() {

    console.log("REDUX [action.js] running creator function getAllFriends()");

    //we can OPTIONALLY "talk" to the server here...
    const { data } = await axios.get("/showfriends/");

    // any action creator function returns an object
    console.log("REDUX [action.js] made request to axios.get(/showfriends/)");
    console.log(
        "REDUX [action.js] received data from this GET request",
        data.rows
    );

    if (data.rows.length === 0) {
        console.log(
            "❗️ REDUX [action.js] received data from this GET request has data.length === ",
            data.rows.length === 0
        );
        console.log(
            "❗️ note - if you get back an empty array, that either means: "
        );
        console.log(
            "❗️ (1) the query is wrong, or (2) you have no friends or wannabes"
        );
    }

    return {
        type: "SHOW_ALL_FRIENDS",
        payload: data.rows, // data.rows is []array with friends, this will be passed on to [reducer.js]
    };
}

// (2) acceptFriendRequest
// makes a POST request to the server to accept the friendship.
// The function should return an object with a type property and the id of the user
// whose friendship was accepted.

export async function acceptFriendRequest(otherId) {
    // receives data from dispatch(acceptFriendRequest(wannabe.id)) in [friends.js]

    console.log(
        `REDUX [action.js] running creator function acceptFriendRequest(otherId: ${otherId})`
    );

    const { data } = await axios.post(`/friendships/${otherId}`, {
        status: "Accept Friendship Request",
    });
    // any action creator function returns an object
    console.log(
        `REDUX [action.js] made request to axios.post(/friendships/:otherId ->${otherId}`
    );
    console.log(
        "REDUX [action.js] received data from this POST request",
        data.rows
    );

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        payload: data.rows, // comesfromserver
    };

    /*

    // THIS TYPE OF AXIOS REQUEST DIDNT WORK
    axios
        .post(`/friendships/${otherId}`, { status: 'Accept Friendship Request'})
        .then(({ data }) => {

            // any action creator function returns an object
            console.log(`REDUX [action.js] made request to axios.post(/friendships/:otherId ->${otherId}`);
            console.log("REDUX [action.js] received data from this POST request", data.rows);

            return {
                type: "ACCEPT_FRIEND_REQUEST",
                payload: data.rows,
            };
        })
        .catch((err) => console.log(`ERROR in axios.post accept friend: .post(/friendships/${otherId}: `, err));
    */
}

// (3) endFriendship
// makes a POST request to the server to end the friendship.
// It should return an object with a type property and the id of the user
// whose friendship was ended.

export async function endFriendship(otherId) {
    // receives data from dispatch(acceptFriendRequest(wannabe.id)) in [friends.js]

    console.log(
        `REDUX [action.js] running creator function endFriendship(otherId: ${otherId} )`
    );

    const { data } = await axios.post(`/friendships/${otherId}`, {
        status: "Unfriend",
    });

    // any action creator function returns an object
    console.log(
        `REDUX [action.js] made request to axios.post(/friendshipstatus/:otherId ->${otherId}`
    );
    console.log(
        "REDUX [action.js] received data from this POST request",
        data.rows
    );

    return {
        type: "UNFRIEND",
        payload: data.rows,
    };
}

/*
/// PART 10 SOCKET.io Chat

// An action for when the 10 most recent messages are received

export async function chatMessages (tenrecentmessages) {
    console.log(`REDUX [action.js] running creator function chatMessages (10recentmessages: ${tenrecentmessages} )`);
    try {
        return {
            type: "10RECENT_MESSAGES",
            messages: tenrecentmessages, // comesfromserver
        };
    } catch (err) {
        console.log("[action.js] Error in chatMessages (tenrecentmessages): ", err);
    }
}


// An action for when individual new messages are received


export async function chatMessage (chatjsnewmessagetext) {
    console.log(`REDUX [action.js] running creator function chatMessages (chatjsnewmessagetext: ${chatjsnewmessagetext} )`);
    try {
        return {
            type: "MESSAGE",
            message: chatjsnewmessagetext,  
        };
    } catch (err) {
        console.log("[action.js] Error in rchatMessage (chatjsnewmessagetext): ", err);
    }
}

export function sendNewMessage(newMessage) {
    console.log(`REDUX [action.js] running creator function sendNewMessage(newMessage: ${newMessage} )`);
    console.log(`REDUX [action.js] -> returns: type: "NEW_MESSAGE", newMessage: ${newMessage} )`);

    return {
        type: "NEW_MESSAGE",
        newMessage,
    };
}

*/

/*

i.e. REDUCT EXAMPLE: ACTION increment, decrement

const increment = () => {
    return {
        type:   'INCREMENT'
    }
}
const decrement = () => {
    return {
        type:   'DECREMENT'
    }
}

}






export async function myFirstActionCreater() {
    // We can OPTIONALLY talk to the server here...
    const {data} = await axios.get("/someroute");
    return {
        type: "UPDATE_STATE_SOMEHOW",
        data: data.userId
        // data: could be also replaced with payload:
    };



}
*/
