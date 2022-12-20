import { logout } from "../services/authService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const Logout = () => {
    const location = useLocation();
    const { key } = location.state;
    useEffect(() => {
        logout(key);
        window.location = "/";
    });
    return null;
};

export default Logout;
