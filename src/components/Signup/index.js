import './index.css';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {BsEyeSlash, BsEye} from 'react-icons/bs'



import config from '../../config';


function Signup() {
    const apiUrl = config.API_BASE_URL;

    const [form, setForm] = useState({username: '', email: '', password: '', organizationName: ''});

    const [usernameErr, setUsernameErr] = useState({usernameErrMsg: '', showUsernameErr: false})
    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [passwordErr, setPasswordErr] = useState({passwordErrMsg: '', showPasswordErr: false})
    const [organizationErr, setOrganizationErr] = useState({orgErrMsg: '', showOrgErr: false})

    const [responseErr, setResponseErr] = useState('')


    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const navigateToLogin = () => {
        navigate('/login', {replace: true});
    }

    const submitForm = async (event) => {
        event.preventDefault();

        const {username, email, password, organizationName} = form 

        if (username.length > 3 && email.length > 3 && password.length > 3 &&  organizationName.length > 3) {
            const userDetails = {username, email, password, organizationName} 
            
            // sending userDetails to backend using fetch method
            const url = `${apiUrl}/signup` 
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
                setResponseErr(data.err_msg)
            }
            else {
                setResponseErr('')
                navigateToLogin()
            }
        }
        else {
            setUsernameErr({usernameErrMsg: '*required', showUsernameErr: true})
            setEmailErr({emailErrMsg: '*required', showEmailErr: true})
            setPasswordErr({passwordErrMsg: '*required', showPasswordErr: true})
            setOrganizationErr({orgErrMsg: '*required', showOrgErr: true})
        }

    }
    
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


  return (
    <div className='signup-bg-container'> 

        {/* logo container  */}
        <div className='logo-container'>
            <img className='signup-company-logo' src='SSDS Logo.png' alt='company logo'/>
            
            {/* welcome heading  */}
            <h1 className='signup-welcome-heading'>
                Welcome to Project-M 
            </h1>
        </div>


        {/* welcome heading for "small devices" */}
        <h1 className='signup-welcome-heading-for-small-devices'>
            Welcome to Project-M 
        </h1>

        {/* get started text  */}
        <p className='get-started-text'>
            Get started - by creating an account 
        </p>


        {/* form and image wrapper  */}
        <div className='signup-form-image-wrapper'>
            {/* signup form  */}
            <form className='signup-form' onSubmit={submitForm}>

                {/* input-and-label-elements */}

                {/* username  */}
                <label htmlFor='username' className='signup-labels'>
                    Username 
                </label>
                <input type='username' id='username' className='signup-inputs' placeholder='Enter Username' name='username' onChange={onChangeInput} onBlur={onBlurInput}/> 
                {usernameErr.showUsernameErr && <p className='error-msg'>{usernameErr.usernameErrMsg}</p>}
                
                {/* email  */}
                <label htmlFor='email' className='signup-labels'>
                    Email 
                </label>
                <input type='email' id='email' className='signup-inputs' placeholder='Enter Email' name='email' onChange={onChangeInput} onBlur={onBlurInput}/> 
                {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                
                
                {/* password */}
                <label htmlFor='password' className='signup-labels'>
                    Password 
                </label>
                <div className='password-wrapper'>
                    <input type={showPassword ? 'text' : 'password'} id='password' className='signup-password-input' placeholder='Enter Password' name='password' onChange={onChangeInput} onBlur={onBlurInput}/> 
                    
                    <button type='button' className='eye-wrapper' onClick={handleOnclickEyeIcon}>
                       {showPassword ? <BsEye/> : <BsEyeSlash/> }
                    </button>
                    
                </div>
                {passwordErr.showPasswordErr && <p className='error-msg'>{passwordErr.passwordErrMsg}</p>}
                

                

                {/* organization name  */}
                <label htmlFor='organizationName' className='signup-labels'>
                    Organization Name 
                </label>
                <input type='text' id='organizationName' className='signup-inputs' placeholder='Enter Organization Name' name='organizationName' onChange={onChangeInput} onBlur={onBlurInput}/>
                {organizationErr.showOrgErr && <p className='error-msg'>{organizationErr.orgErrMsg}</p>}




                {/* response error from backend  */}
                {responseErr.length > 0 && <p className='error-msg already-exits'>*{responseErr}</p>}

                {/* submit btn  */}
                <button type='submit' className='signup-btn'>
                    Signup 
                </button>

            </form>

            {/* todo img  */}
            <img className='signup-main-img' src='Task-Management-Img.jpg' alt='signup img'/>
        </div>


        {/* terms and services  */}
        <p className='terms-and-services-text'>
            By proceeding you agree to the {' '} 
            <span className='signup-footer-link-items'>
                Terms and Services {' '}
            </span>
            and {' '}
            <span className='signup-footer-link-items'>
                Privacy Policy
            </span>
            .
        </p>

        {/* already have account  */}
        <p className='account-exist-text'>
            Already have an account? {' '}
            <button type='button' className='login-text' onClick={navigateToLogin}>
                Log in
            </button>
        </p>




    </div>
  )
}

export default Signup