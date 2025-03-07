import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.webp';
import WatchlistIcon from './WatchlistIcon';
import { FaPlus } from 'react-icons/fa';
import ReviewSidebar from './ReviewSidebar';
import { AuthContext } from './Auth/AuthContext';
import axiosInstance from '../api/axios';
import { WatchlistContext } from '../WatchlistContext';


function MovieDetails() {
  const { media_type, id } = useParams();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn } = useContext(AuthContext);
  const { isInWatchlist } = useContext(WatchlistContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const endpoint = media_type === "tv" ? `/api/tv/${id}` : `/api/movies/${id}`;
        const dbResponse = await axiosInstance.get(endpoint);
        console.log('Movie fetched from DB:', dbResponse.data);
        setMovie(dbResponse.data);
        if (dbResponse.data.length !== 0) {
          refreshMovieData(media_type, id);
        }
        //setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          fetchMovieFromTMDB(media_type, id);
        } else {
          console.error('Error fetching movie from database:', err);
          setErrorMessage('Error fetching movie from database');
          setIsLoading(false);
        }
      };
    };

    const fetchMovieFromTMDB = async (mediaType, movieId) => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movieId}?language=en-US&api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details from TMDB');
        }
        const movieData = await response.json();
        console.log('Fetched movie data from TMDB:', movieData);
        setMovie(movieData);
        setIsLoading(false);
        await addMovieToDatabase(mediaType, movieData);
      } catch (err) {
        console.error('Error fetching movie from TMDB:', err);
        setErrorMessage('Error fetching movie from TMDB');
        setIsLoading(false);
      }
    };

    const addMovieToDatabase = async (mediaType, movieData) => {
      try {
        const genreIds = await Promise.all(
          movieData.genres.map(async (genre) => {
            try {
              const response = await axiosInstance.get(`/api/genres/${genre.id}`);
              return { tmdb_genre_id: genre.id, name: genre.name };
            } catch (error) {
              const newGenreResponse = await axiosInstance.post('/api/genres/', {
                tmdb_genre_id: genre.id,
                name: genre.name,
              });
              return { tmdb_genre_id: genre.id, name: genre.name };
            }
          })
        );

        const endpoint = mediaType === "tv" ? "/api/tv/" : "/api/movies/";

        const response = await axiosInstance.post(endpoint, {
          tmdb_id: movieData.id,
          tmdb_type: mediaType,
          title: movieData.name || movieData.title,
          description: movieData.overview,
          release_date: movieData.first_air_date || movieData.release_date,
          poster_url: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : null,
          vote_average: movieData.vote_average,
          genres: genreIds,
        });
        console.log('Movie added to database:', response.data);
      } catch (error) {
        console.error('Error adding movie to database:', error.response ? error.response.data : error.message);
      }
    };

    fetchMovieDetails();
  }, [id]);


  const refreshMovieData = async (mediaType, movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${API_KEY}`);
      const movieData = await response.json();
      console.log('Movie Data from API:', movieData);

      const updateData = {
        tmdb_id: movieData.id,
        tmdb_type: mediaType,
        title: movieData.name || movieData.title,
        description: movieData.overview,
        release_date: movieData.first_air_date || movieData.release_date,
        poster_url: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
        vote_average: movieData.vote_average,
        genres: movieData.genres.map(genre => ({
          tmdb_genre_id: genre.id,
          name: genre.name,
        })),

      };



      const endpoint = mediaType === "tv" ? `/api/tv/${id}/` : `/api/movies/${id}/`;

      await axiosInstance.put(endpoint, updateData);
      console.log('Updating movie with data:', updateData);

      setMovie((prev) => ({
        ...prev,
        ...movieData,
        genres: movieData.genres,
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error refreshing movie data:', error);
      setIsLoading(false);
    }
  };

  const handleAddReview = () => {
    if (!userLoggedIn) {
      navigate('/login');
    } else {
      setIsSidebarOpen(true);
    }
  };

  const handleReviewSubmit = (reviewContent) => {
    axiosInstance.post('/api/reviews/', {
      [media_type === "tv" ? "tv_series" : "movie"]: parseInt(id, 10),
      content: reviewContent,
    })
      .then(response => {
        setReviews([...reviews, response.data]);
        setIsSidebarOpen(false);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  };


  return (
    <div className="h-screen w-screen bg-primaryBg overflow-y-scroll">
      <div className="flex inset-0 flex-col items-center md:items-start md:flex-row max-w-screen max-h-screen ">

        {isLoading ? (
          <p className="text-white text-center mt-8 ml-8 w-full"> is loading ... </p>
        ) : (
          <>
            <div className="w-2/3 md:w-[400px] h-auto px-4 sm:px-6 md:px-8 shrink-0">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="mt-8 w-full h-full rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center mt-14">
                  <span className="text-white">No Image Available</span>
                </div>
              )}
            </div>

            <div className="text-white px-8 mt-10">
              <a href="/" className="inline-block py-4 w-fit" title="Home">
                <img
                  alt="Home"
                  src={logoImage}
                  className="h-8 sm:h-10 md:h-10"
                />
              </a>

              <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <WatchlistIcon
                  movieId={movie.id}
                  movie={movie}
                  mediaType={media_type}
                  isInWatchlist={isInWatchlist(movie.id, media_type)}
                />
                {movie.title || movie.name}
              </h1>

              <p className="mb-2">
                <strong>TMDb Score:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}/10
              </p>

              <button onClick={handleAddReview} className="text-blue-500 flex items-center">
                <FaPlus className="mr-1" /> Review
              </button>


              <button onClick={() => navigate(`/reviews/${media_type}/${id}`)} className="text-blue-500 underline ml-4 flex items-center">
                All Reviews
              </button>


              <p className="mb-4">{movie.overview || movie.description}</p>
              <p className="mt-2"><strong>Media Type:</strong> {media_type}</p>
              <p className="mt-2"><strong>Release Date:</strong> {movie.release_date || movie.first_air_date}</p>
              <p className="mt-2">
                <strong>Genre:</strong> {
                  Array.isArray(movie.genres) && movie.genres.length > 0
                    ? movie.genres.map((genre) => (typeof genre === 'object' ? genre.name : 'Loading...')).join(', ')
                    : 'No genres available'
                }
              </p>


              {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </div>
          </>
        )}
      </div>

      {/* Review Sidebar */}
      {isSidebarOpen && (
        <ReviewSidebar
          className="fixed right-0 top-0 h-full w-full sm:w-1/2 lg:w-1/4"
          onSubmit={handleReviewSubmit}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default MovieDetails;
