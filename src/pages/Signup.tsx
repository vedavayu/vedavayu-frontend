// src/components/Signup.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, AuthResponse } from '../Api/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SignupProps {
  onLogin: (data: AuthResponse) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

// This interface matches what the API expects for registration
interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [f, setF] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    document.title = 'Sign Up | Vedavayu';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setF(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password !== f.confirmPassword) {
      return alert('Passwords do not match!');
    }
    if (!f.agreeTerms) {
      return alert('You must agree to the terms and conditions');
    }

    try {
      // Create the payload with the correct structure
      const signupPayload: SignupPayload = {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email: f.email,
        phone: f.phone,
        password: f.password,
      };

      const response = await registerUser(signupPayload);
      onLogin(response);
      navigate(response.user.role === 'admin' ? '/admin' : '/');
    } catch (err: unknown) {
      // Type-safe error handling
      const error = err as { response?: { status?: number } };
      alert(error.response?.status === 400
        ? 'User already exists'
        : 'Registration failed – please try again');
    }
  };

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-primary-800 text-center mb-2">
              Create Your Vedavayu Account
            </h1>
            <p className="text-neutral-600 text-center mb-6">
              Join our community for a holistic wellness journey
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={f.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={f.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={f.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={f.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={f.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-500 focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Must be at least 8 characters long
                  </p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={f.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(prev => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-500 focus:outline-none"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={f.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-neutral-700">
                  I agree to the Terms and Conditions and Privacy Policy
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none"
              >
                Create Account
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
