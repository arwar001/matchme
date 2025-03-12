import React, {useCallback, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationForm.module.css';
import UserSelections from '../ReusableComponents/UserSelections';
const baseUrl = process.env.REACT_APP_API_BASE_URL;


// Regex for validating a strong password (8+ chars, at least one uppercase, one lowercase, one digit, and one special character)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

function RegistrationForm() {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        email: ``,
        username: ``,
        password: ``,
        name: ``,
        surname: ``,
        age: ``,
        gender: ``,
        country: ``,
        city: ``,
        purpose: ``,
    });

    const [password2, setPassword2] = useState(``);
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    const handleChange = useCallback((e) => {
        const name = e.target.name;
        let value = e.target.value;

        if (name==='age'){
            value = value.replace(/[^0-9]/g, ``);
        }
        if (name === 'name' || name === 'surname') {
            value = value.replace(/[^a-zA-Z]/g, ``);
        }
        if (name === 'username') {
            value = value.replace(/[^a-zA-Z0-9]/g, ``);
        }
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));

    }, [setRegisterForm])

    const passwordCheck = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === 'password') {
            setPasswordCorrect(PASSWORD_REGEX.test(value));
            setPasswordMatch(value === password2);
        }

        if (name === 'password2') {
            setPassword2(value);
            setPasswordMatch(registerForm.password === value);
        }
    }

    const registerUser = async (e) => {
        e.preventDefault();
        if (!passwordCorrect) {
            alert('Please enter a valid password');
            return;
        }
        if (!passwordMatch) {
            alert('Passwords do not match');
            return;
        }
        if (Object.values(registerForm).some((value) => value === '')) {
            alert('Please fill in all fields');
            return;
        }
        console.log('Submitting registration:', registerForm);
        try {
            const response = await fetch(`${baseUrl}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerForm)
            });
            if (!response.ok) {
                console.error(response.status, response.statusText);
                const text = await response.text();
                alert("Error: "+ text);
                return
            }
            const data = await response.json();
            console.log(data);
            navigate('/login', {state: {registered: true}});
        } catch (error) {
            alert('An error occurred, please contact support');
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={registerUser}>
                <p className={styles.title}>Set up your account</p>
                <input
                    className={styles.input}
                    type='email'
                    name='email'
                    placeholder='E-mail'
                    onChange={handleChange}
                    required
                />

                <input
                    className={styles.input}
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={registerForm.username}
                    onChange={handleChange}
                    required
                />

                <input
                    className={`${styles.input} ${(!passwordCorrect && registerForm.password !== '') && styles.errorinput}`}
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={(e) => {
                        handleChange(e)
                        passwordCheck(e)
                    }}
                    required
                />

                <input
                    className={`${styles.input} ${(!passwordMatch && password2 !== '') && styles.errorinput}`}
                    type='password'
                    name='password2'
                    placeholder='Re-enter Password'
                    onChange={(e) => {
                        handleChange(e)
                        passwordCheck(e)
                    }}
                    required
                />

                <input className={styles.input}
                       type='text'
                       name='name'
                       placeholder='First Name'
                       value={registerForm.name}
                       onChange={handleChange}
                       required
                />

                <input className={styles.input}
                       type='text'
                       name='surname'
                       placeholder='Surname'
                       value={registerForm.surname}
                       onChange={handleChange}
                       required
                />

                <input className={styles.input}
                       type='text'
                       name='age'
                       placeholder='Age'
                       value={registerForm.age}
                       onChange={handleChange}
                       required
                />
                <UserSelections type="gender"
                                handleChange={handleChange}
                                classNames={`${styles.input} ${!registerForm.gender && styles.unselected}`}
                />

                <UserSelections type="country"
                                handleChange={handleChange}
                                classNames={`${styles.input} ${!registerForm.country && styles.unselected}`}
                />

                <UserSelections type="city"
                                handleChange={handleChange}
                                classNames={`${styles.input} ${!registerForm.city && styles.unselected}`}
                                country={registerForm.country}
                />

                <UserSelections type="purpose"
                                handleChange={handleChange}
                                classNames={`${styles.input} ${!registerForm.purpose && styles.unselected}`}
                />
                {/* Password requirement error */}
                {(!passwordCorrect && registerForm.password !== '') && (
                    <p className={styles.error}>
                        Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
                    </p>
                )}

                {/* Password mismatch error */}
                {(!passwordMatch && password2 !== '') && (
                    <p className={styles.error}>Passwords do not match</p>
                )}

                <button className={styles.button} type='submit'>Continue</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
