import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, Paper, Typography, TextField, Button, Snackbar, Alert, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load user profile when component mounts
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5555/api/user/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set some default values if profile can't be loaded
      setProfile({ name: '', email: '' });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5555/api/user/profile', profile);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f3f4f6" display="flex">
      <Sidebar />
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        <Paper sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 6, p: 5, width: '100%', maxWidth: 480 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" mb={4} align="center">Settings</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>Manage Profile</Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                fullWidth
                required
                variant="outlined"
              />
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>Notification Preferences</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={notifications.email} onChange={handleNotifChange} name="email" color="primary" />}
                label={<Typography color="text.primary">Email Alerts</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={notifications.sms} onChange={handleNotifChange} name="sms" color="primary" />}
                label={<Typography color="text.primary">SMS Alerts</Typography>}
              />
            </FormGroup>
          </Box>
        </Paper>
      </Box>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 