import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Store,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Save,
  Check,
} from "lucide-react";
import authFetch from "../../utils/authFetch";
import "./Account.css";

const EMPTY = { name: "", shopName: "", username: "", email: "", phone: "" };

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0 to 4
};

const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Good", "Strong"];

function Account() {
  "use no memo";

  const [account, setAccount] = useState(EMPTY); // last saved version
  const [profile, setProfile] = useState(EMPTY); // what's in the form
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  /* ---------- Load from the database ---------- */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await authFetch("/api/auth/me");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!active) return;

        const info = {
          name: data.name || "",
          shopName: data.shopName || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
        };
        setAccount(info);
        setProfile(info);
      } catch {
        if (active)
          setLoadError("Couldn't load your account. Is the server running?");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /* ---------- Profile ---------- */
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);

  const profileChanged = Object.keys(EMPTY).some(
    (k) => profile[k] !== account[k],
  );

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileError("");
    setProfileSaved(false);
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) return setProfileError("Please enter your name.");
    if (!profile.shopName.trim())
      return setProfileError("Please enter the shop name.");
    if (profile.username.trim().length < 3)
      return setProfileError("Username must be at least 3 characters.");
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email))
      return setProfileError("Please enter a valid email address.");

    setProfileBusy(true);
    try {
      const res = await authFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || "Couldn't save your profile.");
        return;
      }

      const info = {
        name: data.name,
        shopName: data.shopName,
        username: data.username,
        email: data.email,
        phone: data.phone,
      };
      setAccount(info);
      setProfile(info);
      setProfileError("");
      setProfileSaved(true);

      // Keep the sidebar in sync
      localStorage.setItem("adminInfo", JSON.stringify(data));
      window.dispatchEvent(new Event("adminInfoChanged"));
    } catch {
      setProfileError("Can't reach the server. Is it running?");
    } finally {
      setProfileBusy(false);
    }
  };

  /* ---------- Password ---------- */
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  const strength = getStrength(pw.next);

  const updatePw = (field, value) => {
    setPw((prev) => ({ ...prev, [field]: value }));
    setPwError("");
    setPwSaved(false);
  };

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const savePassword = async (e) => {
    e.preventDefault();

    if (!pw.current || !pw.next || !pw.confirm)
      return setPwError("Please fill in all password fields.");
    if (pw.next.length < 8)
      return setPwError("New password must be at least 8 characters.");
    if (pw.next === pw.current)
      return setPwError("New password must be different from the current one.");
    if (pw.next !== pw.confirm)
      return setPwError("New password and confirmation don't match.");

    setPwBusy(true);
    try {
      const res = await authFetch("/api/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: pw.current,
          newPassword: pw.next,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPwError(data.message || "Couldn't change your password.");
        return;
      }

      setPw({ current: "", next: "", confirm: "" });
      setPwError("");
      setPwSaved(true);
    } catch {
      setPwError("Can't reach the server. Is it running?");
    } finally {
      setPwBusy(false);
    }
  };

  /* ---------- Password input helper ---------- */
  const passwordField = (field, label, placeholder, autoComplete) => (
    <label className="acct-field">
      <span>{label}</span>
      <div className="acct-input">
        <Lock size={18} />
        <input
          type={show[field] ? "text" : "password"}
          placeholder={placeholder}
          value={pw[field]}
          onChange={(e) => updatePw(field, e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="acct-eye"
          onClick={() => toggleShow(field)}
          aria-label={show[field] ? "Hide password" : "Show password"}
        >
          {show[field] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="account-page">
        <div className="acct-card acct-loading">Loading your account...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="account-page">
        <div className="acct-card">
          <div className="acct-alert acct-alert--error">{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="acct-header">
        <h1>Account</h1>
        <p>Manage your profile and password.</p>
      </div>

      {/* Summary */}
      <section className="acct-card acct-summary">
        <div className="acct-avatar">
          {(account.name || "A").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{account.name}</h2>
          <span>
            {account.shopName} · @{account.username}
          </span>
        </div>
      </section>

      {/* Profile */}
      <form className="acct-card" onSubmit={saveProfile}>
        <div className="acct-card__head">
          <h2>Profile</h2>
          <span>Your personal and shop details.</span>
        </div>

        {profileError && (
          <div className="acct-alert acct-alert--error">{profileError}</div>
        )}
        {profileSaved && !profileChanged && (
          <div className="acct-alert acct-alert--success">
            <Check size={16} /> Profile updated.
          </div>
        )}

        <div className="acct-grid">
          <label className="acct-field">
            <span>Full name</span>
            <div className="acct-input">
              <User size={18} />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Your name"
              />
            </div>
          </label>

          <label className="acct-field">
            <span>Shop name</span>
            <div className="acct-input">
              <Store size={18} />
              <input
                type="text"
                value={profile.shopName}
                onChange={(e) => updateProfile("shopName", e.target.value)}
                placeholder="Shop name"
              />
            </div>
          </label>

          <label className="acct-field">
            <span>Username</span>
            <div className="acct-input">
              <AtSign size={18} />
              <input
                type="text"
                value={profile.username}
                onChange={(e) => updateProfile("username", e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="acct-field">
            <span>Phone</span>
            <div className="acct-input">
              <Phone size={18} />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                placeholder="0917 123 4567"
              />
            </div>
          </label>

          <label className="acct-field acct-field--full">
            <span>Email</span>
            <div className="acct-input">
              <Mail size={18} />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>
        </div>

        <div className="acct-actions">
          <button
            type="submit"
            className="acct-btn acct-btn--primary"
            disabled={!profileChanged || profileBusy}
          >
            <Save size={16} /> {profileBusy ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>

      {/* Password */}
      <form className="acct-card" onSubmit={savePassword}>
        <div className="acct-card__head">
          <h2>Change password</h2>
          <span>Use at least 8 characters.</span>
        </div>

        {pwError && (
          <div className="acct-alert acct-alert--error">{pwError}</div>
        )}
        {pwSaved && (
          <div className="acct-alert acct-alert--success">
            <Check size={16} /> Password changed.
          </div>
        )}

        <div className="acct-stack">
          {passwordField(
            "current",
            "Current password",
            "Enter current password",
            "current-password",
          )}
          {passwordField(
            "next",
            "New password",
            "Enter new password",
            "new-password",
          )}

          {pw.next && (
            <div className="acct-strength">
              <div className="acct-strength__bars">
                {[1, 2, 3, 4].map((n) => (
                  <i
                    key={n}
                    className={n <= strength ? `on level-${strength}` : ""}
                  />
                ))}
              </div>
              <small>{STRENGTH_LABEL[strength]}</small>
            </div>
          )}

          {passwordField(
            "confirm",
            "Confirm new password",
            "Re-enter new password",
            "new-password",
          )}
        </div>

        <div className="acct-actions">
          <button
            type="submit"
            className="acct-btn acct-btn--primary"
            disabled={pwBusy}
          >
            <Lock size={16} /> {pwBusy ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account;
