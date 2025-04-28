import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/all-doctors`, {
                headers: { aToken }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/change-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    aToken
                },
                body: JSON.stringify({ docId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/appointments`, {
                headers: { aToken }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/cancel-appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    aToken
                },
                body: JSON.stringify({ appointmentId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/dashboard`, {
                headers: { aToken }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Function to update doctor details
    const updateDoctorDetails = async (doctorId, updatedFields) => {
        try {
            console.log("Updating doctor:", doctorId, "with fields:", updatedFields);
            
            const response = await fetch(`http://localhost:4000/api/doctor/edit/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields)
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success("Doctor updated successfully");
                getAllDoctors(); // Refresh the doctors list
                return { success: true };
            } else {
                toast.error(data.message || "Failed to update doctor");
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error updating doctor:", error);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    };

    // Function to delete a doctor
    const deleteDoctor = async (docId) => {
        try {
            console.log("Deleting doctor:", docId);
            
            const response = await fetch(`http://localhost:4000/api/doctor/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ docId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success("Doctor deleted successfully");
                getAllDoctors(); // Refresh the doctors list
                return { success: true };
            } else {
                toast.error(data.message || "Failed to delete doctor");
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error deleting doctor:", error);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    };

    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        updateDoctorDetails,
        deleteDoctor,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider