// src/pages/Home.jsx
import React from "react";
import CryptoList from "../components/crypto/CryptoList";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue sur Crypto de la Hess
          </h1>
          <p className="text-xl">
            Suivez les cours des crypto-monnaies, créez vos favoris et achetez
            en quelques clics
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <CryptoList />
      </div>
    </div>
  );
};

export default Home;
