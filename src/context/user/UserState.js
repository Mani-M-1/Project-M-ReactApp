import { useState, useEffect } from "react";
import UserContext from "./userContext";


const UserState = (props) => {



    const [state, setState] = useState(() => {
        const localData = localStorage.getItem('userState');
        return localData ? JSON.parse(localData) : {};
    });

    useEffect(() => {
        localStorage.setItem('userState', JSON.stringify(state));
    }, [state]);



    return (
        <UserContext.Provider value={{state, setState}}> 
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;