import './index.css';
import {BsSearch, BsFillExclamationCircleFill, BsFillCheckCircleFill} from 'react-icons/bs';
import { FaEllipsisVertical } from "react-icons/fa6";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import ModalComponent from './ModalComponent';
import ModalForDeletingTask from './ModalForDeletingTask';



import userContext from '../../context/user/userContext';


import config from './config';


function Tasks() {

  const apiUrl = config.API_BASE_URL;


  
  const [taskMenuOptions, setTaskMenuOptions] = useState({taskMenuItemId: '', showTaskMenuOptions: false});




  const [searchInput, setSearchInput] = useState('');

  const [taskId, setTaskId] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  // these are for "delete modal"
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [isDeletedSuccessfully, setIsDeletedSuccessfully] = useState(false);

  const [taskDetailsForModal, setTaskDetailsForModal] = useState({})

    




  // "onDragEnd" is a function that gets called when ever a "task" is dragged => this function will contain details about source, destiation and draggedItem 
  const onDragEnd = async (result, columns, setColumns) => {

    if (!result.destination) return; // if result is "null" (or) "undefined" this condition is exicuted

    const {source, destination} = result; // destructuring "source" and "destination" from "result" object 

    if (source.droppableId !== destination.droppableId) { // if "source" and "destination" are different this will execute

      // we should use this condition to write an API to update "taskStatus" of different tasks

      const sourceColumn = columns[source.droppableId]; // getting "source column"
      const destColumn = columns[destination.droppableId]; // getting "destination column"

      const sourceItems = [...sourceColumn.items]; // copiying items of "source column" as array and assigning it to "sourceItems" => Note: It is best practice to not modify the column directly
      const destItems = [...destColumn.items]; // copiying items of "destination column" as array and assigning it to "destItems"

      const [removed] = sourceItems.splice(source.index, 1); // item that is "removed" from "sourceColumn" 
      destItems.splice(destination.index, 0, removed); // item that is "remove" from "sourceColumn" is then added to "destItems"




      // setting state of "columns"
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })


      // we should write API here after the element moved to other column 


      
      // setting value of "isLoading" to "true" to show th loader while requestinf usinf "fetch" method

      const taskStatusUpdationObj = {taskStatus: destColumn.columnStatus}   // creating a "body" for put request based on "destination column status"
      const url = `${apiUrl}/task/${result.draggableId}/${userDetailsFromContext.state.orgId}/${userDetailsFromContext.state.userId}`; //url with "taskId"
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskStatusUpdationObj)
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        alert(data.err_msg);
      }
      else {
        getAlltasks();
      }
      
    }
    else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      })
    }


    
  } 


  // setting initial state of "columns" as "array of objects"
  const [columns, setColumns] = useState([
    {
      id: 'todoStatusColumn',
      name: 'Todo',
      columnStatus: 'todo',
      items: []
    },
    {
      id: 'inProgressStatusColumn',
      name: 'In Progress',
      columnStatus: 'inProgress',
      items: []
    },
    {
      id: 'doneStatusColumn',
      name: 'Done',
      columnStatus: 'done',
      items: []
    }
  ]);


  // "navigate" is used when we want to navigate to other pages
  const navigate = useNavigate();

  // "useParams" hook is used to aquire the "id" from the url
  const {id} = useParams();

  // "userDetailsFromContext" is a "context" Object
  const userDetailsFromContext = useContext(userContext);




  // "getAlltasks" is a function to get all "tasks from backend (or) database"
  const getAlltasks = async () => {


    const url = `${apiUrl}/task/find?search_q=${searchInput}`; // url for "task" API
    const response = await fetch(url); 

    const data = await response.json(); // here we are storing all the response data into the "data"

    const resultantArr = data.filter(eachTask => eachTask.projectId === id) // filtering the data based on "projectId"

    if (response.ok) {

      

      // filtering "tasks" based on "taskStatus"
      const todoTasks = resultantArr.filter(task => task.taskStatus === 'todo'); 
      const inProgressTasks = resultantArr.filter(task => task.taskStatus === 'inProgress');
      const doneTasks = resultantArr.filter(task => task.taskStatus === 'done');

      setColumns([ // setting state for "setColumns" by adding "items" array 
        {
          id: 'todoStatusColumn',
          name: 'Todo',
          columnStatus: 'todo',
          items: todoTasks
        },
        {
          id: 'inProgressStatusColumn',
          name: 'In Progress',
          columnStatus: 'inProgress',
          items: inProgressTasks
        },
        {
          id: 'doneStatusColumn',
          name: 'Done',
          columnStatus: 'done',
          items: doneTasks
        }
      ]);

    }

  }


  // "useEffect" is used to call the "getAlltasks" function when the page loads   
  useEffect(() => {
    getAlltasks();
  }, [searchInput])



  // this function is used to "update the userContext object in local storage"
  const handleOnclickAddtask = () => {
    userDetailsFromContext.setState({...JSON.parse(localStorage.getItem('userState')), projectId: id});
    navigate('/add-task'); // this is to navigate to add-task page 
  }



  const handleOnclickTaskEditIcon = (taskId) => {
    setIsModalVisible(true);
    setTaskId(taskId);
    setIsEditable(true);
  }

  const handleOnclickTaskInfoIcon = (taskId) => {
    setIsModalVisible(true);
    setTaskId(taskId);
    setIsEditable(false);
  }



  const handleOnclickCloseModalIcon = () => {
    setIsModalVisible(false);
  }

  




  // this function is to provide styles for "task Columns"
  const taskColumnStyles = (columnStatus) => {
    switch (columnStatus) {
      case 'todo':
        return {backgroundColor: '#ff5757'}
      case 'inProgress':
        return {backgroundColor: '#ffd600'}
      case 'done':
        return {backgroundColor: '#00e383'}
      default:
        return null;
    }
  }



  // this function is to provide styles for "task Items"
  const taskItemStyles = (statusOfTask) => {
    switch (statusOfTask) {
      case 'todo':
        return 'todo-status-items'
      case 'inProgress':
        return 'in-progress-status-items'
      case 'done':
        return 'done-status-items'
      default:
        return null;
    }
  }


  // this function is used to return "icon" based on "taskStatus"
  const taskStatusIcon = (taskStatusForIcon) => {
    switch (taskStatusForIcon) {
      case 'todo':
        return <BsFillExclamationCircleFill className='todo-status-icon' />
      case 'inProgress':
        return <BsFillExclamationCircleFill className='in-progress-status-icon' />
      case 'done':
        return <BsFillCheckCircleFill className='done-status-icon' />
      default:
        return null;
    }
  }



  // this function is used to "convert the dateString into a proper date format"
  const convertDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();  
    const month = date.getUTCMonth() + 1;  
    const day = date.getUTCDate();  

    return `${day}/${month}/${year}`
  }



  const handleOnclickAcceptDelete = async (taskItemId) => {

    const url = `${apiUrl}/task/${taskItemId}`; 

    const options = {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(url, options); 

    await response.json(); 

    if (!response.ok) {
      alert("Backend Error")
    }
    else {
      
      setIsDeletedSuccessfully(true)

      //this will reload the page to get new task after deletion
      getAlltasks();

      setTimeout(() => {

          setIsDeletedSuccessfully(false);

          setIsDeleteModalVisible(false);
          
      }, 2000)
    }

  }



  const handleOnclickDeleteTask = (taskId, taskTitle) => {    
    setIsDeleteModalVisible(true)
    setTaskDetailsForModal({taskId, taskTitle})
  }


  return (
    <div className='tasks-bg-container'> 

      {/* This modal is for "editing" and "displaying" task details */}
      {isModalVisible && <ModalComponent isModalVisible={isModalVisible} handleOnclickCloseModalIcon={handleOnclickCloseModalIcon} taskId={taskId} isEditable={isEditable} getAlltasks={getAlltasks} />}


      {/* Modal for deleting Task */}
      {isDeleteModalVisible && <ModalForDeletingTask isDeleteModalVisible={isDeleteModalVisible}  handleOnclickCloseDeleteModalIcon={() => setIsDeleteModalVisible(false)} handleOnclickAcceptDelete={handleOnclickAcceptDelete} taskDetails={taskDetailsForModal} isDeletedSuccessfully={isDeletedSuccessfully}/>}


      {/* search container and add task btn wrapper   */}
      <div className='tasks-search-and-add-btn-wrapper'>


        {/* search card  */}
        <div className='tasks-search-card'>
          <input id='taskSearch' type='search' className='tasks-search-input' placeholder='Search by Task or Assignee' onChange={(event) => setSearchInput(event.target.value)} />
          <label className='tasks-search-label' htmlFor='taskSearch' >
            <BsSearch className='search-icon'/>
          </label>
        </div>


        {/* add task btn  */}
        <button className='add-task-btn' type='button' onClick={handleOnclickAddtask}>
          <span className='add-task-plus-text'>
            + {' '}
          </span>
          Add Task 
        </button>


      </div>


      {/* task status card */}

      {/* I have used react-beautiful-dnd pacakage for drag-and-drop functionality  */}


      <div className='task-status-card'>
        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)} >

          
          {Object.entries(columns).map(([id, column]) => {   // 'id' is "index" and 'column' is "taskColumn"
            

            return (
              <div className='status-card'>

                {/* count and status wrapper  */}
                <div style={taskColumnStyles(column.columnStatus)} className='count-and-status-text-wrapper'>
                  <p className='tasks-count'>{column.items.length}</p>
                  <h1 className='status-text' >{column.name}</h1>
                </div>


                {/* droppable card  */}
                <div className='droppable-card'>

                  {/*droppable component to wrap columns*/}
                  <Droppable droppableId={id} key={id} >


                    {(provided, snapshot) => {

                      return (

                        // Task Status Columns
                        <div 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={snapshot.isDraggingOver ? 'droppable-columns draggingOverColor' : 'droppable-columns notDrgaggingOverColor'}
                        >

                          {/* "column" has "items" key which conatins array of "tasks" so we should map over "items" */}
                          {column.items.map((item, index) => {

                            return (
                              
                              // draggable component to wrap Task Item
                              <Draggable key={item.taskId} draggableId={item.taskId} index={index}>
                                
                                {(provided, snapshot) => {
                                  return (
                                    // Task Item
                                    <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={snapshot.isDragging ? `task-items dragging-task ${taskItemStyles(item.taskStatus)}` : `task-items undragging-task ${taskItemStyles(item.taskStatus)}`}
                                    style={{
                                        ...provided.draggableProps.style
                                      }}
                                    >

                                      <div className='task-shortid-and-details-icon-wrapper'>
                                        <p className='task-short-id'>{item.taskShortId}</p>
                                        <button type='button' className='task-ellipsis-icon-wrapper-btn' onClick={() => setTaskMenuOptions({showTaskMenuOptions: !taskMenuOptions.showTaskMenuOptions, taskMenuItemId: item._id})}>
                                          <FaEllipsisVertical className='task-details-ellipsis-icon'/>
                                        </button>
                                      </div>
                                      

                                      {/* This is the card which will show options to user when he clicks on "ellipsis btn" */}
                                      {
                                        taskMenuOptions.showTaskMenuOptions
                                        &&
                                        taskMenuOptions.taskMenuItemId === item._id
                                        &&
                                        <ul className='task-menu-card-on-clicking-ellipsis-icon' onClick={() => setTaskMenuOptions({showTaskMenuOptions: !taskMenuOptions.showTaskMenuOptions})}>

                                          <li className='task-menu-card-items' onClick={() => handleOnclickTaskEditIcon(item.taskId)}>
                                              Edit  
                                          </li>
                                          <li className='task-menu-card-items' onClick={() => handleOnclickTaskInfoIcon(item.taskId)}>
                                              Details   
                                          </li>
                                          {
                                            userDetailsFromContext.state.isAdmin 
                                            && 
                                            <li className='task-menu-card-items' onClick={() => handleOnclickDeleteTask(item.taskId, item.taskTitle)}>
                                                Delete   
                                            </li>
                                          }
                                        </ul>
                                      }


                                      <div className='task-details-and-icon-wrapper'>
                                        <p className='task-title'>{item.taskTitle}</p>
                                        <div className='task-assignee-and-edit-icon-wrapper'>
                                          <p className='task-assigned-to'>{item.assignedTo}</p>
                                        </div>
                                        {taskStatusIcon(item.taskStatus)}
                                      </div>

                                      <p className='task-end-date'>{convertDate(item.endDate)} -End Date</p>

                                    </div>
                                    )
                                  }}
                              </Draggable>

                              )
                              
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>


    </div>
  )
  
}

export default Tasks