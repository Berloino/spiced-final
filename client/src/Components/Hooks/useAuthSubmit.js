// HOOK for submit function

import { useState } from "/react";
import axios from "axios";

// THIS HOOK WILL  ACCEPt PARAMETERS (other than handleChange)
// hook for submit()

// this hook needs a POST ROUTE -> .post('/login', values)
// and values to send along

// therefore, depending on which component we are using it in our hook will change
// our hook accepting url and values makes it dynamic
export function useAuthSubmit(url, values) {
    // keep track of potential errors
    const [error, setError] = useState(false); // same as default in Component to prevent unexpected behaviour

    // handleSubmit when user presses submit button

    const handleSubmit = (e) => {
        // By Deafault Buttons cause page refresh, to prevent page refresh, as it is default behaviour
        e.preventDefault();

        console.log("[useAuthSubmit.js] useAuthSubmit about to run axios");

        axios.post(url, values);
        // upon response, same behaviour as in original function submit()
        then(({ data }) =>
            // if truthy replaye with / otherwise set false
            data.success ? location.replace("/") : setError(true)
        ).catch((err) => {
            console.log(`error in aios.post ${url}`, err); // backticks to make error statement dynamic
            setError(true);
        });

        return [error, handleSubmit]; // to make available outside
    };
}
