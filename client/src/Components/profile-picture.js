// Receives props from App to display the profile pic (it should render a default if none is available).
// It also receives a method from App allowing it to toggle the uploader when it is clicked.

export default function ProfilePic(props) {
    console.log("[profile-pic.js] 📸  props in ProfilePic(props): ", props);
    const { profilePicUrl, first, last, size = "" } = props;

    return (
        <>
            <div className="profilePictureDivBorder">
                <img
                    width="200px"
                    src={profilePicUrl || "default.png"}
                    alt={`${first} ${last}`}
                    className={`${size}`}
                />
            </div>
        </>
    );
}
