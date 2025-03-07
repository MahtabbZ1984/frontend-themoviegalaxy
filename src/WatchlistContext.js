import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './api/axios';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setWatchlistMovies([]);
                return;
            }

            const response = await axiosInstance.get('/api/watchlist/');
            console.log('Fetched watchlist response:', response.data);
            const items = response.data[0]?.items || [];
            setWatchlistMovies(items);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            setWatchlistMovies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();

        return () => {
            setWatchlistMovies([]);
        };
    }, []);

    const refreshWatchlist = () => {
        fetchWatchlist();
    };

    const isInWatchlist = (movieId, mediaType) => {
        return watchlistMovies.some(item => item.tmdb_id === parseInt(movieId) && item.media_type === mediaType);
    };

    const addToWatchlist = async (movieId, movie, mediaType) => {
        try {
            const response = await axiosInstance.post('/api/watchlist/add/', {
                tmdb_id: movieId,
                tmdb_type: mediaType
            });

             setWatchlistMovies(prev => {
                const newItems = [...prev, { tmdb_id: parseInt(movieId), media_type: mediaType }];
                return newItems;
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            throw error;
        }
    };


    const removeFromWatchlist = async (movieId, movie, mediaType) => {
        try {
            await axiosInstance.post('/api/watchlist/remove/', {
                tmdb_id: movieId,
                tmdb_type: mediaType
            });
        setWatchlistMovies(prev => prev.filter(item => !(item.tmdb_id === parseInt(movieId) && item.media_type === mediaType)));
        await fetchWatchlist();
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            throw error;
        }
    };

    return (
        <WatchlistContext.Provider value={{
            watchlistMovies,
            loading,
            isInWatchlist,
            addToWatchlist,
            removeFromWatchlist,
            refreshWatchlist
        }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export default WatchlistProvider;