import './index.css';
import { Link } from 'react-router-dom';


const cardsArr = [
    {
        id: '1',
        title: 'RISE A TICKET',
        imgUrl: '/rise-issue-img-Project-M.png',
        path: '/rise-issue'
    },
    {
        id: '2',
        title: 'MESSAGE CENTER',
        imgUrl: '/msg-img-Project-M.png',
        path: '/message-center'
    }
]


const listItemsArr = [
    {
        id: '1',
        title: 'Purchasing Questions',
        description: 'Information you need to know about Project-M Application',
        imgUrl: '/question-mark-img-Project-M.png',
        path: '/purchasing-question'
    }, 
    {
        id: '2',
        title: 'Get Started',
        description: 'Questions about Project-M services',
        imgUrl: '/check-img-Project-M.png',
        path: '/get-started'
    },
    {
        id: '3',
        title: 'Usage Guides',
        description: 'Instructions related to Project-M usage',
        imgUrl: '/guide-img-Project-M.png',
        path: '/usage-guide'
    }
]

const HelpCenter = () => {



    const CardItem = (props) => {
        const {eachItem} = props;
        const {title, imgUrl, path} = eachItem;

        return (
            <Link className='help-center-link-items' to={path}>
                <li className="help-center-main-card-items">
                    <img className="help-center-main-card-imgs" src={imgUrl} alt="main card imgs"/>
                    <h1 className="help-center-main-card-title">{title}</h1>
                </li>
            </Link>
        )
    } 

    const QueryItem = (props) => {
        const {eachItem} = props;
        const {title, description, imgUrl, path} = eachItem;

        return (
            <Link className='help-center-link-items' to={path}>
                <li className="help-center-bottom-card-items">
                    <img className="help-center-bottom-card-imgs" src={imgUrl} alt="bottom card imgs"/>
                    <div className='help-center-bottom-card-title-and-description-wrapper'>
                        <h1 className="help-center-bottom-card-title">{title}</h1>
                        <p className="help-center-bottom-card-description">{description}</p>
                    </div>
                </li>
            </Link>
        )
    } 



    return (
        <div className='help-center-bg-container'>

            {/* Background Image */}
            <img className='help-center-bg-image' src='/helpcenter-bg-img-Project-M.png' alt="helpcenter bg img"/>

            <div className='help-center-hovering-wrapper'>
                {/* help center heading */}
                <h1 className='help-center-hello-text'>
                    Hello, what can we do for you? 
                </h1>

                {/* help center main cards */}
                <ul className='help-center-main-card'>
                    {cardsArr.map(eachItem => <CardItem key={eachItem.id} eachItem={eachItem} />)}
                </ul>

                {/* help center query cards */}
                <ul className='help-center-bottom-card'>
                    {listItemsArr.map(eachItem => <QueryItem key={eachItem.id} eachItem={eachItem} />)}
                </ul>
            </div>
        </div>
    )
}



export default HelpCenter;