import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemCart from "./ItemCart.jsx";
import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, totalPrice } = useCartContext();
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/carts/644129333f240a1ac4832456/json` // Reemplaza :cid con el ID del carrito correspondiente
        );
        const json = await response.json();
        if (response.ok) {
          setCartData(json);
        } else {
          console.error(json);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleClick = () => {
    // Tu lógica para la compra
  };

  if (!cartData || cartData.productArray.length === 0) {
    return (
      <div className="text-left mt-3">
        <p>Your cart is empty</p>
        <button className="btn btn-primary">
          <Link to="/">Continue shopping</Link>
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center mt-5 mb-5">Your Cart</h2>
      <div>
        {cartData.productArray.map((product) => (
          <ItemCart key={product.code} product={product} />
        ))}
        <h5 className="container">Total buy: ${cartData.total}</h5>
        <div className="container">
          <button className="buyNowButton btn btn-primary" onClick={handleClick}>
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
