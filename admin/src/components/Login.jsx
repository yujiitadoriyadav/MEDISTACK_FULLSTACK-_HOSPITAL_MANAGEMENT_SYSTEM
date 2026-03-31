import React, { useState } from "react";
import axios from "axios"
import {useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
const Login = () => {
    const [state, setState] = useState("doctor");
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const[token,setToken] = useState();
     const navigate = useNavigate();
     const dispatch=useDispatch();
    const submitHandler = async (event) => {
        event.preventDefault();
        try {
           if(state === "admin")
           {
             const { data } = await axios.post("http://localhost:5000/api/admin/login", { email, password })
            if (data.success) {
                                localStorage.removeItem("Doctortoken");
                localStorage.setItem("Admintoken", data.token);
                                localStorage.setItem("activeRole", "admin");
                setToken(data.token);
                toast.success("Login Success");
                dispatch(setUserData(data.user));
                navigate("/admin-dashboard")
            } else {
                toast.error(data.message || "Login failed")
            }
           }
           else{
              const { data } = await axios.post("http://localhost:5000/api/doctor/login", { email, password })
            if (data.success) {
                                localStorage.removeItem("Admintoken");
                localStorage.setItem("Doctortoken", data.token);
                                localStorage.setItem("activeRole", "doctor");
                setToken(data.token);
                toast.success("Login Success");
                dispatch(setUserData(data.user));
                navigate("/doctor-dashboard")
            } else {
                toast.error(data.message || "Login failed")
            }
           }
        }
        catch (error) {
            console.log("error in login:", error);
            toast.error(error.message || "Login error");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={submitHandler}
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
            >
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center mb-8">
                    <span className="text-blue-600">
                        {state === "admin" ? "Admin" : "Doctor"}
                    </span>{" "}
                    <span className="text-gray-800">Login</span>
                </h2>

                {/* Email */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    value={email}
                    placeholder="admin@example.com"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Password */}
                <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Password
                </label>
                <input
                    onChange={(e) => { setPassword(e.target.value) }} value={password}
                    type="password"
                    placeholder="********"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Button */}
                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                >
                    Login
                </button>

                {/* Toggle */}
                <p className="text-sm text-gray-700 mt-6 text-left">
                    {state === "admin" ? (
                        <>
                            Doctor Login?{" "}
                            <span
                                onClick={() => setState("doctor")}
                                className="text-blue-600 cursor-pointer underline font-medium"
                            >
                                Click here
                            </span>
                        </>
                    ) : (
                        <>
                            Admin Login?{" "}
                            <span
                                onClick={() => setState("admin")}
                                className="text-blue-600 cursor-pointer underline font-medium"
                            >
                                Click here
                            </span>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
};

export default Login;
