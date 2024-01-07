import './index.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';
import {MdLanguage} from 'react-icons/md';
import {AiFillInstagram} from 'react-icons/ai';
import {IoMdHelpCircle} from 'react-icons/io';
import {FaTwitter, FaLinkedinIn, FaFacebookF, FaYoutube} from 'react-icons/fa6';








const companiesArr = [
  {
    id: 1,
    imageUrl:'ssds-original-logo.jpg'
  },
  {
    id: 2,
    imageUrl: 'empty-minds-logo.png'
  }
]


const pagesArr = [
  {
    id: 1,
    title: 'Home'
  },
  {
    id: 2,
    title: 'Projects'
  },
  {
    id: 3,
    title: 'Tasks'
  }
]

const aboutArr = [
  {
    id: 1,
    title: 'Company'
  },
  {
    id: 2,
    title: 'Blog'
  },
  {
    id: 3,
    title: 'Customers'
  },
  {
    id: 4,
    title: 'Sitemap'
  }
]



const iconsArr = [
  {
    id: 1,
    icon: <FaTwitter className='footer-icons' />
  },
  {
    id: 2,
    icon: <FaLinkedinIn className='footer-icons' />
  },
  {
    id: 3,
    icon: <AiFillInstagram className='footer-icons' />
  },
  {
    id: 4,
    icon: <FaFacebookF className='footer-icons' />
  },
  {
    id: 5,
    icon: <FaYoutube className='footer-icons' />
  }
]








function Home() {




  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    if (!Cookies.get('jwt_token')) {
      setIsLoggedIn(false)
    }
    else {
      setIsLoggedIn(true)
    }
  }, [isLoggedIn])




  const navigate = useNavigate();





  const CompanyItem = (props) => {
    const {eachItem} = props;
    const {imageUrl} = eachItem;

    return(
      <li className='company-items'>
        <img className='company-logo' src={imageUrl} alt='company logo'/>
      </li>
    )
  }

  const AppDetailItems = (props) => {
    const {eachItem} = props 
    const {title} = eachItem

    return(
      <li className='app-details-items'>
        <p className='details-title'>{title}</p>
      </li>
    )
  }


  const FooterIconItem = (props) => {
    const {eachItem} = props;
    const {icon} = eachItem;

    return(
      <li className='footer-icon-items'>
        {icon}
      </li>
    )
  }

  const signupBtn = () => {
    navigate('/signup')
  }



  const SignupBtn = () => {
    return (
      <button className='home-signup-btn' onClick={() => signupBtn()} >
        Signup 
        <BsArrowRight className='right-arrow' />
      </button>
    )
  }


  return (
    <div className='home-bg-container'>
      
      {/* main section  */}
      <main className='home-main-section'>
        
        {/* wrapper for wrapping 2 cards */}
        <div className='home-intro-wrapper'>

          {/* btn and description wrapper  */}
          <div className='home-description-and-btn-wrapper'>
            
            {/* main heading  */}
            <h1 className='home-intro-heading'>
              The Modern Project Management tool for your bussiness.
            </h1>

            <p className='home-intro-description'>
              Our Product helps teams focus on what counts, see 
              what everyone's working on, and stay on track --without
              all the emails and meetings.
            </p>
            

            {/* hiding signup btn when "user logged in" */}
            {!isLoggedIn && SignupBtn()}
            
          </div>

          {/* main image of home intro  */}
          <img className='home-intro-image' src='Project Management Img.webp' alt='home intro img'/>
        </div>

        {/* companies intro  */}
        <h1 className='companies-intro'>
          Some of the most established companies in India trust 
          out tool to manage their business.
        </h1>

        
        {/* wrap container to wrap all the company cards  */}
        <ul className='company-cards-wrapper'>
          {companiesArr.map(eachItem => <CompanyItem key={eachItem.key} eachItem={eachItem}/>)}
        </ul>

        {/* horizontal line  */}
        <hr className='horizontal-line'/>

        {/* tool description wrapper  */}
        <div className='tool-description-and-btn-wrapper'>
          {/* tool description  */}
          <h1 className='tool-description'>
            Managing a Project will be easy through our tool, 
            just click below button to experience the new era 
            of Project Management
          </h1>

          {!isLoggedIn && SignupBtn()}

        </div>

        {/* horizontal line  */}
        <hr className='horizontal-line'/>

        {/* creating task heading  */}
        <h1 className='creating-task-stages-text'>
          Creating a Task and different stages of a task. 
        </h1>

        {/* task status images  */}
        <img className='task-status-image' src='task-status-img-2.png' alt='task status img'/>

      </main>





      {/* app details section  */}
      <section className='application-details'>

        {/* logo  */}
        <img className='home-ssds-logo' src='SSDS Logo.png' alt='logo'/>
        
        {/* pages details  */}
        <ul className='app-details-card'>
          <li className='app-details-column-name'>
            Pages 
          </li>
          {pagesArr.map(eachItem => <AppDetailItems key={eachItem.id} eachItem={eachItem} />)}
        </ul>

        {/* about details  */}
        <ul className='app-details-card'>
          <li className='app-details-column-name'>
            About 
          </li>
          {aboutArr.map(eachItem => <AppDetailItems key={eachItem.id} eachItem={eachItem} />)}
        </ul>

      </section>






      {/* footer section  */}
      <footer className='home-page-footer'>
        {/* footer ul card  */}
        <ul className='footer-ul-card'>
          {/* copyrights  */}
          <li key='footer-li-1' className='footer-li-item'>
            <p className='footer-li-text'>
              @ 2023 Project-M, inc 
            </p>
          </li>
          {/* language  */}
          <li key='footer-li-2' className='footer-li-item'>
            <MdLanguage className='language-icon'/>
            <p className='footer-li-text'>
              English
            </p>
          </li>
          {/* terms and privacy  */}
          <li key='footer-li-3' className='footer-li-item'>
            <p className='footer-li-text'>
              Terms & Privacy 
            </p>
          </li>
        </ul>

        {/* footer icons card  */}
        <ul className='footer-icons-card'>
          {iconsArr.map(eachItem => <FooterIconItem key={eachItem.id} eachItem={eachItem} />)}
        </ul>

        {/* available in appstore and playstore card  */}
        <div className='app-availability-card'>
          <img className='app-availability-logo playstore' src='Google_Play_EN.svg' alt='available in playstore'/>
          <img className='app-availability-logo' src='Download_App_Store_Badge_US.svg' alt='available in playstore'/>
        </div>
      </footer>





      {/* Help Center Card */}
      <div className='home-help-center-card' onClick={() => navigate('/help-center')}>
        <IoMdHelpCircle className='home-help-center-icon'/>
        <p className='home-help-center-text'>Help Center</p>
      </div>
    </div>
  )
}

export default Home