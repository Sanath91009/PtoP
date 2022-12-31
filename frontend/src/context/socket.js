import socketio from "socket.io-client";
import React from "react";
import config from "../config.json";

export const socket = socketio.connect(config.apiUrl);
export const SocketContext = React.createContext();
