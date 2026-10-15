import { useEffect, useState } from "react";
import { ArrowRight, X, Check, ExternalLink, ShoppingBag } from "lucide-react";
import { peso } from "./Services";
import useProducts from "../../hooks/useProducts";
import productIcons from "../../data/productIcons";
import "./Products.css";

const CATEGORIES = ["Latest", "Hairstyling", "Hair Care"];

const GRADIENTS = [
  ["#D4A853", "#8C6A20"],
  ["#4E4E4E", "#1A1A1A"],
  ["#B8892E", "#7A5A18"],
  ["#3A3222", "#1A1408"],
  ["#D4A853", "#5E4A18"],
];

const PRODUCTS_URL = "https://gentlemanbarbers.com/our-products";
const PHONE = "tel:+63289278667";

export default function Products() {
  "use no memo";

  const { products, loading, error } = useProducts();
  const [category, setCategory] = useState("Latest");
  const [detail, setDetail] = useState(null);

  const list =
    category === "Latest"
      ? products.slice(0, 3)
      : products.filter((p) => p.category === category);

  const gradientFor = (id) => {
    const i = Math.max(
      0,
      products.findIndex((p) => p.id === id),
    );
    const [a, b] = GRADIENTS[i % GRADIENTS.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  };

  useEffect(() => {
    if (!detail) return;
    const onKey = (e) => e.key === "Escape" && setDetail(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detail]);

  return (
    <section className="pd-page">
      <header className="pd-hero">
        <span className="pd-eyebrow">SHOP</span>
        <h1>Gentleman Products</h1>
        <p>Elevate your everyday grooming. Available in all stores.</p>
      </header>

      <div className="pd-wrap">
        <div className="pd-tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="pd-note">Loading products...</p>}
        {error && <p className="pd-note pd-note--error">{error}</p>}
        {!loading && !error && list.length === 0 && (
          <p className="pd-note">No products in this category yet.</p>
        )}

        <ul className="pd-grid">
          {list.map((p) => {
            const Icon = productIcons[p.icon] || ShoppingBag;
            return (
              <li key={p.id}>
                <button className="pd-card" onClick={() => setDetail(p)}>
                  <span
                    className="pd-card__art"
                    style={{ background: gradientFor(p.id) }}
                  >
                    <Icon size={40} />
                    {p.badge && <em className="pd-badge">{p.badge}</em>}
                  </span>

                  <span className="pd-tag">{p.category}</span>
                  <strong className="pd-card__name">{p.name}</strong>
                  <span className="pd-card__desc">{p.description}</span>

                  <span className="pd-card__foot">
                    <b>{peso(p.price)}</b>
                    <span className="pd-go">
                      <ArrowRight size={15} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {detail && (
        <div className="pd-backdrop" onClick={() => setDetail(null)}>
          <div
            className="pd-sheet"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pd-close"
              onClick={() => setDetail(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div
              className="pd-sheet__art"
              style={{ background: gradientFor(detail.id) }}
            >
              {(() => {
                const Icon = productIcons[detail.icon] || ShoppingBag;
                return <Icon size={72} />;
              })()}
            </div>

            <div className="pd-sheet__tags">
              <span className="pd-tag">{detail.category}</span>
              {detail.badge && (
                <span className="pd-tag pd-tag--green">{detail.badge}</span>
              )}
            </div>

            <h2>{detail.name}</h2>
            <p className="pd-sheet__price">{peso(detail.price)}</p>
            <p className="pd-sheet__desc">{detail.description}</p>

            <h3>What makes it great:</h3>
            <ul className="pd-features">
              {detail.features.map((f) => (
                <li key={f}>
                  <Check size={15} /> {f}
                </li>
              ))}
            </ul>

            <div className="pd-actions">
              <a
                href={PRODUCTS_URL}
                target="_blank"
                rel="noreferrer"
                className="pd-btn pd-btn--ghost"
              >
                <ExternalLink size={16} /> View Online
              </a>
              <a href={PHONE} className="pd-btn">
                <ShoppingBag size={18} /> Inquire Now
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
