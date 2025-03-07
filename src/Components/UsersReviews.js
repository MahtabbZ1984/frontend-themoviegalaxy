import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import logoImage from '../assets/logo.webp';

const UsersReviews = () => {
    const { media_type, id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieAndReviews = async () => {
            try {
                const endpoint = media_type === "tv" ? `/api/tv/${id}/` : `/api/movies/${id}/`;

                const movieResponse = await axios.get(endpoint);
                setMovie(movieResponse.data);

                const reviewsResponse = await axios.get(`/api/reviews/${id}/${media_type}`);
                setReviews(reviewsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieAndReviews();
    }, [id]);

    if (error) return <div>Error: {error}</div>;

    return (
     <div className="absolute p-8 bg-primaryBg h-full w-full">
            {loading ? (
          <p className="text-white text-center mt-8 ml-8 w-full"> is loading ... </p>
        ) : (
         <>
            <a href="/" className="inline-block py-4 w-fit" title="Home">
            <img
              alt="Home"
              src={logoImage}
              className="h-8 sm:h-10 md:h-10"
            />
          </a>
            <h2 className="text-3xl text-white font-bold font-serif ">User Reviews</h2>
            <p className="text-xl text-white font-serif mb-4">of the "{movie?.title}"</p>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="border-4 border-white border-opacity-100 p-2">
                        <p className="font-bold font-serif text-xl text-white mb-2">{review.user}:</p>
                        <p className='font-serif text-white'>{review.content}</p>
                        <p className="text-sm text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ))
            ) : (
                <p className='text-white font-serif'>There are no reviews yet!</p>
            )}
         </>
        )}  
        </div>
    );
};

export default UsersReviews; 