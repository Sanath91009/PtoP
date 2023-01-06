import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Views/Home";
import { Auth } from "./Views/auth";
import { Dashboard } from "./Views/dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";
import { GlobalRoom } from "./Views/globalRoom";
import { PrivateRoom } from "./Views/privateRoom";
import { Profile } from "./Views/profile";
import { SocketContext, socket } from "./context/socket";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/DarkMode.css";
import { About } from "./components/about";

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <BrowserRouter>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/:eventID/Groom" element={<GlobalRoom />} />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/:eventID/Proom/:roomID"
                        element={<PrivateRoom />}
                    />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </BrowserRouter>
        </SocketContext.Provider>
    );
}

export default App;
