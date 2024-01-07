import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";




const MayBeHideNav = (props) => {
    
    const {children} = props;






    const [showNavBar, setShowNavBar] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/signup' || location.pathname === '/login' || location.pathname.startsWith('/email-signup/')) {
            setShowNavBar(false);
        }
        else {
            setShowNavBar(true);
        }
    }, [location]);

    return (
        <>{showNavBar && children}</>
    )
}


export default MayBeHideNav