import './App.css';
import React, { useState, useEffect } from 'react';
import Goo from './Goo';
import { Link, Routes, Route } from 'react-router-dom';
import Memochat from './Memochat';
import Pdf from './Pdf';
import Cover from './Cover';
import Code from './Code';
import Speech from './Speech';
import { useAuth0 } from '@auth0/auth0-react';
import PaymentModal from './PaymentModal'; 

function App() {

  let uri='https://bot-8ejc.onrender.com/'
  //'https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/'
  
  const { 
    isAuthenticated, 
    loginWithRedirect, 
    logout,
    user,
    getAccessTokenSilently 
  } = useAuth0();
  console.log(user)
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${uri}/check-subscription`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setIsSubscribed(data.isSubscribed);
        } catch (error) {
          console.error('Error fetching subscription status:', error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated, getAccessTokenSilently]);
  

  const handleGooClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }  
    
  };

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
  };

  const handlePaymentFailure = () => {
    alert('Payment failed. Please try again.');
  };

  return (
    <div className="App">
      <div className="App-header">
        {!isAuthenticated && (
          <div>
            <button onClick={() => loginWithRedirect()}>Log In</button>
          </div>
        )}
        {isAuthenticated && (
          <div>
            <span>{user.name}</span>
            <button onClick={() => logout({ returnTo: 'https://legendary-fishstick-67w6q66jwxgh4q49-3000.app.github.dev' })}>
              Log Out
            </button>
          </div>
        )}
        <h1 style={{height: '7%', margin: '1% 0 2% 0'}}>chatbot</h1>
        <div style={{display: 'flex', alignItems: 'center', width: '100%', height: '85%'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '20%', borderRight: '1px dashed white'}}>
            <Link className='btn' to='/historical'>Chat with memory</Link>
            <Link className='btn' to='/'>Analyze a document</Link>
            <Link className='btn' to='/code'>Convert your code</Link>
            <Link className='btn' to='/goo' onClick={handleGooClick}>Latest knowledge</Link>
            <Link className='btn' to='/cover'>Write cover letter</Link>
            <Link className='btn' to='/speech'>Speech</Link>
          </div>
          <Routes>
            <Route path='goo' element={isAuthenticated && isSubscribed ? <Goo link={uri} /> : <PaymentModal 
          onSuccess={handlePaymentSuccess} 
          onFailure={handlePaymentFailure} 
          link={uri}
        />} />
            <Route path='historical' element={<Memochat link={uri} />} />
            <Route path='/' element={<Pdf link={uri} />} />
            <Route path='/cover' element={<Cover />} />
            <Route path='/code' element={<Code />} />
            <Route path='/speech' element={<Speech />} />
          </Routes>
        </div>
      </div>
      
    </div>
  );
}

export default App;
