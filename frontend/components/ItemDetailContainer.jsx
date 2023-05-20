import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail.jsx";

export default function ItemDetailContainer() {
  const { pid } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${pid}`);
        const json = await response.json();
        if (response.ok) {
          setData(json.product);
        } else {
          console.error(json);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [pid]);

  return (
    <div>
      {data ? <ItemDetail data={data} /> : <p>Loading...</p>}
    </div>
  );
}


