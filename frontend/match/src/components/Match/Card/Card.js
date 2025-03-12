import styles from "./Card.module.css"
import {useNavigate} from "react-router-dom";
const baseUrl = process.env.REACT_APP_API_BASE_URL;


function Card({ user }) {

    const navigate = useNavigate();

    return (
        <div className={styles.matchMain}>
            <div className={styles.cardMain} onClick={(e) => {
                navigate(`/profile/${user.id}`);
            }}>
                <img src={baseUrl + user.avatar} alt="" className={styles.cardImage} onError={
                    (e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/icons/default_pfp.jpg"
                    }}/>
                <div className={styles.cardInfo}>
                    <p className={styles.cardUpperInfo}>
                        <span>{user.name}</span>
                        <span className={styles.age}>{user.age}</span>
                    </p>
                    <p>
                        <span>{user.purpose}</span>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Card;