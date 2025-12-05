// components/ComboInput.jsx
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function ComboInput({
  id,
  label,
  name,
  value,
  options,
  onChange,
  onBlur,   
  errorMessage = "",
  error = "",
  placeholder = "Select...",
}) {
  const [query, setQuery] = useState("");
const finalError = error || errorMessage;
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {<span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Combobox value={value} onChange={onChange}>
        <div className="relative mt-2 mb-1">
          <Combobox.Input
            id={id || name}
            name={name}
       
            placeholder={placeholder}
            className={`block w-full rounded-md border py-3.5 px-4 shadow-sm sm:text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:ring-2 focus:border-primary-500`}
            displayValue={(option) => option?.label || ""}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={onBlur} 
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
          {filteredOptions.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                >
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {option.label}
                  </span>
                  <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      {!value && finalError && (
        <p className="text-red-500 text-sm mt-1">{finalError}</p>
      )}
    </div>
  );
}
