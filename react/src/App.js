import './App.css';
import React, { useState, useEffect } from 'react';
import Goo from './Goo';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Memochat from './Memochat';
import Pdf from './Pdf';
import Cover from './Cover';
import Code from './Code';
import Speech from './Speech';
import { useAuth0 } from '@auth0/auth0-react';
import PaymentModal from './PaymentModal'; 

function App() {

  let uri='https://bot-kjjm.onrender.com/'
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
  
  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Initialize useLocation hook

  useEffect(() => {
      // Check authentication status and redirect on component mount
      if (!isAuthenticated && location.pathname === '/goo') {
          navigate('/'); // Redirect to home if not authenticated and not on home
      } 
  }, [isAuthenticated, location.pathname, navigate]); // Run effect when isAuthenticated or pathname changes

  const handleGooClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
            returnTo: '/goo'
        }
    });
    }  
    
  };

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
  };

  const handlePaymentFailure = () => {
    alert('Payment failed. Please try again.');
  };

  return (
    <div className="min-h-screen w-screen bg-custom-dark text-center">
      <div className="min-h-screen w-full flex flex-col text-white">
        {/* Auth Section */}
        <div className="p-4">
          {!isAuthenticated ? (
            <button 
              onClick={() => loginWithRedirect()}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span>{user.name}</span>
              <button 
                onClick={() => logout({ returnTo: 'https://legendary-fishstick-67w6q66jwxgh4q49-3000.app.github.dev' })}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold mb-8">chatbot</h1>

        {/* Main Content Area */}
        <div className="flex flex-1 w-full">
          {/* Sidebar */}
          <div className="w-1/5 flex flex-col items-center border-r border-white border-dashed p-4">
            <Link to="/historical" className="sidebar-link">
              Chat with memory
            </Link>
            <Link to="/" className="sidebar-link">
              Analyze a document
            </Link>
            <Link to="/code" className="sidebar-link">
              Convert your code
            </Link>
            <Link 
              to="/goo" 
              onClick={handleGooClick}
              className="sidebar-link"
            >
              Latest knowledge
            </Link>
            <Link to="/cover" className="sidebar-link">
              Write cover letter
            </Link>
            <Link to="/speech" className="sidebar-link">
              Speech
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route 
                path="goo" 
                element={
                  isAuthenticated && isSubscribed ? (
                    <Goo link={uri} />
                  ) : (
                    <PaymentModal 
                      onSuccess={handlePaymentSuccess} 
                      onFailure={handlePaymentFailure} 
                      link={uri}
                    />
                  )
                } 
              />
              <Route path="historical" element={<Memochat link={uri} />} />
              <Route path="/" element={<Pdf link={uri} />} />
              <Route path="/cover" element={<Cover />} />
              <Route path="/code" element={<Code />} />
              <Route path="/speech" element={<Speech />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
