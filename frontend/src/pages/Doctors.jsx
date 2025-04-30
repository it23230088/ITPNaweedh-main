import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col items-start gap-5 mt-5 sm:flex-row">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "Optometrist"
                ? navigate("/doctors")
                : navigate("/doctors/Optometrist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Optometrist"
                ? "bg-[#E2E5FF] text-black "
                : ""
            }`}
          >
            Optometrist
          </p>
          <p
            onClick={() =>
              speciality === "Ophthalmologist"
                ? navigate("/doctors")
                : navigate("/doctors/Ophthalmologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Ophthalmologist" ? "bg-[#E2E5FF] text-black " : ""
            }`}
          >
            Ophthalmologist
          </p>
          <p
            onClick={() =>
              speciality === "Optician"
                ? navigate("/doctors")
                : navigate("/doctors/Optician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Optician" ? "bg-[#E2E5FF] text-black " : ""
            }`}
          >
            Optician
          </p>
          <p
            onClick={() =>
              speciality === "Retinal Specialist"
                ? navigate("/doctors")
                : navigate("/doctors/Retinal Specialist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Retinal Specialist" ? "bg-[#E2E5FF] text-black " : ""
            }`}
          >
            Retinal Specialist
          </p>
          
          <p
            onClick={() =>
              speciality === "Cornea Specialist"
                ? navigate("/doctors")
                : navigate("/doctors/Cornea Specialist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Cornea Specialist" ? "bg-[#E2E5FF] text-black " : ""
            }`}
          >
            Cornea Specialist
          </p>
          
          <p onClick={() => 
            speciality === 'Pediatric Ophthalmologist' 
              ? navigate('/doctors') 
              : navigate('/doctors/Pediatric Ophthalmologist')
            } 
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Pediatric Ophthalmologist' ? 'bg-[#E2E5FF] text-black ' : ''
              }`}
              >
                Pediatric Ophthalmologist
                </p>

        </div>
        <div className="grid w-full gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border max-w-[300px] border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-[#EAEFFF]" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-[#262626] text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
