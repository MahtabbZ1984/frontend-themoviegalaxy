import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axios';
import headerImage from '../../../assets/header.png';
import logoImage from '../../../assets/logo.webp';
import { AuthContext } from '../AuthContext';
import { WatchlistContext } from '../../../WatchlistContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { userLoggedIn, setUserLoggedIn } = useContext(AuthContext);
    const { refreshWatchlist } = useContext(WatchlistContext);

    // Check if the user is already logged in by checking the presence of the access token
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token && window.location.pathname === '/login') {
            setUserLoggedIn(true);
            navigate('/');
        } else {
            setUserLoggedIn(false);
        }
    }, [setUserLoggedIn]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/login/', {
                email,
                password,
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

            await refreshWatchlist();

            // If your login endpoint returns user details:
            if (response.data.user) {
                localStorage.setItem('userDetails', JSON.stringify(response.data.user));
            } else {
                const userResponse = await axiosInstance.get('/api/user/');
                localStorage.setItem('userDetails', JSON.stringify(userResponse.data));
            }
            console.log(localStorage.getItem('userDetails'));

            setUserLoggedIn(true);
            navigate('/');
        } catch (error) {
            setErrorMessage("Login failed. Please check your credentials.");
            console.error('Login error:', error.response ? error.response.data : error);
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <section className="bg-primaryBg top-0 left-0 w-full min-h-screen">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt=""
                        src={headerImage}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-[#6327b16c] to-primaryBg"></div>
                </aside>

                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
                        <a className="block text-blue-600" href="/" title="Home">

                            <img
                                alt="Home"
                                src={logoImage}
                                className="h-8 sm:h-10"
                                viewBox="0 0 28 24"
                                fill="none"
                            />
                        </a>

                        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Welcome to <br /> The Movie Galaxy!
                        </h1>

                        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400"> Email </label>
                                <input
                                    type="email"
                                    autoComplete='email'
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                />
                            </div>

                            <div className="col-span-6 ">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-400"> Password </label>
                                <input
                                    type="password"
                                    autoComplete='new-password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-400 shadow-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                >  Login </button>

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    You don't have an account?{' '}
                                    <Link to={'/signup'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                                </p>
                            </div>
                        </form>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                </main>
            </div>
        </section>
    );
}

export default Login;