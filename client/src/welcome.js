// src/welcome.js

// REACT component called Welcome that renders Registration as well as the surrounding UI
// Component to render register or login

import { HashRouter, BrowserRouter, Route, Link } from "react-router-dom"; // for client site routing, hashrouter
// import Registration from "./Components/Login/registration";
import Registration from "./Components/Login/loginregister";
import Login from "./Components/Login/login";
import ResetPassword from "./Components/Login/resetpassword";
import React from "react";

// "dumb"/"presentational" are alternative names for function components
// vond er public route cann alles über slash ankesteuert werden

export default function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}

/*
export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome to your Social Networking Experience</h1>
            <img src="https://media.nature.com/lw800/magazine-assets/d41586-020-01430-5/d41586-020-01430-5_17977552.jpg" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
*/
