/// WIP
import axios from "../../Middleware/axios";
import React from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            renderView: 1, // Create initial state
            email: "",
            verificationcode: "",
            confpassword: "",
            error: false,
        }; // ,() => console.log("this.state", this.state)
    }

    // this is how we handle user input in React!
    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // ,() => console.log("this.state after setState: ", this.state)
        );
    }
    // 1 SUBMIT EMAIL TO RESET
    handleClickToSubmitEmail() {
        //handleClickSubmitEmail() {
        console.log("[resetpassword.js] 1 SUBMIT EMAIL TO RESET", this.state);

        let userInput = {
            email: this.state.email,
        };

        axios
            .post("/password/reset/start", userInput)
            .then((response) => {
                console.log(
                    "Response post('/password/reset/start)',",
                    response
                );

                if (response.data.error) {
                    console.log(
                        "[resetpassword.js] post('/password/reset/start) error "
                    );
                    this.setState({
                        error:
                            "[resetpassword.js] handeCLickSubmitEmail: post('/password/reset/start) unsuccessful",
                    });
                } else {
                    console.log(
                        "[resetpassword.js]mpost('/password/reset/start) Successful submit",
                        response.data
                    );

                    this.setState({
                        renderView: 2,
                        error: false,
                    });
                }
            })
            .catch((error) => {
                console.log(
                    "[resetpassword.js] handeCLickSubmitEmail: post('/password/reset/start) unsuccessful",
                    error
                );

                this.setState({
                    error:
                        "[resetpassword.js] handeCLickSubmitEmail: EMAIL ERROR",
                });
            });
    }

    // 2 SUBMIT CHANGED PASSWORD

    handleClickToResetNewPassword() {
        //handleClickSubmitEmail() {
        console.log("[resetpassword.js] 2 SUBMIT CHANGED PASSWORD", this.state);

        let userInput = {
            verificationcode: this.state.verificationcode,
            confirmednewpassword: this.state.confirmednewpassword,
        };

        axios
            .post("/password/reset/verify", userInput)
            .then((response) => {
                console.log(
                    "Response post('/password/reset/verify)',",
                    response
                );
                if (response.data.error) {
                    console.log(
                        "[resetpassword.js] post('/password/reset/start) error "
                    );
                    this.setState({
                        error:
                            "RENDER error for [resetpassword.js] post('/password/reset/start) error ",
                    });
                } else {
                    console.log(
                        "[resetpassword.js]mpost('/password/reset/verify) Successful submit",
                        response.data
                    );

                    this.setState({
                        renderView: 3, // render this.state.renderView to 3
                        error: false,
                    });
                }
            })
            .catch((error) => {
                console.log(
                    "[resetpassword.js] post('//password/reset/verifyt) unsuccessful",
                    error
                );

                this.setState({
                    error:
                        "RENDER error for [resetpassword.js] PASSWORD verify werror ",
                });
            });
    }

    renderViewSelector() {
        ////// 1 SUBMIT EMAIL TO RESET

        if (this.state.renderView === 1) {
            return (
                <div className="inputFields">
                    <h1>Please enter your email address</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="email"
                        required
                    />

                    <button onClick={() => this.handleClickToSubmitEmail()}>
                        CONFIRM EMAIL
                    </button>
                </div>
            );

            ////// 2 SUBMIT CHANGED PASSWORD
        } else if (this.state.renderView === 2) {
            return (
                <div className="inputFields">
                    <h1>Email with a verification code was sent.</h1>
                    <h1>Please enter the code and set a new password</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="verificationcode"
                        type="text"
                        placeholder="Your received verification code"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="confirmednewpassword"
                        type="password"
                        placeholder="confirm password"
                        required
                    />

                    <button
                        onClick={() => this.handleClickToResetNewPassword()}
                    >
                        CONFIRM NEW PASSWORD
                    </button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>🪅🪅🪅Your password was successfully reset!🪅🪅🪅</h1>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>🆘o🆘o🆘o🆘o🆘o🆘o🆘</h1>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h1>Reset Password</h1>
                {this.renderViewSelector()}{" "}
                {this.state.error && <p className="error">An error occurred</p>}
                <p>
                    Back to <Link to="/login">LOGIN</Link>
                </p>
            </div>
        );
    }
}
