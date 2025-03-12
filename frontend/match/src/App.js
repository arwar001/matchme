import './App.css';

//tools
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useEffect, useState} from "react";
//components
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import LoginForm from "./components/LoginForm/LoginForm";
import HomeBase from "./components/HomeBase/HomeBase";
import AuthProvider from "./components/Context/AuthProvider"
import ProtectedRoute from "./components/Context/ProtectedRoute"
import Profile from "./components/Profile/Profile";
import Match from "./components/Match/Match";
import Chat from "./components/Chat/Chat"
import HomeUser from "./components/HomeUser/HomeUser";
import Friends from "./components/Friends/Friends";
//styles
import './components/LoginForm/LoginForm.module.css'
import './components/RegistrationForm/RegistrationForm.module.css'
import WebSocket from "./components/Context/WebSocket";

function App() {
    const [theme, setTheme] = useState('dark');
// eslint-disable-next-line no-unused-vars
    const changeTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomeBase/>}/>
                    <Route path="/register" element={<RegistrationForm/>}/>
                    <Route path="/login" element={<LoginForm/>}/>

                    <Route element={<ProtectedRoute />}>
                        <Route element={<WebSocket />}>
                            <Route element={<HomeUser/>}>
                                <Route path="/match" element={<Match/>}/>
                                <Route path="/friends" element={<Friends/>}/>
                                <Route path="/chat" element={<Chat/>}/>
                                <Route path="/chat/:id" element={<Chat/>}/>
                                <Route path="/profile/:id" element={<Profile/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;