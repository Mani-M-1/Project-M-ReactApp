import './index.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {BsEyeSlash, BsEye} from 'react-icons/bs'


import userContext from '../../context/user/userContext';


function Login() {
    const appUrl = process.env.REACT_APP_DEPLOYED_BACKEND_URL || process.env.REACT_APP_BACKEND_URL 

    const [form, setForm] = useState({email: '', password: ''});

    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [passwordErr, setPasswordErr] = useState({passwordErrMsg: '', showPasswordErr: false})

    const [responseErr, setResponseErr] = useState('');


    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    const userDetailsFromContext = useContext(userContext);


    const responseToken = (jwtToken) => {
      Cookies.set('jwt_token', jwtToken, {expires: 30});
      navigate('/', {replace: true});
    }

    const navigateToSignup = () => {
        navigate('/signup');
    }


    const submitForm = async (event) => {
        event.preventDefault();

        const {email, password} = form 

        if (email.length > 3 && password.length > 3) {
            const userDetails = {email, password} 
            
            // sending userDetails to backend using fetch method
            const url = `${appUrl}/login`
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
                responseToken(data.jwt_token)
                
                userDetailsFromContext.setState({orgId: data.organizationId, userId: data._id, isAdmin: data.isAdmin, username: data.username})
               
            }
        }
        else {
            setEmailErr({emailErrMsg: '*required', showEmailErr: true})
            setPasswordErr({passwordErrMsg: '*required', showPasswordErr: true})
        }

    }
    
    const onChangeInput = (event) => {
        setForm({
            ...form, 
            [event.target.name]: event.target.value
        })
    } 



    const onBlurInput = (event) => {
        if (event.target.name === 'email') {    
            if (event.target.value.length < 1) {
                setEmailErr({emailErrMsg: '*required', showEmailErr: true})
            }
            else {
                setEmailErr({emailErrMsg: '', showEmailErr: false})
            }
        }
        if (event.target.name === 'password') {    
            if (event.target.value.length < 1) {
                setPasswordErr({passwordErrMsg: '*required', showPasswordErr: true})
            }
            else {
                setPasswordErr({passwordErrMsg: '', showPasswordErr: false})
            }
        }
    } 

    const handleOnclickEyeIcon = () => {
        setShowPassword(!showPassword)
    }


    return (
        <div className='login-bg-container'> 
            {/* logo container  */}
            <div className='logo-container'>
                <img className='login-company-logo' src='SSDS Logo.png' alt='company logo'/>
            </div>

            {/* welcome heading  */}
            <h1 className='account-login-heading'>
                Log in to your account 
            </h1>

            {/* get started text  */}
            <p className='start-creating-projects-text'>
                By logging in you can start creating Projects 
            </p>


            {/* form and image wrapper  */}
            <div className='login-form-image-wrapper'>
                {/* Login form  */}

                <form className='login-form' onSubmit={submitForm}>
                    {/* input-and-label-elements */}

                    {/* email  */}
                    <label htmlFor='email' className='login-labels'>
                        Email
                    </label>
                    <input type='email' id='email' className='login-inputs' placeholder='Enter Email' name='email' onChange={onChangeInput} onBlur={onBlurInput}/> 
                    {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                
                    {/* password */}
                    <label htmlFor='password' className='login-labels'>
                        Password 
                    </label>
                     <div className='password-wrapper'>
                        <input type={showPassword ? 'text' : 'password'} id='password' className='login-password-input' placeholder='Enter Password' name='password' onChange={onChangeInput} onBlur={onBlurInput}/> 
                        
                        <button type='button' className='eye-wrapper' onClick={handleOnclickEyeIcon}>
                        {showPassword ? <BsEye/> : <BsEyeSlash/> }
                        </button>
                        
                    </div>
                    {passwordErr.showPasswordErr && <p className='error-msg'>{passwordErr.passwordErrMsg}</p>}

                
                    {responseErr.length > 0 && <p className='error-msg already-exits'>*{responseErr}</p>}
                    <button type='submit' className='login-btn'>
                        Login 
                    </button>

                </form>


                {/* todo img  */}
                <img className='login-main-img' src='Task-Management-Img-For-Login.jpg' alt='login img'/>
            </div>


            {/* Register here  */}
            <p className='dont-have-account-text'>
                Don't have an account? {' '}
                <button type='button' className='register-here-text' onClick={navigateToSignup}>
                    Register here 
                </button>
            </p>




        </div>
    )
}

export default Login