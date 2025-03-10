import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext"; 
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserProvider>
            <App />
    </UserProvider>
);
