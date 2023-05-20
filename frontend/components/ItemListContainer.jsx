import React from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList.jsx";
import { useState, useEffect } from "react";

export default function Categoria() {
  let { category } = useParams();
  let [data, setData] = useState([]);

  useEffect(() => {

    const createCart = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/carts', {
          method: 'POST',
        });
        const cart = await response.json();
        setCartId(cart.cid); // Almacenar el cid del carrito en la variable de estado
      } catch (error) {
        console.error('Error creating cart:', error);
      }
    };
    createCart();


    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products/json');
        const products = await response.json();
        if (category) {
          const filteredProducts = products.filter(
            (product) => product.category === category
          );
          setData(filteredProducts);
        } else {
          setData(products);
        }
            console.log(products); // Imprimir el arreglo de productos en la consola

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <h2 className="text-center mt-5 mb-5">Apple Products</h2>
      <div className="container">
        <ItemList data={data}></ItemList>
      </div>
    </div>
  );
}
