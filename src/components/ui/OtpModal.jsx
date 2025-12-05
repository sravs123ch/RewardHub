import { X, Edit } from "lucide-react";
import { useEffect, useState } from "react";

const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  targetLabel,
  allowEditTarget = false,
  onEditTarget,
  otpLength = 6,
  timerSeconds = 60,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const [timer, setTimer] = useState(timerSeconds);

  useEffect(() => {
    if (!isOpen) return;
    setTimer(timerSeconds);
    setOtp(Array(otpLength).fill(""));
  }, [isOpen, timerSeconds]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer]);


  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < otpLength - 1) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  };

  const handleVerify = () => {
    onVerify(otp.join(""));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[400px] shadow-xl relative animate-slideIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-primary transition-all hover:rotate-90"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary text-center mb-4">
          Enter OTP
        </h3>

        {/* Target Info */}
        <div className="text-sm text-gray-600 text-center mb-6 flex items-center justify-center">
          OTP has been sent to <span className="font-semibold ml-1">{targetLabel}</span>
          {allowEditTarget && (
            <button
              onClick={onEditTarget}
              className="ml-2 text-gray-500 hover:text-primary"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* OTP Fields */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Timer + Resend */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm mb-6">
          <span className="text-gray-600">
            Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>

          <button
            onClick={() => {
              setTimer(timerSeconds);
              setOtp(Array(otpLength).fill(""));
              onResend();
            }}
            disabled={timer > 0}
            className={`font-semibold ${
              timer === 0
                ? "text-primary hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Resend OTP
          </button>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.some((d) => d === "")}
          className={`w-full py-3 bg-primary text-white rounded-xl font-semibold transition-all ${
            isLoading || otp.some((d) => d === "")
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
