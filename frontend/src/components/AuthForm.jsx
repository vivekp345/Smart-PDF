import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, signup, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Switch between Login and Signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await signup(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      navigate('/summary'); // Redirect to dashboard on success
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#1B1F24]/80 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#9C27B0] to-[#6FFFB0] blur-[2px]" />

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 font-poppins">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-[#EAE0D5]/60 text-sm">
          {isLogin
            ? 'Enter your credentials to access your workspace.'
            : 'Start summarizing your PDFs with AI power.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field (Signup Only) */}
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#EAE0D5]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#EAE0D5]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#EAE0D5]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] hover:from-[#AB47BC] hover:to-[#8E24AA] text-white font-semibold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {authLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Toggle Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleMode}
            className="ml-2 text-[#6FFFB0] hover:text-[#4ade80] font-medium transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;