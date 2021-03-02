/*
   /   = Root directory
   .   = This location
   ..  = Up a directory
   ./  = Current directory
   ../ = Parent of current directory
   ../../ = Two directories backwards
*/

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Route, Link } from "react-router-dom";
import axios from "axios";

import ProfilePic from "../profile-picture";
import Logo from "./logo";

const hoverVariants = {
    hidden: {},
    visible: {
        y: -4,
        color: "#152238",
        duration: 0.4,
    },
};

const NavigationHeader = (props) => {
    console.log("[NavigationHeader.js] props: ", props);
    const [currentTab, setTab] = useState(""); // currentTab

    const logoutUser = async () => {
        try {
            await axios.get("/logout");

            setTimeout(() => {
                window.location.replace("/welcome");
            }, 500);
        } catch (error) {
            console.log("error logging out");
        }
    };

    return (
        <header>
            <Logo />
            <div className={`mt-4 mb-2 border-gray border-b  text-md`}>
                <div className="flex ml-6 space-x-5 text-gray-700">
                    <h2 className="logo-title"> BREWLER </h2>

                    <Link to="/">
                        <motion.div
                            variants={hoverVariants}
                            whileHover="visible"
                            className={`border-b border-transparent   ${
                                currentTab === "/" ? "border-black" : ""
                            } cursor-pointer `}
                        >
                            Home
                        </motion.div>
                    </Link>

                    <Link to="/findbreweries">
                        <motion.div
                            variants={hoverVariants}
                            whileHover="visible"
                            className={`border-b border-transparent ${
                                currentTab === "/findbreweries"
                                    ? "border-black"
                                    : ""
                            } cursor-pointer`}
                        >
                            Find Breweries*
                        </motion.div>
                    </Link>

                    <Link to="/users">
                        <motion.div
                            variants={hoverVariants}
                            whileHover="visible"
                            className={`border-b border-transparent ${
                                currentTab == "/users" ? "border-black" : ""
                            }  cursor-pointer`}
                        >
                            Find People
                        </motion.div>
                    </Link>

                    <Link to="/friends">
                        <motion.div
                            variants={hoverVariants}
                            whileHover="visible"
                            className={`border-b border-transparent ${
                                currentTab == "/friends" ? "border-black" : ""
                            }  cursor-pointer`}
                        >
                            Friends
                        </motion.div>
                    </Link>

                    <Link to="/maps">
                        <motion.div
                            variants={hoverVariants}
                            whileHover="visible"
                            className={`border-b border-transparent ${
                                currentTab === "/chat" ? "border-black" : ""
                            } cursor-pointer`}
                        >
                            Maps
                        </motion.div>
                    </Link>

                    <motion.div
                        variants={hoverVariants}
                        whileHover="visible"
                        className={`border-b border-transparent   ${
                            currentTab === "/" ? "border-black" : ""
                        } cursor-pointer `}
                        onClick={logoutUser}
                    >
                        Logout
                    </motion.div>
                </div>
            </div>
            <ProfilePic {...props} />
        </header>
    );
};

export default NavigationHeader;
