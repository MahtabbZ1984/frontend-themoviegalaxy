import React, { useContext } from 'react';
import { FaPlusCircle, FaCheckCircle } from 'react-icons/fa';
import { WatchlistContext } from '../WatchlistContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';

function WatchlistIcon({ movieId, movie, mediaType, isInWatchlist: propIsInWatchlist }) {
    const { isInWatchlist: contextIsInWatchlist, addToWatchlist, removeFromWatchlist } = useContext(WatchlistContext);
    const { userLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Prioritize the prop, fallback to context method
    const isInWatchlistStatus = propIsInWatchlist !== undefined
        ? propIsInWatchlist
        : contextIsInWatchlist(movieId);


    if (!userLoggedIn) {
        return null;
    }

    const handleWatchlistToggle = async () => {
        if (!userLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            if (isInWatchlistStatus) {
                await removeFromWatchlist(movieId, movie, mediaType);
            } else {
                await addToWatchlist(movieId, movie, mediaType);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        }
    };

    return (
        <span onClick={handleWatchlistToggle} className="cursor-pointer">
            {isInWatchlistStatus ? (
                <FaCheckCircle color="green" />
            ) : (
                <FaPlusCircle color="blue" />
            )}
        </span>
    );
}

export default WatchlistIcon;
