// src/registration.js
// REACT component called Registration that displays the registration form itself.
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
// Registration component, in this case its a class component
// class-component, because they have state and lifecycle methods, which we need

import React from "react";
import axios from "../../Middleware/axios"; // import axios for React, it's not a global variable lke in Vue
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import cx from "classnames"; // A simple JavaScript utility for conditionally joining classNames together.

const pageEnter = {
    hidden: { y: "-200vh", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "tween",
            duration: 0.3,
        },
    },
};

// KINDL Brauerei Image Link
const bgImage =
    "https://www.eventsofa.de/campus/wp-content/uploads/2018/08/kindl-zentrum-fu%CC%88r-zeitgeno%CC%88ssische-kunst-Eventlocation-berlin-mieten-1.jpg";

// Create Title

function Logo() {
    return (
        <>
            <div className="flex justify-start">
                <div id="registrationtitle">
                    <h1 className="text-2xl leading-loose">
                        Support your local brewery
                    </h1>
                </div>
            </div>
        </>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  BOTTOM ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Bottom() {
    return (
        <div className="object-bottom order-2 flex space-x-4 flex-row w-full bg-yellow-400 bg-opacity-50 rounded p-8 overflow-y-scroll z-10 items-center">
            <div className="flex flex-1 w-2/5 bg-white p-4 rounded shadow h-8 items-center">
                <p className="text-base">COL1</p>
            </div>

            <div className="flex flex-1 w-3/5 bg-white p-4 rounded shadow h-8 items-center">
                <p className="text-base">COL2</p>
            </div>
        </div>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  LEFT ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Left Content of Screen

function Left() {
    return (
        <>
            <div className="flex space-x-4 items-center">
                <div className="w-8" id="registrationtitleimg">
                    <img src="/beer-favicon-removebg.png" />
                </div>

                <h1 className="text-2xl leading-loose"> BREWLER </h1>
            </div>
        </>
    );
}
/*
            <div className="bg-white p-4 rounded shadow mb-4">
                <p>Add some decription to the App here!</p>
            </div>;
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  EXPORT COMPONENT REGISTRATION ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
        // stretagy for binding 2 stragegies, +1, +2
        // strategy #1 for binding
        // this.handleChange = this.handleChange.bind(this);
    }

    /// REACT TO USER TYPING INPUT FIELD -> this is how we handle user input in React!

    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        //1. we need to sotre the user's input in state
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            //,() => console.log("this.state after setState: ", this.state)
        );
    }

    /// REACT TO USER CLICKING SUBMIT

    // 2. when user clicks "submit", we need to take the input we got from the user
    // and send it off to the server in a 'POST' request
    // with submit we trigger axios to server to pass input value to db

    handleClick() {
        console.log("[registration.js] handleClick()");
        console.log(
            "[registration.js] Click on Submit -> this.state: ",
            this.state
        );

        // 1. we need to stroe the user's input in state

        let inputData = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };

        if (
            // if all inputData provided by User -> true
            inputData.first &&
            inputData.last &&
            inputData.email &&
            inputData.password
        ) {
            // remaining tasks: make the red underlines go away! - replace dataToSendToServer and error
            // 1. send user's input off to the server (in a POST)

            axios
                // .post("/registration", dataToSendToServer)
                // .post("/registration", inputData)     // input is this.state object of user input data
                .post("/registration", inputData)
                .then((resp) => {
                    console.log(
                        "[registration.js] ROUTE: axios app.post(/registration)"
                    ); //👻
                    console.log("resp from server: ", resp.data);
                    // what to do in case of an error:
                    // need to look at "resp" and make sure there's no error message sent here to the server
                    // for example, the server might send abck a message that says,
                    // "the user forgot to fill in an input field. Please render an error message"
                    // in this case render an error message for the suer
                    // if everything was successful: redirect the user to the '/' route

                    if (resp.data.error) {
                        // handle error (render error message for user)
                        console.log(
                            "[registration.js], Error in Registration "
                        );
                        // if server sends back a response that says something went wrong render a message to the user
                        this.setState({
                            error: true,
                            // error: resp.data.error, // Questions on error messages  in this.setState🥎
                        });
                    } else {
                        console.log(
                            "[registration.js] User Registered with Firstname, Lastname, Email and Password. Proceed!"
                        );
                        console.log(
                            "[registration.js] post /registration response: ",
                            resp.data
                        );
                        location.replace("/"); // replace as in redirect
                    }
                })
                .catch((err) => {
                    // render an error message
                    console.log(
                        "[registration.js] err in user registration: ",
                        err
                    );
                });
        } else {
            this.setState({
                // error: true,
                error: "Password wrong or Email already exists",
            });
            console.log(
                "[registration.js] Password wrong or Email already exists!"
            ); // Questions on error messages  in this.setState🥎
        }
    }
    // How to conditionally render an error message in REACT

    // p tag with {this.state.error && <p>Something broke :(</p>} if wrong render this message

    // onChange={} is an event listener

    render() {
        return (
            <div
                className="w-full bg-cover h-screen"
                style={{ backgroundImage: `url('${bgImage}')` }}
            >
                <div className="object-top order-1 flex flex-col z-0 h-5/6">
                    {/* TOP */}
                    <div className="flex flex-wrap-reverse sm:flex-row-reverse items-stretch h-full">
                        <div className="w-full flex items-center justify-center">
                            <motion.div
                                variants={pageEnter}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="w-full flex-1 bg-yellow-400 bg-opacity-50 rounded p-3 overflow-y-scroll">
                                    <div className="my-8 md:my-auto shadow-lg">
                                        <div className="m-auto sm:max-w-xs bg-white rounded p-3 ">
                                            <Logo />
                                            {/* <RegistrationForm> */}
                                            <form>
                                                <div className="w-full px-4 mx-auto mt-2 space-y-2 text-sm text-center text-gray-800 md:text-lg">
                                                    <div className="container">
                                                        <div className="form">
                                                            {/* this is the syntax for conditions, IF left is true, then the thing after && is executed */}
                                                            {this.state
                                                                .error && (
                                                                <p>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .error
                                                                    }
                                                                </p>
                                                            )}
                                                            <h1 className="text-2xl leading-loose">
                                                                Registration
                                                            </h1>
                                                            {/* strategy #2 for binding: arrow functions! */}
                                                            <div id="inputfield">
                                                                <input
                                                                    type="hidden"
                                                                    name="_csrf"
                                                                    value="{{csrfToken}}"
                                                                ></input>
                                                                <input
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        this.handleChange(
                                                                            e
                                                                        )
                                                                    }
                                                                    name="first"
                                                                    type="text"
                                                                    placeholder="first"
                                                                />
                                                            </div>
                                                            <div id="inputfield">
                                                                <input
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        this.handleChange(
                                                                            e
                                                                        )
                                                                    }
                                                                    name="last"
                                                                    type="text"
                                                                    placeholder="last"
                                                                />
                                                            </div>
                                                            <div id="inputfield">
                                                                <input
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        this.handleChange(
                                                                            e
                                                                        )
                                                                    }
                                                                    name="email"
                                                                    type="text"
                                                                    placeholder="email"
                                                                />
                                                            </div>
                                                            <div id="inputfield">
                                                                <input
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        this.handleChange(
                                                                            e
                                                                        )
                                                                    }
                                                                    name="password"
                                                                    type="password"
                                                                    placeholder="password"
                                                                />
                                                            </div>
                                                            <button
                                                                id="button"
                                                                className="text"
                                                                onClick={() =>
                                                                    this.handleClick()
                                                                }
                                                            >
                                                                JOIN
                                                            </button>
                                                            <h3>
                                                                Already have an
                                                                account?
                                                            </h3>
                                                            <Link to="/login">
                                                                <button>
                                                                    Login
                                                                    instead!
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {/* <RegistrationForm> */}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Left */}
                        <div className="w-full flex-1 rounded p-8">
                            <Left />
                        </div>
                        {/* Left */}
                    </div>
                    {/* TOP */}
                </div>
                {/* Bottom */}
                <Bottom />
                {/* Bottom */}
            </div>
        );
    }
}
