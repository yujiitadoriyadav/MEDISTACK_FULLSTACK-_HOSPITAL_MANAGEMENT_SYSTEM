import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const getDoctorImage = (item) => item.DocImage || item.image
    const getDoctorName = (item) => item.DocName || item.name
    const getDoctorSpeciality = (item) => item.DocSpecility || item.speciality
    const isDoctorAvailable = (item) =>
        typeof item.DocAvailable === "boolean" ? item.DocAvailable : item.available

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 '>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Sumply browse through our extensive list of trusted doctors</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-blue-50' src={getDoctorImage(item)} alt={getDoctorName(item)} />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${isDoctorAvailable(item) ? "text-green-500" : "text-red-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${isDoctorAvailable(item) ? "bg-green-500" : "bg-red-500"}`}></p>
                                <p>{isDoctorAvailable(item) ? "Available" : "Unavailable"}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{getDoctorName(item)}</p>
                            <p className='text-gray-600 text-sm'>{getDoctorSpeciality(item)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => {
                navigate('/doctors');
                scrollTo(0, 0)
            }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>
                More
            </button>
        </div>
    )
}

export default TopDoctors