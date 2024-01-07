import './index.css';
import { useState, useContext, useEffect } from 'react';
import userContext from '../../context/user/userContext';
import { useNavigate} from 'react-router-dom';





// this object represents various "Views" of a component
const componentViews = {
    initial: 'initial',
    success: 'success'
}




const AddTask = () => {

    const appUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_DEPLOYED_BACKEND_URL

    
    const [view, setView] = useState(componentViews.initial)


    
    const [taskTitleErr, setTaskTitleErr] = useState({taskTitleErrMsg: '', showTaskTitleErr: false})
    const [taskDescriptionErr, setTaskDescriptionErr] = useState({taskDescriptionErrMsg: '', showTaskDescriptionErr: false})
    const [startDateErr, setStartDateErr] = useState({startDateErrMsg: '', showStartDateErr: false})
    const [endDateErr, setEndDateErr] = useState({endDateErrMsg: '', showEndDateErr: false})
    
    const [form, setForm] = useState({projectTitle: '', taskTitle: '', taskDescription: '', assigneeArr: [], assignedTo: '', startDate: '', endDate: ''})

    const [backendResponseErr, setBackendResponseErr] = useState('');




    const navigate = useNavigate();


    const userDetailsFromContext = useContext(userContext);



    const getProjectTitle = async () => {
        const url = `${appUrl}/project/${userDetailsFromContext.state.projectId}/${userDetailsFromContext.state.orgId}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            setBackendResponseErr(data.err_msg);
        } 
        else {
            setForm({
                ...form,
                projectTitle: data.projectDetails.projectTitle,
                assigneeArr: data.usersFromSameOrganization,
                assignedTo: data.usersFromSameOrganization[0].username
            })
        }
    }


    useEffect(() => {
        getProjectTitle();
    }, [])







    const submitForm = async (event) => {
        event.preventDefault();


        const {taskTitle, taskDescription, assignedTo, startDate, endDate} = form;

        if (taskTitle.length >= 4 && taskDescription.length >= 4 && startDate.length > 0 && endDate.length > 0) {
            const taskDetails = {taskTitle, taskDescription, assignedTo, startDate, endDate, projectId: userDetailsFromContext.state.projectId, orgId: userDetailsFromContext.state.orgId, userId: userDetailsFromContext.state.userId};

            const url = `${appUrl}/task/createTask`
            const options = {
                method: 'POST',
                // mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskDetails)
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
                    navigate(`/project/${userDetailsFromContext.state.projectId}`);
                }, 2000)
                
            }

            setTaskTitleErr({projectTitleErrMsg: '', showProjectTitleErr: false})
            setTaskDescriptionErr({projectDescriptionErrMsg: '', showProjectDescriptionErr: false})
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
        if (event.target.name === 'taskTitle') {    
            if (event.target.value.length < 4) {
                setTaskTitleErr({taskTitleErrMsg: '*Project Title should atleast contain 4 characters', showTaskTitleErr: true})
            }
            else {
                setTaskTitleErr({taskTitleErrMsg: '', showTaskTitleErr: false})
            }
        }
        if (event.target.name === 'taskDescription') {    
            if (event.target.value.length < 4) {
                setTaskDescriptionErr({taskDescriptionErrMsg: '*Project Description should atleast contain 4 characters', showTaskDescriptionErr: true})
            }
            else {
                setTaskDescriptionErr({taskDescriptionErrMsg: '', showTaskDescriptionErr: false})
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

    const AssigneeItem = (props) => {
        const {eachItem} = props; 
        const {username} = eachItem;

        return (
            <option className='assignee-task-options' value={username}>
                {username}
            </option>
        )
    }


    const renderForm = () => {
        return (
            <form className='add-task-form' onSubmit={submitForm}>

                {/* project title  */}
                <label htmlFor='projectTitleInsideTaskPage' className='add-task-labels'>
                    Project Title 
                </label>
                <input disabled type='text' id='projectTitleInsideTaskPage' className='add-task-inputs' placeholder='Enter Project Title' name='projectTitle' value={form.projectTitle}/>



                {/* task title  */}
                <label htmlFor='taskTitle' className='add-task-labels'>
                    Task Title 
                </label>
                <input type='text' id='taskTitle' className='add-task-inputs' placeholder='Enter Task Title' name='taskTitle' value={form.taskTitle} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {taskTitleErr.showTaskTitleErr && <p className='error-msg'>{taskTitleErr.taskTitleErrMsg}</p>}
                


                {/* task description  */}
                <label htmlFor='taskDescription' className='add-task-labels'>
                    Task Description 
                </label>
                <textarea rows={4} cols={40} id='taskDescription' className='add-task-textarea' name='taskDescription' value={form.taskDescription}  placeholder='Enter Task Description' onChange={handleOnchangeInput} onBlur={onBlurInput} />
                {taskDescriptionErr.showTaskDescriptionErr && <p className='error-msg'>{taskDescriptionErr.taskDescriptionErrMsg}</p>}

                {/* assigned to */}
                <label htmlFor='assignedTo' className='add-task-labels'>
                    Assign Task To  
                </label>
                <select className='add-task-assign-task-dropdown' onChange={handleOnchangeInput} name='assignedTo' value={form.assignedTo} >
                    {form.assigneeArr.map(eachItem => <AssigneeItem key={eachItem._id} eachItem={eachItem} />)}
                </select>






                {/* start date and end date  */}
                <div className='start-and-end-date-cards'>
                    {/* start date card  */}
                    <div className='add-task-date-card'>
                        {/* start date  */}
                        <label htmlFor='startDate' className='add-task-labels'>
                            Start Date 
                        </label>
                        <input type='date' id='startDate' className='add-task-inputs' name='startDate' value={form.startDate} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        {startDateErr.showStartDateErr && <p className='error-msg'>{startDateErr.startDateErrMsg}</p>}
                    </div>

                    {/* end date card  */}
                    <div className='add-task-date-card'>
                        {/* end date  */}
                        <label htmlFor='endDate' className='add-task-labels'>
                            End Date 
                        </label>
                        <input type='date' id='endDate' className='add-task-inputs' name='endDate' value={form.endDate} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        {endDateErr.showEndDateErr && <p className='error-msg'>{endDateErr.endDateErrMsg}</p>}
                    </div>
                </div>

                {/* backendResponseErr */}
                {backendResponseErr.length > 0 && <p className='error-msg'>{backendResponseErr}</p>}

                {/* create task btn */}
                <button type='submit' className='create-task-btn'>
                    Create Task  
                </button>

                
                {/* cancel btn for smaller screens */}
                <button type='button' className='add-task-cancel-btn' onClick={() => navigate(`/project/${userDetailsFromContext.state.projectId}`)} >
                    Cancel 
                </button>

            </form>
        )
    }

    const renderSuccessfullCard = () => {
        return (
            <div className='task-created-successfully-card'>
                <h1 className='task-created-successfully-text'>
                    task ceated successfully 
                </h1>
                <img className='task-created-successfully-tick-gif' src='/Check animation.gif' alt='check animation' />
            </div>
        )
    }




    const renderDifferentViews = () => {
        switch (view) {
            case componentViews.success:
                return renderSuccessfullCard()
            default:
                return renderForm()
        }
    }





    return (
        <div className='add-task-bg-container' >
            {renderDifferentViews()}
        </div>
    )
}

export default AddTask;