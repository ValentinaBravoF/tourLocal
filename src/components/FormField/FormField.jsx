import React, { useState } from "react";
import "./FormField.css";

const FormField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="form-field">
      <label className="form-field__label">{label}</label>
      <div
        className={`form-field__input-wrapper ${error ? "form-field--error" : ""}`}
      >
        <input
          type={inputType}
          className="form-field__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            className="form-field__toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* Icono de ojo en SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        )}
      </div>
      {error && <span className="form-field__error-msg">{error}</span>}
    </div>
  );
};

export default FormField;
