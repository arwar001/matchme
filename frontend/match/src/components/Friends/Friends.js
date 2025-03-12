import styles from "./Friends.module.css";
import {useEffect, useState} from "react";
import Card from "../Match/Card/Card";
import FriendList from "../FriendList/FriendList";
import {useNavigate} from "react-router-dom";
const baseUrl = process.env.REACT_APP_API_BASE_URL;



function Friends() {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const getRequests = async () => {
            try {
                const response = await fetch(`${baseUrl}friend/requests`, {
                    method: "GET",
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error("Error: " + response.statusText);
                }
                const requests = await response.json();
                setRequests(requests);
                console.log(requests);
            } catch (e) {
                console.error(e);
            }
        }
        void getRequests()
    }, [])

    const sendRequestOrAccept = async () => {
        try {
            const response = await fetch(`${baseUrl}friend`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: receiverEmail
            });
            if (!response.ok) {
                throw new Error("Error: " + response.statusText);
            }
            const message = await response.text();
            alert(message);
            } catch (e) {
                console.error(e);
            }
        }

    const handleFriendClick = (friend) => {
        navigate(`/profile/${friend.id}`);
    }

    return (
        <>
            <div className={styles.requests}>
                <div className={styles.requestsTop}>
                    <h1 className={styles.requestsTitle}>Friends requests</h1>
                    <div className={styles.requestsForm}>
                        <input
                        className={styles.input}
                        type="email"
                        placeholder="Enter email"
                        value={receiverEmail}
                        onChange={(e) => setReceiverEmail(e.target.value)}
                        />
                        <button className={styles.requestsSubmit} onClick={sendRequestOrAccept}>Send request</button>
                    </div>
                </div>
                <div className={styles.requestsCards}>
                    {requests.map((request) => (
                        <Card key={request.email} user={request}/>
                    ))}
                </div>
            </div>
            <FriendList handleFriendClick={ handleFriendClick }/>
        </>
    );
}

export default Friends;