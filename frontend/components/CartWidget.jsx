import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";



export default function Cartwidget() {
  const {totalProducts} = useCartContext();

  return (
    <div className='cart-container'>
      <Link to="/cart/:cid" className="notification">
        <img src="../public/images/cart.png"></img>
        <span className="badge">{totalProducts()}</span>
      </Link>
    </div>
  );
}
