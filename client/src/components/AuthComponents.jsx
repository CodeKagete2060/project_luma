import { Link } from 'react-router-dom';

export function AuthButton({ type = 'submit', isLoading = false, loadingText = 'Please wait...', children }) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`w-full px-4 py-2 text-white font-medium rounded-lg
        ${isLoading 
          ? 'bg-blue-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        } transition-colors duration-200`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

export function AuthInput({ 
  label, 
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow duration-200`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function AuthSelect({ 
  label, 
  value, 
  onChange, 
  options,
  error,
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg bg-white
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow duration-200`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-center text-sm text-gray-600 max-w">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}