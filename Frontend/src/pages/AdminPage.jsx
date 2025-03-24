import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../components/admin/AdminDashboard";
import ManageCrypto from "../components/admin/ManageCrypto";
import ManageUsers from "../components/admin/ManageUsers";

const AdminPage = () => {
  const { isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/cryptos" element={<ManageCrypto />} />
        <Route path="/users" element={<ManageUsers />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
