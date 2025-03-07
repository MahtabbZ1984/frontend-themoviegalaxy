import React, { useState, useContext } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axios';
import headerImage from '../../../assets/header.png'
import logoImage from '../../../assets/logo.webp'
import { AuthContext } from '../AuthContext';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { userLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();


    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axiosInstance.post('/api/register/', {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                navigate('/login');
            } else {
                setErrorMessage("Registration failed");
            }

        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "Registration failed");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };


    if (userLoggedIn) {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <section className="bg-primaryBg top-0 left-0 w-full min-h-screen">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12 ">
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 ">
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

                        {/* <p className="mt-4 leading-relaxed text-gray-200">
                            <br />
                        </p> */}

                        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="UserName" className="block text-sm font-medium text-gray-400">
                                    User Name
                                </label>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    name="Username"
                                    required
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-400"> Email </label>

                                <input
                                    type="email"
                                    autoComplete='email'
                                    required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    name="Email"
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="Password" className="block text-sm font-medium text-gray-400"> Password </label>

                                <input
                                    type="password"
                                    autoComplete='new-password'
                                    required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    namer="Password"
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-400 shadow-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-400">
                                    Password Confirmation
                                </label>

                                <input
                                    type="password"
                                    autoComplete='off'
                                    required
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    name="Confirm Password"

                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-400 shadow-sm"
                                />
                            </div>



                            <div className="col-span-6">
                                <p className="text-sm text-gray-500">
                                    By creating an account, you agree to our
                                    <a href="#" className="text-gray-400 underline"> terms and conditions </a>
                                    and
                                    <a href="#" className="text-gray-400 underline">privacy policy</a>.
                                </p>
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                >Sign Up</button>

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    Already have an account?{'   '}
                                    <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                                </p>
                            </div>
                        </form>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Register;
