import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="119765557809-6pq9f2bqkq97mc6tt9dqphfenvgkoqa5.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)