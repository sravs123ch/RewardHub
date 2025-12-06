import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordValidator from "../../common/PasswordValidator";
import { FaArrowRight, FaSpinner, FaEnvelope } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import carouselImages2 from "../../assets/Images/carouselImages2.jpeg";
import carouselImages1 from "../../assets/Images/Category_Banner.png";
import Input from "../ui/input-field";
import ComboInput from "../ui/ComboInput";
import CustomDatePicker from "../ui/DatePicker";
import PhoneInputField from "../ui/PhoneInputField";
import OtpModal from "../../components/ui/OtpModal";
import {
  GENDER_OPTIONS,
  OTP_LENGTH,
  OTP_TIMER,
} from "../../constants/data";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
// Static customers data
const STATIC_CUSTOMERS = [
  {
    phone: "+919876543210",
    email: "john.doe@example.com",
    password: "Password@123",
    firstName: "John",
    lastName: "Doe",
    gender: "male",
    dateOfBirth: "1990-01-01",
    customerId: "cust-001",
    token: "token-john-001",
    points: 12500
  },
  {
    phone: "+919123456780",
    email: "jane.smith@example.com",
    password: "Password@123",
    firstName: "Jane",
    lastName: "Smith",
    gender: "female",
    dateOfBirth: "1992-05-15",
    customerId: "cust-002",
    token: "token-jane-002",
    points: 8500
  },
  {
    phone: "+919555123456",
    email: "alex.johnson@example.com",
    password: "Password@123",
    firstName: "Alex",
    lastName: "Johnson",
    gender: "other",
    dateOfBirth: "1988-11-30",
    customerId: "cust-003",
    token: "token-alex-003",
    points: 21000
  }
];

// Static OTPs for each customer
const STATIC_OTPS = {
  "+919876543210": "123456",
  "+919123456780": "654321",
  "+919555123456": "987654"
};

