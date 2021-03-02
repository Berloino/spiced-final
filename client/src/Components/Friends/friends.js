// PART 9 REDUX SHOW FRIENDS

/// linked to [action.js], [redux.js] and exporting to [app.js]
/// for REDUX, setup Redux boilerplate in [start.js]

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// imports REDUX action functions
import {
    getAllFriends,
    acceptFriendRequest,
    endFriendship,
} from "../../Redux/action";

/*
Friends Component (friends.js)

should be a function component!!!!!
dispatch an action when it mounts - the action will fetch the list of friends and wannabes from the server and add it to Redux.
you'll want to split the friendsWannabes array that in Redux into 2 arrays - 1 array will be just wannabes and the 2nd array is friends.
you'll need to use useSelector hook TWICE to accomplish this.
you'll want to render the 2 lists on screen using map when you click the accept friend button, dispatch the acceptFriendRequest action
when you click the unfriend button, dispatch the unfriend action
do not use the buttons from part 8 for this!!
*/

//spread operator, slice, filter, map are ways to COPY the object/array without mutating it
//good array method for unfriend. FILTER method
//good array method for accept: MAP method

export default function Friends() {
    // Friends should be a function component!!!!!

    // console.log("[friends.js] props inside <Friends />", props);

    // dispatch an action when it mounts -
    // the action will fetch the list of friends and wannabes from the server and add it to Redux.

    const dispatch = useDispatch(); //  The useDispatch hook gives you access to a function you can call to dispatch an action.

    console.log(
        "[friends.js] <Friends/>  is dispatchting an action to [action.js]"
    );
    console.log("[friends.js] <Friends/>  const dispatch = useDispatch()");

    // split the friendsWannabes array that in Redux into 2 arrays

    // (1) friendsWannabes[] -> use useSelector hook to accomplish this

    const friendsWannabes = useSelector(
        (state) =>
            state.allFriends &&
            state.allFriends.filter(
                (allFriends) => allFriends.accepted == false
            )
    );

    // (2) yourFriends[] -> use useSelector hook to accomplish this

    const yourFriends = useSelector(
        (state) =>
            state.allFriends &&
            state.allFriends.filter((allFriends) => allFriends.accepted == true)
    );

    console.log("[friends.js] (1) friendsWannabes[]", friendsWannabes);
    console.log("[friends.js] (2) yourFriends[]", yourFriends);

    // const [friendsWannabes, setfriendsWannabes] = useState([]);
    // const [yourFriends, setyourFriends] = useState([]);

    // DISPATCH runs every time we load the page in order to show all friends and friend requests

    useEffect(() => {
        console.log(
            "[friends.js] making dispatch request in useEffect() to [action.js] -> dispatch(getAllFriends())"
        );
        dispatch(getAllFriends());
        return () => {
            //cleanup;
        };
    }, []);

    // you'll want to render the 2 lists on screen using map when you click the accept friend button, dispatch the acceptFriendRequest action
    // The other two DISPATCH functions run only upon click: dispatch(endFriendship(friend.id)) AND dispatch(acceptFriendRequest(wannabe.id))
    // when you click the unfriend button, dispatch the unfriend action

    return (
        <div className="friends">
            <h2>Your Friends: </h2>

            {yourFriends &&
                yourFriends.map((friend, index) => {
                    return (
                        <div key={index}>
                            <img
                                width="70px"
                                src={friend.profile_pic_url}
                                alt={`${friend.first} ${friend.last}`}
                            />
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <button
                                onClick={() =>
                                    dispatch(endFriendship(friend.id))
                                }
                            >
                                UNFRIEND {friend.first}
                            </button>
                        </div>
                    );
                })}

            <h2>Check out who you received Friend Requests from: </h2>

            {friendsWannabes &&
                friendsWannabes.map((wannabe, index) => {
                    return (
                        <div key={index}>
                            <img
                                width="70px"
                                src={wannabe.profile_pic_url}
                                alt={`${wannabe.first} ${wannabe.last}`}
                            />
                            <p>
                                {wannabe.first} {wannabe.last}
                            </p>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendRequest(wannabe.id))
                                }
                            >
                                Accept Friend Request from {wannabe.first}
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}
