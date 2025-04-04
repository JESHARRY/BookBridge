import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Ensure this file exists
import {Route, BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./stores/index.js"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
    
  </React.StrictMode>
);
