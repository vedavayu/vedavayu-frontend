// src/components/Login.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../Api/api';
import { User } from '../App';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginProps {
  onLogin: (data: { token: string; user: User }) => void;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    document.title = 'Login | Vedavayu';
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) setFormData(f => ({ ...f, email: saved, rememberMe: true }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Verify storage
      console.log('Stored token:', localStorage.getItem('token'));

      // Ensure the user has a name property as required by User type
      const userWithRequiredName: User = {
        ...user,
        name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email.split('@')[0]
      };

      // Call parent login handler
      onLogin({ token, user: userWithRequiredName });

      // Handle remember me functionality - use if statement to avoid unused expression
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/');

    } catch (err: unknown) {
      console.error('Login failed:', err);
      // Type guard to check if the error has the expected structure
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { status?: number } };
        alert(
          apiError.response?.status === 401
            ? 'Invalid email or password'
            : 'Login failed – please try again'
        );
      } else {
        alert('Login failed – please try again');
      }
    }
  };

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <h1 className="text-2xl font-bold text-primary-800 text-center">
              Welcome Back to Vedavayu
            </h1>
            <p className="text-neutral-600 text-center mb-8">
              Sign in to access your account
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
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
              </div>
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-neutral-700">
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none"
              >
                Sign In
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;