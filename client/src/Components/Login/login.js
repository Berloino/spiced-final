import React from "react";
import axios from "../../Middleware/axios";
import { Link } from "react-router-dom";

//1. Store the user's input in state
//2. After click "submit" zake the input we got from the user and send it off to the server in a 'POST' request

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
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

    handleClick() {
        console.log("[login.js]: handleClick()");
        //1. send the user's input off to the server (in a POST)

        let loginInputData = {
            email: this.state.email,
            password: this.state.password,
        };

        if (this.state.email == "" || this.state.password == "") {
            console.log("[login.js] Error: input fields not all filled out!");
            this.setState({
                error: "Not all input fields have been filled out",
            });
        } else {
            axios
                .post("/login", loginInputData)
                .then((response) => {
                    console.log("Axios sent post request to server (/login)");
                    console.log("resp from server: ", response);

                    if (!response.data.error) {
                        this.setState({
                            error: false,
                        });
                        location.replace("/");
                    } else {
                        console.log("error");
                        this.setState({
                            error: resp.data.error,
                            // true,
                        });
                    }
                })
                .catch((err) => {
                    console.log("err in login post: ", err);
                    this.setState({
                        error: "Email already registered or wrong password",
                    });
                    // render an error message
                });
        }
    }

    render() {
        return (
            <div className="form">
                <h1>Login</h1>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <button onClick={() => this.handleClick()}>LOGIN</button>
                <p>
                    Not yet a user? Click here to{" "}
                    <Link to="/">
                        Not registered yet? Click here to register!
                    </Link>
                </p>
                <p>
                    Forgot your password? Click here to{" "}
                    <Link to="/resetpassword">reset</Link>
                </p>
                {this.state.error && <p>{this.state.error}</p>}
            </div>
        );
    }
}
