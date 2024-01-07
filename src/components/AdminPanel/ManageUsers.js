import './ManageUsers.css';
import {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {BsSearch} from 'react-icons/bs';

import ModalForUser from './ModalForUser';

import userContext from '../../context/user/userContext';



import config from './config';







const ManageUsers = () => {

    const apiUrl = config.API_BASE_URL;

    const navigate = useNavigate();



    const [searchInput, setSearchInput] = useState('');

    const [usersArr, setUsersArr] = useState([]);

    const [userId, setUserId] = useState('')

    const [isModalVisible, setIsModalVisible] = useState(false);


   
    

    // this is "context api", it is used to get "userData from conetxt state"
    const userDetailsFromContext = useContext(userContext);



    const [isDeletedSuccessfully, setIsDeletedSuccessfully] = useState(false);
    
    



    const getAllUsers = async () => {
        const url = `${apiUrl}/manage-users/find/${userDetailsFromContext.state.orgId}?search_q=${searchInput}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            setUsersArr(data);
        }
    } 

    useEffect(() => {
        getAllUsers();
    }, [searchInput])





    const handleOnclickUserEditBtn = (userId) => {
        setIsModalVisible(true);
        setUserId(userId);
    }



    const handleOnclickUserDeleteBtn = async (userId) => {
        const url = `${apiUrl}/manage-users/${userId}`
        const options = {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (!response.ok) {
            alert(data.err_msg)
        }
        else {
            setIsDeletedSuccessfully(true)

            //this function is called again to refresh the page and to get updated data
            getAllUsers();

            setTimeout(() => {
                setIsDeletedSuccessfully(false);
            }, 2000)
        }
    }




    
    const handleOnclickCloseModalIcon = () => {
        setIsModalVisible(false);
    }










    const renderDeletedSuccessfullyModal = () => {
        return (
            <div className='manage-users-deleted-successfully-card'>
                <div className='manage-users-deleted-successfully-inner-card'>
                    <p className='manage-users-deleted-successfully-text'>
                        User deleted successfully
                    </p>
                    <img className='manage-users-deleted-successfully-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
                </div>
            </div>
        )
    }





    const UserItem = (props) => {
        const {eachItem} = props; 
        const {_id, username, role, email, isAdmin} = eachItem;

        return (
            <li className='user-list-items'>
                

                {/* this will wrap profile related data */}
                <div className='profile-and-username-wrapper'>
                    {/* user profile card */}
                    <div className='manage-user-profile-card'>
                        {username && username.slice(0, 1).toUpperCase()}
                    </div>

                    {/* username and role wrapper */}
                    <div className='manage-user-username-and-role-wrapper'>
                        <p className='manage-user-username'>{username} {" "} {isAdmin && "(Admin)"}</p>
                        <p className='manage-user-role'>{role}</p>
                    </div>
                </div>

                {/* email text */}
                <p className='manage-user-email'>
                    {email}
                </p>


                {/* edit btn */}
                <button type='button' className='manage-user-btn edit' onClick={() => handleOnclickUserEditBtn(_id)} >
                    Edit 
                </button>


                {/* edit btn */}
                {isAdmin 
                    ? 
                    <button disabled id='disabledRemoveBtn' type='button' className='manage-user-btn remove' onClick={() => handleOnclickUserDeleteBtn(_id)} >
                        Remove 
                    </button>
                    :
                    <button type='button' className='manage-user-btn remove' onClick={() => handleOnclickUserDeleteBtn(_id)} >
                        Remove 
                    </button>
                }



            </li>
        )
    }

    const handleOnclickAddUserBtn = () => {
        navigate('/add-user');
    }



    const renderManageUsersComponent = () => {
        return (
            <>
                <div className='manage-users-top-wrapper'> {/* top wrapper to wrap "Users List text, search and add user btn" */}


                    {/* users list */}
                    <p className='users-list-text'>
                        Users List 
                    </p>


                    {/* this wrapper wraps search and btn */}
                    <div className='manage-users-search-and-add-btn-wrapper'>

                        {/* this wrapper wraps search input */}
                        <div className='manage-users-search-card'>
                            <input id='manageUsersSearch' type='search' className='manage-users-search-input' placeholder='Search User' onChange={(event) => setSearchInput(event.target.value)} />
                            <label className='manage-users-search-label' htmlFor='manageUsersSearch' >
                                <BsSearch className='manage-users-search-icon'/>
                            </label>
                        </div>


                        {/* add user btn  */}
                        <button className='manage-user-add-user-btn' type='button' onClick={handleOnclickAddUserBtn} >
                            <span className='manage-user-plus-text'>
                                + {' '}
                            </span>
                            Add User 
                        </button>

                    </div>




                </div>




                {/* users list card */}
                {usersArr.length > 0 
                
                ?   <ul className='users-list-card'>
                        {usersArr.map(eachItem => <UserItem key={eachItem._id} eachItem={eachItem} />)}
                    </ul> 
                :   <div className='users-not-found-card'>
                        <h1 className='users-not-found-text'>
                            No Users Found 
                        </h1>
                    </div>
                }
            </>
        )
    }


    return (
        <div className='manage-users-bg-container'>


            {/* Modal component to show user details */}
            {isModalVisible && <ModalForUser isModalVisible={isModalVisible} handleOnclickCloseModalIcon={handleOnclickCloseModalIcon} userId={userId} getAllUsers={getAllUsers} />}


            {isDeletedSuccessfully ? renderDeletedSuccessfullyModal() : renderManageUsersComponent()}
            

        </div>
    )
}

export default ManageUsers;