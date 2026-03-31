import { useEffect } from "react";
import { useState } from "react"
import axios from "axios";
const DoctorList = () => {
  const [DocList,setDocList] = useState([]);
  const DocListhandler = async ()=>{
    try{
      const {data} = await axios.get("http://localhost:5000/api/admin/doc-list");
      setDocList(data.data)
      console.log(data.data)
    }
    catch(err){
      console.log(err)
    }
  }
useEffect(() => {
  DocListhandler();
}, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {DocList.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.DocImage}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.DocName}
              </p>
              <p className="text-zinc-600 text-sm">{item.DocSpecility}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorList


