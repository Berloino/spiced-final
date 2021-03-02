// REACT IMPORTS
import { Component } from "react";
import axios from "../Middleware/axios";
import { Link } from "react-router-dom";

// IMPORT COMPONENTS:   <ProfilePic />, <FriendButton />

import ProfilePic from "./profile-picture";
import FriendButton from "./Friends/friendButton";

// EXPORT COMPONENT:    <OtherProfile />

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // added state
            id: this.props.id,
            first: this.props.first,
            last: this.props.last,
            profilePicUrl: this.props.profilePicUrl,
            bio: this.props.bio,
            error: false,
        };
    }

    updateFriendshipStatus(status) {
        this.setState(
            {
                friendship: status,
            },
            () =>
                console.log(
                    "[otherProfile.js] <OtherProfile/> updateFriendshipStatus(status) -> this.state.friendship: ",
                    this.state.friendship
                )
        );
    }

    // when i go to another users profile I want to make an axios request when this otherProfile component mounts

    componentDidMount() {
        console.log("[otherProfile.js] componentDidMount() START ");
        // we want to make an axios request to the server to get the other users information when this component mounts
        console.log("[otherProfile.js] this.props.match: ", this.props.match); // we get match automatically by react when route is dynamc:
        // match -> :id in users/:id because id is intepreted as dynamic
        /*
                                <Route
                                    path="/user/:id"
                                    render={(props) => (
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match} // must be passed down when we work with match
                                            history={props.history}
                                        />
                                    )}
                                />

        */
        console.log(
            "[otherProfile.js] this.props.match.params.id -> :id: ",
            this.props.match.params.id
        ); // gives us the dynamic :id in url-Route

        // we should  make a request to our server to get the other user's data using the id
        // so this id we can pass to server to get informtion on this specific user!
        // hence: ->         axios.get(`/show-users/${this.props.match.params.id}`) ...

        axios
            .get(`/display-other-user-profile/${this.props.match.params.id}`) // server route should not match route in client browser url
            .then(({ data }) => {
                console.log(
                    "[otherProfile.js] REQUEST by axios.get(`/show-users/${this.props.match.params.id}) to [server.js]"
                );
                console.log(
                    "[otherProfile.js] RESPONSE from [server.js ]: ",
                    data
                );

                // take care of situation where user tries to access his own profile and we have to redirect in that case to '/' route to render his own component
                // If we are trying to view our own profile, we should make sure to send the user back to the '/' route
                // check by cookie inside axios
                console.log(
                    "[otherProfile.js] 🍪🍪🍪  logged in user id is the current cookie -> response.data.cookie: ",
                    data.cookie
                );
                if (this.props.match.params.id == data.cookie) {
                    this.props.history.push("/"); // pushes logged in user back to logged in page on route "/"" (PART 6)
                    //make sure server sends back loggedin user id
                }

                this.setState({
                    id: data.rows.id,
                    first: data.rows.first,
                    last: data.rows.last,
                    profilePicUrl: data.rows.profile_pic_url,
                    bio: data.rows.bio,
                    error: false,
                });
            })
            .catch((err) => {
                console.log("error in axios api/user: ", err);
                this.setState({
                    error: true,
                });
            });

        console.log("[otherProfile.js] componentDidMount() END ");
    }

    // PART 8 <FriendButton/>  component in render()
    // The FriendButton component will have to be passed a prop containing the
    // id of the user whose profile it is appearing on so that it can make an ajax request
    // to retrieve the information it needs to render correctly when it mounts.
    /* That is, OtherProfile must pass it the id that is in the url:
        axios
            .get(`/display-other-user-profile/${this.props.match.params.id}`) 
            ->      this.setState({ id:             response.data.rows.id,

        OtherProfile needs to pass the id of the user whose page we're on to the FriendButton component. 
        Only render FriendButton in OtherProfile!
        FriendButton should render just one button. 
        The text of the button changes depending on the status of the friendship

                                <FriendButton
                                    id={this.state.id}
                                    }}
                                />
    */

    render() {
        if (this.state.id) {
            return (
                <>
                    <div className="profile">
                        <h1>[otherProfile.js]</h1>
                        <h2>
                            {this.state.first} {this.state.last}
                        </h2>

                        <ProfilePic
                            // Passing down props:
                            first={this.state.first}
                            last={this.state.last}
                            profilePicUrl={this.state.profilePicUrl}
                        />

                        <FriendButton
                            id={this.props.match.params.id}
                            first={this.props.first}
                        />

                        <h2>Bio of {this.state.first} : </h2>
                        <p className="bio">{this.state.bio}</p>
                    </div>
                </>
            );
        } else {
            return (
                <div className="no-user">
                    {this.state.error && <p>Oh oh, this user doesn't exist!</p>}

                    <iframe
                        src="https://giphy.com/embed/L12fQlpT3Pnavi9Kgk"
                        width="480"
                        height="333"
                        frameBorder="0"
                        className="giphy-embed"
                        allowFullScreen
                    ></iframe>

                    <Link to="/">
                        <button>Back to my profile</button>
                    </Link>
                </div>
            );
        }
    }
}
