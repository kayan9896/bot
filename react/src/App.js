import './App.css';
import React, {useEffect, useState} from 'react';
import Chatwindow from './Chatwindow';
import Goo from './Goo';
import {Link, Routes,Route} from 'react-router-dom';
import Memochat from './Memochat';
import Pdf from './Pdf';
import Cover from './Cover';
import Code from './Code';
import Speech from './Speech';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './auth0-provider';
import LoginModal from './LoginModal'

function App() {
  
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginModalClose = () => setShowLoginModal(false);
  let uri='https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/'

  const { 
    isAuthenticated, 
    loginWithRedirect, 
    logout,
    user 
  } = useAuth0();


  const handleGooClick = () => {
    if (!isAuthenticated) {
      // Instead of showing a modal, we'll redirect to Auth0 login
      loginWithRedirect();
    }
  };

  return (
    
    <div className="App">
      <div className="App-header">{!isAuthenticated && (
        <div>
          <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      )}
      {isAuthenticated && (
        <div>
          <span>{user.name}</span>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </div>
      )}
        <h1 style={{height:'7%',margin:'1% 0 2% 0'}}>chatbot</h1>
        <div style={{display:'flex', alignItems:'center', width:'100%',height:'85%'}}>
          <div style={{display:'flex', flexDirection:'column',alignItems:'center',height:'100%',width:'20%',borderRight:'1px dashed white'}}>
          <Link className='btn' to='/historical' >Chat with memory</Link>
          <Link className='btn' to='/'>Analyze a document</Link>
          <Link className='btn' to='/code'>Convert your code</Link>
          <Link className='btn' to='/goo' onClick={()=>{handleGooClick()}}>Latest knowledge</Link>
          <Link className='btn' to='/cover'>Write cover letter</Link>
          <Link className='btn' to='/speech'>Speech</Link>
        </div>
        <Routes>
        <Route path='goo' element={isAuthenticated ? <Goo link={uri} /> : null} />
        <Route path='historical' element={<Memochat link={uri}/>} />
        <Route path='/' element={<Pdf link={uri}/>} />
        <Route path='/cover' element={<Cover/>} />
        <Route path='/code' element={<Code/>} />
        <Route path='/speech' element={<Speech/>} />
        </Routes>
        {/*<LoginModal open={showLoginModal} onClose={handleLoginModalClose} onLogin={handleLogin} onSignup={handleSignUp} />*/}
        </div>
      </div>
    
    </div>
  );
}

export default App;
