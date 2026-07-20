import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, authMode, setAuthMode }) => {
  const isSignUp = authMode === 'register';

  const [emailInput, setEmailInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [nameInput, setNameInput] = React.useState('');
  const [photoUrl, setPhotoUrl] = React.useState('');

  const hasUpper = /[A-Z]/.test(passwordInput);
  const hasLower = /[a-z]/.test(passwordInput);
  const hasMinLen = passwordInput.length >= 6;

  const handleGoogleSignIn = () => {
    Swal.fire({
      title: 'Google Authentication',
      text: 'Simulating Google OAuth verification...',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      const mockGoogleUser = {
        name: "Verified Google User",
        email: "user.google@mediqueue.edu",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
      };
      setUser(mockGoogleUser);
      Swal.fire('Welcome!', 'Authenticated via Google.', 'success');
      if (redirectTarget) {
        setActiveTab(redirectTarget.value);
        if (setRedirectTarget) setRedirectTarget(null);
      } else {
        setActiveTab('home');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (!hasUpper || !hasLower || !hasMinLen) {
        Swal.fire({
          title: 'Invalid Password',
          text: 'Password must contain at least 6 characters, one uppercase letter, and one lowercase letter.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
        return;
      }

      const userData = { 
        name: nameInput, 
        email: emailInput, 
        password: passwordInput, 
        role: 'student', 
        image: photoUrl || '/male-avatar.jpg' 
      };

      try {
        const res = await axios.post(`${API_URL}/users/signup`, userData);
        if (res.status === 201) {
          Swal.fire('Success', 'Account created! Please sign in.', 'success');
          setAuthMode('login');
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Registration failed', 'error');
      }
    } else {
      try {
        const res = await axios.post(`${API_URL}/users/signin`, { email: emailInput, password: passwordInput });
        if (res.data.email) {
          setUser(res.data);
          Swal.fire('Welcome Back!', 'Logged in successfully.', 'success');
          
          if (redirectTarget) {
            setActiveTab(redirectTarget.value);
            if (setRedirectTarget) setRedirectTarget(null);
          } else {
            setActiveTab('home');
          }
        }
      } catch (err) {
        Swal.fire('Error', 'Invalid email or password credentials.', 'error');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            {isSignUp ? 'Join MediQueue and start learning today' : 'Sign in to your MediQueue account'}
          </p>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-300 hover:bg-slate-50 font-black rounded-xl text-slate-700 text-sm shadow-sm transition-all cursor-pointer hover:border-slate-400"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-4 h-4" /> Continue with Google
        </button>

        <div className="relative flex py-1 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3">or {isSignUp ? 'register' : 'continue'} with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Full Name</label>
              <input type="text" value={nameInput} onChange={(e)=>setNameInput(e.target.value)} required placeholder="Your full name" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">Email</label>
            <input type="email" value={emailInput} onChange={(e)=>setEmailInput(e.target.value)} required placeholder="you@email.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500" />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Photo URL <span className="text-slate-400">(optional)</span></label>
              <input type="url" value={photoUrl} onChange={(e)=>setPhotoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-black text-slate-800">Password</label>
              {!isSignUp && <button type="button" className="text-[11px] font-black text-blue-600 hover:underline">Forgot password?</button>}
            </div>
            <input type="password" value={passwordInput} onChange={(e)=>setPasswordInput(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:border-blue-500" />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border">
              <div className="flex items-center gap-1.5"><input type="checkbox" checked={hasMinLen} readOnly className="accent-blue-600" /> At least 6 chars</div>
              <div className="flex items-center gap-1.5"><input type="checkbox" checked={hasUpper} readOnly className="accent-blue-600" /> Uppercase letter</div>
              <div className="flex items-center gap-1.5"><input type="checkbox" checked={hasLower} readOnly className="accent-blue-600" /> Lowercase letter</div>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase rounded-xl tracking-wider shadow cursor-pointer transition-all">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs font-bold text-slate-600 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button" 
            onClick={() => setAuthMode(isSignUp ? 'login' : 'register')} 
            className="text-blue-600 font-black hover:underline bg-transparent cursor-pointer"
          >
            {isSignUp ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;