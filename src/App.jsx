

import React, { useContext, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login/login';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';
import Chat from './pages/Chat/chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext';
import { updateDoc } from 'firebase/firestore';

const ErrorBoundary = ({ children }) => {
  // Add your error handling logic here
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/chat');
        await loadUserData(user.uid);
      } else {
        navigate('/');
      }
    });
    setInterval(async () => {
      if (auth.chatUser) {
        await updateDoc(useRef, {
          lastSeen: Date.now(),
        });
      }
    }, 60000);
  }, []);

  return (
    <ErrorBoundary>
      <>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/Profile" element={<ProfileUpdate />} />
        </Routes>
      </>
    </ErrorBoundary>
  );
};

export default App;
