// HOOKS

// piece of logic that i can use in my different components
// now i dont have to write my handleChange for input fields in every component

import { useState } from "react";

// The only purpose of this this hook is to
// keep track of inputfields changing

// useStatefulFields() is a function component,
// a function that is a hook that we can use inside a function component

// HOOK THis useStatefulFields() hook can be used anywhere we have a function component
// with state and i want to have input fields where these values should be stored in state

// -> import in function components with import useStatefulFiels from "./Hooks/useStatefulFields";

// THIS HOOK WILL NOT ACCEPt PARAMETERS, doesn't need to

export function useStatefulFields() {
    // Set State

    const [values, setValues] = useState({});
    const handelChange = (e) => {
        // this set Values will do exactly the same logic that we do inside our components
        //
        setValues({
            //[hookComponents.js]
            /*
                setFields({  // set Fields inside state
                    ...fields,
                    [target.name]: target.value,
                });
            */

            // value becomes the actual value inside my object
            // the values need to be copied over (from Component)
            ...values,
            // without ...values we will keep on overwriting the value in our state
            // and only the last and most recent value would update our state
            // to save the state we have already created we use ...values

            //I am copying over my COmponents current state and set the value
            // Whatever the name of the input field is is a property
            [e.target.name]: e.target.value,

            // this way we will keep on overwriting the value in our state
            // and only the last and most recent value would update our state
            // to save the state we have already created we use ...values
        });
    };
    console.log("[useStatefulFields.js] in hook useStatefulfields: ", values);
    return [values, handleChange];
}
