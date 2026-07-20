import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, fallbackTab, customRole }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState('male');
  const [role, setRole] = useState(customRole || 'student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // ডাইনামিক টাইপ পরিবর্তনের জন্য রিয়েক্ট স্টেট
  const [emailFieldType, setEmailFieldType] = useState('text');
  const [passFieldType, setPasswordFieldType] = useState('text');

  // পেজ লোড বা টগল করার সময় ইনপুট ভ্যালু একদম ব্লাঙ্ক বা ফাঁকা রাখা নিশ্চিত করার জন্য
  useEffect(() => {
    setEmailInput('');
    setPasswordInput('');
    setEmailFieldType('text');
    setPasswordFieldType('text');
  }, [isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let defaultAvatar = gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg';
    const userData = { 
      name: e.target.name?.value || '', 
      email: emailInput, 
      password: passwordInput, 
      role, 
      gender, 
      image: defaultAvatar 
    };

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:5000/users/signup', userData);
        if (res.status === 201) {
          Swal.fire({
            title: 'Account Registered!',
            text: 'Please sign in with your secure parameters.',
            icon: 'success',
            confirmButtonColor: '#0D9488'
          });
          setIsSignUp(false);
        }
      } else {
        const res = await axios.post('http://localhost:5000/users/signin', { email: emailInput, password: passwordInput });
        if (res.data.email) {
          setUser(res.data);
          Swal.fire('Welcome Back!', `Logged in successfully!`, 'success');
          
          if (redirectTarget) {
            if (redirectTarget.type === 'tab') setActiveTab(redirectTarget.value);
            if (redirectTarget.type === 'book') setActiveTab('find');
            setRedirectTarget(null);
          } else if (fallbackTab) {
            setActiveTab(fallbackTab);
          } else {
            setActiveTab('find');
          }
        }
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Authentication parameters invalid.', 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-6">
          {isSignUp ? 'Create Premium Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-black text-slate-800 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-800 mb-1">Gender Specification</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Email Address</label>
            {/* ডাইনামিকলি অন-ফোকাস টাইপ মিউটেশন ট্রিক */}
            <input 
              type={emailFieldType}
              name="mediqueue_secure_user_field" 
              required 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onFocus={() => setEmailFieldType('email')}
              placeholder="Enter your email address"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:border-teal-500 focus:outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Password</label>
            {/* ডাইনামিকলি অন-ফোকাস টাইপ মিউটেশন ট্রিক */}
            <input 
              type={passFieldType}
              name="mediqueue_secure_pass_field" 
              required 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onFocus={() => setPasswordFieldType('password')}
              placeholder="Enter your password"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:border-teal-500 focus:outline-none transition-all" 
            />
          </div>

          {isSignUp && !customRole && (
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1">Join Platform As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-md cursor-pointer text-base uppercase tracking-wider mt-4 transition-all">
            {isSignUp ? 'Register Account' : 'LOG IN'}
          </button>
        </form>
        <p className="text-sm text-center font-bold text-slate-600 mt-5">
          {isSignUp ? 'Already registered?' : 'New to MediQueue?'}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-teal-600 font-black hover:underline bg-transparent border-none cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;