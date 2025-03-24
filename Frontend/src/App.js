// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminLogin from "./components/auth/AdminLogin";
import AdminPage from "./pages/AdminPage";
import CryptoDetails from "./components/crypto/CryptoDetails";
import FavoritesList from "./components/favorites/FavoritesList";
import Cart from "./components/cart/Cart";
// import "./styles/corrections.css";
import "./styles/styles.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Ajoutez ces deux routes */}
              <Route path="/favorites" element={<FavoritesList />} />
              <Route path="/cart" element={<Cart />} />
              {/* Fin des ajouts */}
              <Route path="/crypto/:id" element={<CryptoDetails />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route
                path="*"
                element={
                  <div className="container mx-auto p-4 text-center">
                    Page non trouvée
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
