'use client';

import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';
import { useGlobalContext } from '../Context';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SignupPage() {
    const {
        isModalOpen,
        setIsModalOpen,
        authType,
        openModal,
        data,
        setData,
        route } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }

    const baseUrl = authType === "login" ? "/api/auth/login" : "/api/auth/register"
    const creatUser = async () => {
        setLoading(true)
        try {
            const response = await axios.post(baseUrl, data);
            if (response.data.success) {
                setData({
                    name: "",
                    email: "",
                    number: "",
                    password: ""
                });
                const userData = response.data.userData
                localStorage.setItem("userData", JSON.stringify(userData));
                setIsModalOpen(false);
                window.location.reload();
                route.push("/dashboard");
            }
            else {
                setError(response.data.message);
            }
        } catch (error) {
            console.log("ERROR:", error);
            setError(error.response.data.message);
        }
        finally {
            setLoading(false)
        }
    }

    const handleFormSubmission = (e) => {
        e.preventDefault();
        creatUser();
    }

    useEffect(() => {
        setTimeout(() => {
            setError("")
        }, 3000);
    }, [error])

    return (
        <div className="min-h-screen absolute w-full flex items-center justify-center text-black px-4">
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-70">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-blue-600">
                            {authType === 'register' ? 'Create Account' : 'Login to Chipsub'}
                        </h2>

                        <form onSubmit={handleFormSubmission} className="space-y-4">
                            {authType === 'register' && (
                                <input
                                    onChange={handleOnchange}
                                    value={data.name}
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
                                />
                            )}
                            <input
                                onChange={handleOnchange}
                                value={data.email}
                                name="email"
                                type="email"
                                required
                                placeholder="Email"
                                className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
                            />
                            {
                                authType === "register" &&
                                <input
                                    onChange={handleOnchange}
                                    value={data.number}
                                    name="number"
                                    type="tel"
                                    required
                                    placeholder="Phone"
                                    className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
                                />
                            }
                            <input
                                onChange={handleOnchange}
                                value={data.password}
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full border rounded-lg outline-none border-gray-500 px-4 py-2"
                            />
                            {
                                error && <p className='text-red-600 text-center'>
                                    {error}
                                </p>
                            }
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                            >
                                {
                                    loading ? "Processing"
                                        :
                                        <>
                                            {authType === 'register' ? 'Register' : 'Login'}
                                        </>
                                }
                            </button>
                            {
                                authType === 'register' && <p className='text-center'>Already have an account? <span onClick={() => openModal("login")} className='text-blue-600 underline cursor-pointer'>Login</span></p>
                            }
                        </form>

                        <div className="mt-6 flex items-center justify-between">
                            <hr className="w-full border-t border-gray-500" />
                            <span className="mx-2 text-gray-400 text-sm">OR</span>
                            <hr className="w-full border-t border-gray-500" />
                        </div>

                        <button className="w-full mt-4 flex items-center justify-center gap-3 border border-gray-500 py-2 rounded-lg hover:bg-gray-100">
                            <FcGoogle size={22} />
                            <span className="text-sm">Continue with Google</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
