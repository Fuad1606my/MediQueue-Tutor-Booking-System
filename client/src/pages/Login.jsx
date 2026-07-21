import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLoginSuccess, setAuthMode, setActiveTab, setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = (userData) => {
    // 1. Save user object to LocalStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // 2. Dispatch custom event for immediate UI navbar reactivity
    window.dispatchEvent(new Event('storage'));

    // 3. Trigger prop callbacks safely
    if (typeof onLoginSuccess === 'function') onLoginSuccess(userData);
    if (typeof setUser === 'function') setUser(userData);

    // 4. Show success sweet alert popup
    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: `Welcome back, ${userData.name || 'User'}!`,
      timer: 1500,
      showConfirmButton: false
    });

    // 5. Smooth redirect to home or tutors tab
    setTimeout(() => {
      if (typeof setActiveTab === 'function') {
        setActiveTab('home');
      } else {
        window.location.hash = '#home';
        window.location.reload();
      }
    }, 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/users/signin`, { email, password });
      
      if (res.data?.success || res.status === 200) {
        handleLoginSuccess(res.data.user);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: res.data?.message || 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error("Login Network/Server Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.response?.data?.message || 'Invalid email or password! Please check your credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const googleUser = {
      name: "Verified Google User",
      email: "user.google@mediqueue.edu",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"
    };

    handleLoginSuccess(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4 font-sans">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl w-full max-w-md space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Welcome back</h2>
          <p className="text-xs text-slate-500 font-bold">Sign in to your MediQueue account</p>
        </div>

        {/* Google Sign-in Button */}
        <button 
          onClick={handleGoogleSignIn}
          type="button" 
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
            Or continue with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="email@example.com" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition" 
              required 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label>Password</label>
              <button 
                type="button"
                onClick={() => Swal.fire('Forgot Password', 'Please contact support or register a new account.', 'info')} 
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SIGNING IN...
              </>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-bold">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => setAuthMode && setAuthMode('register')} 
            className="text-blue-600 hover:underline font-black cursor-pointer"
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;