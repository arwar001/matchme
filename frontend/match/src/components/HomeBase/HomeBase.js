import HomeGuest from "../HomeGuest/HomeGuest";
import HomeUser from "../HomeUser/HomeUser";
import {useContext} from "react";
import { AuthContext } from "../Context/AuthProvider";
import {useNavigate} from "react-router-dom";




function HomeBase() {
    const navigate = useNavigate();

    const { user, loading} = useContext(AuthContext)
    if (loading){
        return <div>Loading...</div>
    }
    if (!user){
        return <HomeGuest/>
    }
    navigate('/match', {replace: true})
}

export default HomeBase;