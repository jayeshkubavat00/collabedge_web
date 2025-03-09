import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import MainPage from "./components/MainPage/MainPage";
import EditProfile from "./components/EditProfile/EditProfilePage";
import NotificationPage from "./components/Notifications/NotificationPage";
import SubmittedConnections from "./components/SubmittedConnection/SubmittedConnectionPage";
import CreatePost from "./components/CreatePost/CreatePost";
import MyPosts from "./components/MyPosts/MyPosts";
import InterestRequests from "./components/MyPosts/InterestRequests";
import AdminLogin from "./AdminDashBoard/admin-login/admin_login_page";
import AdminDashboard from "./AdminDashBoard/dashboard_page/dashboard_page";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route: AuthForm (Login/Signup) */}
        <Route path="/" element={<AuthForm />} />
        
        {/* MainPage Route */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/submitted-connections" element={<SubmittedConnections />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/my-post" element={<MyPosts />} />

        {/* Add the route for InterestRequests with dynamic postId */}
        <Route path="/interest-requests/:postId" element={<InterestRequests />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
