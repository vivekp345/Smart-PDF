import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, signup as signupApi, logout as logoutApi, googleLoginApi } from '../api/authApi';

const AuthContext = createContext();

// Custom hook to use the AuthContext easily
export const useAuth = () => {
  return useContext(AuthContext);
};



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Local Storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- Actions ---

  const login = async (email, password) => {
    try {
      const data = await loginApi({ email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data)); // Save non-sensitive info
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const googleSignIn = async (token) => {
    try {
      const data = await googleLoginApi(token);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Google Login failed' 
      };
    }
  };


  const signup = async (name, email, password) => {
    try {
      const data = await signupApi({ name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await logoutApi(); // Clears cookie on backend
      setUser(null);
      localStorage.removeItem('userInfo'); // Clears info on frontend
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};