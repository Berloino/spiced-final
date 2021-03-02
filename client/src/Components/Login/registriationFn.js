// src/registration.js
// REACT component called Registration that displays the registration form itself.
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
// Registration component, in this case its a class component
// class-component, because they have state and lifecycle methods, which we need

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

export const RegistrationFn = () => {
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
                console.log("error in Post Registration from client: ", err);
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
                            <h2>Join 1000's of Reactive people</h2>

                            <h1 className="text-2xl leading-loose">
                                Registration
                            </h1>
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
};
