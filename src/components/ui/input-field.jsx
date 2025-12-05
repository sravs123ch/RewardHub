import { motion } from "framer-motion";
import { Mail, Lock, Phone, User, Calendar, Key } from "lucide-react";

const iconComponents = {
  email: Mail,
  password: Lock,
  phone: Phone,
  user: User,
  date: Calendar,
  otp: Key,
};

const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  icon,
  className = "",
  containerClassName = "",
  error,
  readOnly = false,
  disabled = false,
  required = false, // New prop to control asterisk visibility
  ...props
}) => {
  const Icon = icon ? iconComponents[icon] : null;

  return (
    <motion.div
      className={`relative ${containerClassName}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>} {/* Conditional rendering */}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:ring-2 custom-focus-ring focus:border-transparent transition-colors ${
            Icon ? "pl-11" : ""
          } ${
            readOnly || disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Input;