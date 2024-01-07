import './index.css';
import { useState } from 'react';
import ManageUsers from './ManageUsers';
import ManageProjects from './ManageProjects';



const adminTabItemsArr = [
    {
        id: '1',
        inactiveIcon: 'admin-user-project-m.svg',
        activeIcon: 'admin-active-user-project-m.svg',
        title: 'Manage Users'
    }
]


const AdminPanel = () => {

    const [activeTabId, setActiveTabId] = useState(adminTabItemsArr[0].id);


    
    
    const AdminTabItem = (props) => {
        
        const handleOnclickTabItem = (id) => {
            setActiveTabId(id);
        }

        const {eachItem, isActivated} = props;

        const {id, inactiveIcon, activeIcon, title} =eachItem;


        return (
            <li className='admin-tab-items' onClick={() => handleOnclickTabItem(id)} >
                {isActivated ? <img className='admin-tab-icon' src={activeIcon} alt='active img' /> : <img className='admin-tab-icon' src={inactiveIcon} alt='inactive img' />}
                <p className={isActivated ? 'admin-tab-title tab-active' : 'admin-tab-title'}>
                    {title}
                </p>
            </li>
        )
    }

    const renderComponentBasedOnActiveId = (tabId) => {
        switch (tabId) {
            case "1":
                return <ManageUsers/>;
            case "2":
                return <ManageProjects/>;
            default:
                return null;
        }
    }



    return (
        <div className='admin-panel-bg-container'>
            {/* sidebar for navigating to different pages onclicking "tabItems" */}
            <ul className='admin-panel-side-bar'>
                {adminTabItemsArr.map(eachItem => <AdminTabItem key={eachItem.id} eachItem={eachItem} isActivated={eachItem.id === activeTabId} />)}
            </ul>
            
            {/* right card */}
            <div className='admin-panel-right-card'>
                {renderComponentBasedOnActiveId(activeTabId)}
            </div>
        </div>
    )
}

export default AdminPanel;