import { useState } from "react";

const FIELDS = [
  { id: "fullName",        label: "Full Name",        type: "text",     placeholder: "John Doe" },
  { id: "email",           label: "Email Address",    type: "email",    placeholder: "john@example.com" },
  { id: "phone",           label: "Phone Number",     type: "tel",      placeholder: "+1 234 567 8900" },
  { id: "password",        label: "Password",         type: "password", placeholder: "Min 8 characters" },
  { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter password" },
];

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(values.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Must be at least 8 characters.";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Must include at least one uppercase letter.";
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = "Must include at least one number.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.terms) {
    errors.terms = "You must agree to the terms.";
  }

  return errors;
}

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function RegistrationForm() {
  const [values, setValues] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "", terms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass] = useState({ password: false, confirmPassword: false });

  const strength = getStrength(values.password);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newVal = { ...values, [name]: type === "checkbox" ? checked : value };
    setValues(newVal);
    if (touched[name]) {
      const errs = validate(newVal);
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(values);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // prevent page refresh — the IPO model in action
    const allTouched = Object.fromEntries(FIELDS.map(f => [f.id, true]));
    allTouched.terms = true;
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  function handleReset() {
    setValues({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false });
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }

  const isValid = id => touched[id] && !errors[id] && values[id];

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: 520,
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 24,
      padding: "48px 40px",
      boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
    },
    badge: {
      display: "inline-block",
      background: "rgba(99,102,241,0.2)",
      border: "1px solid rgba(99,102,241,0.4)",
      color: "#a5b4fc",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: 20,
      marginBottom: 16,
    },
    heading: {
      color: "#f1f5f9",
      fontSize: 28,
      fontWeight: 800,
      margin: "0 0 6px",
      letterSpacing: "-0.02em",
    },
    sub: {
      color: "#94a3b8",
      fontSize: 14,
      margin: "0 0 36px",
    },
    fieldGroup: { marginBottom: 20 },
    label: {
      display: "block",
      color: "#cbd5e1",
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 8,
      letterSpacing: "0.02em",
    },
    inputWrap: { position: "relative" },
    input: {
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1.5px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "12px 16px",
      color: "#f1f5f9",
      fontSize: 15,
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    },
    inputError: { borderColor: "#f87171" },
    inputValid: { borderColor: "#4ade80" },
    statusIcon: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 16,
      pointerEvents: "none",
    },
    eyeBtn: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: 16,
      padding: 0,
    },
    errMsg: {
      marginTop: 6,
      color: "#f87171",
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    okMsg: {
      marginTop: 6,
      color: "#4ade80",
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    strengthBar: {
      display: "flex",
      gap: 4,
      marginTop: 8,
      alignItems: "center",
    },
    strengthSeg: (i, strength) => ({
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: i < strength ? strengthColor[strength] : "rgba(255,255,255,0.1)",
      transition: "background 0.3s",
    }),
    strengthText: (strength) => ({
      fontSize: 11,
      fontWeight: 700,
      color: strengthColor[strength] || "#64748b",
      marginLeft: 8,
      minWidth: 40,
    }),
    termsRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 28,
    },
    checkbox: { marginTop: 2, accentColor: "#6366f1", width: 16, height: 16, cursor: "pointer" },
    termsLabel: { color: "#94a3b8", fontSize: 13, lineHeight: 1.5 },
    termsLink: { color: "#818cf8", textDecoration: "none" },
    submitBtn: {
      width: "100%",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "14px",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "0.04em",
      cursor: "pointer",
      transition: "opacity 0.2s, transform 0.1s",
      marginBottom: 16,
    },
    loginRow: {
      textAlign: "center",
      color: "#64748b",
      fontSize: 13,
    },
    loginLink: { color: "#818cf8", textDecoration: "none", fontWeight: 600 },
    successCard: {
      textAlign: "center",
      padding: "20px 0",
    },
    successIcon: { fontSize: 64, marginBottom: 16 },
    successTitle: { color: "#4ade80", fontSize: 26, fontWeight: 800, margin: "0 0 10px" },
    successText: { color: "#94a3b8", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 },
    resetBtn: {
      background: "rgba(99,102,241,0.15)",
      border: "1.5px solid rgba(99,102,241,0.4)",
      color: "#a5b4fc",
      borderRadius: 12,
      padding: "12px 28px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.successTitle}>Registration Successful!</h2>
            <p style={styles.successText}>
              Welcome aboard, <strong style={{ color: "#f1f5f9" }}>{values.fullName}</strong>!<br />
              Your account has been created successfully.<br />
              A confirmation has been sent to <strong style={{ color: "#a5b4fc" }}>{values.email}</strong>.
            </p>
            <button style={styles.resetBtn} onClick={handleReset}>
              ← Register Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
       
        <h1 style={styles.heading}>Create Account</h1>
        <p style={styles.sub}>Fill in the form below. All fields are validated in real-time.</p>

        <form onSubmit={handleSubmit} noValidate>
          {FIELDS.map(field => {
            const isPass = field.type === "password";
            const inputType = isPass ? (showPass[field.id] ? "text" : "password") : field.type;
            const hasError = touched[field.id] && errors[field.id];
            const hasOk = isValid(field.id);

            return (
              <div key={field.id} style={styles.fieldGroup}>
                <label style={styles.label} htmlFor={field.id}>{field.label}</label>
                <div style={styles.inputWrap}>
                  <input
                    id={field.id}
                    name={field.id}
                    type={inputType}
                    placeholder={field.placeholder}
                    value={values[field.id]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      ...styles.input,
                      paddingRight: isPass ? 44 : (hasError || hasOk ? 40 : 16),
                      ...(hasError ? styles.inputError : {}),
                      ...(hasOk ? styles.inputValid : {}),
                    }}
                    autoComplete={isPass ? "new-password" : field.id}
                  />
                  {isPass ? (
                    <button
                      type="button"
                      style={styles.eyeBtn}
                      onClick={() => setShowPass(p => ({ ...p, [field.id]: !p[field.id] }))}
                      aria-label="Toggle password visibility"
                    >
                      {showPass[field.id] ? "🙈" : "👁️"}
                    </button>
                  ) : (
                    hasError ? <span style={styles.statusIcon}>❌</span>
                    : hasOk  ? <span style={styles.statusIcon}>✅</span>
                    : null
                  )}
                </div>

                {/* Password strength meter */}
                {field.id === "password" && values.password && (
                  <div style={styles.strengthBar}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={styles.strengthSeg(i, strength)} />
                    ))}
                    <span style={styles.strengthText(strength)}>{strengthLabel[strength]}</span>
                  </div>
                )}

                {hasError && (
                  <div style={styles.errMsg} role="alert">
                    <span>⚠️</span> {errors[field.id]}
                  </div>
                )}
                {hasOk && !errors[field.id] && (
                  <div style={styles.okMsg}>
                    <span>✓</span> Looks good!
                  </div>
                )}
              </div>
            );
          })}

          {/* Terms */}
          <div style={{ marginBottom: 8 }}>
            <div style={styles.termsRow}>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={values.terms}
                onChange={handleChange}
                onBlur={handleBlur}
                style={styles.checkbox}
              />
              <label style={styles.termsLabel} htmlFor="terms">
                I agree to the{" "}
                <a href="#" style={styles.termsLink}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </label>
            </div>
            {touched.terms && errors.terms && (
              <div style={{ ...styles.errMsg, marginTop: -8, marginBottom: 16 }} role="alert">
                <span>⚠️</span> {errors.terms}
              </div>
            )}
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            onMouseEnter={e => e.target.style.opacity = "0.88"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            Create My Account →
          </button>

          <div style={styles.loginRow}>
            Already have an account?{" "}
            <a href="#" style={styles.loginLink}>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}
