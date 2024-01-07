import './index.css';
import { useState, useEffect, useContext } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import Cookies from 'js-cookie';
import {MdOutlineExpandMore, MdOutlineExpandLess} from 'react-icons/md';
import {TbLogout} from 'react-icons/tb';
import {CgProfile} from 'react-icons/cg';

import {SlMenu} from 'react-icons/sl';
import {IoMdClose} from 'react-icons/io';


import userContext from '../../context/user/userContext';


const menuItemsArray = [
  {
    id: 1,
    path: '/',
    title: 'HOME'
  },
  {
    id: 2,
    path: '/project',
    title: 'PROJECTS'
  },
  {
    id: 3,
    path: '/admin-panel',
    title: 'ADMIN PANEL'
  }
] 

function Header() {
  const location = useLocation();

  const [activeId, setActiveId] = useState(menuItemsArray[0].id);

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [isProfileVisible, setIsProfileVisible] = useState(false);


  const userDetailsFromContext = useContext(userContext);

  const [sidebar, setSidebar] = useState(false);







  const navigate = useNavigate();

    const MenuItem = (props) => {
      const {eachItem, isTabActive, activeFunc} = props;
      const {id, path, title} = eachItem


      const handleOnclick = () => {
        activeFunc(id);
      }

      const checkWeatherUserIsAdmin = (isAdmin, path) => {
        if (!isAdmin && path === '/admin-panel') {
          

          return (
            <Link to={path} className='hide-tab-item'>
              {title}
            </Link>
          )
        }
        else {

          return (
            <Link to={path} className={isTabActive && location.pathname === `${path}` ? 'link-items link-active' : 'link-items'}>
              {title}
            </Link>
          )
        }
      }

      return (
        <>
          {/* "sm" means for "small screens" */}
          <li className='menu-items sm-menu-items' onClick={handleOnclick}>
            {checkWeatherUserIsAdmin(userDetailsFromContext.state.isAdmin, path)}
          </li>
        </>
      )

    }

    const activeFunc = (id) => {
      setActiveId(id);
    }

    const handleLogin = () => {
      
      navigate('/login', {replace: true});
    }

    const handleSignup = () => {
      navigate('/signup', {replace: true});
    }

    const handleLogout = () => {
      setIsProfileVisible(!isProfileVisible)
      
      Cookies.remove('jwt_token');


      localStorage.removeItem('userState');

      navigate('/login', {replace: true});
    }



    useEffect(() => {
      if (!Cookies.get('jwt_token')) {
        setIsLoggedIn(false)
      }
      else {
        setIsLoggedIn(true)
      }
    }, [isLoggedIn])
    

    const handleProfileData = () => {
      setIsProfileVisible(!isProfileVisible)
    }


    const handleOnclickProfile = () => {
      setIsProfileVisible(!isProfileVisible)
      navigate(`/profile/${userDetailsFromContext.state.userId}`, {replace: true}); 
    }

    


    return (
      <nav className='header-card'>
        <img className='header-logo' src='/SSDS Logo.png' alt='logo' onClick={() => navigate('/')}/>
        
        {/* for smaller or medium devices hiding "company logo" and showing "menu icon" */}
        <button type='button' className='header-burger-btn' onClick={() => setSidebar(!sidebar)}>
            <SlMenu className='header-burger-icon'/>
        </button>

        
        {/* sidebar item  */}
        <ul className={sidebar ? 'sidebar-menu sidebar-active' : 'sidebar-menu'} onClick={() => setSidebar(!sidebar)}>
            <li className='cross-item'>
                <button type='button' className='close-icon-btn' onClick={() => setSidebar(!sidebar)}>
                    <IoMdClose className='close-icon'/>
                </button>
            </li>
            <Link to='/' className='sidebar-link-items'>
                <li className='sidebar-menu-items'>
                        Home
                </li>
            </Link>
            <Link to='/project' className='sidebar-link-items'>
                <li className='sidebar-menu-items'>
                        Projects 
                </li>
            </Link>
            {
              userDetailsFromContext.state.isAdmin
              &&
              <Link to='/admin-panel' className='sidebar-link-items'>
                  <li className='sidebar-menu-items'>
                          Admin Panel
                  </li>
              </Link>
            }
        </ul>
        


        {/* for larger devices  */}
        <ul className='menu-card'>
          {menuItemsArray.map(eachItem => <MenuItem key={eachItem.id} eachItem={eachItem} activeFunc={activeFunc} isTabActive={activeId === eachItem.id} /> )}
          
          {/* Login Button  */}
          <li className={isLoggedIn ? 'inactive' : 'menu-items'}>
            <button id='loginBtn' type='button' className= 'menu-btns' onClick={handleLogin}>
              LOGIN
            </button>
          </li>

          {/* Signup Button  */}
          <li className={isLoggedIn ? 'inactive' : 'menu-items'}>
            <button id='signupBtn' type='button' className= 'menu-btns' onClick={handleSignup}>
              SIGNUP
            </button>
          </li>


          {/* User Menu */}
          <li className={isLoggedIn ? 'menu-items' : 'inactive'} onClick={handleProfileData}>
            <div className='user-profile-card'>
              {userDetailsFromContext.state.username && userDetailsFromContext.state.username.slice(0, 1).toUpperCase()} 
            </div>
            {
              isProfileVisible ? <MdOutlineExpandLess className='expand-icon' /> : <MdOutlineExpandMore className='expand-icon' /> 
            }
            
          </li>

          {/* Profile Card */}
          <ul className={isProfileVisible ? 'user-profile-panel' : 'inactive'}>
            <li className='profile-panel-items'>
              <button id='logoutBtn' type='button' className= 'profile-panel-btns' onClick={handleOnclickProfile}>
                <CgProfile className='profile-panel-icons' /> 
                Profile
              </button>
            </li>
            <li className='profile-panel-items'>
              <button id='logoutBtn' type='button' className= 'profile-panel-btns' onClick={handleLogout}>
                <TbLogout className='profile-panel-icons' /> 
                Logout
              </button>
            </li>
          </ul>
        </ul>

        
      </nav>
    )
}

export default Header

