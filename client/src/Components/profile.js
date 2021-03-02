import BioEditor from "./bio-editor";
import ProfilePic from "./profile-picture";
import Uploader from "./uploader";
import Maps from "../APIs/Google/googlemap";

// <ProfilePic/> same componetn as in APP parent

export default function Profile(props) {
    const {
        id,
        first,
        last,
        profilePicUrl,
        toggleUploader,
        uploaderVisible,
        bio,
        submitBio,
        setProfilePicUrl,
    } = props;

    console.log("[profile.js] profilePicUrl: ", profilePicUrl);

    return (
        <>
            <div className="profile">
                <h1>
                    Nice to see you for your Final Project {first} {last} !
                </h1>

                <ProfilePic
                    // Passing down props:
                    first={props.first}
                    last={props.last}
                    profilePicUrl={props.profilePicUrl}
                />

                {/* UPLOADER */}
                <div className="editProfPic">
                    <button onClick={() => toggleUploader()}>
                        Change profile picture
                    </button>
                </div>

                {/*Conditionally render the Uploader component: */}
                {uploaderVisible && (
                    <Uploader
                        // Passing down methods with arrow function (no binding needed):
                        setProfilePicUrl={(profilePictureUrl) =>
                            setProfilePicUrl(profilePictureUrl)
                        }
                    />
                )}

                <BioEditor
                    // passing down props
                    first={props.first} // will render in [bio-editor.js] "Hey {this.props.first}! Why don't you add a brief introduction"
                    bio={props.bio}
                    submitBio={props.submitBio}
                />

                <Maps />
            </div>
        </>
    );
}
