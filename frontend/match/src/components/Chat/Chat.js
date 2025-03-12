import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../Context/AuthProvider";
import FriendList from "../FriendList/FriendList";
import styles from './Chat.module.css';
import {useNavigate, useParams} from 'react-router-dom';
import {WebSocketContext} from "../Context/WebSocket";


const baseUrl = process.env.REACT_APP_API_BASE_URL;

function Chat() {
    const {user} = useContext(AuthContext);
    const {isConnected, subscribeToPath, unsubscribeFromPath} = useContext(WebSocketContext);
    const {id} = useParams();
    const navigate = useNavigate();

    const [friend, setFriend] = useState({});
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(0);
    const pageRef = useRef(0);
    const pageSize = 20;
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!id || !isConnected) {
            return;
        }
        const handleNewMessage = (msg) => {
            if (msg.deleteid) {
                // delete message
                setMessages(prev => prev.map(message =>
                    message.id === msg.deleteid
                        ? {...message, deleted: true, content: "deleted"}
                        : message));
                return;
            }
            // add message
            setMessages(prev => [msg, ...prev]);
            // remove last message for correct pagination if exceeding intended page size
            setMessages(prev => prev.length > pageSize * (pageRef.current + 1) ? prev.slice(0, -1) : prev);

        };
        subscribeToPath(`/user/${user.email}/queue/messages`, handleNewMessage);
        return () => unsubscribeFromPath(`/user/${user.email}/queue/messages`);
    }, [id, isConnected, subscribeToPath, unsubscribeFromPath, user.email]);


    useEffect(() => {
        if (!id) {
            return;
        }

        async function fetchFriendAndHistory() {
            //check if friend is already fetched or given from friendList
            if (Number(friend.id) !== Number(id)) {
                console.log('fetching friend')
                try {
                    const response = await fetch(`${baseUrl}user/${id}`, {
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        throw new Error("Error: " + response.statusText);
                    }
                    const newFriend = await response.json();
                    setFriend(newFriend);
                } catch (e) {
                    console.error(e);
                }
            }
            try {
                const response = await fetch(`${baseUrl}messages/${user.id}/${id}?page=${page}&pageSize=${pageSize}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }
                const paginated = await response.json();

                //because useEffect runs twice in testing, we need to check if messages are already set
                if (page === 0) {
                    setMessages(paginated.content)
                } else {
                    setMessages(prevMessages => [...prevMessages, ...paginated.content]);
                }

            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        }

        void fetchFriendAndHistory()

    }, [id, setFriend, user.id, page, friend.id]);


    const loadMoreMessages = () => {
        setPage(prevPage => {
            const newPage = prevPage + 1;
            pageRef.current = newPage;
            return newPage;
        });
    };


    const handleChange = (event) => {
        setInputValue(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedValue = inputValue.trim();
        if (trimmedValue) {
            try {
                const response = await fetch(`${baseUrl}messages/send/${friend.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    credentials: 'include',
                    body: trimmedValue
                });
                setInputValue('');
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }

        }
    };
    const handleFriendClick = (friendTemp) => {
        navigate(`/chat/${friendTemp.id}`);
        setFriend(friendTemp)
    }

    const createMessage = (message, index) => {
        message.senderId = message.senderId.toString();
        const date = new Date(message.timestamp);
        const showSenderName = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;
        return (<div key={index}
                     className={message.senderId === user.id ? styles.userMessage : styles.friendMessage}>
                {showSenderName && (
                    <div className={styles.senderName}>
                        {message.senderId === user.id ? "You" : friend.name}
                    </div>
                )}

                <div title={date.toString()}
                     className={message.senderId === user.id ? styles.userBubble : styles.friendBubble}>
                    {message.content}
                </div>
            </div>
        )
    }

    if (!friend.id) {
        return (
            <>
                <h1 className={styles.main}>Select a friend to chat to!</h1>
                <FriendList handleFriendClick={handleFriendClick}/>
            </>
        );
    } else {
        return (
            <>
                <div className={styles.main}>

                    <div className={styles.title} onClick={() => navigate(`/profile/${friend.id}`)}>
                        <img className={styles.pfp} src={baseUrl + friend.avatar} alt="Profile" onError={
                            (e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/icons/default_pfp.jpg"
                            }}/>
                        <div className={styles.name}>{friend.name}</div>
                    </div>

                    <div className={styles.messagebox}>
                        {
                            messages.length > 0 ? (
                                messages.map((message, index) => createMessage(message, index))
                            ) : (
                                <div>No messages found</div>
                            )}
                        <button className={styles.loadMore} onClick={loadMoreMessages}>
                            Load more messages
                        </button>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            className={styles.input}
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="Type your message here..."
                        />
                        <button className={styles.submit} type="submit">Send</button>
                    </form>
                </div>
                <FriendList handleFriendClick={handleFriendClick}/>
            </>
        );
    }
}

export default Chat;