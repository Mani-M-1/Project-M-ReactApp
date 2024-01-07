import './ModalForUser.css';
import {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {AiOutlineClose} from 'react-icons/ai';
import {BsEyeSlash, BsEye} from 'react-icons/bs'


import config from '../../config';



const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgb(248, 248, 248)'
  },
  overlay: {
    background: 'hsl(0 0% 0% / 50%)'
  }
};


function ModalForUser(props) {

    const apiUrl = config.API_BASE_URL;

    const {isModalVisible, handleOnclickCloseModalIcon, userId, getAllUsers} = props;






    const [form, setForm] = useState({username: '', email: '', password: '', organizationName: ''});


    const [usernameErr, setUsernameErr] = useState({usernameErrMsg: '', showUsernameErr: false})
    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [passwordErr, setPasswordErr] = useState({passwordErrMsg: '', showPasswordErr: false})
    const [organizationErr, setOrganizationErr] = useState({orgErrMsg: '', showOrgErr: false})

    const [responseErr, setResponseErr] = useState('')





    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);


    const [showPassword, setShowPassword] = useState(false)






    const getTaskDetails = async () => {
        const url = `${apiUrl}/manage-users/${userId}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            setResponseErr(data.err_msg);
        } 
        else {
            setForm(data)
        }
    }



    useEffect(() => {
        getTaskDetails();
    }, [])




    const submitForm = async (event) => {
        event.preventDefault();

        const {username, email, password, organizationName} = form 

        if (username.length > 3 && email.length > 3 && password.length > 3 && organizationName.length > 3) {
            const userDetails = {username, email, password, organizationName} 
            
            // sending userDetails to backend using fetch method
            const url = `${apiUrl}/manage-users/${userId}`
            const options = {
                method: 'PUT',
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
                setIsSubmittedSuccessfully(true)

                //this function is called again to refresh the page and to get updated data
                getAllUsers();

                setTimeout(() => {
                    setIsSubmittedSuccessfully(false);

                    //this function is called to close modal and show users list 
                    handleOnclickCloseModalIcon()
                    
                }, 2000)
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






    const renderSuccessfulSubmissionCard = () => {
        return (
            <div className='user-changes-saved-successfully-card'>
                <p className='user-changes-saved-successfully-text'>
                    User changes updated successfully 
                </p>
                <img className='user-changes-saved-successfully-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
            </div>
        )
    }






    const renderForm = () => {
        return (
            <form className='user-details-modal-form' onSubmit={submitForm}>

                {/* input-and-label-elements */}

                {/* username  */}
                <label htmlFor='username' className='user-details-modal-labels'>
                    Username 
                </label>
                <input type='username' id='username' className='user-details-modal-inputs' placeholder='Enter Username' value={form.username} name='username' onChange={onChangeInput} onBlur={onBlurInput}/> 
                {usernameErr.showUsernameErr && <p className='error-msg'>{usernameErr.usernameErrMsg}</p>}
                
                {/* email  */}
                <label htmlFor='email' className='user-details-modal-labels'>
                    Email 
                </label>
                <input type='email' id='email' className='user-details-modal-inputs' placeholder='Enter Email' value={form.email} name='email' onChange={onChangeInput} onBlur={onBlurInput}/> 
                {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                
                {/* password */}
                <label htmlFor='password' className='user-details-modal-labels'>
                    Password 
                </label>
                <div className='user-details-password-wrapper'>
                    <input type={showPassword ? 'text' : 'password'} id='password' className='user-details-password-input' placeholder='Enter Password' value={form.password} name='password' onChange={onChangeInput} onBlur={onBlurInput}/> 
                    
                    <button type='button' className='user-details-eye-wrapper' onClick={handleOnclickEyeIcon}>
                        {showPassword ? <BsEye/> : <BsEyeSlash/> }
                    </button>
                    
                </div>
                {passwordErr.showPasswordErr && <p className='error-msg'>{passwordErr.passwordErrMsg}</p>}
                
                {/* organization name  */}
                <label htmlFor='organizationName' className='user-details-modal-labels'>
                    Organization Name 
                </label>
                <input type='text' id='organizationName' className='user-details-modal-inputs' placeholder='Enter Organization Name' value={form.organizationName} name='organizationName' onChange={onChangeInput} onBlur={onBlurInput}/>
                {organizationErr.showOrgErr && <p className='error-msg'>{organizationErr.orgErrMsg}</p>}

                {/* response error from backend  */}
                {responseErr.length > 0 && <p className='error-msg already-exits'>*{responseErr}</p>}

                {/* submit btn  */}
                <button type='submit' className='save-user-changes-btn'>
                    Save Changes 
                </button>

            </form>
        )
    }






  return (
    <div className='user-details-modal-component-bg-container' >
      <Modal
        isOpen={isModalVisible}
        onRequestClose={handleOnclickCloseModalIcon}
        style={customStyles}
        contentLabel="User Deatils Modal"
      >

        {/* this div is used to wrap the btn  */}
        <div className='user-details-modal-btn-card'>
            {/* this is close btn  */}
            <button className='user-details-modal-close-btn' onClick={handleOnclickCloseModalIcon}>
                <AiOutlineClose className='user-details-modal-close-icon' />
            </button>
        </div>

        {/* this is content inside modal which is "form containing task details" */}
        {isSubmittedSuccessfully ? renderSuccessfulSubmissionCard() : renderForm()} 
      </Modal>
    </div>
  );
}

export default ModalForUser;