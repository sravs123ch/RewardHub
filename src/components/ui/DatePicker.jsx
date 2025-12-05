import { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
const CustomDatePicker = ({ 
  label, 
  value, 
  onChange, 
  name, 
  error,
  onBlur,
  highlightedDays = [],
  disableFuture = false,
  required = false
}) => {
  const [internalValue, setInternalValue] = useState(value ? dayjs(value) : null);

  const handleChange = (newValue) => {
    const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
    setInternalValue(newValue);
    onChange(dateString); 
  };

  const renderDay = (day, _value, DayComponentProps) => {
    const isSelected =
      !DayComponentProps.outsideCurrentMonth &&
      highlightedDays.includes(day.date());

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
      >
        <PickersDay {...DayComponentProps} />
      </Badge>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-1 text-gray-700`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={internalValue}
          onChange={handleChange}
          disableFuture={disableFuture}
          renderDay={highlightedDays.length > 0 ? renderDay : undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              error: !!error,
              onBlur,
              InputLabelProps: {
                className: error ? 'text-red-500' : 'text-gray-800'
              },
              sx: {
                '& .MuiInputBase-root': {
                  color: '#333333',
                  height: '50px',
                  '&.Mui-focused': {
                    color: '#333333',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: error ? '#d32f2f' : '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF5A5F',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF5A5F',
                    borderWidth: 2,
                  },
                  '& input': {
                    padding: '12px 14px',
                    height: 'auto',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: error ? '#d32f2f' : '#333333',
                  '&.Mui-focused': {
                    color: '#FF5A5F',
                  },
                },
              },
            },
            popper: {
              sx: {
                zIndex: 1300,
                '& .MuiPaper-root': {
                  backgroundColor: 'white',
                  color: '#333333',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                },
                '& .MuiPickersCalendarHeader-root': {
                  backgroundColor: 'rgba(255, 90, 95, 0.13)',
                  color: '#333333',
                },
                '& .MuiPickersCalendarHeader-label': {
                  color: '#FF5A5F',
                  fontWeight: 'bold',
                },
                '& .MuiPickersDay-root': {
                  color: '#333333',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 90, 95, 0.13)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#FF5A5F',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#FF5A5F',
                    },
                  },
                  '&.MuiPickersDay-today': {
                    border: '2px solid #FF5A5F',
                    color: '#FF5A5F',
                  },
                },
                '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
                  color: '#333333',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 90, 95, 0.13)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#FF5A5F',
                    color: 'white',
                  },
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: '#FF5A5F',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 90, 95, 0.13)',
                  },
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: '#333333',
                  fontWeight: '500',
                },
                '& .MuiDialogActions-root': {
                  '& .MuiButton-root': {
                    color: '#FF5A5F',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 90, 95, 0.13)',
                    },
                  },
                },
                '@media (max-width: 600px)': {
                  '& .MuiPaper-root': {
                    width: '100%',
                    maxWidth: '100vw',
                    position: 'fixed',
                    left: '0 !important',
                    right: '0 !important',
                    bottom: '0 !important',
                    borderRadius: '8px 8px 0 0',
                  },
                  '& .MuiPickersDay-root': {
                    width: '36px',
                    height: '36px',
                  },
                },
              },
            },
          }}
        />
      </LocalizationProvider>
       {error && (
    <p className="text-red-500 text-sm mt-1">{error}</p>
  )}
    </div>
  );
};

export default CustomDatePicker;