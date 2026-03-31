import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const adminToken = localStorage.getItem("Admintoken")
        const doctorToken = localStorage.getItem("Doctortoken")
        const activeRole = localStorage.getItem("activeRole")

        if (!adminToken && !doctorToken) {
          return
        }

        if (activeRole === "doctor" && doctorToken) {
          const { data } = await axios.get("http://localhost:5000/api/doctor/currentDoc", {
            headers: { token: doctorToken }
          })
          if (data.success) {
            dispatch(setUserData({ ...data.user, role: "doctor" }))
            return
          }
        }

        if (activeRole === "admin" && adminToken) {
          const { data } = await axios.get("http://localhost:5000/api/admin/currentAdmin", {
            headers: { token: adminToken }
          })
          if (data.success) {
            dispatch(setUserData(data.user))
            return
          }
        }
        
        if (doctorToken) {
          const { data } = await axios.get("http://localhost:5000/api/doctor/currentDoc", { 
            headers: { token: doctorToken } 
          })
          if (data.success) {
            dispatch(setUserData({ ...data.user, role: "doctor" }))
          }
        } else if (adminToken) {
          const { data } = await axios.get("http://localhost:5000/api/admin/currentAdmin", { 
            headers: { token: adminToken } 
          })
          if (data.success) {
            dispatch(setUserData(data.user))
          }
        }
      } catch (error) {
        console.log("Error fetching user:", error)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    fetchUser()
  }, [dispatch])

  return isCheckingAuth;
}

export default useGetCurrentUser