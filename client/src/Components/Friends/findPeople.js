import { useState, useEffect } from "react";
import axios from "../../Middleware/axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);
    const [userInputSearchProfile, setUserInput] = useState("");
    const [error, setError] = useState(false);
    const [button, setSearchButton] = useState(false);

    useEffect(() => {
        axios
            .get("/api/users/")
            .then(({ data }) => {
                console.log("[findPeople.js] data: ", data);
                setUser(data.rows);
            })
            .catch((err) => {
                console.log("error in axios GET users", err);
            });
    }, []);

    useEffect(() => {
        let abort = false;
        if (userInputSearchProfile) {
            axios
                .get(`/find/${userInputSearchProfile}`)
                .then(({ data }) => {
                    // console.log("data in find users: ", data);

                    if (!abort) {
                        setUsers(data.rows);
                        userInputSearchProfile && setError(!data.success);
                    } else {
                        abort = true;
                    }
                })
                .catch((err) => {
                    console.log("error in axios find users: ", err);
                });
        }
    }, [userInputSearchProfile]);

    if (!button) {
        return (
            <div className="find-people">
                <h2>Find Users: </h2>

                <h3>Looking for someone specific? </h3>
                <button onClick={(e) => setSearchButton(true)}>
                    SEARCH USER
                </button>

                <h3>Check out these users who recently signed up?</h3>

                {user &&
                    user.map((user) => {
                        return (
                            <Link
                                to={`/user/${user.id}`}
                                key={user.id}
                                className="user-search"
                            >
                                <img
                                    width="100px"
                                    height="100px"
                                    justify-content="center"
                                    src={user.profile_pic_url || "default.png"}
                                    alt={`${user.first} ${user.last}`}
                                />

                                <p>{`${user.first} ${user.last} `}</p>
                            </Link>
                        );
                    })}
            </div>
        );
    } else {
        return (
            <div className="find-people">
                <h2>Find Users: </h2>
                <h3>Search: </h3>

                <div className="search-con">
                    <input
                        name="userInputSearchProfile"
                        type="text"
                        placeholder="Find me baby one more time"
                        autoComplete="off"
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                </div>

                {error && (
                    <p className="error">
                        Hello, there's no one here you're looking for
                    </p>
                )}

                {userInputSearchProfile && (
                    <h3>We found these users matching your search: </h3>
                )}

                {userInputSearchProfile &&
                    users.map((val, index) => {
                        // console.log("val: ", val);
                        return (
                            <Link
                                to={`/user/${val.id}`}
                                key={index}
                                className="user-search"
                            >
                                <img
                                    width="100px"
                                    height="100px"
                                    src={val.profile_pic_url || "default.png"}
                                    alt={`${val.first} ${val.last}`}
                                />
                                <p>{`${val.first} ${val.last} `}</p>
                            </Link>
                        );
                    })}

                <h3>
                    Didn't find who you are looking for? Check out random
                    profiles:{" "}
                </h3>
                <button onClick={(e) => setSearchButton(false)}>
                    DISPLAY RANDOM PROFILES
                </button>
            </div>
        );
    }
}
