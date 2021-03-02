import React from "react";
import axios from "../Middleware/axios";

// <BioEditor /> is child of Profile component
// There are 3 different possibilities for what it might display:
// 1.If the user has NO existing bio, then it will display a button/clickable element saying 'ADD BIO'
// 2.If the user HAS a bio, then it will display the bio, along with a button/clickable element saying 'EDIT BIO'
// 3.If the user clicks either 'ADD BIO' or 'EDIT BIO', the component will switch to EDIT MODE and a textarea will be displayed
//  If EDIT BIO was clicked then the text area will be prepopulated with the existing bio before the user makes any changes

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            error: false,
            errorMessage: "",
            bio: "", // this.props.bio'',
        };

        this.toggleEditingMode = this.toggleEditingMode.bind(this);
        // state of button will change upon click
        // If editingMode, is false then the component is in DISPLAY mode,
        // and the textarea is hidden
        // If this value becomes true, then the component is in EDIT mode and
        // the textarea becomes visible
    }

    componentDidMount() {
        console.log("[bio-editor.js] executing -> componentDidMount()");
        this.setState({
            bio: this.props.bio,
        });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // ,() => console.log("this.state in Bio-editor: ", this.state)
        );
    }

    // Toggling the component between EDIT and DISPLAY mode requires to keep track of which mode you are in.
    // You will need to store this in the components state
    // If this variable, let's call it editingMode, is false then the component is in DISPLAY made, and the textarea is hidden
    // If this value becomes true, then the component is in EDIT mode and the textarea becomes visible
    // When the component first mounts, this value will be false. If the user clicks either 'ADD BIO', or 'EDIT BIO', it will become true and the textarea will become visible
    // Typing in the textarea will trigger an update to the value of draftBio, a variable stored in state

    toggleEditingMode() {
        console.log("[bio-editor.js] INSIDE TOGGLE EDITOR");
        // changes state of editing
        this.setState({
            editing: !this.state.editing,
        });
    }

    submitBio() {
        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                console.log("[bio-editor.js] Response submit: ", data); //// 🎀
                console.log("🎀🎀🎀🎀🎀🎀🎀🎀🎀");
                if (!data.success) {
                    this.setState({
                        errorMessage: data.errorMessage,
                    });
                } else {
                    this.setState({
                        bio: data.bio,
                        editing: false,
                    });
                    console.log(
                        "[bio-editor.js] This.state in submitBio: ",
                        this.state
                    );
                    // this.props.submitBio(this.state.bio);

                    this.props.submitBio(data.bio);
                }
            })
            .catch((err) => {
                console.log("🎀🎀🎀🎀🎀🎀🎀🎀🎀");
                console.log("Err in update-bio: ", err);
                this.setState({
                    error: true,
                });
                // location.reload();              // UPDATE HTML
            });
    }

    render() {
        // console.log("props in Bioeditor: ", this.props);
        if (this.state.editing) {
            return (
                <>
                    <div className="bioEditor">
                        <h1>Editing: </h1>
                        <textarea
                            cols="50"
                            rows="5"
                            name="inputbio"
                            defaultValue={
                                this.props.bio
                                    ? `${this.state.bio}`
                                    : "Add something about yourself"
                            }
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={(e) => this.submitBio()}>Save</button>
                    </div>
                    {this.state.error && (
                        <p>Something went wrong in adding Bio!</p>
                    )}
                    {this.state.errorMessage && <p>${this.errorMessage}</p>}
                </>
            );
        } else {
            return (
                <>
                    <div className="bioEditor">
                        <h1>Bio</h1>
                        <p>
                            Hey {this.props.first}! Why don't you add a brief
                            introduction:
                        </p>
                        <div id="bioText">
                            <p>{this.props.bio}</p>
                        </div>
                        <button onClick={() => this.toggleEditingMode()}>
                            {" "}
                            {this.props.editing ? "Save" : "Edit"}
                        </button>
                    </div>
                </>
            );
        }
    }
}
