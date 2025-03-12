import {useNavigate} from "react-router-dom";
import styles from "./HomeGuest.module.css";

function HomeGuest() {
    const navigate = useNavigate();

    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <h1>Match Me</h1>
                <button onClick={() => navigate('/login')} name="login">Login</button>
                <button onClick={() => navigate('/register')} name="register">Register</button>
            </div>
        </div>
    );
}

export default HomeGuest;