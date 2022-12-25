import { logout } from "../services/authService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const Logout = () => {
    const location = useLocation();
    useEffect(() => {
        logout("token");
        window.location = "/";
    });
    return null;
};

export default Logout;
