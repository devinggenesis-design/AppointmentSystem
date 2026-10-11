import { useState } from "react";
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
import "./Account.css";

const STORAGE_KEY = "adminAccount";

const DEFAULT_ACCOUNT = {
  name: "Admin",
  shopName: "Barbershop",
  username: "admin",
  email: "",
  phone: "",
  password: "admin123",
};

const loadAccount = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...DEFAULT_ACCOUNT, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_ACCOUNT };
  }
};

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Good", "Strong"];

function Account() {
  "use no memo";

  const [account, setAccount] = useState(loadAccount);

  const [profile, setProfile] = useState(() => {
    const a = loadAccount();
    return {
      name: a.name,
      shopName: a.shopName,
      username: a.username,
      email: a.email,
      phone: a.phone,
    };
  });
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const profileChanged = Object.keys(profile).some(
    (k) => profile[k] !== account[k],
  );

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileError("");
    setProfileSaved(false);
  };

  const saveProfile = (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      setProfileError("Please enter your name.");
      return;
    }
    if (!profile.shopName.trim()) {
      setProfileError("Please enter the shop name.");
      return;
    }
    if (profile.username.trim().length < 3) {
      setProfileError("Username must be at least 3 characters.");
      return;
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    const cleaned = {
      name: profile.name.trim(),
      shopName: profile.shopName.trim(),
      username: profile.username.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    };

    const updated = { ...account, ...cleaned };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAccount(updated);
    setProfile(cleaned);
    setProfileError("");
    setProfileSaved(true);
  };

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const strength = getStrength(pw.next);

  const updatePw = (field, value) => {
    setPw((prev) => ({ ...prev, [field]: value }));
    setPwError("");
    setPwSaved(false);
  };

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const savePassword = (e) => {
    e.preventDefault();

    if (!pw.current || !pw.next || !pw.confirm) {
      setPwError("Please fill in all password fields.");
      return;
    }
    if (pw.current !== account.password) {
      setPwError("Your current password is incorrect.");
      return;
    }
    if (pw.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pw.next === pw.current) {
      setPwError("New password must be different from the current one.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwError("New password and confirmation don't match.");
      return;
    }

    const updated = { ...account, password: pw.next };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAccount(updated);
    setPw({ current: "", next: "", confirm: "" });
    setPwError("");
    setPwSaved(true);
  };

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

  return (
    <div className="account-page">
      <div className="acct-header">
        <h1>Account</h1>
        <p>Manage your profile and password.</p>
      </div>

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
            disabled={!profileChanged}
          >
            <Save size={16} /> Save profile
          </button>
        </div>
      </form>

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
          <button type="submit" className="acct-btn acct-btn--primary">
            <Lock size={16} /> Update password
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account;
