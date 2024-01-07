import './index.css';
import { useState, useContext } from 'react';
import userContext from '../../context/user/userContext';
import { useNavigate } from 'react-router-dom';



import config from './config';


const AddProject = () => {

    const apiUrl = config.API_BASE_URL;

    const [form, setForm] = useState({projectTitle: '', projectDescription: '', startDate: '', endDate: ''})

    const [projectTitleErr, setProjectTitleErr] = useState({projectTitleErrMsg: '', showProjectTitleErr: false})
    const [projectDescriptionErr, setProjectDescriptionErr] = useState({projectDescriptionErrMsg: '', showProjectDescriptionErr: false})
    const [startDateErr, setStartDateErr] = useState({startDateErrMsg: '', showStartDateErr: false})
    const [endDateErr, setEndDateErr] = useState({endDateErrMsg: '', showEndDateErr: false})


    const [backendResponseErr, setBackendResponseErr] = useState('');


    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);


    const navigate = useNavigate();




    const userDetailsFromContext = useContext(userContext);




    const handleOnSuccessfullSubmission = () => {
        setIsSubmittedSuccessfully(false);
        navigate('/project');
    }

    const submitForm = async (event) => {
        event.preventDefault();

        const {projectTitle, projectDescription, startDate, endDate} = form;
        if (projectTitle.length >= 4 && projectDescription.length >= 4 && startDate.length > 0 && endDate.length > 0) {
            const projectDetails = {projectTitle, projectDescription, startDate, endDate, userId: userDetailsFromContext.state.orgId};

            const url = `${apiUrl}/project`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectDetails)
            }
            const response = await fetch(url, options)
            const data = await response.json()
            // console.log(data)
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

            setProjectTitleErr({projectTitleErrMsg: '', showProjectTitleErr: false})
            setProjectDescriptionErr({projectDescriptionErrMsg: '', showProjectDescriptionErr: false})
            setStartDateErr({startDateErrMsg: '', showStartDateErr: false})
            setEndDateErr({endDateErrMsg: '', showEndDateErr: false})
        }

    } 

    const handleOnchangeInput = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

     const onBlurInput = (event) => {
        if (event.target.name === 'projectTitle') {    
            if (event.target.value.length < 4) {
                setProjectTitleErr({projectTitleErrMsg: '*Project Title should atleast contain 4 characters', showProjectTitleErr: true})
            }
            else {
                setProjectTitleErr({projectTitleErrMsg: '', showProjectTitleErr: false})
            }
        }
        if (event.target.name === 'projectDescription') {    
            if (event.target.value.length < 4) {
                setProjectDescriptionErr({projectDescriptionErrMsg: '*Project Description should atleast contain 4 characters', showProjectDescriptionErr: true})
            }
            else {
                setProjectDescriptionErr({projectDescriptionErrMsg: '', showProjectDescriptionErr: false})
            }
        }
        if (event.target.name === 'startDate') {    
            if (event.target.value.length < 1) {
                setStartDateErr({startDateErrMsg: '*required', showStartDateErr: true})
            }
            else {
                setStartDateErr({startDateErrMsg: '', showStartDateErr: false})
            }
        }
        if (event.target.name === 'endDate') {    
            if (event.target.value.length < 1) {
                setEndDateErr({endDateErrMsg: '*required', showEndDateErr: true})
            }
            else {
                setEndDateErr({endDateErrMsg: '', showEndDateErr: false})
            }
        }
    } 


    const renderForm = () => {
        return (
            <form className='add-project-form'>

                {/* project title  */}
                <label htmlFor='projectTitle' className='add-project-labels'>
                    Project Title 
                </label>
                <input type='text' id='projectTitle' className='add-project-inputs' placeholder='Enter Project Title' name='projectTitle' value={form.projectTitle} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {projectTitleErr.showProjectTitleErr && <p className='error-msg'>{projectTitleErr.projectTitleErrMsg}</p>}
                
                {/* project description  */}
                <label htmlFor='projectDescription' className='add-project-labels'>
                    Project Description 
                </label>
                <textarea rows={4} cols={40} id='projectDescription' className='add-project-textarea' name='projectDescription' value={form.projectDescription}  placeholder='Enter Project Description' onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {projectDescriptionErr.showProjectDescriptionErr && <p className='error-msg'>{projectDescriptionErr.projectDescriptionErrMsg}</p>}


                {/* start date and end date  */}
                <div className='start-and-end-date-cards'>
                    {/* start date card  */}
                    <div className='add-project-date-card'>
                        {/* start date  */}
                        <label htmlFor='startDate' className='add-project-labels'>
                            Start Date 
                        </label>
                        <input type='date' id='startDate' className='add-project-inputs' name='startDate' value={form.startDate} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        {startDateErr.showStartDateErr && <p className='error-msg'>{startDateErr.startDateErrMsg}</p>}
                    </div>

                    {/* end date card  */}
                    <div className='add-project-date-card'>
                        {/* end date  */}
                        <label htmlFor='endDate' className='add-project-labels'>
                            End Date 
                        </label>
                        <input type='date' id='endDate' className='add-project-inputs' name='endDate' value={form.endDate} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        {endDateErr.showEndDateErr && <p className='error-msg'>{endDateErr.endDateErrMsg}</p>}
                    </div>
                </div>

                {/* backendResponseErr */}
                {backendResponseErr.length > 0 && <p className='error-msg'>{backendResponseErr}</p>}

                {/* create project btn */}
                <button type='submit' className='create-project-btn'>
                    Create Project 
                </button>

                {/* cancel btn for smaller screens */}
                <button type='button' className='add-project-cancel-btn' onClick={() => navigate('/project')} >
                    Cancel 
                </button>

            </form>
        )
    }

    const renderSuccessfullCard = () => {
        return (
            <div className='project-created-successfully-card'>
                <h1 className='project-created-successfully-text'>
                    Project created successfully 
                </h1>
                <img className='project-created-successfully-tick-gif' src='/Check animation.gif' alt='check animation' />
            </div>
        )
    }




    return (
        <div className='add-project-bg-container' onSubmit={submitForm} >
            {isSubmittedSuccessfully ? renderSuccessfullCard() : renderForm()}
        </div>
    )
}

export default AddProject;