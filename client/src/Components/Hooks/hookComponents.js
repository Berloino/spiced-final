//// HOOK COMPONENTS FOR INPUT FIELDS

import { useState, useEffect } from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import { useStatefulFields } from "./Hooks/useStatefulFields";
import { useAuthSubmit } from "./Hooks/useAuthSubmit";
/*

import ReactDOM from "react-dom";


ReactDOM.render(

    <> 
        <Login/>
        </Register />
    </>,
    document.querySelector("main")

);
*/

const { default: axios } = require("axios");

///// LOGIN HOOK FUNCTION   <LOGIN />

function Login() {
    // const [error, setError] = useState(false); not handled here anymore but in hook
    const [error, handleSubmit] = useAuthSubmit("/login", values);
    // NEW WITH HOOK for input fields imported
    const [values, handleChange] = useStatefulFields();
    // next update: change fields to values

    /* BEFORE imported HOOK useStatefulFields()
    const [fields, setFields] = useState({});

    // handleChange puts the values that the user has typed into the input fields
    function handleChange({target}) {       

        setFields({  // set Fields inside state
            ...fields,
            [target.name]: target.value,

        });
    }
    */

    // NEW WITH HOOK for submit:
    const [values, handleChange] = useAuthSubmit(url, values);

    /* BEFORE imported HOOK useAuthSubmit(url, values)
    function submit () {
        axios
        .post('/login', values)         // Before hooks: .post('/login', fields)
        .then(({data}) => 
            // if truthy replaye with / otherwise set false
            data.success ? location.replace('/') : setError(true)
        );

    }
    */
    return (
        <div>
            <h2>Login</h2>
            {error && <div>Oops! Something went wrong.</div>}
            <input onChange={handleChange} name="email" placeholder="email" />
            <input
                onChange={handleChange}
                name="pw"
                placeholder="password"
                type="password"
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    );

    /*
        // BEFORE HOOK AUTH
    <button 
        onClick={submit}>submit
    </button>
    */
}

///// REGISTER HOOK FUNCTION   <REGISTER />

function Register() {
    // IMPORT STATEFULFIELDS HOOK
    const [values, handleChange] = useStatefulFields();
    // const [error, setError] = useState(false); not handled here anymore but in hook
    const [error, handleSubmit] = useAuthSubmit("/register", values);

    /* SAME LOGIC AS IN LOGIN
    const [fields, setFields]   = userState({});
    function handleChange({ target }) {
        setFields({
            ...fields,
            [target.name]: target.value,

        });

    }
    */

    /*
    // Fires when submit button is clicked submit handler
    function submit() { 
        axios
        .post('/register', values) // .post('/register', fields)
        .then(({data}) =>
            data.success ? location.replace('/')   : setError(true)
        );

    }
    */

    return (
        <div>
            <h2>Register</h2>

            {error && <div>Oops! Something went wrong.</div>}
            <input
                onChange={handleChange}
                name="first"
                placeholder="first name"
            />
            <input
                onChange={handleChange}
                name="last"
                placeholder="last name"
            />
            <input onChange={handleChange} name="email" placeholder="email" />
            <input
                onChange={handleChange}
                name="pw"
                placeholder="password"
                type="password"
            />

            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}
