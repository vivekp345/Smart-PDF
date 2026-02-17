import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for UI feedback
  
  const { login, signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading UI

    // Artificial delay for smoother UX if API is too fast (optional, removed for speed)
    // await new Promise(r => setTimeout(r, 500)); 

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await signup(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      navigate('/summary');
      // Don't stop loading here, allows for smooth transition to next page
    } else {
      setError(result.message);
      setIsLoading(false); // Stop loading on error
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    const result = await googleSignIn(credentialResponse.credential);
    if (result.success) {
      navigate('/summary');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#1B1F24]/80 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#9C27B0] to-[#6FFFB0] blur-[2px]" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1B1F24]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#9C27B0]/30 border-t-[#6FFFB0] rounded-full animate-spin mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#6FFFB0]/20 rounded-full blur-md animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </h3>
            <p className="text-sm text-gray-400">Please wait while we verify your credentials.</p>
          </motion.div>
        )}
      </AnimatePresence>

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
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>
        )}

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
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

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
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-[#0f1216] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] hover:from-[#AB47BC] hover:to-[#8E24AA] text-white font-semibold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Google Login Section */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-700 w-full"></div>
          <span className="bg-[#1B1F24] px-3 text-xs text-gray-500 uppercase">Or continue with</span>
          <div className="border-t border-gray-700 w-full"></div>
        </div>

        <div className={`flex justify-center ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google Login Failed');
              setIsLoading(false);
            }}
            theme="filled_black"
            shape="pill"
            text="continue_with"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="ml-2 text-[#6FFFB0] hover:text-[#4ade80] font-medium transition-colors disabled:opacity-50"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;