import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorList from "./pages/admin/DoctorList";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";


const App = () => {
  
  
  const isCheckingAuth = useGetCurrentUser();

   const{userData}=useSelector(state=>state.user)

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">
        <div className="rounded-xl border border-[#E4E8FF] bg-white px-6 py-4 text-sm font-semibold text-primary">
          Loading dashboard...
        </div>
        <ToastContainer />
      </div>
    );
  }

  return userData ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path='/admin-dashboard' element={<AdminDashboard/>} />
          <Route path='/all-appointments' element={<AdminAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
           <Route path='/doctor-list' element={<DoctorList/>}/>
           <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
           <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
            <Route path='/doctor-profile' element={<DoctorProfile/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;