const Login = () => {
  const [bIsLogin, setIsLogin] = useState(true);
  const [sPhoneNumber, setPhoneNumber] = useState("");
  const [sEmail, setEmail] = useState("");
  const [sPassword, setPassword] = useState("");
  const [bShowOtpModal, setShowOtpModal] = useState(false);
  const [aOtp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sOtpError, setOtpError] = useState("");
  const [iTimer, setTimer] = useState(OTP_TIMER);
  const [bIsLoading, setIsLoading] = useState({
    main: false,
    otp: false,
    resend: false,
  });
  const [iCustomerId, setCustomerId] = useState();
  const [sProfileData, setProfileData] = useState({
    sFirstName: "",
    sLastName: "",
    sEmail: "",
    sPassword: "",
    sGender: "",
    sDateOfBirth: "",
  });
  const [bOtpVerified, setOtpVerified] = useState(false);
  const [sErrors, setErrors] = useState({});
  const [sErrorMessage, setErrorMessage] = useState(null);
  const [sSelectedGender, setSelectedGender] = useState(null);
  const [bIsForgotPassword, setIsForgotPassword] = useState(false);
  const [bIsForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false);
  const [sForgotPasswordStep, setForgotPasswordStep] = useState("email");
  const [sNewPassword, setNewPassword] = useState("");
  const [sConfirmPassword, setConfirmPassword] = useState("");
  const [bIsPasswordFocused, setIsPasswordFocused] = useState(false);
  const [sFullPhoneNumber, setFullPhoneNumber] = useState("");
  
  // New states for login method selection
  const [sLoginMethod, setLoginMethod] = useState("phone"); // "phone" or "email"
  const [bIsResetPasswordFlow, setIsResetPasswordFlow] = useState(false);
  const [sResetPasswordStep, setResetPasswordStep] = useState("email"); // "email", "otp", "reset"

  // Live validation states
  const [sTouchedFields, setTouchedFields] = useState({});
  
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return "empty";
    // Simple phone validation - adjust as needed
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(cleanedPhone) ? "valid" : "invalid";
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const validateName = (name) => {
    return name && name.length >= 2;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateField = (field, value, extraData = {}) => {
    let error = "";
    
    switch (field) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Invalid email format";
        }
        break;
      case "phone":
        const phoneValidation = validatePhone(value);
        if (phoneValidation === "empty") {
          error = "Phone number is required";
        } else if (phoneValidation === "invalid") {
          error = "Invalid phone number";
        }
        break;
      case "password":
      case "newPassword":
      case "sPassword":
        if (!value) {
          error = "Password is required";
        } else if (!validatePassword(value)) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== extraData.newPassword && value !== sNewPassword) {
          error = "Passwords do not match";
        }
        break;
      case "sFirstName":
        if (!value || !validateName(value)) {
          error = "First name is required";
        }
        break;
      case "sLastName":
        if (!value || !validateName(value)) {
          error = "Last name is required";
        }
        break;
      case "sGender":
        if (!value) {
          error = "Gender is required";
        }
        break;
      case "sDateOfBirth":
        if (!value) {
          error = "Date of birth is required";
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  useEffect(() => {
    Object.keys(sTouchedFields).forEach((field) => {
      let value;

      if (field === "phone") value = sFullPhoneNumber;
      else if (field === "email") value = sEmail;
      else if (field === "password") value = sPassword;
      else if (field === "confirmPassword") value = sConfirmPassword;
      else if (field === "newPassword") value = sNewPassword;
      else if (field === "sGender")
        value = sSelectedGender ? sSelectedGender.value : "";
      else if (field === "sDateOfBirth") value = sProfileData.sDateOfBirth || "";
      else value = sProfileData[field] ?? "";

      validateField(field, value, {
        newPassword: sNewPassword,
      });
    });
  }, [
    sFullPhoneNumber,
    sEmail,
    sPassword,
    sProfileData,
    sProfileData.sDateOfBirth,
    sSelectedGender,
    sNewPassword,
    sConfirmPassword,
    sTouchedFields,
  ]);

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (sLoginMethod === "phone") {
      if (!sFullPhoneNumber) {
        newErrors.phone = "Phone number is required";
      } else if (validatePhone(sFullPhoneNumber) !== "valid") {
        newErrors.phone = "Invalid phone number";
      }
    } else {
      if (!sEmail) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(sEmail)) {
        newErrors.email = "Invalid email format";
      }
      
      if (!sPassword) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(sPassword)) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (JSON.stringify(newErrors) !== JSON.stringify(sErrors)) {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    const validationResult = validatePhone(sFullPhoneNumber);

    if (validationResult === "empty" || validationResult === "invalid") {
      newErrors.phone = "Phone number is required";
    }

    if (JSON.stringify(newErrors) !== JSON.stringify(sErrors)) {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!sProfileData.sFirstName || !validateName(sProfileData.sFirstName)) {
      newErrors.sFirstName = "First name is required";
    }

    if (!sProfileData.sLastName || !validateName(sProfileData.sLastName)) {
      newErrors.sLastName = "Last name is required";
    }

    if (!sProfileData.sEmail || !validateEmail(sProfileData.sEmail)) {
      newErrors.sEmail = "Invalid email format";
    }

    if (!sProfileData.sPassword || !validatePassword(sProfileData.sPassword)) {
      newErrors.sPassword = "Password must be at least 6 characters";
    }

    if (!sProfileData.sGender) {
      newErrors.sGender = "Gender is required";
    }
    if (!sProfileData.sDateOfBirth) {
      newErrors.sDateOfBirth = "Date of birth is required";
    }

    if (JSON.stringify(newErrors) !== JSON.stringify(sErrors)) {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setProfileData((prev) => ({
      ...prev,
      sGender: gender ? gender.value : "",
    }));

    if (sErrors.sGender) {
      setErrors((prev) => ({ ...prev, sGender: "" }));
    }

    if (sTouchedFields.sGender) {
      validateField("sGender", gender ? gender.value : "");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (sErrors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (sTouchedFields.email) {
      validateField("email", value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (sErrors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    if (sTouchedFields.password) {
      validateField("password", value);
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (sErrors.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
    if (sTouchedFields.newPassword) {
      validateField("newPassword", value);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (sErrors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
    if (sTouchedFields.confirmPassword) {
      validateField("confirmPassword", value);
    }
  };

  // Check if phone number is in static customers
  const isStaticCustomer = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const fullPhone = `+91${cleanedPhone.slice(-10)}`;
    return STATIC_CUSTOMERS.some(customer => customer.phone === fullPhone);
  };

  // Get static customer by phone
  const getStaticCustomer = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const fullPhone = `+91${cleanedPhone.slice(-10)}`;
    return STATIC_CUSTOMERS.find(customer => customer.phone === fullPhone);
  };

  // Get static customer by email
  const getStaticCustomerByEmail = (email) => {
    return STATIC_CUSTOMERS.find(customer => customer.email === email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bIsLogin) {
      // For login flow
      if (sLoginMethod === "phone") {
        setTouchedFields((prev) => ({ ...prev, phone: true }));
        if (!validateLoginForm()) return;

        try {
          setIsLoading((prev) => ({ ...prev, main: true }));
          
          // Check if it's a static customer
          if (isStaticCustomer(sFullPhoneNumber)) {
            // Show OTP in toast message
            const staticOtp = STATIC_OTPS[`+91${sFullPhoneNumber.replace(/\D/g, '').slice(-10)}`];
            
            toast.success(`OTP sent to ${sFullPhoneNumber}: ${staticOtp}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Static customer login attempt with:", sFullPhoneNumber);
            console.log("OTP for demo:", staticOtp);
            
            // Show OTP modal
            setShowOtpModal(true);
            setTimer(OTP_TIMER);
            startTimer();
            
          } else {
            // Not a static customer
            setErrorMessage("Phone number not registered. Please sign up first.");
            toast.error("Phone number not registered. Please sign up first.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
          
        } catch (error) {
          setErrorMessage("An error occurred. Please try again.");
        } finally {
          setIsLoading((prev) => ({ ...prev, main: false }));
        }
      } else {
        // Email/Password login
        setTouchedFields((prev) => ({ ...prev, email: true, password: true }));
        if (!validateLoginForm()) return;

        try {
          setIsLoading((prev) => ({ ...prev, main: true }));
          
          // Check if it's a static customer
          const customer = getStaticCustomerByEmail(sEmail);
          if (customer && sPassword === customer.password) {
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Email login successful for:", customer.email);
            
            // Store user data
            localStorage.setItem("token", customer.token);
            localStorage.setItem("customerId", customer.customerId);
            localStorage.setItem("userName", `${customer.firstName} ${customer.lastName}`);
            localStorage.setItem("userEmail", customer.email);
            localStorage.setItem("userPoints", customer.points.toString());
            localStorage.setItem("userPhone", customer.phone);
            
            toast.success(`Welcome back, ${customer.firstName}!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            
            // Redirect to profile page
            navigate("/");
            
          } else {
            setErrorMessage("Invalid email or password");
            toast.error("Invalid email or password", {
              position: "top-right",
              autoClose: 3000,
            });
          }
          
        } catch (error) {
          setErrorMessage("An error occurred. Please try again.");
          toast.error("An error occurred. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setIsLoading((prev) => ({ ...prev, main: false }));
        }
      }
    } else {
      // For signup flow (only phone method)
      if (!bOtpVerified) {
        setTouchedFields((prev) => ({ ...prev, phone: true }));
        if (!validateSignupForm()) return;

        try {
          setIsLoading((prev) => ({ ...prev, main: true }));
          
          // Check if phone already exists (in static customers)
          if (isStaticCustomer(sFullPhoneNumber)) {
            setErrorMessage("Phone number already registered. Please login instead.");
            toast.error("Phone number already registered. Please login instead.", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Generate random OTP for new signup
          const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
          
          toast.success(`OTP sent to ${sFullPhoneNumber}: ${randomOtp}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          
          console.log("New signup attempt with phone:", sFullPhoneNumber);
          console.log("Generated OTP:", randomOtp);
          
          setShowOtpModal(true);
          startTimer();
          setTimer(OTP_TIMER);
          
        } catch (err) {
          setErrorMessage("An error occurred. Please try again.");
          toast.error("An error occurred. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setIsLoading((prev) => ({ ...prev, main: false }));
        }
      }
    }
  };

  // Reset Password Flow Functions
  const handleInitiateResetPassword = async (e) => {
    e.preventDefault();
    
    if (!sEmail || !validateEmail(sEmail)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, main: true }));
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Reset password initiated for:", sEmail);
      
      // Check if email exists in static customers
      const customer = getStaticCustomerByEmail(sEmail);
      if (!customer) {
        setErrorMessage("Email not found. Please check and try again.");
        toast.error("Email not found. Please check and try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      
      // Generate OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      toast.success(`Password reset OTP sent to ${sEmail}: ${randomOtp}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      setResetPasswordStep("otp");
      setShowOtpModal(true);
      setIsForgotPasswordFlow(true);
      startTimer();
      setTimer(OTP_TIMER);
      setErrorMessage("");
      setErrors({});
      
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!sNewPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!validatePassword(sNewPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!sConfirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (sNewPassword !== sConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, main: true }));
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Password reset for:", sEmail);
      
      toast.success("Password reset successfully! Please login with your new password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      // Reset all states and go back to login
      setIsResetPasswordFlow(false);
      setResetPasswordStep("email");
      setNewPassword("");
      setConfirmPassword("");
      setEmail("");
      setErrors({});
      setTouchedFields({});
      
      // Switch back to email login method
      setLoginMethod("email");
      
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, main: false }));
    }
  };

  // Common OTP verification function
  const verifyOtp = async () => {
    setIsLoading((prev) => ({ ...prev, otp: true }));
    try {
      const otpValue = aOtp.join("");
      if (otpValue.length !== OTP_LENGTH) {
        setOtpError("Please enter a valid 6-digit OTP");
        return;
      }

      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("OTP entered:", otpValue);
      
      if (bIsForgotPasswordFlow) {
        // For forgot password OTP verification
        // In a real app, verify OTP from backend
        toast.success("OTP verified successfully! Please set your new password.", {
          position: "top-right",
          autoClose: 3000,
        });
        
        if (bIsResetPasswordFlow) {
          setResetPasswordStep("reset");
        } else {
          setForgotPasswordStep("reset");
        }
        setShowOtpModal(false);
        setOtpError("");
        setOtp(Array(OTP_LENGTH).fill(""));
        
      } else {
        // For regular signup OTP verification (including static customers)
        if (bIsLogin) {
          // Phone login for static customers
          const customer = getStaticCustomer(sFullPhoneNumber);
          const staticOtp = STATIC_OTPS[`+91${sFullPhoneNumber.replace(/\D/g, '').slice(-10)}`];
          
          if (customer && otpValue === staticOtp) {
            toast.success(`Welcome back, ${customer.firstName}!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            
            // Store user data
            localStorage.setItem("token", customer.token);
            localStorage.setItem("customerId", customer.customerId);
            localStorage.setItem("userName", `${customer.firstName} ${customer.lastName}`);
            localStorage.setItem("userEmail", customer.email);
            localStorage.setItem("userPoints", customer.points.toString());
            localStorage.setItem("userPhone", customer.phone);
            
            setCustomerId(customer.customerId);
            setOtpVerified(false); // Don't need profile completion for static customers
            setShowOtpModal(false);
            setOtpError("");
            setOtp(Array(OTP_LENGTH).fill(""));
            
            // Redirect to profile page
            navigate("/");
            
          } else if (otpValue === "123456" || otpValue === "654321" || otpValue === "987654") {
            // Allow OTPs from STATIC_OTPS for demo
            const customer = getStaticCustomer(sFullPhoneNumber);
            if (customer) {
              toast.success(`Welcome back, ${customer.firstName}!`, {
                position: "top-right",
                autoClose: 3000,
              });
              
              localStorage.setItem("token", customer.token);
              localStorage.setItem("customerId", customer.customerId);
              localStorage.setItem("userName", `${customer.firstName} ${customer.lastName}`);
              localStorage.setItem("userEmail", customer.email);
              localStorage.setItem("userPoints", customer.points.toString());
              localStorage.setItem("userPhone", customer.phone);
              
              setCustomerId(customer.customerId);
              setOtpVerified(false);
              setShowOtpModal(false);
              setOtpError("");
              setOtp(Array(OTP_LENGTH).fill(""));
              
              navigate("/");
            } else {
              setOtpError("Invalid OTP. Please try again.");
              toast.error("Invalid OTP. Please try again.", {
                position: "top-right",
                autoClose: 3000,
              });
            }
          } else {
            setOtpError("Invalid OTP. Please try again.");
            toast.error("Invalid OTP. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
          // New signup OTP verification
          // For demo, accept any 6-digit OTP
          if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
            setCustomerId("new-customer-" + Date.now());
            setOtpVerified(true);
            setShowOtpModal(false);
            setOtpError("");
            setOtp(Array(OTP_LENGTH).fill(""));
            
            toast.success("OTP verified! Please complete your profile.", {
              position: "top-right",
              autoClose: 3000,
            });
            
            // Pre-fill profile with phone number
            setProfileData(prev => ({
              ...prev,
              sEmail: sEmail || "",
            }));
          } else {
            setOtpError("Invalid OTP. Please try again.");
            toast.error("Invalid OTP. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
      }
    } catch (err) {
      setOtpError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleResendOtp = async () => {
    if (iTimer > 0) return;

    try {
      setIsLoading((prev) => ({ ...prev, resend: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Resending OTP...");
      
      // Get OTP based on flow
      let otpMessage = "";
      if (bIsForgotPasswordFlow) {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpMessage = `Password reset OTP sent to ${sEmail}: ${randomOtp}`;
      } else if (bIsLogin && isStaticCustomer(sFullPhoneNumber)) {
        const staticOtp = STATIC_OTPS[`+91${sFullPhoneNumber.replace(/\D/g, '').slice(-10)}`];
        otpMessage = `OTP resent to ${sFullPhoneNumber}: ${staticOtp}`;
      } else {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpMessage = `OTP resent to ${sFullPhoneNumber}: ${randomOtp}`;
      }
      
      toast.success(otpMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      setTimer(OTP_TIMER);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startTimer();
      
    } catch (err) {
      setErrorMessage("Failed to resend OTP. Please try again.");
      toast.error("Failed to resend OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, resend: false }));
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (sTouchedFields[name]) {
      validateField(name, value);
    }
  };

  const handlePhoneChange = (val) => {
    setFullPhoneNumber(val || "");
    if (sErrors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (sTouchedFields.phone) {
      validateField("phone", val);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setTouchedFields({
      sFirstName: true,
      sLastName: true,
      sEmail: true,
      sPassword: true,
      sGender: true,
      sDateOfBirth: true,
    });

    if (!validateProfileForm()) return;

    try {
      setIsLoading((prev) => ({ ...prev, main: true }));
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Profile submitted:", sProfileData);
      
      // Create new customer data
      const newCustomer = {
        phone: sFullPhoneNumber,
        email: sProfileData.sEmail,
        password: sProfileData.sPassword,
        firstName: sProfileData.sFirstName,
        lastName: sProfileData.sLastName,
        gender: sProfileData.sGender,
        dateOfBirth: sProfileData.sDateOfBirth,
        customerId: "new-customer-" + Date.now(),
        token: "token-new-" + Date.now(),
        points: 1000 // Starting points for new customers
      };
      
      localStorage.setItem("token", newCustomer.token);
      localStorage.setItem("customerId", newCustomer.customerId);
      localStorage.setItem("userName", `${newCustomer.firstName} ${newCustomer.lastName}`);
      localStorage.setItem("userEmail", newCustomer.email);
      localStorage.setItem("userPoints", newCustomer.points.toString());
      localStorage.setItem("userPhone", newCustomer.phone);
      
      toast.success(`Welcome ${newCustomer.firstName}! Your account has been created.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      // Reset form
      setOtpVerified(false);
      setIsLogin(true);
      setProfileData({
        sFirstName: "",
        sLastName: "",
        sEmail: "",
        sPassword: "",
        sGender: "",
        sDateOfBirth: "",
      });
      
      // Redirect to profile page
      navigate("/");
      
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const carouselImages = [carouselImages1, carouselImages2, carouselImages1];

  const [nCurrentSlide, setCurrentSlide] = useState(0);
  const [bIsFormValid, setIsFormValid] = useState(false);
  const [bIsPasswordValid, setIsPasswordValid] = useState(false);
  const [bIsLoginFormValid, setIsLoginFormValid] = useState(false);
  const [bIsForgotPasswordFormValid, setIsForgotPasswordFormValid] =
    useState(false);
  const [bIsResetPasswordFormValid, setIsResetPasswordFormValid] =
    useState(false);

  useEffect(() => {
    if (sLoginMethod === "phone") {
      setIsLoginFormValid(validatePhone(sFullPhoneNumber) === "valid");
    } else {
      setIsLoginFormValid(
        sEmail &&
          validateEmail(sEmail) &&
          sPassword &&
          validatePassword(sPassword)
      );
    }
  }, [sLoginMethod, sFullPhoneNumber, sEmail, sPassword]);

  useEffect(() => {
    setIsForgotPasswordFormValid(sEmail && validateEmail(sEmail));
  }, [sEmail]);

  useEffect(() => {
    setIsResetPasswordFormValid(
      sEmail &&
        validateEmail(sEmail) &&
        sNewPassword &&
        bIsPasswordValid &&
        sConfirmPassword &&
        sNewPassword === sConfirmPassword
    );
  }, [sEmail, sNewPassword, sConfirmPassword, bIsPasswordValid]);

  useEffect(() => {
    const areAllFieldsFilled =
      sProfileData.sFirstName &&
      sProfileData.sLastName &&
      sProfileData.sEmail &&
      sProfileData.sPassword &&
      sProfileData.sGender &&
      sProfileData.sDateOfBirth;
    const hasNoErrors =
      !sErrors.sFirstName &&
      !sErrors.sLastName &&
      !sErrors.sEmail &&
      !sErrors.sPassword &&
      !sErrors.sGender;

    setIsFormValid(areAllFieldsFilled && bIsPasswordValid && hasNoErrors);
  }, [sProfileData, bIsPasswordValid, sErrors]);

  useEffect(() => {
    const iTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(iTimer);
  }, [carouselImages.length]);

  const handleDotClick = (idx) => {
    setCurrentSlide(idx);
  };

  // Reset all states when toggling between login/signup
  const toggleLoginSignup = () => {
    setIsLogin(!bIsLogin);
    setOtpVerified(false);
    setEmail("");
    setPassword("");
    setFullPhoneNumber("");
    setErrors({});
    setTouchedFields({});
    setErrorMessage("");
    setIsForgotPassword(false);
    setIsResetPasswordFlow(false);
    setResetPasswordStep("email");
    // When switching to sign up, only phone is available
    if (!bIsLogin) {
      setLoginMethod("phone");
    }
  };

  // Reset states for forgot password
  const handleForgotPasswordClick = () => {
    setIsResetPasswordFlow(true);
    setResetPasswordStep("email");
    setEmail("");
    setErrors({});
    setTouchedFields({});
    setErrorMessage("");
    setLoginMethod("email");
  };

  // When switching to email tab in login mode, clear phone errors
  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    // Clear validation errors when switching tabs
    if (method === "email" && sErrors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    } else if (method === "phone" && (sErrors.email || sErrors.password)) {
      setErrors((prev) => ({ ...prev, email: "", password: "" }));
    }
  };

  // Function to get the appropriate heading based on mode and method
  const getHeading = () => {
    if (bIsResetPasswordFlow) return "Reset Password";
    if (bOtpVerified) return "Complete Your Profile";
    
    if (bIsLogin) {
      if (sLoginMethod === "phone") return "Login with Phone";
      return "Login with Email";
    } else {
      return "Create Account";
    }
  };

  // Function to get the appropriate subheading based on mode and method
  const getSubheading = () => {
    if (bIsResetPasswordFlow) return "Enter your email to reset your password";
    if (bOtpVerified) return "Please complete your profile information";
    
    if (bIsLogin) {
      if (sLoginMethod === "phone") return "Enter your phone number to continue";
      return "Enter your email and password to login";
    } else {
      return "Enter your phone number to get started";
    }
  };

  // Helper function to format phone for display
  const getPhonePayload = (phone) => {
    return {
      phoneNumber: phone.replace(/\D/g, '').slice(-10),
      countryCode: '+91',
      formatted: phone || 'Phone number'
    };
  };

  return (
      <div className="min-h-screen flex flex-col bg-background">
      <Header />
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
    
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* OTP Modal */}
      <OtpModal
        isOpen={bShowOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          if (bIsForgotPasswordFlow || bIsResetPasswordFlow) {
            if (bIsResetPasswordFlow) {
              setResetPasswordStep("email");
            } else {
              setForgotPasswordStep("email");
            }
            setIsForgotPasswordFlow(false);
            setErrors({});
          }
        }}
        onVerify={(otpValue) => {
          setOtp(otpValue.split(""));
          verifyOtp();
        }}
        onResend={handleResendOtp}
        targetLabel={
          bIsForgotPasswordFlow || bIsResetPasswordFlow
            ? sEmail
            : getPhonePayload(sFullPhoneNumber).formatted
        }
        allowEditTarget
        onEditTarget={() => {
          setShowOtpModal(false);
          setOtp(Array(6).fill(""));
          setOtpError("");
        }}
        otpLength={6}
        timerSeconds={60}
        isLoading={bIsLoading.otp}
        isResendLoading={bIsLoading.resend}
      />

      {/* Main Auth Form */}
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl flex overflow-hidden relative min-h-[600px]">
        {/* Left Panel – with carousel */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            src={carouselImages2}
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 flex flex-col items-center justify-center p-12">
            <motion.h2
              className="text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {bIsLogin ? "Welcome Back" : "Join Us Today"}
            </motion.h2>
            <motion.p
              className="text-lg text-indigo-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {bIsLogin ? "Login to access your account and exclusive features" : "Create an account to get started with our services"}
            </motion.p>

            <div className="relative w-full max-w-md">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={nCurrentSlide}
                  src={carouselImages[nCurrentSlide]}
                  alt={`Slide ${nCurrentSlide + 1}`}
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === nCurrentSlide
                        ? "bg-white scale-125"
                        : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getHeading()}
              </h1>
              <p className="text-gray-600 mb-4">
                {getSubheading()}
              </p>
              
              {/* Demo Static Customers Info */}
              {bIsLogin && sLoginMethod === "phone" && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Demo Static Employee:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Phone: 9876543210 (OTP: 123456)</li>
                    <li>• Phone: 9123456780 (OTP: 654321)</li>
                    <li>• Phone: 9555123456 (OTP: 987654)</li>
                  </ul>
                </div>
              )}
              
              {bIsLogin && sLoginMethod === "email" && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Demo Static Employee:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Email: john.doe@example.com (Password: Password@123)</li>
                    <li>• Email: jane.smith@example.com (Password: Password@123)</li>
                    <li>• Email: alex.johnson@example.com (Password: Password@123)</li>
                  </ul>
                </div>
              )}
            </motion.div>

            {sErrorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center">{sErrorMessage}</p>
              </div>
            )}

            {bOtpVerified ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Profile completion form */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="sFirstName"
                    value={sProfileData.sFirstName}
                    onChange={handleProfileChange}
                    onBlur={() => handleFieldBlur("sFirstName")}
                    required
                    icon="user"
                    error={sErrors.sFirstName}
                  />
                  <Input
                    label="Last Name"
                    name="sLastName"
                    value={sProfileData.sLastName}
                    onChange={handleProfileChange}
                    onBlur={() => handleFieldBlur("sLastName")}
                    required
                    icon="user"
                    error={sErrors.sLastName}
                  />
                </div>
                <PhoneInputField
                  label="Phone Number"
                  value={sFullPhoneNumber}
                  onChange={() => {}}
                  defaultCountry="IN"
                  required
                  error={sErrors.phone}
                  disabled
                />

                <Input
                  label="Email"
                  type="email"
                  name="sEmail"
                  value={sProfileData.sEmail}
                  onChange={handleProfileChange}
                  onBlur={() => handleFieldBlur("sEmail")}
                  required
                  icon="email"
                  error={sErrors.sEmail}
                />

                <div>
                  <Input
                    label="Password"
                    type="password"
                    name="sPassword"
                    required
                    value={sProfileData.sPassword}
                    onChange={handleProfileChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      handleFieldBlur("sPassword");
                    }}
                    icon="password"
                    error={sErrors.sPassword}
                  />

                  {(bIsPasswordFocused || sProfileData.sPassword) && (
                    <PasswordValidator
                      password={sProfileData.sPassword}
                      onValidationChange={setIsPasswordValid}
                    />
                  )}
                </div>

                <ComboInput
                  id="sGender"
                  name="sGender"
                  label="Gender"
                  value={sSelectedGender}
                  onChange={handleGenderChange}
                  onBlur={() =>
                    handleFieldBlur("sGender", sProfileData.sGender)
                  }
                  options={GENDER_OPTIONS}
                  required
                  error={sErrors.sGender}
                />

                <CustomDatePicker
                  label="Date of Birth"
                  value={sProfileData.sDateOfBirth}
                  required
                  onBlur={() => handleFieldBlur("sDateOfBirth")}
                  onChange={(date) => {
                    handleProfileChange({
                      target: {
                        name: "sDateOfBirth",
                        value: date,
                      },
                    });
                  }}
                  name="sDateOfBirth"
                  error={sErrors.sDateOfBirth}
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    className={`w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold transition-all duration-300 ${
                      !bIsFormValid || bIsLoading.main
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90"
                    }`}
                    disabled={!bIsFormValid || bIsLoading.main}
                  >
                    {bIsLoading.main ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin h-5 w-5" />
                        Processing...
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </form>
            ) : bIsResetPasswordFlow ? (
              // Reset Password Flow
              <form
                onSubmit={
                  sResetPasswordStep === "email"
                    ? handleInitiateResetPassword
                    : sResetPasswordStep === "reset"
                    ? handleResetPasswordSubmit
                    : (e) => e.preventDefault()
                }
                className="space-y-6"
              >
                {sResetPasswordStep === "email" && (
                  <>
                    <Input
                      label="Email"
                      type="email"
                      value={sEmail}
                      onChange={handleEmailChange}
                      onBlur={() => handleFieldBlur("email")}
                      icon="email"
                      placeholder="Enter your email"
                      error={sErrors.email}
                      required
                    />
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetPasswordFlow(false);
                          setResetPasswordStep("email");
                          setEmail("");
                          setErrors({});
                          setTouchedFields({});
                        }}
                        className="flex-1 px-4 py-3 border border-primary text-primary bg-transparent rounded-lg font-medium hover:bg-primary/10 transition-colors duration-150"
                      >
                        Back to Login
                      </button>
                      <button
                        type="submit"
                        disabled={!sEmail || !validateEmail(sEmail) || bIsLoading.main}
                        className={`flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold ${
                          !sEmail || !validateEmail(sEmail) || bIsLoading.main
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90"
                        }`}
                      >
                        {bIsLoading.main ? (
                          <span className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin h-5 w-5" />
                            Processing
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                    </div>
                  </>
                )}

                {sResetPasswordStep === "reset" && (
                  <>
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        OTP verified successfully. Please set your new password.
                      </p>
                    </div>
                    <div>
                      <Input
                        label="New Password"
                        type="password"
                        value={sNewPassword}
                        onChange={handleNewPasswordChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => {
                          setIsPasswordFocused(false);
                          handleFieldBlur("newPassword");
                        }}
                        icon="password"
                        error={sErrors.newPassword}
                        required
                      />
                      {(bIsPasswordFocused || sNewPassword) && (
                        <PasswordValidator
                          password={sNewPassword}
                          onValidationChange={setIsPasswordValid}
                        />
                      )}
                    </div>
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={sConfirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={() => handleFieldBlur("confirmPassword")}
                      icon="password"
                      error={sErrors.confirmPassword}
                      required
                    />
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setResetPasswordStep("email");
                          setNewPassword("");
                          setConfirmPassword("");
                          setErrors({});
                        }}
                        className="flex-1 px-4 py-3 border border-primary text-primary bg-transparent rounded-lg font-medium hover:bg-primary/10 transition-colors duration-150"
                      >
                        Go Back
                      </button>
                      <button
                        type="submit"
                        disabled={
                          !sNewPassword ||
                          !sConfirmPassword ||
                          sNewPassword !== sConfirmPassword ||
                          bIsLoading.main
                        }
                        className={`flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold ${
                          !sNewPassword ||
                          !sConfirmPassword ||
                          sNewPassword !== sConfirmPassword ||
                          bIsLoading.main
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90"
                        }`}
                      >
                        {bIsLoading.main ? (
                          <span className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin h-5 w-5" />
                            Processing
                          </span>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              // Login/Signup Form
              <form onSubmit={handleSubmit} className="space-y-6">
                {bIsLogin && (
                  <div className="mb-6">
                    <div className="flex rounded-lg border border-gray-300 p-1">
                      <button
                        type="button"
                        onClick={() => handleLoginMethodChange("phone")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                          sLoginMethod === "phone"
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FaPhone className="h-4 w-4" />
                        Phone
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoginMethodChange("email")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                          sLoginMethod === "email"
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FaEnvelope className="h-4 w-4" />
                        Email
                      </button>
                    </div>
                  </div>
                )}

                {bIsLogin && sLoginMethod === "phone" && (
                  <div className="space-y-4">
                    <div>
                      <PhoneInputField
                        label="Phone Number"
                        value={sFullPhoneNumber}
                        onChange={handlePhoneChange}
                        onBlur={() => handleFieldBlur("phone")}
                        required
                      />
                      {sErrors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {sErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {bIsLogin && sLoginMethod === "email" && (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={sEmail}
                      onChange={handleEmailChange}
                      onBlur={() => handleFieldBlur("email")}
                      icon="email"
                      placeholder="Enter your email"
                      error={sErrors.email}
                      required
                    />
                    <div>
                      <Input
                        label="Password"
                        type="password"
                        value={sPassword}
                        onChange={handlePasswordChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => {
                          setIsPasswordFocused(false);
                          handleFieldBlur("password");
                        }}
                        icon="password"
                        placeholder="Enter your password"
                        error={sErrors.password}
                        required
                      />
                      {(bIsPasswordFocused || sPassword) && (
                        <PasswordValidator
                          password={sPassword}
                          onValidationChange={setIsPasswordValid}
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}

                {!bIsLogin && (
                  <div className="space-y-4">
                    <div>
                      <PhoneInputField
                        label="Phone Number"
                        value={sFullPhoneNumber}
                        onChange={handlePhoneChange}
                        onBlur={() => handleFieldBlur("phone")}
                        required
                      />
                      {sErrors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {sErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold text-primary-foreground bg-primary focus:outline-none transition-all ${
                    (bIsLogin && sLoginMethod === "phone" && validatePhone(sFullPhoneNumber) !== "valid") ||
                    (bIsLogin && sLoginMethod === "email" && (!sEmail || !sPassword)) ||
                    (!bIsLogin && validatePhone(sFullPhoneNumber) !== "valid") ||
                    bIsLoading.main
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                  disabled={
                    (bIsLogin && sLoginMethod === "phone" && validatePhone(sFullPhoneNumber) !== "valid") ||
                    (bIsLogin && sLoginMethod === "email" && (!sEmail || !sPassword)) ||
                    (!bIsLogin && validatePhone(sFullPhoneNumber) !== "valid") ||
                    bIsLoading.main
                  }
                >
                  {bIsLoading.main ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin h-5 w-5" />
                      Processing
                    </span>
                  ) : (
                    <div className="flex items-center justify-center">
                      {bIsLogin
                        ? sLoginMethod === "phone"
                          ? "Continue"
                          : "Login"
                        : "Sign Up"}
                      <FaArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    {bIsLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleLoginSignup}
                      className="text-primary font-semibold hover:underline ml-1"
                    >
                      {bIsLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Login;