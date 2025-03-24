// src/components/cart/Cart.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/api/cart");
        setCartItems(response.data);
        setLoading(false);

        // Calculer le total
        calculateTotal(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
        setError(
          "Impossible de charger votre panier. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      return acc + parseFloat(item.Crypto.prix) * parseFloat(item.quantite);
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return;
    }

    try {
      await api.put(`/api/cart/${itemId}`, { quantite: newQuantity });

      // Mettre à jour l'état local
      const updatedItems = cartItems.map((item) => {
        if (item.id_panier === itemId) {
          return { ...item, quantite: newQuantity };
        }
        return item;
      });

      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      alert("Erreur lors de la mise à jour de la quantité");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);

      // Mettre à jour l'état local
      const updatedItems = cartItems.filter(
        (item) => item.id_panier !== itemId
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
      alert("Erreur lors de la suppression du panier");
    }
  };

  const handleCheckout = () => {
    alert("Fonctionnalité de paiement à implémenter");
    // Ici vous pourriez rediriger vers une page de paiement ou intégrer une passerelle de paiement
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Mon Panier</h2>

        {cartItems.length === 0 ? (
          <div className="text-center p-4 bg-gray-100 rounded-md">
            Votre panier est vide.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Crypto-monnaie</th>
                    <th className="py-3 px-6 text-right">Prix unitaire</th>
                    <th className="py-3 px-6 text-center">Quantité</th>
                    <th className="py-3 px-6 text-right">Sous-total</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {cartItems.map((item) => (
                    <tr
                      key={item.id_panier}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6 text-left">
                        <Link
                          to={`/crypto/${item.Crypto.id_crypto}`}
                          className="text-blue-500 hover:underline"
                        >
                          {item.Crypto.nom} ({item.Crypto.symbol})
                        </Link>
                      </td>
                      <td className="py-3 px-6 text-right">
                        {parseFloat(item.Crypto.prix).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id_panier,
                                parseFloat(item.quantite) - 0.1
                              )
                            }
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0.00000001"
                            step="0.1"
                            value={item.quantite}
                            onChange={(e) =>
                              updateQuantity(
                                item.id_panier,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-20 text-center border-t border-b border-gray-200 py-1"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id_panier,
                                parseFloat(item.quantite) + 0.1
                              )
                            }
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right font-medium">
                        {(
                          parseFloat(item.Crypto.prix) *
                          parseFloat(item.quantite)
                        ).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => removeFromCart(item.id_panier)}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {total.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Procéder au paiement
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
