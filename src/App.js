import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MayBeHideNav from './components/MayBeHideNav';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import Projects from './components/Projects';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Tasks from './components/Tasks';
import AddProject from './components/AddProject';
import AddTask from './components/AddTask';
import AdminPanel from './components/AdminPanel';
import AddUser from './components/AddUser';
import HelpCenter from './components/HelpCenter';
import RiseIssue from './components/RiseIssue';
import MessageCenter from './components/MessageCenter';
import PurchasingQuestions from './components/PurchasingQuestions';
import GetStarted from './components/GetStarted';
import UsageGuide from './components/UsageGuide';

import UserState from './context/user/UserState';



function App() {
  return (
    <div className='app-bg-container'>
      <UserState>
        <BrowserRouter>
          <MayBeHideNav>
            <Header/>
          </MayBeHideNav>
          <Routes>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/help-center' element={<HelpCenter/>}/>
            <Route path='/rise-issue' element={<RiseIssue/>}/>
            <Route path='/message-center' element={<MessageCenter/>}/>
            <Route path='/purchasing-question' element={<PurchasingQuestions/>}/>
            <Route path='/get-started' element={<GetStarted/>}/>
            <Route path='/usage-guide' element={<UsageGuide/>}/>
            <Route path='/profile/:id' element={<ProtectedRoute element={<Profile/>}/>}/>
            <Route path='/project' element={<ProtectedRoute element={<Projects/>}/>}/>
            <Route path='/admin-panel' element={<ProtectedRoute element={<AdminPanel/>}/>}/>
            <Route path='/add-project' element={<ProtectedRoute element={<AddProject/>}/>}/>
            <Route path='/project/:id' element={<ProtectedRoute element={<Tasks/>}/>}/>
            <Route path='/add-task' element={<ProtectedRoute element={<AddTask/>}/>}/>
            <Route path='/add-user' element={<ProtectedRoute element={<AddUser/>}/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </BrowserRouter>
      </UserState>
    </div>
  );
}

export default App;
