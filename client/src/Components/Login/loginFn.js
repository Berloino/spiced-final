import React, { useState } from "react";
import axios from "../../Middleware/axios"; // import axios for React, it's not a global variable lke in Vue
import { Link } from "react-router-dom";

export const LoginFn = () => {
    console.log("[loginFn.js] handleClick()");

    const [error, setError] = useState(false);
    const [errorEmpty, setInputfieldEmpty] = useState(false);
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
            console.log("[login.js] Error: input fields not all filled out!");
            return setInputfieldEmpty(true);
        } else {
            axios
                .post("/login", inputData)
                .then((response) => {
                    console.log("Axios sent post request to server (/login)");
                    console.log("resp from server: ", response);

                    if (!response.data.error) {
                        console.log("Login Successful");
                        return location.replace("/");
                    } else {
                        console.log("error");
                        return setError(true);
                    }
                })
                .catch((err) => {
                    console.log("err in login post: ", err);
                    return setError(true);
                    // render an error message
                });
        }
    };

    return (
        <form>
            <div className="w-full px-4 mx-auto mt-2 space-y-2 text-sm text-center text-gray-800 md:text-lg">
                <div className="container">
                    <div className="flex-col algn-center mrgn-top">
                        <h1 className="text-2xl leading-loose">Login</h1>
                        {/* strategy #2 for binding: arrow functions! */}

                        {errorEmpty && <p>Please fill out all input fields!</p>}
                        {error && (
                            <p>
                                Oooops, something went wrong. Please try again.
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
                        <Link to="/">
                            <button>Go to Register!</button>
                        </Link>
                        <h3>Not registered yet? Click here to register!</h3>
                        <p>
                            Not yet a user? Click here to{" "}
                            <Link to="/">
                                Not registered yet? Click here to register!
                            </Link>
                        </p>
                        <h3>Forgot your password?</h3>
                        <p>
                            Forgot your password? Click here to{" "}
                            <Link to="/resetpassword">reset</Link>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
};
