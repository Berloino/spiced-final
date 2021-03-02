import React from "react";
import axios from "./Middleware/axios";
import Uploader from "./Components/uploader";
import Profile from "./Components/profile";
import OtherProfile from "./Components/otherProfile";
import NavigationHeader from "./Components/Navigation/navigationheader";
import { BrowserRouter, Route } from "react-router-dom"; // PART 6 initialisze Browser Routing, wrap entire code inside render( <BrowserRouter></Broserrouter>)
import FindPeople from "./Components/Friends/findpeople";
import Friends from "./Components/Friends/friends";
import Maps from "./APIs/Google/googlemap";
import "@reach/combobox/styles.css";

//// REDUX: IMPORT ACTION

// REDUX
import { useSelector } from "react-redux";

// App is a top-level component named App that will contain Logo and all the other components we will show.
/*
App should make an ajax request to get basic data about the user
 such as id, first name, last name, and their profile pic url 
 (we haven't created a way to assign profile pics yet, so no users will have any). 
 You should create a route (/user would be a good path for it) that returns the logged-in user's info. 
 After the ajax response is received, the App instance should pass it to setState. 
 The App will then be able to pass user info to any of the components it contains. 
 The ajax request should happen in the componentDidMount method.
- Controls the general state of the application
- (Conditionally) Renders all the child components (Logo, ProfilePic, Uploader)
- Fetches the user information when it mounts (using the componedntDidUpdate() lifecylce method)
- Passes down data to the child components as needed
- Passes downs methods to the child compenents as needed to allow them to update its state
*/

export default class App extends React.Component {
    // const counter = useSelecter(state => state.reducer);
    // const isLogged = useSelecter(state => state.isLogged);

    constructor(props) {
        super(props);

        // Initialize App's state

        // TODO: Bind methods if needed
        this.state = {
            uploaderVisible: false,
            id: "",
            first: "",
            last: "",
            profilePicUrl: "", // just some random picture to initialise "https://cdn.drawception.com/images/avatars/647493-B9E.png"
            bio: "",
            size: "",
        };

        // TODO: Bind methods if needed
        this.toggleUploader = this.toggleUploader.bind(this);

        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
    }

    async componentDidMount() {
        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts

        // const { data } = await axios.get("/user");

        console.log("[app.js] inside componentDidMount() ");

        //axios  fetch current user's data from db -> check sessions.id, make db query in get request
        // put returned data into state
        axios
            .get("/api/user") // .get("/api/user", this.state)
            .then((response) => {
                console.log(
                    "[app.js] componentDidMount() axios.get(/api/user/)"
                );
                console.log(
                    "[app.js] response.data.rows: ",
                    response.data.rows
                );

                // TODO: update the state when the data is retrieved

                // this.setState({});
                this.setState({
                    id: response.data.rows.id,
                    first: response.data.rows.first,
                    last: response.data.rows.last,
                    profilePicUrl: response.data.rows.profile_pic_url,
                    bio: response.data.rows.bio,
                });
            })
            .catch((err) => {
                console.log("[app.js] error with axios.get(/api/user/): ", err);
            });

        console.log("[app.js] componentDidMount() finish");

        /* 
            
           // alternatively 
           axios.get("/user.json").then(({ data })) => {
               this.setState(data);
           });
           -> server.js -> app.get("/user.json", (req, res) => { ...
            
            
            */
    }

    toggleUploader() {
        // TODO: Toggles the "uploaderVisible" state
        console.log("[app.js] toggleUploader() ");

        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });

        /*
        if (this.state.uploaderVisible) {
            this.setState({
                uploaderVisible: false,
            });
        } else {
            this.setState({
                uploaderVisible: true,
            });
        }
        */
    }

    setProfilePicUrl(profilePicUrl) {
        // TODO: Updates the "profilePicUrl" in the state
        // TODO: Hides the uploader
        console.log("[app.js] setProfilePicUrl(profilePicUrl) ");
        console.log("[app.js] where profilePicUrl is: ", profilePicUrl);
        this.setState({
            profile_pic_url: profilePicUrl,
            uploaderVisible: false,
        });
    }

    submitBio(userBio) {
        console.log("[app.js], submitBio( parameter: " + userBio + " )");
        this.setState(
            {
                bio: userBio,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    render() {
        console.log("[app.js] render() this.state: ", this.state); // see anytime the component rerenders smth
        if (!this.state.id) {
            // return null;

            return (
                <div className="spinner-container">
                    <div className="spinner">
                        <img
                            src="/beer-favicon-removebg.png"
                            alt="please wait"
                        />
                    </div>
                    <p>brewing</p>
                </div>
            );
        } else {
            return (
                <BrowserRouter>
                    <div className="app">
                        <NavigationHeader
                            first={this.state.first}
                            last={this.state.last}
                            profilePicUrl={this.state.profilePicUrl}
                            size="small"
                        />

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePicUrl={this.state.profilePicUrl}
                                    size="large"
                                    toggleUploader={() => this.toggleUploader()}
                                    uploaderVisible={this.state.uploaderVisible}
                                    // onClick={() => this.toggleUploader()}
                                    bio={this.state.bio}
                                    submitBio={(e) => this.submitBio(e)}
                                    setProfilePicUrl={(url) =>
                                        this.setProfilePicUrl(url)
                                    }
                                />
                            )}
                        />

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

                        <Route
                            path="/users"
                            render={() => (
                                <FindPeople
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePicUrl={this.state.profilePicUrl}
                                />
                            )}
                        />

                        <Route
                            path="/friends"
                            render={(props) => (
                                <Friends
                                    key={props.match.url}
                                    match={props.match} // must be passed down when we work with match
                                    history={props.history}
                                />
                            )}
                        />

                        <Route path="/map" component={Maps} />
                    </div>
                </BrowserRouter>
            );
        }
    }
}

// <Route path="/chat" component={Chat} />;
