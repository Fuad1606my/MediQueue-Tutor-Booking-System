import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, fallbackTab }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = isSignUp ? form.name.value : '';

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:5000/users/signup', { name, email, password, role });
        if (res.status === 201) {
          Swal.fire('Account Created!', 'Please sign in with your credentials.', 'success');
          setIsSignUp(false);
        }
      } else {
        const res = await axios.post('http://localhost:5000/users/signin', { email, password });
        if (res.data && res.data.email) {
          setUser(res.data);
          Swal.fire({
            title: 'Welcome Back!',
            text: `Successfully logged in as ${res.data.role}.`,
            icon: 'success',
            confirmButtonColor: '#0D9488'
          });

          if (redirectTarget) {
            if (redirectTarget.type === 'tab') {
              setActiveTab(redirectTarget.value);
            } else if (redirectTarget.type === 'book') {
              setActiveTab('find');
            }
            setRedirectTarget(null);
          } else if (fallbackTab) {
            setActiveTab(fallbackTab);
          } else {
            setActiveTab('find');
          }
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Authentication Failed',
        text: error.response?.data?.message || 'Invalid parameters specified.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-6">
          {isSignUp ? 'Create Premium Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" name="email" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
          </div>
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Join Platform As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}
          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl cursor-pointer shadow-md mt-2">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-600 mt-4 font-semibold">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-teal-600 font-black hover:underline bg-transparent border-none cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;