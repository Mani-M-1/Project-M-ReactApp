import './index.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import config from './config';


const RiseIssue = () => {
    const apiUrl = config.API_BASE_URL;

    const navigate = useNavigate()


    const [form, setForm] = useState({email: '', issueTitle: '', issueDescription: ''})

    const [emailErr, setEmailErr] = useState({emailErrMsg: '', showEmailErr: false})
    const [issueTitleErr, setIssueTitleErr] = useState({issueTitleErrMsg: '', showIssueTitleErr: false})
    const [issueDescriptionErr, setIssueDescriptionErr] = useState({issueDescriptionErrMsg: '', showIssueDescriptionErr: false})

    const [backendResponseErr, setBackendResponseErr] = useState('');


    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);




    const handleOnSuccessfullSubmission = () => {
        setIsSubmittedSuccessfully(false);
        navigate('/help-center', {replace: true})
    }

    const submitForm = async (event) => {
        event.preventDefault();

        const {email, issueTitle, issueDescription} = form;

        if (email.length > 0 && issueTitle.length >= 4 && issueDescription.length >= 4) {
            const issueDetails = {email, issueTitle, issueDescription};

            const url = `${apiUrl}/rise-issue`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(issueDetails)
            }
            const response = await fetch(url, options)
            const data = await response.json()

            
            if (!response.ok) {
                setBackendResponseErr(data.err_msg)
            }
            else {
                setBackendResponseErr('')
                
                setIsSubmittedSuccessfully(true)
                
                setTimeout(() => {
                    handleOnSuccessfullSubmission()
                }, 2000)
                
            }

            setIssueTitleErr({issueTitleErrMsg: '', showissueTitleErr: false})
            setIssueDescriptionErr({issueDescriptionErrMsg: '', showIssueDescriptionErr: false})
            setEmailErr({emailErrMsg: '', showEmailErr: false})
        }

    } 

    const handleOnchangeInput = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

     const onBlurInput = (event) => {
        if (event.target.name === 'email') {    
            if (event.target.value.length <= 3) {
                setEmailErr({emailErrMsg: '*required', showEmailErr: true})
            }
            else {
                setEmailErr({emailErrMsg: '', showEmailErr: false})
            }
        }
        if (event.target.name === 'issueTitle') {    
            if (event.target.value.length < 4) {
                setIssueTitleErr({issueTitleErrMsg: '*Issue Title should atleast contain 4 characters', showIssueTitleErr: true})
            }
            else {
                setIssueTitleErr({issueTitleErrMsg: '', showissueTitleErr: false})
            }
        }
        if (event.target.name === 'issueDescription') {    
            if (event.target.value.length < 4) {
                setIssueDescriptionErr({issueDescriptionErrMsg: '*Issue Description should atleast contain 4 characters', showIssueDescriptionErr: true})
            }
            else {
                setIssueDescriptionErr({issueDescriptionErrMsg: '', showIssueDescriptionErr: false})
            }
        }
    } 


    const renderForm = () => {
        return (
            <form className='rise-issue-form'>

                {/* email  */}
                <label htmlFor='email' className='rise-issue-labels'>
                    Email 
                </label>
                <input type='email' id='email' className='rise-issue-inputs' placeholder='Enter Email' name='email' value={form.email} onChange={handleOnchangeInput} onBlur={onBlurInput}/> 
                {emailErr.showEmailErr && <p className='error-msg'>{emailErr.emailErrMsg}</p>}
                
                

                {/* issue title  */}
                <label htmlFor='issueTitle' className='rise-issue-labels'>
                    Issue Title 
                </label>
                <input type='text' id='issueTitle' className='rise-issue-inputs' placeholder='Enter Issue Title' name='issueTitle' value={form.issueTitle} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {issueTitleErr.showIssueTitleErr && <p className='error-msg'>{issueTitleErr.issueTitleErrMsg}</p>}
                



                {/* issue description  */}
                <label htmlFor='issueDescription' className='rise-issue-labels'>
                    Issue Description 
                </label>
                <textarea rows={4} cols={40} id='issueDescription' className='rise-issue-textarea' name='issueDescription' value={form.issueDescription}  placeholder='Enter Issue Description' onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {issueDescriptionErr.showIssueDescriptionErr && <p className='error-msg'>{issueDescriptionErr.issueDescriptionErrMsg}</p>}


                

                {/* backendResponseErr */}
                {backendResponseErr.length > 0 && <p className='error-msg'>{backendResponseErr}</p>}

                {/* create project btn */}
                <button type='submit' className='create-project-btn'>
                    Submit 
                </button>

                
                {/* cancel btn for smaller screens */}
                <button type='button' className='rise-issue-cancel-btn' onClick={() => navigate('/help-center')} >
                    Cancel 
                </button>

            </form>
        )
    }

    const renderSuccessfullCard = () => {
        return (
            <div className='project-created-successfully-card'>
                <h1 className='project-created-successfully-text'>
                    Issue Submitted Successfully 
                </h1>
                <img className='project-created-successfully-tick-gif' src='/Check animation.gif' alt='check animation' />
            </div>
        )
    }





    return (
        <div className='rise-issue-bg-container' onSubmit={submitForm}>
            {isSubmittedSuccessfully ? renderSuccessfullCard() : renderForm()}
        </div>
    )
}


export default RiseIssue;