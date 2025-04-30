import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, updateDoctorDetails, deleteDoctor: deleteDocContext } = useContext(AdminContext);
  const [editingDoctor, setEditingDoctor] = useState(null);  // Track the doctor being edited
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    available: false,
    image: '',
  });

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  // Handle Delete button
  const deleteDoctor = async (docId) => {
    try {
      if (window.confirm("Are you sure you want to delete this doctor?")) {
        const result = await deleteDocContext(docId);
        
        if (!result.success) {
          alert('Failed to delete doctor: ' + (result.message || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('An error occurred while deleting the doctor: ' + error.message);
    }
  };

  // Handle Edit button
  const editDoctor = (doctor) => {
    console.log("Editing doctor:", doctor);
    setEditingDoctor(doctor);  // Set the doctor being edited
    
    // Set only the fields we want to edit
    setFormData({
      name: doctor.name || '',
      speciality: doctor.speciality || '',
      available: doctor.available || false,
      image: doctor.image || '',
      // Don't include other required fields that we don't want to modify
      // This will ensure we only update what we've changed
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission to update doctor details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting edit for doctor:", editingDoctor._id);
      console.log("Form data:", formData);
      
      // Only include fields that have changed
      const changedFields = {};
      if (formData.name !== editingDoctor.name) changedFields.name = formData.name;
      if (formData.speciality !== editingDoctor.speciality) changedFields.speciality = formData.speciality;
      if (formData.available !== editingDoctor.available) changedFields.available = formData.available;
      if (formData.image !== editingDoctor.image) changedFields.image = formData.image;
      
      console.log("Changed fields:", changedFields);
      
      // If nothing has changed, just return
      if (Object.keys(changedFields).length === 0) {
        alert('No changes to save');
        setEditingDoctor(null);
        return;
      }
      
      // Use the updateDoctorDetails function from context
      const result = await updateDoctorDetails(editingDoctor._id, changedFields);
      
      if (result.success) {
        setEditingDoctor(null); // Reset the editing state
        setFormData({ name: '', speciality: '', available: false, image: '' }); // Reset form data
      } else {
        console.error("Update failed:", result.message);
        alert('Failed to update doctor: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('An error occurred while updating the doctor: ' + error.message);
    }
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      {/* Show the edit form when editingDoctor is not null */}
      {editingDoctor && (
        <div className='p-4 border border-[#C9D8FF] rounded-xl'>
          <h2>Edit Doctor</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-2'>
              <label className='block'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='border border-gray-300 p-2 rounded w-full'
                required
              />
            </div>
            <div className='mb-2'>
              <label className='block'>Speciality</label>
              <input
                type='text'
                name='speciality'
                value={formData.speciality}
                onChange={handleChange}
                className='border border-gray-300 p-2 rounded w-full'
                required
              />
            </div>
            <div className='mb-2'>
              <label className='block'>Availability</label>
              <input
                type='checkbox'
                name='available'
                checked={formData.available}
                onChange={handleChange}
              />
            </div>
            <div className='mb-2'>
              <label className='block'>Image URL</label>
              <input
                type='text'
                name='image'
                value={formData.image}
                onChange={handleChange}
                className='border border-gray-300 p-2 rounded w-full'
              />
            </div>
            <button type='submit' className='mt-2 bg-blue-600 text-white p-2 rounded'>
              Update Doctor
            </button>
            <button
              type='button'
              className='mt-2 bg-gray-300 text-black p-2 rounded ml-2'
              onClick={() => setEditingDoctor(null)}  // Cancel edit
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
              {/* Add delete button */}
              <button
                onClick={() => deleteDoctor(item._id)}
                className="flex gap-4 mt-2 text-red-600 hover:text-red-800"
              >
                Delete
              </button>

              {/* Add edit button */}
              <button
                onClick={() => editDoctor(item)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;