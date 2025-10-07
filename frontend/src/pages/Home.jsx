// export default function Home() {
//   return <div><h1>Home</h1><p>Products will show here.</p></div>;
// }


import { useState, useEffect } from "react";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");

  useEffect(() => {
  const fetchProducts = async () => {
    const res = await API.get("/products", { params: { page, limit, search } });
    setProducts(res.data.products);
    setTotal(res.data.total);
  };
  fetchProducts();
  }, [page, search, limit]); // no warning now

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Products</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} style={{ margin: "0 5px" }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
