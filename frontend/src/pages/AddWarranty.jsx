import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';

const API_URL = 'http://localhost:5555/api/warranties';

const AddWarranty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    userName: '',
    email: '',
    startDate: '',
    endDate: ''
  });
  const [upcomingExpiry, setUpcomingExpiry] = useState([]);

  useEffect(() => {
    fetchUpcomingExpiry();
  }, []);

  const fetchUpcomingExpiry = async () => {
    try {
      const response = await axios.get(API_URL);
      const sortedWarranties = response.data
        .map(warranty => ({
          ...warranty,
          endDate: new Date(warranty.endDate)
        }))
        .sort((a, b) => a.endDate - b.endDate)
        .slice(0, 4);
      setUpcomingExpiry(sortedWarranties);
    } catch (error) {
      console.error('Error fetching warranties:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      if (response.status === 201) {
        fetchUpcomingExpiry();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error adding warranty:', error);
      alert('Failed to create warranty. Please try again.');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #f3f4f6 0%, #e3e9f7 100%)',
      fontFamily: 'Inter, Roboto, Arial, sans-serif'
    }}>
      <Sidebar />
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Box sx={{ 
          flex: 1,
          p: { xs: 1, md: 4 }, 
          display: 'flex', 
          gap: 4, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          {/* Add Warranty Form */}
          <Paper elevation={4} sx={{
            flex: 1,
            maxWidth: 480,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(2px)',
            mr: { xs: 0, md: 4 },
          }}>
            <Typography variant="h4" fontWeight={700} color="primary" mb={2} letterSpacing={1} sx={{ fontSize: { xs: 28, md: 32 } }}>
              Add New Warranty
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
              />
              <TextField
                label="Your Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
              />
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  height: 48,
                  fontSize: '1rem',
                  borderRadius: 2,
                  fontWeight: 600,
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
                  }
                }}
              >
                ADD WARRANTY
              </Button>
            </Box>
          </Paper>

          {/* Upcoming Expiry Section */}
          <Paper elevation={0} sx={{
            width: 350,
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3e9f7 100%)',
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.08)',
            border: '1px solid #e3e9f7',
          }}>
            <Typography variant="h5" fontWeight={700} mb={2} letterSpacing={0.5}>
              Upcoming Expiry
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {upcomingExpiry.map((warranty) => (
                <Box
                  key={warranty._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    pb: 2,
                    borderBottom: '1px solid #f0f1f3',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {warranty.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(warranty.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: 13,
                      bgcolor: warranty.endDate < new Date() ? '#ffebee' : '#fff3e0',
                      color: warranty.endDate < new Date() ? '#d32f2f' : '#ed6c02',
                      boxShadow: '0 1px 4px 0 rgba(31, 38, 135, 0.04)'
                    }}
                  >
                    {warranty.endDate < new Date() ? 'Expired' : 'Expiring Soon'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default AddWarranty; 