import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';
import Footer from '../components/Footer';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';

const COLORS = ['#2563eb', '#fbbf24', '#f87171', '#10b981'];

const Dashboard = () => {
  const [warranties, setWarranties] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warrantyRes, claimRes] = await Promise.all([
          axios.get('http://localhost:5555/api/warranties'),
          axios.get('http://localhost:5555/api/claims'),
        ]);
        setWarranties(warrantyRes.data);
        setClaims(claimRes.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Stats
  const total = warranties.length;
  const active = warranties.filter(w => new Date(w.endDate) > new Date()).length;
  const expiringSoon = warranties.filter(w => {
    const daysLeft = (new Date(w.endDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysLeft > 0 && daysLeft <= 30;
  }).length;
  const expired = warranties.filter(w => new Date(w.endDate) < new Date()).length;

  // Chart data (warranties per month)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      count: warranties.filter(w => new Date(w.startDate).getMonth() + 1 === month).length,
    };
  });

  const getClaimStatus = (warrantyId) => {
    const claim = claims.find((c) => c.warrantyId && c.warrantyId._id === warrantyId);
    return claim ? claim.status : 'No Claim';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getStatusBadge = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return <span style={{background:'#fee2e2',color:'#b91c1c',padding:'2px 8px',borderRadius:12,fontSize:12}}>Expired</span>;
    if (daysLeft <= 30) return <span style={{background:'#fef9c3',color:'#b45309',padding:'2px 8px',borderRadius:12,fontSize:12}}>Expiring Soon</span>;
    return <span style={{background:'#dcfce7',color:'#166534',padding:'2px 8px',borderRadius:12,fontSize:12}}>Active</span>;
  };

  if (loading) return <Box textAlign="center" py={8}>Loading...</Box>;

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'background.default'
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
          p: { xs: 2, md: 4 }
        }}>
          <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>Dashboard</Typography>
          {/* Recent Warranties Table */}
          <Paper elevation={3} sx={{ mb: 4, p: 2, bgcolor: 'white' }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">Recent Warranties</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warranties.slice(-8).reverse().map((warranty) => {
                    const today = new Date();
                    const end = new Date(warranty.endDate);
                    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
                    let status = 'Active', color = '#16a34a';
                    if (daysLeft < 0) { status = 'Expired'; color = '#dc2626'; }
                    else if (daysLeft <= 30) { status = 'Expiring Soon'; color = '#ca8a04'; }
                    return (
                      <TableRow key={warranty._id}>
                        <TableCell>{warranty.productName}</TableCell>
                        <TableCell>{formatDate(warranty.startDate)}</TableCell>
                        <TableCell>{formatDate(warranty.endDate)}</TableCell>
                        <TableCell>{getStatusBadge(warranty.endDate)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* Charts side by side */}
          <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
            <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 320, maxWidth: 500, bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">Warranties by Month</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 320, maxWidth: 500, bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">Warranty Status</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[{ name: 'Active', value: active }, { name: 'Expiring Soon', value: expiringSoon }, { name: 'Expired', value: expired }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
                    {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Dashboard; 