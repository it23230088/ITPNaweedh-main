import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        
        console.log("Delete request received for doctor ID:", docId);
        
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }
        
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        
        await doctorModel.findByIdAndDelete(docId);
        console.log("Doctor deleted successfully:", docId);
        res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        console.log("Error deleting doctor:", error);
        res.json({ success: false, message: "Failed to delete doctor: " + error.message });
    }
};

// API to edit doctor details
const editDoctor = async (req, res) => {
    try {
        const { id } = req.params; // Get the doctor ID from the URL
        
        console.log("Edit request received for doctor ID:", id);
        console.log("Request body:", req.body);
        
        if (!id) {
            console.log("No doctor ID provided in params");
            return res.json({ success: false, message: "Doctor ID is required" });
        }

        // Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId:", id);
            return res.json({ success: false, message: "Invalid doctor ID format" });
        }

        // Verify doctor exists before updating
        const doctorExists = await doctorModel.findById(id);
        if (!doctorExists) {
            console.log("Doctor not found with ID:", id);
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Create update object with only provided fields from request body
        const updateFields = {};
        
        // Only update the fields that are sent in the request
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                updateFields[key] = req.body[key];
            }
        });

        console.log("Fields to update:", updateFields);

        if (Object.keys(updateFields).length === 0) {
            console.log("No fields to update");
            return res.json({ success: false, message: "No fields to update" });
        }

        // Use findOneAndUpdate to avoid validation issues for partial updates
        const updatedDoctor = await doctorModel.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { 
                new: true,
                runValidators: false // Don't run validators for partial updates
            }
        );

        if (!updatedDoctor) {
            console.log("Update failed for doctor ID:", id);
            return res.json({ success: false, message: "Failed to update doctor details" });
        }

        console.log("Doctor updated successfully:", id);
        res.json({ success: true, message: "Doctor details updated", doctor: updatedDoctor });
    } catch (error) {
        console.log("Error updating doctor:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};


// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.query || req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        return res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
        return res.json({ success: true, message: 'Appointment Completed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.query || req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    deleteDoctor,
    editDoctor
}