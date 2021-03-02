// PART 9 REDUX SHOW FRIENDS

/// linked to [action.js], [redux.js] and exporting to [app.js]
/// for REDUX, setup Redux boilerplate in [start.js]

// REDUX REDUCER component will be created here

/*
You'll have THREE (3) Conditionals (one for each action)
GET_LIST or RECEIVE_FRIENDS_WANNABES - clones the global state and adds to it a property called friendsWannabes whose value is the array of friends and wannabes
ACCEPT_FRIEND_REQUEST - clones the global state. The clone should have ALL the properties of the old state but one of the objects inside the friendsWannabes array should have their accepted property set to true. Do it immutably!
UNFRIEND - clones the global state. The clone should have all the properties of the old state except the user whose friendship was ended. That user should be removed from the friendsWannabes array. Do it immutably!
*/

// if-statements to check ACTION and then modify STATE

export function reducer(state = {}, action) {
    console.log("[reducer.js] received data from [action.js]");
    console.log("[reducer.js] running reducer( state = {}, action )");
    // console.log("[reducer.js] state = {}: ", state);
    console.log("[reducer.js] action: ", action);

    // SHOW_ALL_FRIENDS
    // clones the global state and adds to it a property called friendsWannabes
    // whose value is the array of friends and wannabes

    if (action.type === "SHOW_ALL_FRIENDS") {
        console.log(
            "[reducer.js] received data from [action.js] creator function (1) getAllFriends()"
        );
        console.log("action.type === 'SHOW_ALL_FRIENDS'");
        console.log("[reducer.js] updating state object");

        console.log("[reducer.js] action.type: ", action.type);
        console.log("[reducer.js] action.payload: ", action.payload);

        state = {
            ...state,
            allFriends: action.payload,
        };

        console.log(
            "[reducer.js] state udpdated in 'SHOW_ALL_FRIENDS': ",
            state
        );
        console.log(
            "[reducer.js] action.payload udpdated in 'SHOW_ALL_FRIENDS': ",
            action.payload
        );

        // console.log("[reducer.js] allFriends udpdated in 'SHOW_ALL_FRIENDS': ", allFriends);
    }

    // ACCEPT_FRIEND_REQUEST - clones the global state.
    // The clone should have ALL the properties of the old state but one of the objects
    // inside the friendsWannabes array should have their accepted property set to true.
    // Do it immutably!

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        console.log(
            "[reducer.js] received data from [action.js] creator function (2) acceptFriendRequest(otherId)"
        );
        console.log("action.type === 'ACCEPT_FRIEND_REQUEST'");
        console.log("[reducer.js] updating state object");

        console.log("[reducer.js] action.type: ", action.type);
        console.log("[reducer.js] action.payload: ", action.payload);

        state = {
            ...state,
            accept: action.payload,
        };

        console.log(
            "[reducer.js] state udpdated in 'ACCEPT_FRIEND_REQUEST': ",
            state
        );
        console.log(
            "[reducer.js] action.payload udpdated in 'SHOW_ALL_FRIENDS': ",
            action.payload
        );
    }

    // UNFRIEND - clones the global state.
    // The clone should have all the properties of the old state except the user whose friendship was ended.
    // That user should be removed from the friendsWannabes array. Do it immutably!

    if (action.type === "UNFRIEND") {
        console.log(
            "[reducer.js] received data from [action.js] creator function (3) endFriendship(otherId)"
        );
        console.log("action.type === 'UNFRIEND'");
        console.log("[reducer.js] updating state object");

        console.log("[reducer.js] action.type: ", action.type);
        console.log("[reducer.js] action.payload: ", action.payload);

        state = {
            ...state,
            end: action.payload,
        };

        console.log("[reducer.js] state udpdated in 'UNFRIEND': ", state);
    }

    // taking returned values from [action.js]
    // chatMessages (tenrecentmessages) ->  type: "10RECENT_MESSAGES", messages: tenrecentmessages

    if (action.type == "10RECENT_MESSAGES") {
        console.log("[reduce.js] action.type == '10RECENT_MESSAGES'");
        console.log("[reduce.js] state: ", state);
        console.log("[reduce.js] action.messages: ", action.messages);

        state = {
            ...state,
            messages: action.messages,
        };
    }

    // taking returned values from [action.js]
    // chatMessage (chatjsnewmessagetext) ->  type: "NEW_MASSAGE", message: chatjsnewmessagetext

    if (action.type == "NEW_MESSAGE") {
        console.log("[reduce.js] action.type == 'NEW_MESSAGE'");
        console.log("[reduce.js] State: ", state);
        console.log("[reduce.js] action.message: ", action.message);

        state = {
            ...state,
            messages: [...state.messages, action.newMessage],
        };
    }

    if (action.type === "MESSAGE") {
        state = {
            ...state,
            message: action.message,
        };
    }

    return state;
}

/*
/// SOCKET.io CHAT

// A conditional for the action with the 10 most recent messages. 
// For this action the reducer should return a new object that has all the same properties 
// as the old state object except a an array of chat messages is added


// A conditional for the action with individual new messages. 
// For this action, the reducer should return a new object that has all the same properties 
// as the old state object except the array of chat messages is 
// replaced with a new array that has in it all the same objects 
// as the old chat messages array plus one more at the end




*/

/*

// To import it in another file:  import { reducer } from './reducer';

//action is modifying state-object
export function reducer(store = {}, action) {


    if (action.type === "UPDATE__STATE_SOMEHOW") {
        //update the state object....
    }


    return store;
}

/*
export default function reducer(store = {}, action) {
    return store;
}
*/

//// NOTES

//// 3) REDUCER describes how action transform state to the next next state (see start.js, in other application it could be called index.js)
// reducer checks which action you did and based on this action it's going to modify our STORE (the globalised state)

/*
i.e. REDUCT EXAMPLE: REDUCER for ACTION increment, decrement
// A reducer will look for which action was dispatched, based on action.type -> it will return a state change



const counter = (state = 0, action) => {            /// state = 0 is initial state, action is 
    switch(action.type){
        case "INCREMENT":
            return state + 1;                        // will update state in STORE
        case "DECREMENT":
            retunr state - 1;
    }
};

let store = createStore(counter);
// Display it in the console
store.subscribe(() => console.log(store.getState()));

// to DISPATCH an ACTION do:
store.dispatch(increment()); // where increemnt() is ACTION and defined in action.js. "const increment = () => { return { type:   'INCREMENT' } };"
store.dispatch(decrement());


ReactDOM.render(<App />, document.getElementById('root'));

reducer.js
*/
