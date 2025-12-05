import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { DEFAULT_COUNTRY_CODE } from "../../constants/data";
const PhoneInputField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  onBlur,   
  defaultCountry = DEFAULT_COUNTRY_CODE,
  t,
  disabled,
}) => {
  const [country, setCountry] = useState(defaultCountry);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (value) {
      try {
        const parsed = parsePhoneNumberFromString(value);
        if (parsed?.country) {
          setCountry(parsed.country);
        }
        setInputValue(value);
      } catch (e) {
        console.warn("Invalid phone format from API:", value);
        setInputValue(value);
        setCountry(defaultCountry);
      }
    }
  }, [value, defaultCountry]);

  const handleChange = (val) => {
    setInputValue(val || "");
    if (onChange) {
      onChange(val || "");
    }
  };

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry || defaultCountry);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <PhoneInput
        international
        defaultCountry={defaultCountry}
        country={country}
        value={inputValue}
        onChange={handleChange}
        onBlur={onBlur} 
        onCountryChange={handleCountryChange}
        disabled={disabled}
        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-color focus:border-transparent ${
          error
            ? "border-red-500"
            : disabled
            ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
            : "border-gray-300"
        }`}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInputField;
