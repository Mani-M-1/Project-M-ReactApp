import './ModalForDeleteProject.css';
import Modal from 'react-modal';
import {AiOutlineClose} from 'react-icons/ai';




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


function ModalForDeleteProject(props) {



    const {isModalVisible, handleOnclickCloseModalIcon, handleOnclickAcceptDelete, projectDetails, isDeletedSuccessfully} = props;








    const renderSuccessfullyDeletedCard = () => {
        return (
            <div className='delete-project-successfully-deleted-card'>
                <p className='delete-project-successfully-deleted-text'>
                    Project Deleted Successfully 
                </p>
                <img className='delete-project-successfully-deleted-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
            </div>
        )
    }






    const renderDeleteProjectModal = () => {
        return (
            <div className='delete-project-modal-card'>
                <p className='delete-project-modal-text'>Do you want to delete <span className='delete-project-modal-project-title'>{projectDetails.projectTitle}</span></p>
                <div className='delete-project-modal-btns-wrapper'>
                    <button id='yesBtnForAcceptDeletion' type='button' className='delete-project-modal-btns' onClick={() => handleOnclickAcceptDelete(projectDetails.projectId)}>
                        Yes
                    </button>
                    <button id='noBtnForRejectDeletion' type='button' className='delete-project-modal-btns' onClick={() => handleOnclickCloseModalIcon(!isModalVisible)}>
                        No
                    </button>
                </div>
            </div>
        )
    }






  return (
    <div className='delete-project-modal-component-bg-container' >
      <Modal
        isOpen={isModalVisible}
        onRequestClose={handleOnclickCloseModalIcon}
        style={customStyles}
        contentLabel="Project Delete Modal"
      >

        {/* this div is used to wrap the btn  */}
        <div className='delete-project-modal-btn-card'>
            {/* this is close btn  */}
            <button className='delete-project-modal-close-btn' onClick={handleOnclickCloseModalIcon}>
                <AiOutlineClose className='delete-project-modal-close-icon' />
            </button>
        </div>

        {/* this is content inside modal which is "form containing task details" */}
        {isDeletedSuccessfully ? renderSuccessfullyDeletedCard() : renderDeleteProjectModal()} 
      </Modal>
    </div>
  );
}

export default ModalForDeleteProject;