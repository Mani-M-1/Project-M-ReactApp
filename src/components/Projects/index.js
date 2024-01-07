import './index.css';
import {BsSearch, BsArrowRight} from 'react-icons/bs';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaTrash} from 'react-icons/fa';



import userContext from '../../context/user/userContext';
import ModalForDeleteProject from './ModalForDeleteProject';

import config from '../../config';

function Projects() {
  const apiUrl = config.API_BASE_URL;

  const [searchInput, setSearchInput] = useState('');

  const [projectsArr, setProjectsArr] = useState([]);


  const [projectDetailsForModal, setProjectDetailsForModal] = useState({})


  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isDeletedSuccessfully, setIsDeletedSuccessfully] = useState(false);
    
    

  const navigate = useNavigate();

  const userDetailsFromContext = useContext(userContext);



  

  const handleOnclickAcceptDelete = async (projectId) => {
      const url = `${apiUrl}/project/${projectId}`
      const options = {
          method: 'Delete',
          headers: {
              'Content-Type': 'application/json'
          }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (!response.ok) {
          alert(data.err_msg)
      }
      else {
          setIsDeletedSuccessfully(true)

          //this function is called again to refresh the page and to get updated data
          getAllProjects();

          setTimeout(() => {
              setIsDeletedSuccessfully(false);
              handleOnclickCloseModalIcon(true)
          }, 2000)
      }
  }




  const ProjectItem = (props) => {
    const {eachItem} = props;
    const {projectId, projectShortId, projectTitle, projectDescription, startDate, endDate, projectOwner} = eachItem;


    const convertDate = (dateString) => {
      const date = new Date(dateString);

      const year = date.getUTCFullYear();  
      const month = date.getUTCMonth() + 1;  
      const day = date.getUTCDate();  

      return `${day}/${month}/${year}`
    }

    const handleOnclickViewTasks = () => {
      navigate(`/project/${projectId}`);
    } 

    const handleOnclickTrashBtn = () => {
      setIsModalVisible(true)
      setProjectDetailsForModal({projectId, projectTitle})
    }

    return (
      <li className='project-item'>

        
        <div className='project-item-project-shortid-and-delete-btn-wrapper'>
          <p className='project-short-id'>
            {projectShortId}
          </p>
          {
            userDetailsFromContext.state.isAdmin 
              && 
              <button type='button' className='project-delete-btn' onClick={handleOnclickTrashBtn}>
                <FaTrash className='project-delete-icon'/>
              </button>
          }
        </div>
        <h1 className='project-title'>
            {projectTitle}
        </h1>
        <p className='project-description'>
          {projectDescription}
        </p>
        <p className='project-details'>
          Project Owner: {projectOwner}
        </p>
        <div className='start-and-end-date-text-wrapper'>
          <p className='project-details'>
            Start Date: {convertDate(startDate)}
          </p>
          <p className='project-details'>
            End Date: {convertDate(endDate)}
          </p>
        </div>
        <button type='button' className='view-details-btn' onClick={() => handleOnclickViewTasks()}>
          View Tasks
        </button>
      </li>
    )
  }

  const getAllProjects = async () => {
    
    const url = `${apiUrl}/project/find/${userDetailsFromContext.state.orgId}?search_q=${searchInput}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      setProjectsArr(data);
    }
  } 

  useEffect(() => {
    getAllProjects();
  }, [searchInput])


  const handleOnclickAddProject = () => {
    navigate('/add-project');
  }

  const handleOnclickCloseModalIcon = () => {
      setIsModalVisible(false);
  }



  return (
    <div className='projects-bg-container'>

      
      {/* Modal for deleting Project */}
      {isModalVisible && <ModalForDeleteProject isModalVisible={isModalVisible}  handleOnclickCloseModalIcon={ handleOnclickCloseModalIcon} handleOnclickAcceptDelete={handleOnclickAcceptDelete} projectDetails={projectDetailsForModal} isDeletedSuccessfully={isDeletedSuccessfully}/>}
      
      
      {/* search container and add project btn wrapper   */}
      <div className='projects-search-and-add-btn-wrapper'>
        {/* search card  */}
        <div className='projects-search-card'>
          <input id='projectSearch' type='search' className='projects-search-input' placeholder='Search Project' onChange={(event) => setSearchInput(event.target.value)} />
          <label className='projects-search-label' htmlFor='projectSearch' >
            <BsSearch className='search-icon'/>
          </label>
        </div>

        {/* add project btn  */}
        <button disabled={userDetailsFromContext.state.isAdmin ? false : true} className={userDetailsFromContext.state.isAdmin ? 'add-project-btn' : 'non-admin-add-project-btn' } type='button' onClick={handleOnclickAddProject}>
          <span className='add-project-plus-text'>
            + {' '}
          </span>
          Add Project 

          {/* Only Admin can create project Message card */}
          <div className='only-admin-wrapper'>
            <div className='only-admin-can-create-project-card'>
              Only admin can create Projects 
            </div>
            <div className='comment-type-bottom-edge-card'>

            </div>
            
          </div>
        </button>
      </div>

      <div className='projects-count-and-swipe-wrapper'>
        {/* projects count  */}
        <div className='projects-count-card'>
          <p className='projects-count-num'>
            {projectsArr.length}
          </p>
          <p className='projects-count-text'>
            Projects 
          </p>
        </div>

        {/* swipe msg  */}
        <div className='swipe-card'>
          <p className='swipe-text'>
            Swipe for more
          </p>
          <BsArrowRight className='swipe-right-arrow'/>
        </div>
      </div>

      {/* horizontal scroll card for project items */}
      {projectsArr.length > 0 
        ? 
        <ul className='projects-card'>
          {projectsArr.map(eachItem => <ProjectItem key={eachItem._id} eachItem={eachItem} />)}
        </ul> 
        :
        <div className='no-projects-found-card'>
          <h1 className='no-projects-found'>No Projects Found</h1> 
          <p className='click-add-project-btn-text'>
            Click Add Project button to create a project.
          </p>
        </div>
      }
    </div>
  )
}

export default Projects