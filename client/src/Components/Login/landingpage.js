// src/registration.js
// REACT component called Registration that displays the registration form itself.
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
// Registration component, in this case its a class component
// class-component, because they have state and lifecycle methods, which we need

import React from "react";
// import axios from "../../Middleware/axios"; // import axios for React, it's not a global variable lke in Vue
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegistrationFn from "./registriationFn";

// import cx from "classnames"; // A simple JavaScript utility for conditionally joining classNames together.

/*
            <div className="bg-white p-4 rounded shadow mb-4">
                <p>Add some decription to the App here!</p>
            </div>;
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  EXPORT COMPONENT REGISTRATION ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const Registration = () => {
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

                                        <RegistrationFn />

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
};
export default Registration;
