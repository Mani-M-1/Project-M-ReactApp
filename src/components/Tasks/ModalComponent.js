import './ModalComponent.css';
import {useState, useEffect, useContext} from 'react';
import Modal from 'react-modal';
import {AiOutlineClose} from 'react-icons/ai';




import userContext from '../../context/user/userContext';


import config from './config';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    background: 'hsl(0 0% 0% / 50%)'
  }
};


// this object represents various "Views" of a component
const componentViews = {
    initial: 'initial',
    success: 'success'
}



function ModalComponent(props) {

    const apiUrl = config.API_BASE_URL;

    const {isModalVisible, handleOnclickCloseModalIcon, taskId, isEditable, getAlltasks} = props;



    const [view, setView] = useState(componentViews.initial)




    const [form, setForm] = useState({projectTitle: '', taskTitle: '', taskDescription: '', assigneeArr: [], assignedTo: '', startDate: '', endDate: ''})

    const [taskTitleErr, setTaskTitleErr] = useState({taskTitleErrMsg: '', showTaskTitleErr: false})
    const [taskDescriptionErr, setTaskDescriptionErr] = useState({taskDescriptionErrMsg: '', showTaskDescriptionErr: false})
    const [startDateErr, setStartDateErr] = useState({startDateErrMsg: '', showStartDateErr: false})
    const [endDateErr, setEndDateErr] = useState({endDateErrMsg: '', showEndDateErr: false})


    const [backendResponseErr, setBackendResponseErr] = useState('');






    const userDetailsFromContext = useContext(userContext);


    const modifyDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Add leading zero if needed
        const day = String(date.getUTCDate()).padStart(2, '0');  // Add leading zero if needed

        return `${year}-${month}-${day}`;
    }


    const modifyDateForNonEditable = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Add leading zero if needed
        const day = String(date.getUTCDate()).padStart(2, '0');  // Add leading zero if needed

        return `${day}-${month}-${year}`;
    }




    const getTaskDetails = async () => {

        

        const url = `${apiUrl}/task/${taskId}/${userDetailsFromContext.state.orgId}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            setBackendResponseErr(data.err_msg);
        } 
        else {
            setForm({...data.taskDetails, assigneeArr: data.usersFromSameOrganization})

            

        }
    }



    useEffect(() => {
        getTaskDetails();
    }, [])


    const submitForm = async (event) => {
      event.preventDefault();



      const {taskTitle, taskDescription, assignedTo, startDate, endDate} = form;


      if (taskTitle.length >= 4 && taskDescription.length >= 4 && assignedTo.length >= 4 && startDate.length > 0 && endDate.length > 0) {
          const taskDetails = {taskTitle, taskDescription, assignedTo, startDate, endDate};

          const url = `${apiUrl}/task/${taskId}/${userDetailsFromContext.state.orgId}/${userDetailsFromContext.state.userId}`
          const options = {
              method: 'PUT',
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
              getTaskDetails()

            setView(componentViews.success)
              
              setTimeout(() => {
                  
                  //this function is called to refresh the page to get updated data
                  getAlltasks()

                  //this function is called to close the modal after updating user successfully
                  handleOnclickCloseModalIcon()

                  setView(componentViews.initial)

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



  const renderSuccessfulSubmissionCard = () => {
    return (
        <div className='task-changes-saved-successfully-card'>
            <p className='task-changes-saved-successfully-text'>
                Task changes updated successfully 
            </p>
            <img className='task-changes-saved-successfully-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
        </div>
    )
  }







  const renderForm = () => {
      return (
        <form className='modal-form' onSubmit={submitForm} >

            {/* project title  */}
            <label htmlFor='projectTitleInsideTaskPage' className='modal-labels'>
                Project Title 
            </label>
            {isEditable 
                ? <input disabled type='text' id='projectTitleInsideTaskPage' className='modal-inputs' placeholder='Enter Project Title' name='projectTitle' value={form.projectTitle}/>
                : <div className='modal-inputs non-editable'>
                    {form.projectTitle}
                </div>
            }


            
            {/* task title  */}
            <label htmlFor='taskTitle' className='modal-labels'>
                Task Title 
            </label>
            {isEditable 
                ? <input type='text' id='taskTitle' className='modal-inputs' placeholder='Enter Task Title' name='taskTitle' value={form.taskTitle} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                : <div className='modal-inputs non-editable'>
                    {form.taskTitle}
                </div>
            }
            {taskTitleErr.showTaskTitleErr && <p className='error-msg'>{taskTitleErr.taskTitleErrMsg}</p>}
            


            {/* task description  */}
            <label htmlFor='taskDescription' className='modal-labels'>
                Task Description 
            </label>

            
            {isEditable 
                ? <textarea rows={4} cols={40} id='taskDescription' className='modal-textarea' name='taskDescription' value={form.taskDescription}  placeholder='Enter Task Description' onChange={handleOnchangeInput} onBlur={onBlurInput} />
                : <div className='modal-inputs non-editable'>
                    {form.taskDescription}
                </div>
            }
            {taskDescriptionErr.showTaskDescriptionErr && <p className='error-msg'>{taskDescriptionErr.taskDescriptionErrMsg}</p>}


            {/* assignee names should be retreived from database to show them in dropdown  */}
            <label htmlFor='assignedTo' className='modal-labels'>
                Assign Task To  
            </label>
            {isEditable 
                ?   <select className='modal-assign-task-dropdown' onChange={handleOnchangeInput} name='assignedTo' value={form.assignedTo} >
                        <option className='modal-assignee-task-options'>
                            Select Assignee
                        </option> 
                        {form.assigneeArr.map(eachItem => <AssigneeItem key={eachItem._id} eachItem={eachItem} />)}
                    </select>

                :   <div className='modal-inputs non-editable'>
                        {form.assignedTo}
                    </div>
            }
            



            {/* start date and end date  */}
            <div className='modal-start-and-end-date-cards'>
                {/* start date card  */}
                <div className='modal-date-card'>
                    {/* start date  */}
                    <label htmlFor='startDate' className='modal-labels'>
                        Start Date 
                    </label>
                    {isEditable 
                        ?   <input type='date' id='startDate' className='modal-inputs' name='startDate' value={modifyDate(form.startDate)} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        :   <div className='modal-inputs non-editable'>
                                {modifyDateForNonEditable(form.startDate)}
                            </div>
                    }
                    {startDateErr.showStartDateErr && <p className='error-msg'>{startDateErr.startDateErrMsg}</p>}
                </div>

                {/* end date card  */}
                <div className='modal-date-card'>
                    {/* end date  */}
                    <label htmlFor='endDate' className='modal-labels'>
                        End Date 
                    </label>

                    {isEditable
                        ?  <input type='date' id='endDate' className='modal-inputs' name='endDate' value={modifyDate(form.endDate)} onChange={handleOnchangeInput} onBlur={onBlurInput} />
                        :  <div className='modal-inputs non-editable'>
                                {modifyDateForNonEditable(form.endDate)}
                            </div>
                    }
                    {endDateErr.showEndDateErr && <p className='error-msg'>{endDateErr.endDateErrMsg}</p>}
                </div>
            </div>

            {/* backendResponseErr */}
            {backendResponseErr.length > 0 && <p className='error-msg'>{backendResponseErr}</p>}

            {/* save task changes btn */}
            {isEditable 
            && <button type='submit' className='save-task-changes-btn'>
                    Save Changes
                </button> 
            }

        </form>
      )
    }




    const renderDifferentViews = () => {
        switch (view) {
            case componentViews.success:
                return renderSuccessfulSubmissionCard()
            default:
                return renderForm()
        }
    }





  return (
    <Modal
        isOpen={isModalVisible}
        onRequestClose={handleOnclickCloseModalIcon}
        style={customStyles}
        contentLabel="Task Deatils Modal"
    >
        <div className='modal-component-bg-container' >

            {/* this div is used to wrap the btn  */}
            <div className='modal-btn-card'>
                {/* this is close btn  */}
                <button className='modal-close-btn' onClick={handleOnclickCloseModalIcon}>
                    <AiOutlineClose className='modal-close-icon' />
                </button>
            </div>

            {/* this is content inside modal which is "form containing task details" */}
            {renderDifferentViews()}
        </div>
    </Modal>
  );
}

export default ModalComponent;