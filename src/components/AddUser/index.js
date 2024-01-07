import './index.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {BsEyeSlash, BsEye} from 'react-icons/bs';





import userContext from '../../context/user/userContext';


import config from '../../config';



const rolesArr = [
    {
        id: '1',
        role: 'Fullstack Developer'
    },
    {
        id: '2',
        role: 'Frontend Developer'
    },
    {
        id: '3',
        role: 'Backend Developer'
    },
    {
        id: '4',
        role: 'UI/UX Designer'
    },
    {
        id: '5',
        role: 'Software Developer'
    },
    {
        id: '6',
        role: 'Project Manager'
    }
]





// this object represents various "Views" of a component
const componentViews = {
    initial: 'initial',
    success: 'success'
}




const AddUser = () => {

    const apiUrl = config.API_BASE_URL;

    const navigate = useNavigate();

    const [view, setView] = useState(componentViews.initial)




    const [form, setForm] = useState({username: '', email: '', password: '', role: rolesArr[0].role});

    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [usernameErr, setUsernameErr] = useState({usernameErrMsg: '', showUsernameErr: false})
    const [passwordErr, setPasswordErr] = useState({passwordErrMsg: '', showPasswordErr: false})

    const [showPassword, setShowPassword] = useState(false)



    const [backendResponseErr, setBackendResponseErr] = useState('');




    // this is "context api", it is used to get "userData from context state"
    const userDetailsFromContext = useContext(userContext);





    const onChangeInput = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }


    const onBlurInput = (event) => {
        if (event.target.name === 'username') {    
            if (event.target.value.length < 4) {
                setUsernameErr({usernameErrMsg: '*Username should be atleast 4 characters', showUsernameErr: true})
            }
            else {
                setUsernameErr({usernameErrMsg: '', showUsernameErr: false})
            }
        }
        if (event.target.name === 'email') {    
            if (event.target.value.length < 4) {
                setEmailErr({emailErrMsg: '*Email should be atleast 4 characters', showEmailErr: true})
            }
            else {
                setEmailErr({emailErrMsg: '', showEmailErr: false})
            }
        }
        if (event.target.name === 'password') {    
            if (event.target.value.length < 4) {
                setPasswordErr({passwordErrMsg: '*Password should be atleast 4 characters', showPasswordErr: true})
            }
            else {
                setPasswordErr({passwordErrMsg: '', showPasswordErr: false})
            }
        }
    } 



    const submitForm = async (event) => {
        event.preventDefault();


        const {username, email, password, role} = form 

        if (username.length > 3 && email.length > 3 && password.length > 3) {
            const userDetails = {username, email, password, role, adminId: userDetailsFromContext.state.userId, frontendUrl: process.env.REACT_APP_FRONTEND_URL} 
            
            // sending userDetails to backend using fetch method
            const url = `${apiUrl}/manage-users/add-user/${userDetailsFromContext.state.orgId}`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (!response.ok) {
                setBackendResponseErr(data.err_msg)
            }
            else {
                setBackendResponseErr('')
                setView(componentViews.success)

                setTimeout(() => {
                    setView(componentViews.initial)

                    navigate('/admin-panel')
                }, 2000)
            }
        }
        else {
            setEmailErr({emailErrMsg: '*required', showEmailErr: true})
        }

    }


    const renderUSerAddedSuccessfullyCard = () => {
        return (
            <div className='add-user-successfully-card'>
                <div className='add-user-successfully-inner-card'>
                    <p className='add-user-successfully-text'>
                        User Added successfully
                    </p>
                    <img className='add-user-successfully-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
                </div>
            </div>
        )
    }



    const RoleItem = (props) => {
        const {eachItem} = props;
        const {role} = eachItem;


        return (
            <option className='add-user-role-options' value={role} >
                {role}
            </option>
        )
    }





    const renderAddUserForm = () => {
        return (
            <form className='add-user-form' onSubmit={submitForm}>

                {/* input-and-label-elements */}


                {/* username  */}
                <label htmlFor='username' className='add-user-labels'>
                    Username 
                </label>
                <input type='username' id='username' className='add-user-inputs' placeholder='Enter Username' name='username' value={form.username} onChange={onChangeInput} onBlur={onBlurInput}/> 
                {usernameErr.showUsernameErr && <p className='error-msg'>{usernameErr.usernameErrMsg}</p>}
                





                {/* email  */}
                <label htmlFor='email' className='add-user-labels'>
                    Email 
                </label>
                <input type='email' id='email' className='add-user-inputs' placeholder='Enter Email' value={form.email} name='email' onChange={onChangeInput} onBlur={onBlurInput}/> 
                {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                


                
                
                {/* password */}
                <label htmlFor='password' className='add-user-labels'>
                    Password 
                </label>
                <div className='add-user-password-wrapper'>
                    <input type={showPassword ? 'text' : 'password'} id='password' className='add-user-password-input' placeholder='Enter Password' name='password' value={form.password} onChange={onChangeInput} onBlur={onBlurInput}/> 
                    
                    <button type='button' className='add-user-eye-wrapper' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <BsEye/> : <BsEyeSlash/> }
                    </button>
                    
                </div>
                {passwordErr.showPasswordErr && <p className='error-msg'>{passwordErr.passwordErrMsg}</p>}
                    








                {/* role  */}
                <label htmlFor='email' className='add-user-labels'>
                    Role 
                </label>
                <select className='add-user-select-element' name='role' value={form.role} onChange={onChangeInput} > 
                    {rolesArr.map(eachItem => <RoleItem key={eachItem.id} eachItem={eachItem} />)}
                </select>
                





                {/* backendResponseErr */}
                {backendResponseErr.length > 0 && <p className='error-msg'>{backendResponseErr}</p>}


                {/* add user btn  */}
                <button type='submit' className='add-user-btn'>
                    Add User 
                </button>

                
                
                {/* cancel btn for smaller screens */}
                <button type='button' className='add-user-cancel-btn' onClick={() => navigate('/admin-panel')} >
                    Cancel 
                </button>


            </form>
        )
    }




    const renderDifferentViews = () => {
        switch (view) {
            case componentViews.success:
                return renderUSerAddedSuccessfullyCard()
            default:
                return renderAddUserForm()
        }
    }





    return (
        <div className='add-user-bg-container'>
            {renderDifferentViews()}
        </div>
    )
}


export default AddUser;