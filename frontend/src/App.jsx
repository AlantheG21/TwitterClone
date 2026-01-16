import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import HomePage from './pages/home/HomePage.jsx';
import LoginPage from './pages/auth/login/LoginPage.jsx';
import SignupPage from './pages/auth/signup/SignUpPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App
