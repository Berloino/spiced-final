// HERE IT ALL STARTS

import ReactDOM from "react-dom";

/// start.js is seen as the entry point of our application
import Welcome from "./welcome";
import App from "./app";

// Import REDUX

import { createStore, applyMiddleware } from "redux"; // STEP 1 for REDUC: create the globalised state, combineReducers combines all reducers in environment
import { Provider } from "react-redux"; // import PROVIDER: connects glabal state store to your <App /> component!!! so APP has access to the store

// Enhance REDUX: https://extension.remotedev.io/#usage

import reduxPromise from "redux-promise";
import { reducer } from "./Redux/reducer";

// Allow us to have chrome devtools
import { composeWithDevTools } from "redux-devtools-extension";

/////// REACT REDUCE  https://www.youtube.com/watch?v=CVpUuw9XSjY

//// 1) Create a store
// is a globalised state, Store holds all the data of the application that can be accessed from anywhere in the application

// let store = createStore(reducer)

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // to insert chrome redux devtools  possibly comment out!
);

// export default store;

//Next wrap elem in another component, Provider-component will give everything living inside of it accesss to the global store

//// 2) ACTION -> action.js i.e. increment

// an action is a function that returns an object

//// 3) REDUCER describes how action transform state to the next next state
// reducer checks which action you did and based on this action it's going to modify our STORE (the globalised state)

//// 4) DISPATCH
// here the action is executed, action is send to reducer, so the reducer can check what to do an update STORE

// IF user is on / welcome, render welcome, else an any other path render ptag

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    // initializeSocket(store);          // add socket

    // elem needs to be the Provider component with the App component inside it
    // Wrapp <App /> in Provider to give it access to global store!

    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// it is reacts job to read url and render right component
// server job is to redirect user away from pages they are not authorised to see
ReactDOM.render(elem, document.querySelector("main"));
//  render attaches reactDOM to the DOM
// underneath you find reach codde
// renders <Welcome> component in the DOM
// [props] are variables passed down from parent to child component
