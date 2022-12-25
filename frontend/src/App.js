import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Views/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import { Auth } from "./Views/auth";
import { Dashboard } from "./Views/dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";
import { GlobalRoom } from "./Views/globalRoom";
import { PrivateRoom } from "./Views/privateRoom";
import { Profile } from "./Views/profile";
function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/event/Groom" element={<GlobalRoom />} />
                <Route path="/event/Proom/:id" element={<PrivateRoom />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
