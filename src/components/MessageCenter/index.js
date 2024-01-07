import './index.css';
import {useEffect, useState} from 'react';
import {BsSearch} from 'react-icons/bs';





const MessageCenter = () => {
    const appUrl = process.env.REACT_APP_DEPLOYED_BACKEND_URL || process.env.REACT_APP_BACKEND_URL 




    const [searchInput, setSearchInput] = useState('');

    const [issuesArr, setIssuesArr] = useState([]);

    const [viewDeatilsObj, setViewDetailsObj] = useState({viewDetails: false, viewDeatilsItemId: null});






    const getAllUsers = async () => {
        const url = `${appUrl}/rise-issue/find?search_q=${searchInput}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            setIssuesArr(data);
        }
    } 

    useEffect(() => {
        getAllUsers();
    }, [searchInput])




    // this function is used to "convert the dateString into a proper date format"
    const convertDate = (dateString) => {
        const date = new Date(dateString);

        const year = date.getUTCFullYear();  
        const month = date.getUTCMonth() + 1;  
        const day = date.getUTCDate();  

        return `${day}/${month}/${year}`
    }





    const IssueItem = (props) => {
        const {eachItem} = props; 
        const {_id, email, issueTitle, issueDescription, issueStatus,  createdOn} = eachItem;

        return (
            <li className='issue-list-items'>
                
                <div className='message-center-basic-details-wrapper'>
                    
                    {/* Issue Title */}
                    <p className='message-center-issue-title'>
                        {issueTitle}
                    </p>

                    {/* Email */}
                    <p className='message-center-email'>
                        {email}
                    </p>

                


                    {/* Details Btn */}
                    <div className='message-center-details-btn-wrapper'>
                        <button type='button' className='message-center-details-btn' onClick={() => setViewDetailsObj(prevValue => ({viewDetails: !prevValue.viewDetails, viewDeatilsItemId: _id}))} >
                            Details 
                        </button>
                    </div>


                    {/* Issue Status */}
                    <p className={issueStatus === "inProgress" ? 'message-center-issue-status inprogress' : "message-center-issue-status done" }>
                        {issueStatus}
                    </p>


                    {/* Issue CreatedOn */}
                    <p className='message-center-created-on'>
                        created-on: {" "} {convertDate(createdOn)}
                    </p>
                </div>



                {viewDeatilsObj.viewDetails && viewDeatilsObj.viewDeatilsItemId === _id
                    && 
                    <div className='message-center-issue-description-wrapper'>
                        <hr className='message-center-horizontal-line'/>
                        
                        <p className='message-center-issue-description'>
                            <b>Issue Description:</b> {issueDescription}
                        </p>
                    </div>
                }
                

            </li>
        )
    }


    const renderIssuesComponent = () => {
        return (
            <>
                <div className='message-center-top-wrapper'> {/* top wrapper to wrap "Users List text, search and add user btn" */}


                    {/* users list */}
                    <p className='message-center-issues-list-text'>
                        Issues List 
                    </p>


                    {/* this wrapper wraps search and btn */}
                    <div className='message-center-search-and-add-btn-wrapper'>

                        {/* this wrapper wraps search input */}
                        <div className='message-center-search-card'>
                            <input id='manageUsersSearch' type='search' className='message-center-search-input' placeholder='Search Issue' onChange={(event) => setSearchInput(event.target.value)} />
                            <label className='message-center-search-label' htmlFor='manageUsersSearch' >
                                <BsSearch className='message-center-search-icon'/>
                            </label>
                        </div>

                    </div>




                </div>




                {/* users list card */}
                {issuesArr.length > 0 
                
                ?   <ul className='issues-list-card'>
                        {issuesArr.map(eachItem => <IssueItem key={eachItem._id} eachItem={eachItem} />)}
                    </ul> 
                :   <div className='issues-not-found-card'>
                        <h1 className='issues-not-found-text'>
                            No Issues Found 
                        </h1>
                    </div>
                }
            </>
        )
    }


    return (
        <div className='message-center-bg-container'>

            {renderIssuesComponent()}
            

        </div>
    )
}

export default MessageCenter;