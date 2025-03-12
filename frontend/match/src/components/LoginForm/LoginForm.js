import styles from './LoginForm.module.css';
import {useLocation} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from 'react';
const baseUrl = process.env.REACT_APP_API_BASE_URL;


function LoginForm() {
    const { setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const registered = location.state?.registered;

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting form:', form);

            const response = await fetch(`${baseUrl}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Something went wrong');
            }

            const userData = await response.json();
            console.log(userData);
            setUser(userData);
            navigate('/match');
        } catch (err) {
            console.error('An error occurred:', err);
            alert('Error: ' + err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {registered ? (
                    <p className={styles.registered +' '+ styles.title}>Registration successful, please login</p>
                ): (
                    <p className={styles.title}>Login</p>
                )}
                <input
                    className={styles.input}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    required
                />
                <input
                    className={styles.input}
                    onChange={handleChange}
                    placeholder="Password"
                    type="password"
                    id="password"
                    name="password"
                    required
                />
                <button className={styles.button} type="submit">Login</button>
            </form>
        </div>
    );
}


export default LoginForm;