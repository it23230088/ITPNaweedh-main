import express from 'express';
import { 
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
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

// Custom middleware to bypass authentication for specific routes
const bypassAuth = (req, res, next) => {
    // Skip authentication for edit doctor route
    console.log("Bypassing authentication for edit/delete");
    next();
};

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", appointmentCancel);
doctorRouter.get("/appointments", appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", changeAvailablity);
doctorRouter.post("/complete-appointment", appointmentComplete);
doctorRouter.get("/dashboard", doctorDashboard);
doctorRouter.get("/profile", doctorProfile);
doctorRouter.post("/update-profile", updateDoctorProfile);
doctorRouter.delete("/delete", bypassAuth, deleteDoctor);
doctorRouter.put("/edit/:id", bypassAuth, editDoctor);

export default doctorRouter;