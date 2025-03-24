// src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Coin de la Hess</h3>
            <p className="text-gray-400">
              Suivez vos crypto-monnaies préférées
            </p>
          </div>

          <div className="text-center md:text-right">
            <p>&copy; {currentYear} Coin de la Hess. Tous droits réservés.</p>
            <p className="text-gray-400 text-sm mt-1">
              Cette application est fournie à des fins éducatives uniquement et
              peut etre lucrativement utilisée par des personnes physiques ou
              morales.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
