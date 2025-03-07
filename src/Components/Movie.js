import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';
import headerImage from '../assets/header.png';
import searchIcon from '../assets/search-icon.webp';
import { FaBars } from 'react-icons/fa';
import watchlistIcon from '../assets/wishlist-icon.webp';

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [filteredBYGenreMovies, setFilteredBYGenreMovies] = useState([]);
  const [filteredByDecadeMovies, setFilteredByDecadeMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenre] = useState('');
  const [decade, setDecade] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser, userLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User Logged In:", userLoggedIn);
    console.log("Current User:", currentUser);
  }, [userLoggedIn, currentUser]);

  const decades = [
    '2020s', '2010s', '2000s', '1990s', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s',
  ];

  const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

  const getTrendingMovies = () => {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        setMovieList(json.results);
        setFilteredBYGenreMovies(json.results);
        setFilteredByDecadeMovies(json.results);
      })
      .catch(error => console.error('Error fetching movies:', error));
  };

  const getGenres = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        setGenreList(json.genres);
      })
      .catch(error => console.error('Error fetching genres:', error));
  };

  const searchMovies = (query) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)

      .then(res => res.json())
      .then(json => {
        setMovieList(json.results);
        setFilteredBYGenreMovies(json.results);
        setFilteredByDecadeMovies(json.results);
      })
      .catch(error => console.error('Error searching movies:', error));
  };

  const genreFilterMovies = () => {
    let filteredMovies = filteredBYGenreMovies;

    if (genre !== '' && decade === '') {
      filteredMovies = filteredMovies.filter(movie => movie.genre_ids && movie.genre_ids.includes(parseInt(genre)));
      setMovieList(filteredMovies);
    } else if (genre !== '' && decade !== '') {
      filteredMovies = filteredByDecadeMovies;
      const startYear = parseInt(decade.slice(0, 4));
      const endYear = startYear + 9;
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.release_date) return false;
        const releaseYear = new Date(movie.release_date).getFullYear();
        return releaseYear >= startYear && releaseYear <= endYear;
      });
      setMovieList(filteredMovies);

      filteredMovies = movieList;
      filteredMovies = filteredMovies.filter(movie => movie.genre_ids.includes(parseInt(genre)));
      setMovieList(filteredMovies);
    } else if (genre === '' && decade === '') {
      getTrendingMovies();
    } else if (genre === '' && decade !== '') {
      decadeFilterMovies();
    }
  };

  const decadeFilterMovies = () => {
    let filteredMovies = filteredByDecadeMovies;

    if (decade !== '' && genre === '') {
      const startYear = parseInt(decade.slice(0, 4));
      const endYear = startYear + 9;
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.release_date) return false;
        const releaseYear = new Date(movie.release_date).getFullYear();
        return releaseYear >= startYear && releaseYear <= endYear;
      });
      setMovieList(filteredMovies);
    } else if (decade !== '' && genre !== '') {
      filteredMovies = filteredBYGenreMovies;
      filteredMovies = filteredMovies.filter(movie => movie.genre_ids && movie.genre_ids.includes(parseInt(genre)));
      setMovieList(filteredMovies);

      filteredMovies = movieList;
      const startYear = parseInt(decade.slice(0, 4));
      const endYear = startYear + 9;
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.release_date) return false;
        const releaseYear = new Date(movie.release_date).getFullYear();
        return releaseYear >= startYear && releaseYear <= endYear;
      });
      setMovieList(filteredMovies);
    } else if (decade === '' && genre === '') {
      getTrendingMovies();
    } else if (decade === '' && genre !== '') {
      genreFilterMovies();
    }
  };

  useEffect(() => {
    getTrendingMovies();
    getGenres();
  }, []);

  useEffect(() => {
    genreFilterMovies();
  }, [genre]);

  useEffect(() => {
    decadeFilterMovies();
  }, [decade]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchMovies(searchTerm);
    } else {
      getTrendingMovies();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMovieClick = (media_type, movieId) => {
    navigate(`/details/${media_type|| 'movie'}/${movieId}`);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleWatchlistClick = () => {
    if (userLoggedIn) {
      navigate('/watchlist');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="absolute h-full w-screen overflow-auto no-scrollbar bg-primaryBg">
      <header className="relative w-full h-auto text-right mb-55%">
        <div className="absolute w-full h-auto mb-0 mt-0">
          <img src={headerImage} alt="Header" className="w-full h-95% object-cover absolute z-0 mt-0" />
          <div className="absolute inset-0 bg-gradient-to-b h-full from-[#6327b16c] to-primaryBg z-10 "></div>

          <div className='fixed bg-gray-900/80 z-40 h-20 md:h-24 w-full'>
            <div className="fixed z-50  text-left ml-6 lg:ml-8 top-6">
              <button onClick={toggleMenu} className="text-white font-bold">
                <FaBars className='h-8 w-8 md:h-12 md:w-12 lg:h-10 lg:w-10 xl:h-10 xl:w-10' />
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-60  font-bold text-base bg-white text-gray-600 rounded shadow-lg">
                  <Link to="/contact" className="block px-4 py-2 hover:bg-purple-300 hover:rounded">Contact Us</Link>
                  <Link to="/about" className="block  px-4 py-2 hover:bg-purple-300 hover:rounded">What is The Movie Galaxy?</Link>
                </div>
              )}

            </div>

            <div className="fixed z-50 top-7 left-16 md:left-20">
              <img
                src={watchlistIcon}
                alt="Watchlist"
                title='Watchlist'
                className="cursor-pointer rounded-md h-7 w-6 md:h-10 md:w-10 lg:h-9 lg:w-9"
                onClick={handleWatchlistClick}
              />
            </div>

            <div className='fixed z-50 w-1/2 right-1 mr-8 top-5 '>

              {userLoggedIn ? (
                <Link onClick={handleLogout} className="text-white md:text-2xl lg:text-2xl xl:text-2xl text-lg font-bold  font-serif ml-2% ">
                  logout <p>as {currentUser?.username}</p>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="  text-white md:text-3xl lg:text-2xl text-lg font-bold  font-serif ml-2%  ">Login |</Link>
                  <Link to="/signup" className="  text-white md:text-3xl lg:text-2xl text-lg top-12 font-bold  font-serif "> Signup</Link>
                </>
              )}
            </div>
          </div>

          <h1 className="relative z-20 text-white text-200% font-serif px-4 py-2 rounded 
          md:mt-23% mt-35% mx-auto text-center  bg-black/50 h-16 w-96">
            The Movie Galaxy
          </h1>
          <form className="relative mt-5% z-20 w-100% flex justify-center " onSubmit={handleSearch}>
            <div className="relative mx-7% rounded-xl sm:w-50% w-50% mr-15% sm:mr-10% bg-white text-gray-700">
              <input
                type="text"
                className="w-98% py-2.5 pr-6 sm:pr-5 rounded-xl focus:outline-none"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute mr-0 ml-2% cursor-pointer p-0 w-20% 2xl:w-8% xl:w-8% lg:w-8% md:w-8% h-100%">
                <img src={searchIcon} alt="Search" className="w-100% h-100%" />
              </button>
            </div>
          </form>
          <div className="flex relative justify-center gap-20% top-6 md:top-32 w-full z-20">
            <select className="py-2.5 pl-2 text-95% ml-10% font-bold  rounded-xl bg-black/50 text-white w-100%" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">All Genres</option>
              {genreList.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <select className="py-2.5 pl-2 text-95% font-bold mr-10% rounded-xl bg-black/50 text-white w-100%" value={decade} onChange={(e) => setDecade(e.target.value)}>
              <option value="">All Decades</option>
              {decades.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </header>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center md:gap-5% lg:gap-y-8 gap-2 p-8 mb-10">
        {movieList?.map((movie) => (
          <div key={movie.id} className="text-center w-100% h-80% ">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="rounded-xl sm:hover:scale-110 sm:transform sm:transition-transform sm:duration-300 mt-16 lg:mt-8 xl:mt-0 "
              alt={movie.title || movie.name}
              onClick={() => handleMovieClick(movie.media_type, movie.id)}
            />
            <div className="mt-2.5 text-base text-white">
              <Link to={`/details/${movie.media_type || 'movie'}/${movie.id}`}>
                {movie.title || movie.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movie;
