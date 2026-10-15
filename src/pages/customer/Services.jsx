import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  X,
  Clock,
  Scissors,
  BadgeCheck,
  Star,
  Check,
} from "lucide-react";
import useServices from "../../hooks/useServices";
import useProducts from "../../hooks/useProducts";
import serviceIcons from "../../data/serviceIcons";
import hairstyles from "../../data/hairstyles";
import "./Services.css";

export const peso = (n) => `₱${Number(n).toLocaleString("en-PH")}`;

const CATEGORIES = [
  "All",
  "Haircut",
  "Hair Styling",
  "Hair Removal",
  "Massages",
  "Stylist",
  "Hand and Foot Care",
  "Scalp Care",
  "Facial Care",
  "Hair Color",
  "Hair Care",
  "Other Services",
  "Packages",
];

const INCLUDED = [
  "Professional consultation",
  "Premium shampoo & conditioner",
  "Service by licensed barber",
  "Hot towel treatment (on applicable services)",
  "Final styling & product recommendation",
];

const searchRank = (service, query) => {
  const name = service.name.toLowerCase();
  const category = service.category.toLowerCase();
  const description = (service.description || "").toLowerCase();
  const subs = (service.subServices || []).map((s) => s.name.toLowerCase());

  const wordStarts = (value) =>
    value.split(/[^a-z0-9]+/).some((word) => word.startsWith(query));

  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (wordStarts(name)) return 2;
  if (category === query || category.startsWith(query)) return 3;
  if (subs.some(wordStarts)) return 4;
  if (name.includes(query) || category.includes(query)) return 5;
  if (subs.some((s) => s.includes(query))) return 6;
  if (description.includes(query)) return 7;
  return null;
};

