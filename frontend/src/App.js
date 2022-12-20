import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Views/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { CpAuth } from "./Views/cpAuth";
import { Auth } from "./Views/auth";
import { Dashboard } from "./Views/dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";
import { GlobalRoom } from "./Views/globalRoom";
import { ExamPortal } from "./Views/examPortal";
import { PrivateRoom } from "./Views/privateRoom";
import { ShowResults } from "./components/showResults";

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/cpauth" element={<CpAuth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/event/Groom" element={<GlobalRoom />} />
                <Route path="/event/exam" element={<ExamPortal />} />
                <Route path="/event/Proom/:id" element={<PrivateRoom />} />
                <Route path="/event/results" element={<ShowResults />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
