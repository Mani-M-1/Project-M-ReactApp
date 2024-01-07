import './index.css';
import {useState, useEffect, useContext} from 'react';
import {BsEyeSlash, BsEye} from 'react-icons/bs'


import userContext from '../../context/user/userContext';


import config from './config';

const Profile = () => {
    const apiUrl = config.API_BASE_URL;

    const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);


    const [form, setForm] = useState({organizationId: '', username: '', email: '', password: '', organizationName: ''});

    const [usernameErr, setUsernameErr] = useState({usernameErrMsg: '', showUsernameErr: false})
    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [passwordErr, setPasswordErr] = useState({passwordErrMsg: '', showPasswordErr: false})
    const [organizationErr, setOrganizationErr] = useState({orgErrMsg: '', showOrgErr: false})

    const [responseErr, setResponseErr] = useState('')


    const [showPassword, setShowPassword] = useState(false)

     const userDetailsFromContext = useContext(userContext);
   
    const getProfileDetailsFunc = async () => {
        const url = `${apiUrl}/profile/${userDetailsFromContext.state.userId}`
        const response = await fetch(url)
        const data = await response.json()
        if (!response.ok) {
            setResponseErr(data.err_msg)
        }
        else {
            setForm(data.userDetails)
            setResponseErr('')
        }

    }


    const saveFormChanges = async (event) => {
        event.preventDefault();

        
        const {username, email, password, organizationName} = form 
        
        if (username.length > 3 && email.length > 3 && password.length > 3 && organizationName.length > 3) {

            setIsSubmitSuccessfull(true);

            const userDetails = {username, email, password, organizationName} 
            
            // sending userDetails to backend using fetch method
            const url = `${apiUrl}/profile/${userDetailsFromContext.state.userId}`
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            }
            const response = await fetch(url, options)
            await response.json()

            setTimeout(() => {
                setIsSubmitSuccessfull(false);
            }, 2000);
        } 
        else {
            setIsSubmitSuccessfull(false);
            setUsernameErr({usernameErrMsg: '*required', showUsernameErr: true})
            setEmailErr({emailErrMsg: '*required', showEmailErr: true})
            setPasswordErr({passwordErrMsg: '*required', showPasswordErr: true})
            setOrganizationErr({orgErrMsg: '*required', showOrgErr: true})
        }
    }



    useEffect(() => {
        getProfileDetailsFunc();
    }, [])
    


    
    const onChangeInput = (event) => {
        setForm({
            ...form, 
            [event.target.name]: event.target.value
        })
    } 



    const onBlurInput = (event) => {
        if (event.target.name === 'username') {    
            if (event.target.value.length <= 3) {
                setUsernameErr({usernameErrMsg: '*Username should be atleast 3 characters', showUsernameErr: true})
            }
            else {
                setUsernameErr({usernameErrMsg: '', showUsernameErr: false})
            }
        }
        if (event.target.name === 'email') {    
            if (event.target.value.length <= 3) {
                setEmailErr({emailErrMsg: '*Email should be atleast 3 characters', showEmailErr: true})
            }
            else {
                setEmailErr({emailErrMsg: '', showEmailErr: false})
            }
        }
        if (event.target.name === 'password') {    
            if (event.target.value.length <= 3) {
                setPasswordErr({passwordErrMsg: '*Password should be atleast 3 characters', showPasswordErr: true})
            }
            else {
                setPasswordErr({passwordErrMsg: '', showPasswordErr: false})
            }
        }
        if (event.target.name === 'organizationName') {    
            if (event.target.value.length <= 3) {
                setOrganizationErr({orgErrMsg: '*Organization Name should be atleast 3 characters', showOrgErr: true})
            }
            else {
                setOrganizationErr({orgErrMsg: '', showOrgErr: false})
            }
        }
    } 

    const handleOnclickEyeIcon = () => {
        setShowPassword(!showPassword)
    }


    const renderSuccessfullCard = () => {
        return (
            <div className='profile-page-success-card'>
                <div className='profile-page-success-inner-card'>
                    <p className='profile-page-success-text'> Profile updated successfully </p>
                    <img className='profile-page-success-gif' src='/successfull-submition-animated-gif.gif' alt='successfull submission img'/>
                </div>    
            </div>
        )
    }


    const renderForm = () => {
        return (
            <div className='gradient-and-form-card'>
                {/* gradient bg image with profile image and username  */}
                <div className='profile-gradient-container'>
                    <div className='profile-img-card'>
                        <p className='profile-initial'>
                            {form.username && form.username[0].toUpperCase()}
                        </p>
                    </div>
                    <p className='profile-username'>
                        {form.username && form.username}
                    </p>
                </div>

                {/* profile form  */}
                <form className='profile-form' onSubmit={saveFormChanges}>

                    {/* input-and-label-elements */}

                    {/* organizationId  (Note: this is not editable) */}
                    <label htmlFor='organizationId' className='profile-labels'>
                        OrganizationId 
                    </label>
                    <input disabled value={form.organizationId} type='text' id='organizationId' className='profile-inputs org-id' name='organizationId'/> 
                    
                    {/* username  */}
                    <label htmlFor='username' className='profile-labels'>
                        Username 
                    </label>
                    <input type='username' id='username' className='profile-inputs' placeholder='Enter Username' value={form.username} name='username' onChange={onChangeInput} onBlur={onBlurInput}/> 
                    {usernameErr.showUsernameErr && <p className='error-msg'>{usernameErr.usernameErrMsg}</p>}
                    
                    {/* email  */}
                    <label htmlFor='email' className='profile-labels'>
                        Email 
                    </label>
                    <input type='email' id='email' className='profile-inputs' placeholder='Enter Email' name='email' value={form.email} onChange={onChangeInput} onBlur={onBlurInput}/> 
                    {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                    
                    {/* password */}
                    <label htmlFor='password' className='profile-labels'>
                        Password 
                    </label>
                    <div className='password-wrapper'>
                        <input type={showPassword ? 'text' : 'password'} id='password' className='profile-password-input' placeholder='Enter Password' name='password'  value={form.password} onChange={onChangeInput} onBlur={onBlurInput}/> 
                        
                        <button type='button' className='eye-wrapper' onClick={handleOnclickEyeIcon}>
                        {showPassword ? <BsEye/> : <BsEyeSlash/> }
                        </button>
                        
                    </div>
                    {passwordErr.showPasswordErr && <p className='error-msg'>{passwordErr.passwordErrMsg}</p>}
                    
                    {/* organization name  */}
                    <label htmlFor='organizationName' className='profile-labels'>
                        Organization Name 
                    </label>
                    <input type='text' id='organizationName' className='profile-inputs' placeholder='Enter Organization Name' name='organizationName'  value={form.organizationName} onChange={onChangeInput} onBlur={onBlurInput}/>
                    {organizationErr.showOrgErr && <p className='error-msg'>{organizationErr.orgErrMsg}</p>}

                    {/* response error from backend  */}
                    {responseErr.length > 0 && <p className='error-msg already-exits'>*{responseErr}</p>}

                    {/* save changes btn  */}
                    <button type='submit' className='save-changes-btn'>
                        Save Changes 
                    </button>
                </form>
            </div>
        )
    }

    


    return(
        <div className='profile-bg-container'>
            {isSubmitSuccessfull ? renderSuccessfullCard() : renderForm()}
        </div>
    )
}

export default Profile