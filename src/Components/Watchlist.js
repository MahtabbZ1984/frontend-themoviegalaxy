import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { FaTrash } from 'react-icons/fa';
import logoImage from '../assets/logo.webp';

function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axiosInstance.get('/api/watchlist/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Watchlist response:', response.data);

                setWatchlist(response.data[0]?.items || []);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlist();
    }, [navigate]);

    const handleRemoveFromWatchlist = async (movieId, mediaType) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axiosInstance.post(
                '/api/watchlist/remove/',
                { 
                    tmdb_id: movieId,
                    tmdb_type: mediaType
                 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const updatedResponse = await axiosInstance.get('/api/watchlist/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWatchlist(updatedResponse.data[0]?.items || []);
            } else {
                console.error('Failed to remove movie:', response.data);
                alert(response.data.message || 'Failed to remove movie.');
            }
        } catch (error) {
            console.error('Error removing movie from watchlist:', error);
            alert('An error occurred while trying to remove the movie.');
        }
    };




    return (
        <body className="absolute inset-0 h-full w-full bg-primaryBg overflow-scroll">

            <div className="text-white px-8 mt-8 md:mt-0">
                <a href="/" className="inline-block py-4 w-fit" title="Home">
                    <img
                        alt="Home"
                        src={logoImage}
                        className="h-8 sm:h-10 md:h-10"
                    />
                </a>

                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">Your Watchlist</h1>
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 p-4">
                    {Array.isArray(watchlist) && watchlist.length > 0 ? (
                        watchlist.map(item => (
                            <div key={item.id} className="text-center p-2 ">
                                <img
                                    src={item.poster_url}
                                    alt={item.title}
                                    className="rounded-lg cursor-pointer"
                                    onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
                                />
                                <div className="mt-2 flex items-center justify-center">
                                    <FaTrash
                                        className="text-red-500 cursor-pointer mr-2"
                                        onClick={() => handleRemoveFromWatchlist(item.tmdb_id, item.media_type)}
                                    />
                                    <Link to={`/details/${item.media_type}/${item.tmdb_id}`}>
                                        {item.title}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">Your watchlist is empty.</p>
                    )}
                </div>
            </div>

        </body>
    );
}

export default Watchlist;