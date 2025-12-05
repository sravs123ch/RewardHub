import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

const PasswordValidator = ({ password, onValidationChange }) => {
  const [criteria, setCriteria] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };

    setCriteria(newCriteria);

    const isPasswordValid = Object.values(newCriteria).every(Boolean);
    onValidationChange(isPasswordValid);
  }, [password, onValidationChange]);

  const rules = [
    { key: 'length', label: "At least 8 characters", isValid: criteria.length },
    { key: 'upperCase', label: "At least one uppercase letter (A–Z)", isValid: criteria.upperCase },
    { key: 'lowerCase', label: "At least one lowercase letter (a–z)", isValid: criteria.lowerCase },
    { key: 'number', label: "At least one number (0–9)", isValid: criteria.number },
    { key: 'specialChar', label: "At least one special character (!@#$...)", isValid: criteria.specialChar },
  ];

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-600 mb-2">
        Password must contain:
      </p>

      <ul className="space-y-1">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center">
            {rule.isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}

            <span
              className={`ml-2 text-sm ${
                rule.isValid ? "text-green-600" : "text-gray-500"
              }`}
            >
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordValidator;
