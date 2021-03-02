import axios from "../Middleware/axios";
import React from "react";
import { Component } from "react";
import { setProfilePicUrl } from "../app";

/*
Is being rendered conditionally (depending on the value of this.state.uploaderVisible)
Allows the user to upload a profile picture (work neeeded to save the selected file to the state of Uploader and send it pack with FormData to the server)
It is also being passed a method that allows it to update the profilePicUrl property on the state of App
-> Uploader needs to be a class component as it has to manage its own state.
*/

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
        };

        this.submit = this.submit.bind(this);
        console.log("[uploader.js] Uploader Component props: ", props);
    }

    handleChange(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("[uploader.js] this.state: ", this.state)
        );
    }

    submit() {
        const formData = new FormData();
        formData.append("file", this.state.file);

        // Axios req
        axios
            .post("/profile-pic", formData)
            .then((response) => {
                console.log(
                    "[uploader.js] 📸 response from axios .post(/profile-pic) request ",
                    response
                );

                if (!response.data.rows[0]) {
                    console.log(
                        "[uploader.js] 📸 response from axios .post(/profile-pic) request IS !response.data.success ❌"
                    );
                    this.setState({
                        error: true,
                    });
                } else {
                    console.log(
                        "[uploader.js] 📸 response from axios .post(/profile-pic) request IS !response.data.success ✅"
                    );
                    console.log(
                        "response url: ",
                        response.data.rows[0].profile_pic_url
                    );
                    let profilePicUrl = response.data.rows[0].profile_pic_url;
                    console.log("this: ", this);
                    console.log("this.props: ", this.props);
                    this.props.setProfilePicUrl(profilePicUrl); // method imported from app.js
                    this.setState({
                        error: false,
                    });
                    location.reload(); //HTML page refresh
                }
            })
            .catch((err) => {
                console.log("[uploader.js] ❌ Error in postProfilePic: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <>
                <div className="uploader">
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={this.submit}>Upload</button>
                </div>
            </>
        );
    }
}
