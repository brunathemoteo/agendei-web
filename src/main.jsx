import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import Rotas from "./rotas.jsx"
import api from "./constants/api.js";

const token = localStorage.getItem("sessionToken");
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <Rotas />
)
