import styles from "./HomeUser.module.css";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {WebSocketContext} from "../Context/WebSocket";
import {useContext, useEffect, useState, createContext} from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const UIContext = createContext(null);

function HomeUser() {
    const navigate = useNavigate();
    const location = useLocation().pathname.split('/').filter(Boolean);
    const path = location[0] || 'home';
    const { setUser, user } = useContext(AuthContext);
    const { subscribeToPath, unsubscribeFromPath } = useContext(WebSocketContext);
    const [notifications, setNotifications] = useState([]);

    const [navOpen, setNavOpen] = useState(false);
    const [friendListOpen, setFriendListOpen] = useState(false);

    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications(prev => [...prev, notification]);
        }

        subscribeToPath(`/user/${user.email}/queue/notifications`, handleNotification);
        return () => unsubscribeFromPath(`/user/${user.email}/queue/notifications`);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${baseUrl}auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
            if (!response.ok) {
                throw new Error('An error occurred while logging out');
            }
            console.log('Logged out');
            setUser(null);
        } catch (e){
            console.error(e);
        }
    }

    const handleHamburger = () => {
        if (!navOpen){
            setFriendListOpen(false);
        }
        setNavOpen(!navOpen)
    }

    const handleFriendIcon = () => {
        if (!friendListOpen){
            setNavOpen(false)
        }
        setFriendListOpen(!friendListOpen);
    }

    const handleNavigate = (e) => {
        const path = e.target.innerText.toLowerCase();
        if (path === 'profile') {
            navigate(`/profile/${user.id}`);
        } else if (path === 'matchme'){
            navigate(`/match`);
        } else {
            navigate(`/${path}`);
        }
        setNavOpen(false)
        setFriendListOpen(false)
    }

    return (
        <div className={styles.mainDiv}>
            <button className={styles.hamburger} onClick={handleHamburger}>&#9776;</button>
            <nav className={`${styles.navBar} ${navOpen ? styles.navBarOpen : ''}`}>
                <button className={styles.bell}>&#128276;</button>
                {notifications.length !==0 && <div className={styles.notification}>{notifications.length}</div>}
                <span className={styles.title} onClick={handleNavigate}>MatchMe</span>
                <div className={styles.navLinks}>
                    <span className={path === 'match' ? styles.selected : ''} onClick={handleNavigate}>Match</span>
                    <span className={path === 'friends' ? styles.selected : ''} onClick={handleNavigate}>Friends</span>
                    <span className={path === 'chat' ? styles.selected : ''} onClick={handleNavigate}>Chat</span>
                    <span className={path === 'profile' ? styles.selected : ''} onClick={handleNavigate}>Profile</span>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </nav>
            <UIContext.Provider value={{handleFriendIcon, friendListOpen}}>
                <Outlet/>
            </UIContext.Provider>
        </div>
    );
}

export default HomeUser;
