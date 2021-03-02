// src/registration.js
// REACT component called Registration that displays the registration form itself.
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
// Registration component, in this case its a class component
// class-component, because they have state and lifecycle methods, which we need

import React, { useState } from "react";
import axios from "../../Middleware/axios"; // import axios for React, it's not a global variable lke in Vue
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import LoginFn from "./loginFn";

const hoverVariants = {
    hidden: {},
    visible: {
        y: -4,
        color: "#152238",
        duration: 0.4,
    },
};

export default function Registration() {
    const [registerTag, setRegisterTag] = useState(true);
    /////////IMPORTS/////////////////////////////////////////////////////////////////////////////////

    const pageEnter = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "tween",
                duration: 0.7,
            },
        },
    };

    // KINDL Brauerei Image Link
    const bgImage =
        "https://www.eventsofa.de/campus/wp-content/uploads/2018/08/kindl-zentrum-fu%CC%88r-zeitgeno%CC%88ssische-kunst-Eventlocation-berlin-mieten-1.jpg";

    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// RIGHT ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    function Logo() {
        return (
            <>
                <div className="flex justify-start">
                    <div id="registrationtitle">
                        <h2 className="text-2xl leading-loose">
                            Support your local brewery
                        </h2>
                    </div>
                </div>
            </>
        );
    }

    function Options() {
        // let handleClickLogin = async () => {};
        // let handleClickRegister = async () => {};

        return (
            <div className="flex  flex-row w-full bg-opacity-50 rounded overflow-y-scroll z-10 place-items-center">
                <div className="w-1/2 items-center">
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        onHoverStart={(e) => {}}
                        onHoverEnd={(e) => {}}
                    >
                        <div
                            className="flex flex-1 w-full bg-yellow-500 p-4 .rounded-tr-lg shadow h-8 items-center"
                            onClick={(e) => setRegisterTag(true)}
                        >
                            <p className="text-sm text-center">REGISTER</p>
                        </div>
                    </motion.div>
                </div>
                <div className="w-1/2 items-center">
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        onHoverStart={(e) => {}}
                        onHoverEnd={(e) => {}}
                    >
                        <div
                            className="flex flex-1 w-full bg-yellow-600 p-4 .rounded-tr-lg shadow h-8 items-center"
                            onClick={(e) => setRegisterTag(false)}
                        >
                            <p className="text-sm text-center">LOGIN</p>
                        </div>
                    </motion.div>
                </div>
            </div>
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

    //////////////////////////////////

    function LoginFn() {
        console.log("[loginFn.js] handleClick()");

        const [error, setError] = useState();
        const [errorEmpty, setInputfieldEmpty] = useState();
        const [errorDuplicate, setErrorDuplicate] = useState();
        const [inputData, setInputData] = useState();

        /// REACT TO USER TYPING INPUT FIELD -> this is how we handle user input in React!

        let handleChange = (e) => {
            setInputData({
                ...inputData,
                [e.target.name]: e.target.value,
            });
            // console.log('User has submitted the following inputData: ', inputData);
        };

        /// REACT TO USER CLICKING SUBMIT

        // 2. when user clicks "submit", we need to take the input we got from the user
        // and send it off to the server in a 'POST' request
        // with submit we trigger axios to server to pass input value to db

        let handleClick = async () => {
            let { email, password } = inputData;

            console.log("Click to submit inputData");

            // Check if not input field is empty
            if (email === "" || password === "") {
                return setInputfieldEmpty(true);
            } else {
                try {
                    let { data } = await axios.post("/login", inputData);
                    if (data.errorDuplicate) {
                        return setErrorDuplicate(true);
                    } else if (data.error) {
                        return setError(true);
                    }
                    return location.replace("/");
                } catch (err) {
                    console.log(
                        "error in Post Registration from client: ",
                        err
                    );
                    return setError(true);
                }
            }
        };

        return (
            <form>
                <div className="w-full px-4 mx-auto mt-2 space-y-2 text-sm text-center text-gray-800 md:text-lg">
                    <div className="container">
                        <div className="flex-col algn-center mrgn-top">
                            <h1 className="text-2xl leading-loose">Login</h1>
                            {/* strategy #2 for binding: arrow functions! */}

                            {errorEmpty && (
                                <p>Please fill out all input fields!</p>
                            )}
                            {errorDuplicate && (
                                <p>Seems like this email already exists.</p>
                            )}
                            {error && (
                                <p>
                                    Oooops, something went wrong. Please try
                                    again.
                                </p>
                            )}

                            <div id="inputfield">
                                <input
                                    type="hidden"
                                    name="_csrf"
                                    value="{{csrfToken}}"
                                ></input>
                            </div>
                            <div id="inputfield">
                                <input
                                    onChange={(e) => handleChange(e)}
                                    name="email"
                                    type="text"
                                    placeholder="email"
                                />
                            </div>
                            <div id="inputfield">
                                <input
                                    onChange={(e) => handleChange(e)}
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                />
                            </div>
                            <button
                                onClick={() => handleClick()}
                                id="button"
                                className="text"
                            >
                                LOGIN
                            </button>

                            <h3>Not registered yet?</h3>
                            <Link to="/register">
                                <button>Go to Register!</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    function RegistrationFn() {
        console.log("[registrationFn.js] handleClick()");

        const [error, setError] = useState();
        const [errorEmpty, setInputfieldEmpty] = useState();
        const [errorDuplicate, setErrorDuplicate] = useState();
        const [inputData, setInputData] = useState();

        /// REACT TO USER TYPING INPUT FIELD -> this is how we handle user input in React!

        let handleChange = (e) => {
            setInputData({
                ...inputData,
                [e.target.name]: e.target.value,
            });
            // console.log('User has submitted the following inputData: ', inputData);
        };

        /// REACT TO USER CLICKING SUBMIT

        // 2. when user clicks "submit", we need to take the input we got from the user
        // and send it off to the server in a 'POST' request
        // with submit we trigger axios to server to pass input value to db

        let handleClick = async () => {
            let { firstname, lastname, email, password } = inputData;

            console.log("Click to submit inputData");

            // Check if not input field is empty
            if (
                firstname === "" ||
                lastname === "" ||
                email === "" ||
                password === ""
            ) {
                return setInputfieldEmpty(true);
            } else {
                try {
                    let { data } = await axios.post("/registration", inputData);
                    if (data.errorDuplicate) {
                        return setErrorDuplicate(true);
                    } else if (data.error) {
                        return setError(true);
                    }
                    return location.replace("/");
                } catch (err) {
                    console.log(
                        "error in Post Registration from client: ",
                        err
                    );
                    return setError(true);
                }
            }
        };

        return (
            <>
                <form>
                    <div className="w-full px-4 mx-auto mt-2 space-y-2 text-sm text-center text-gray-800 md:text-lg">
                        <div className="container">
                            <div className="flex-col algn-center mrgn-top">
                                <h2 className="text-2xl leading-loose">
                                    Registration
                                </h2>
                                {/* strategy #2 for binding: arrow functions! */}

                                {errorEmpty && (
                                    <p>Please fill out all input fields!</p>
                                )}
                                {errorDuplicate && (
                                    <p>Seems like this email already exists.</p>
                                )}
                                {error && (
                                    <p>
                                        Oooops, something went wrong. Please try
                                        again.
                                    </p>
                                )}

                                <div id="inputfield">
                                    <input
                                        type="hidden"
                                        name="_csrf"
                                        value="{{csrfToken}}"
                                    ></input>
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        name="first"
                                        type="text"
                                        placeholder="first"
                                    />
                                </div>

                                <div id="inputfield">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        name="last"
                                        type="text"
                                        placeholder="last"
                                    />
                                </div>
                                <div id="inputfield">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        name="email"
                                        type="text"
                                        placeholder="email"
                                    />
                                </div>
                                <div id="inputfield">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        name="password"
                                        type="password"
                                        placeholder="password"
                                    />
                                </div>
                                <button
                                    onClick={() => handleClick()}
                                    id="button"
                                    className="text"
                                >
                                    SUBMIT
                                </button>

                                <h3>Already have an account?</h3>
                                <Link to="/login">
                                    <button>Go to Login!</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        );
    }

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
                                    <Options />
                                    <div className="m-auto sm:max-w-xs bg-white rounded p-3 ">
                                        <Logo />
                                        {/* <RegistrationForm> */}

                                        {registerTag && <RegistrationFn />}

                                        {!registerTag && <LoginFn />}

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
