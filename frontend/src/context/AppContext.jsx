import { createContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const currencySymbol = "₹";

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/user/getDoclist");
            if (data?.success) {
                setDoctors(data.doctors || []);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getUserProfile = async () => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const { data } = await axios.get("http://localhost:5000/api/user/getuserProfile", {
                headers: { token },
            });

            if (data?.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const value = {
        user,
        doctors,
        token,
        setToken,
        currencySymbol,
        getDoctorsData,
        getUserProfile,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;