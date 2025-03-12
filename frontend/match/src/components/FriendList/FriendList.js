import styles from "./FriendList.module.css";
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {WebSocketContext} from "../Context/WebSocket";
import {AuthContext} from "../Context/AuthProvider";
import {UIContext} from "../HomeUser/HomeUser";
const baseUrl = process.env.REACT_APP_API_BASE_URL;


function FriendList( { handleFriendClick } ) {
    const { user } = useContext(AuthContext);
    const { handleFriendIcon, friendListOpen } = useContext(UIContext);
    const { isConnected, subscribeToPath, unsubscribeFromPath } = useContext(WebSocketContext);
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const {id} = useParams();


    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await fetch(`${baseUrl}friend/all`, {
                    method: "GET",
                    credentials: "include"
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }
                const friends = await response.json();
                setFriends(friends);
                setFilteredFriends(friends);
            } catch (e) {
                console.error(e);
            }
        }
        getFriends().then();

        if (!isConnected) {
            return;
        }
        const handleNewMessage = (friend) => {
            if (friend.deleteid) {
                setFriends(prev => prev.filter(f => f.id !== friend.deleteid));
                setFilteredFriends(prev => prev.filter(f => f.id !== friend.deleteid));
                return;
            }
            setFriends( prev => prev.map(f => f.id === friend.id ? friend : f));
        };

        subscribeToPath(`/user/${user.email}/queue/friends`, handleNewMessage);
        return () => unsubscribeFromPath(`/user/${user.email}/queue/friends`);
        }, [user, setFilteredFriends, setFriends, subscribeToPath, unsubscribeFromPath, isConnected]);

    const handleChangeSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setFilteredFriends(friends.filter((friend) => {
            return (friend.name.toLowerCase() + " " + friend.surname.toLowerCase()).includes(value);
        }));
    }

    return (
        <>
            <button className={styles.friendIcon} onClick={handleFriendIcon}>👯</button>
            <div className={`${styles.list} ${friendListOpen ? styles.listOpen : ''}`}>
                <h1>Friends list</h1>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Search"
                    onChange={handleChangeSearch}
                />
                <div className={styles.friendList}>
                    {filteredFriends.length === 0 ? <div>No friends found</div> : (
                        filteredFriends.map((friend, index) => (
                            <div key={index}
                                 className={`${styles.friend} ${Number(id) === Number(friend.id) && styles.selected}`}
                                 onClick={() => handleFriendClick(friend)}>
                                <img src={baseUrl + friend.avatar} alt="Profile"
                                     className={`${styles.pfp} ${friend.online && styles.online}`} onError={
                                    (e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/icons/default_pfp.jpg"
                                    }}/>
                                <div key={friend.email}>
                                    {friend.name + " " + friend.surname}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default FriendList;