import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget }) => {
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
          Swal.fire('Success', 'Account created! Please Sign In.', 'success');
          setIsSignUp(false);
        }
      } else {
        const res = await axios.post('http://localhost:5000/users/signin', { email, password });
        if (res.data.email) {
          setUser(res.data);
          Swal.fire('Welcome', `Signed in successfully as ${res.data.role}`, 'success');
          
          if (redirectTarget) {
            if (redirectTarget.type === 'tab') {
              setActiveTab(redirectTarget.value);
            } else if (redirectTarget.type === 'book') {
              setActiveTab('find');
            }
            setRedirectTarget(null);
          } else {
            setActiveTab('find');
          }
        }
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Authentication failed', 'error');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" name="email" required className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
          </div>
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Join System As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}
          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-500 mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-teal-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;