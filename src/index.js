import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './Components/Auth/AuthContext';
import { WatchlistProvider } from './WatchlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <WatchlistProvider> 
            <App />
        </WatchlistProvider>
    </AuthProvider>
);