import './ModalForDeletingTask.css';
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


function ModalForDeletingtask(props) {



    const {isDeleteModalVisible, handleOnclickCloseDeleteModalIcon, handleOnclickAcceptDelete, taskDetails, isDeletedSuccessfully} = props;








    const renderSuccessfullyDeletedCard = () => {
        return (
            <div className='delete-project-successfully-deleted-card'>
                <p className='delete-project-successfully-deleted-text'>
                    Task Deleted Successfully 
                </p>
                <img className='delete-project-successfully-deleted-gif' src='/successfull-submition-animated-gif.gif' alt='success gif'/>
            </div>
        )
    }






    const renderDeleteTaskModal = () => {
        return (
            <div className='delete-task-modal-card'>
                <p className='delete-task-modal-text'>Do you want to delete <span className='delete-task-modal-task-title'>{taskDetails.taskTitle}</span></p>
                <div className='delete-task-modal-btns-wrapper'>
                    <button id='yesBtnForAcceptDeletion' type='button' className='delete-task-modal-btns' onClick={() => handleOnclickAcceptDelete(taskDetails.taskId)}>
                        Yes
                    </button>
                    <button id='noBtnForRejectDeletion' type='button' className='delete-task-modal-btns' onClick={() => handleOnclickCloseDeleteModalIcon(!isDeleteModalVisible)}>
                        No
                    </button>
                </div>
            </div>
        )
    }






  return (
    <div className='delete-task-modal-component-bg-container' >
      <Modal
        isOpen={isDeleteModalVisible}
        onRequestClose={handleOnclickCloseDeleteModalIcon}
        style={customStyles}
        contentLabel="task Delete Modal"
      >

        {/* this div is used to wrap the btn  */}
        <div className='delete-task-modal-btn-card'>
            {/* this is close btn  */}
            <button className='delete-task-modal-close-btn' onClick={handleOnclickCloseDeleteModalIcon}>
                <AiOutlineClose className='delete-task-modal-close-icon' />
            </button>
        </div>

        {/* this is content inside modal which is "form containing task details" */}
        {isDeletedSuccessfully ? renderSuccessfullyDeletedCard() : renderDeleteTaskModal()} 
      </Modal>
    </div>
  );
}

export default ModalForDeletingtask;