export default function Services() {
  "use no memo";

  const navigate = useNavigate();
  const { services, loading, error } = useServices();
  const { products } = useProducts();

  const [tab, setTab] = useState("services");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [style, setStyle] = useState(null);

  const filtered = useMemo(() => {
    const list =
      category === "All"
        ? services
        : services.filter((s) => s.category === category);

    const q = search.trim().toLowerCase();
    if (!q) return list;

    const order = new Map(list.map((s, i) => [s.id, i]));
    return list
      .map((s) => ({ s, rank: searchRank(s, q) }))
      .filter((x) => x.rank !== null)
      .sort((a, b) => a.rank - b.rank || order.get(a.s.id) - order.get(b.s.id))
      .map((x) => x.s);
  }, [services, category, search]);

  const closeAll = () => {
    setDetail(null);
    setStyle(null);
  };

  useEffect(() => {
    if (!detail && !style) return;
    const onKey = (e) => e.key === "Escape" && closeAll();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detail, style]);

  const book = (id) => {
    closeAll();
    navigate(`/booking?service=${id}`);
  };

  const hasOptions = (s) =>
    (s.subServices?.length || 0) > 0 || (s.priceTiers?.length || 0) > 0;

  const subsLine = (s) =>
    s.subServices?.length
      ? `${s.subServices.length} variants`
      : s.priceTiers?.length
        ? `${s.priceTiers.length} tiers`
        : null;

  const recommended = style
    ? (style.products || [])
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean)
    : [];

  return (
    <section className="sv-page">
      <header className="sv-hero">
        <h1>Our Services</h1>
        <p>Crafted for confidence. Your style. Our craft.</p>
      </header>

      <div className="sv-wrap">
        <div className="sv-switch">
          <button
            className={tab === "services" ? "active" : ""}
            onClick={() => setTab("services")}
          >
            Services
          </button>
          <button
            className={tab === "hairstyles" ? "active" : ""}
            onClick={() => setTab("hairstyles")}
          >
            Hairstyle Guide
          </button>
        </div>

        {tab === "services" && (
          <>
            <div className="sv-search">
              <Search size={20} />
              <input
                type="text"
                maxLength={100}
                placeholder="Search services, cuts, treatments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="sv-chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(category === c ? "All" : c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {loading && <p className="sv-note">Loading services...</p>}
            {error && <p className="sv-note sv-note--error">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <div className="sv-empty">
                <span>
                  <Search size={34} />
                </span>
                <h2>No services found</h2>
                <p>Try a different search or category.</p>
              </div>
            )}

            <ul className="sv-grid">
              {filtered.map((s) => {
                const Icon = serviceIcons[s.icon] || Scissors;
                const line = subsLine(s);
                return (
                  <li key={s.id}>
                    <div
                      className="sv-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => setDetail(s)}
                      onKeyDown={(e) => e.key === "Enter" && setDetail(s)}
                    >
                      <span className="sv-card__icon">
                        <Icon size={28} />
                      </span>

                      <div className="sv-card__main">
                        <div className="sv-card__tags">
                          <span className="sv-tag">{s.category}</span>
                          <span className="sv-time">
                            <Clock size={12} /> {s.durationMinutes}m
                          </span>
                        </div>

                        <h2>{s.name}</h2>
                        {line ? (
                          <span className="sv-card__line">{line}</span>
                        ) : (
                          <p>{s.description}</p>
                        )}

                        <div className="sv-card__foot">
                          <div>
                            <strong>from {peso(s.price)}</strong>
                            {hasOptions(s) && <small>Tap for options</small>}
                          </div>
                          <button
                            className="sv-book"
                            onClick={(e) => {
                              e.stopPropagation();
                              book(s.id);
                            }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {tab === "hairstyles" && (
          <>
            <div className="sv-info">
              <BadgeCheck size={20} />
              <p>
                Tap a style to see the details, then book a haircut with your
                barber.
              </p>
            </div>

            <ul className="sv-styles">
              {hairstyles.map((h, i) => {
                const Icon = h.icon;
                return (
                  <li key={h.id}>
                    <button
                      className="sv-style"
                      style={{
                        backgroundImage: `url("${h.image}"), linear-gradient(160deg, #2f2a20, #151515)`,
                      }}
                      onClick={() => setStyle(h)}
                    >
                      <span className="sv-style__top">
                        <span className="sv-style__icon">
                          <Icon size={20} />
                        </span>
                        <em>#{i + 1}</em>
                      </span>
                      <span className="sv-style__text">
                        <strong>{h.name}</strong>
                        <span>{h.tagline}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {detail && (
        <div className="sv-backdrop" onClick={closeAll}>
          <div
            className="sv-sheet"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="sv-sheet__close"
              onClick={closeAll}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="sv-sheet__head">
              <span className="sv-card__icon sv-card__icon--lg">
                {(() => {
                  const Icon = serviceIcons[detail.icon] || Scissors;
                  return <Icon size={40} />;
                })()}
              </span>
              <span className="sv-tag">{detail.category}</span>
              <h2>{detail.name}</h2>
              <p className="sv-sheet__price">
                from {peso(detail.price)} · {detail.durationMinutes} min
              </p>
              <p className="sv-sheet__desc">{detail.description}</p>
            </div>

            {detail.subServices?.length > 0 && (
              <>
                <h3 className="sv-section">Available Options</h3>
                {detail.subServices.map((o) => (
                  <div className="sv-row" key={o.id}>
                    <span>{o.name}</span>
                    <em>{o.durationMinutes}m</em>
                    <strong>{peso(o.price)}</strong>
                  </div>
                ))}
              </>
            )}

            {!detail.subServices?.length && detail.priceTiers?.length > 0 && (
              <>
                <h3 className="sv-section">Price Tiers (by hair length)</h3>
                {detail.priceTiers.map((t) => (
                  <div className="sv-row" key={t.label}>
                    <span>{t.label}</span>
                    <strong>{peso(t.price)}</strong>
                  </div>
                ))}
              </>
            )}

            {!hasOptions(detail) && (
              <>
                <div className="sv-detail">
                  <Clock size={20} />
                  <div>
                    <span>Duration</span>
                    <strong>{detail.durationMinutes} minutes</strong>
                  </div>
                </div>
                <div className="sv-detail">
                  <BadgeCheck size={20} />
                  <div>
                    <span>Barber</span>
                    <strong>Licensed professionals</strong>
                  </div>
                </div>
                <div className="sv-detail">
                  <Star size={20} />
                  <div>
                    <span>Products</span>
                    <strong>Premium in-store brands</strong>
                  </div>
                </div>
              </>
            )}

            <hr className="sv-hr" />

            <h3 className="sv-section">What's included:</h3>
            <ul className="sv-included">
              {INCLUDED.map((t) => (
                <li key={t}>
                  <Check size={15} /> {t}
                </li>
              ))}
            </ul>

            <p className="sv-fine">
              * Prices and service offerings may vary depending on the branch.
            </p>

            <button className="sv-cta" onClick={() => book(detail.id)}>
              Book This Service
            </button>
          </div>
        </div>
      )}

      {style && (
        <div className="sv-backdrop" onClick={closeAll}>
          <div
            className="sv-sheet"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="sv-sheet__close"
              onClick={closeAll}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div
              className="sv-sheet__photo"
              style={{
                backgroundImage: `url("${style.image}"), linear-gradient(160deg, #2f2a20, #151515)`,
              }}
            />
            <h2 className="sv-sheet__style">{style.name}</h2>
            <p className="sv-sheet__tag">{style.tagline}</p>
            <p className="sv-sheet__desc sv-sheet__desc--left">
              {style.description}
            </p>

            {recommended.length > 0 && (
              <>
                <h3 className="sv-section">Recommended Products</h3>
                {recommended.map((p) => (
                  <Link to="/products" className="sv-row" key={p.id}>
                    <span>{p.name}</span>
                    <strong>{peso(p.price)}</strong>
                  </Link>
                ))}
              </>
            )}

            <button className="sv-cta" onClick={() => book("haircut-main")}>
              Book a Haircut
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
