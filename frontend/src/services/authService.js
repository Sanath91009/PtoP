import jwtDecode from "jwt-decode";
export function Login(key, token) {
    localStorage.setItem(key, token);
}
export function getUser(key) {
    try {
        const jwt = localStorage.getItem(key);
        return jwtDecode(jwt);
    } catch (err) {
        return null;
    }
}
export function logout(key) {
    localStorage.removeItem(key);
}
