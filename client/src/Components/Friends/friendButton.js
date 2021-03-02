// PART 8 FriendButton Component

// Standard imports
import axios from "../../Middleware/axios";
import { Link } from "react-router-dom";
// Hooks

import { useState, useEffect } from "react";
// useState because our components have state
// useEffect: request upon when the component renders

// <FriendButton/> appears only as a child of the OtherProfile component created in Part 5.
// The purpose of FriendButton is to allow users to friend and unfriend other users.

export default function FriendButton(props) {
    // received otehrUserId from Props
    // needs to get passed the id of the user that we are currently viewing
    // we will either want to:
    // (1) befriend that user, (2) cancel a request we made in the past,
    // (3) accept a pending friend request or (4) end our friendship
    // the id of the otehr user lives in the OtherProfile component
    console.log(
        "[friendButton.js] FriendButton(props) props from <OtherProfile/>: ",
        props
    ); // props is id of otherProfile

    // CUSTOM HOOK TO UPDATE STATUS OF BUTTON
    const [buttonText, setbuttonText] = useState("Send Friend Request");
    const [error, setError] = useState(false);

    // the text of the button should be set in state.
    // You will need to have a property in state, called buttonText,
    // and the <button> itself should render whatever text is in buttonText property in state

    // in the useEffect we will want to make a request to the server to find out
    // our relationship status with the user we are looking at, and send over
    // some button text

    // display FRIEND Button TEXT

    useEffect(() => {
        console.log("[friendButton.js] FriendButton did mount");
        console.log("[friendButton.js] props in useEffect(): ", props);
        console.log(
            "[friendButton.js] props.id displaying viewed PROFILE: ",
            props.id
        );

        // when our component mounts, we need to make an axios request to our server to figure out the intial status of our friendship

        axios
            .get(`/friendship/${props.id}`)
            .then(({ data }) => {
                console.log(
                    `[friendButton.js] Axios request made to GET/friendship/with/${props.id}`
                );
                console.log(
                    "[friendButton.js] data received from GET request: ",
                    data
                );
                // console.log("data.accepted", data.accepted);

                // depending on the response we get from the server, we'll have to set the state of buttonText

                setbuttonText(data.button); // renders FriendButton text -> buttonText

                // - if the server sends back an empty array, that means the two users don't have a row in friendships,
                // which means they don't have any relationship,
                // which means buttonText should be Make Friend Request
                // or simply have your server send back a string of what the buttonText should be and put that in state

                // - if server sends back accepted set to true, buttonText should be end friendship

                // - if the server sends back accept set to false, then we'll have to do some logic
                // to figure out if buttonText should be accept friend request or cancel friend request
            })
            .catch((err) => {
                console.log("error in axios GET users", err);
            });
    }, []);

    // on submit/btn click we want tto send the button text to the server, to update our db,
    // and change the btn text again, once the DB has been successfully updated

    // 7. What should I do when the button is clicked?
    /* make a POST request to the server. The url of the POST request will depend 
    on what buttonText was when the button was clicked, 
    or you will send along the button text in your POST request 
    and your server will figure out what to do */

    // render FRIEND Button TEXT
    // make changes to db

    const handleSubmit = () => {
        // what happens upon click of friends button
        console.log("[friendButton.js] FriendButton clicked");
        console.log("[friendButton.js] inside renderSubmitButton()");
        console.log("[friendButton.js] sending axios.POST request");

        console.log("🥎[friendButton.js] props.action: ", props.action);

        axios
            .post(`/friendshipstatus/${buttonText}`, {
                otherProfileId: props.id,
            }) // handingarams. over buttonText as req.params and otherProfileId as req.body to [server.js]
            .then(({ data }) => {
                // once we've received a response from the server that indicates everything went well,
                // then we'll have to update buttonText accordingly
                console.log(
                    `[friendButton.js] Made axios.post request to ROUTE /friendship/status/${data.button} `
                );
                console.log(
                    "[friendButton.js] received DATA from axios.post request ROUTE /friendship/status/ -> data: ",
                    data
                );
                console.log(
                    "[friendButton.js] setFriendshipStatus(data.button) with data.button:",
                    data.button
                );

                /*
                if buttonText was Make Friend Request when it was clicked, then we'll update buttonText to Cancel Friend Request
                Make -> Cancel
                Cancel -> Make
                Accept -> End Friendship
                End Friendship -> Make
                // LOGIC NOW DEPENDENT on buttonText and MOVED INTO SERVER on ROUTE app.post("/friendshipstatus/:status"
                */
                console.log(
                    "[friendButton.js] inside declaration of setSubmit(): PART 8: 7. What should I do when the button is clicked"
                );
                setbuttonText(data.button); // renders FriendButton text -> buttonText
            })
            .catch((err) => {
                console.log(
                    "Error in axios.post(/friendshipstatus/${buttonText}",
                    err
                );
            });
    };

    // function will only return onle element, that sends data to db

    return (
        <>
            <button className="button" onClick={() => handleSubmit()}>
                {buttonText}
            </button>
        </>
    );
}
