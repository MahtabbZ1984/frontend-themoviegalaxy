import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Movie from './Components/Movie';
import Watchlist from './Components/Watchlist';
import Login from './Components/Auth/login';
import Register from './Components/Auth/register';
import MovieDetails from './Components/MovieDetails';
import { AuthProvider } from './Components/Auth/AuthContext'; 
import { WatchlistProvider } from './WatchlistContext';
import UsersReviews from './Components/UsersReviews';
import ContactUs from './Components/ContactUs';
import AboutUs from './Components/AboutUs';

function App() {
    return (
        <AuthProvider>
            <WatchlistProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Movie />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/details/:media_type/:id" element={<MovieDetails />} />
                        <Route path="/reviews/:media_type/:id" element={<UsersReviews />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/about" element={<AboutUs />} />

                    </Routes>
                </Router>
            </WatchlistProvider>
        </AuthProvider>
    );
}

export default App;