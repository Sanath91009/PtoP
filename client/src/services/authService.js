import jwtDecode from "jwt-decode";
import config from "../config.json";
export function Login(key, token) {
    localStorage.setItem(key, token);
}
export function getUser(key) {
    try {
        const jwt = localStorage.getItem(key);
        if (jwt == undefined) return null;
        return jwtDecode(jwt);
    } catch (err) {
        return null;
    }
}
export function getHandle(eventID, username) {
    try {
        const tok = localStorage.getItem(`handle${eventID}`);
        if (tok == null) {
            const endpoint = config.apiUrl;
        }
    } catch (err) {
        return null;
    }
}
export function logout(key) {
    localStorage.removeItem(key);
}
