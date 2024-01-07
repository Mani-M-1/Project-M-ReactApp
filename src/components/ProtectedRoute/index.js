import Cookies from "js-cookie"
import { Navigate, useLocation } from 'react-router-dom';




const ProtectedRoute = (props) => {
    const {element} = props


    
    const location = useLocation();
    
    const jwtToken = Cookies.get("jwt_token")



    if (jwtToken === undefined && location.pathname === '/signup') {
        return element
    }
    else if (jwtToken === undefined) {
        return <Navigate to="/" replace />;
    }
    return element
}

export default ProtectedRoute