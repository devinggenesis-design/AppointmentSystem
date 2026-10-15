import { useEffect, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => active && setProducts(data))
      .catch(
        () => active && setError("Couldn't load products. Please try again."),
      )
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}
