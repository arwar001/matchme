import { AuthContext } from "./AuthProvider";
import {createContext, useContext} from 'react';
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const {user, loading} = useContext(AuthContext);

    if (loading){
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/" replace/>
    }

    return <Outlet />
}

export default ProtectedRoute;