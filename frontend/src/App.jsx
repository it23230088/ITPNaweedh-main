// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";

import AdminDashboard from "./pages/AdminDashboard";

import Product from "./pages/Products/Product";
import CreateProducts from "./pages/Products/CreateProducts";
import DeleteProduct from "./pages/Products/DeleteProduct";
import EditProduct from "./pages/Products/EditProduct";
import ShowProduct from "./pages/Products/ShowProduct";
import PaymentPage from "./pages/PaymentPage";


import LandingPage from "./pages/Products/LandingPage";
import ProductView from "./pages/Products/ProductUser";
import ProductDetails from "./pages/Products/PurchaseForm";
import PurchaseList from "./pages/Products/PurchaseList";
import EditPurchase from "./pages/Products/EditPurchase";
import DeletePurchase from "./pages/Products/DeletePurchase";

import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Verify from './pages/Verify'

import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Header />
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* Naweedh */}
      <Routes>
        <Route path="/products" element={<Product />} />
        <Route path="/products/create" element={<CreateProducts />} />
        <Route path="/products/details/:id" element={<ShowProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/delete/:id" element={<DeleteProduct />} />
      </Routes>

      <Routes>
        <Route path="/shop" element={<LandingPage />} />
        <Route path="/productViews" element={<ProductView />} />
        <Route path="/productViews/purchaseForm" element={<ProductDetails />} />
        <Route path="/purchaseList" element={<PurchaseList />} />
        <Route path="/sendEmail" element={<PurchaseList />} />
        <Route path="/purchaseList/edit/:id" element={<EditPurchase />} />
        <Route path="/purchaseList/delete/:id" element={<DeletePurchase />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>

      {/* aaqib */}
      <Routes>
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
