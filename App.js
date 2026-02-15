// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import FreelancerProfile from "./pages/FreelancerProfile";
// import Jobs from "./pages/Jobs";
// import Notifications from "./pages/PostJob";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<FreelancerProfile />} />
//         <Route path="/jobs" element={<Jobs />} />
//         <Route path="/notifications" element={<Notifications />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FreelancerProfile from './pages/FreelancerProfile';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.user_type)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Freelancer Routes */}
          <Route
            path="/freelancer/profile"
            element={
              <ProtectedRoute allowedUserTypes={['freelancer']}>
                <FreelancerProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Recruiter Routes */}
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedUserTypes={['recruiter']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedUserTypes={['recruiter']}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          
          {/* Common Routes */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;