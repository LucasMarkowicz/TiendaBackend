import React from "react";
import { useCartContext } from "../context/CartContext";

export default function ItemCart({ product }) {
  const { removeProduct } = useCartContext();

  return (
    <div className="itemCart">
      <div className="container">
        <div className="card mb-3 maximo-card">
          <div className="row g-0">
            <div className="col-md-3">
              <img
                src={product.image}
                className="img-fluid rounded-start"
                alt="..."
              />
            </div>
            <div className="col-md-9">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-title">Unitary Price: ${product.price}</p>
                <p className="card-title">Quantity: {product.quantity}</p>
                <p className="card-title">
                  Subtotal Price: ${product.quantity * product.price}
                </p>
                
                <button
                  className="btn btn-primary"
                  onClick={() => removeProduct(product.id)}
                >
                  Delete Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
