import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, fallbackTab, customRole }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState('male');
  const [role, setRole] = useState(customRole || 'student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // কাস্টম ডিভাইস ম্যাচিং সাজেশন জেনারেটর
  useEffect(() => {
    if (!isSignUp && emailInput.length >= 2) {
      const savedVault = localStorage.getItem('mediqueue_vault_list');
      if (savedVault) {
        const accounts = JSON.parse(savedVault);
        const matched = accounts.filter(acc => 
          acc.email.toLowerCase().includes(emailInput.toLowerCase())
        );
        setSuggestions(matched);
      }
    } else {
      setSuggestions([]);
    }
  }, [emailInput, isSignUp]);

  const handleSelectSuggestion = (acc) => {
    setEmailInput(acc.email);
    setPasswordInput(acc.password);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let defaultAvatar = gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg';
    const userData = { name: e.target.name?.value || '', email: emailInput, password: passwordInput, role, gender, image: defaultAvatar };

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:5000/users/signup', userData);
        if (res.status === 201) {
          Swal.fire({
            title: 'Secure Credentials?',
            text: "Save account parameters on this local device vault?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0D9488',
            confirmButtonText: 'Yes, Save'
          }).then((result) => {
            if (result.isConfirmed) {
              const currentVault = JSON.parse(localStorage.getItem('mediqueue_vault_list') || '[]');
              if(!currentVault.some(v => v.email.toLowerCase() === emailInput.toLowerCase())) {
                currentVault.push({ email: emailInput, password: passwordInput });
                localStorage.setItem('mediqueue_vault_list', JSON.stringify(currentVault));
              }
            }
            setIsSignUp(false);
          });
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
                <input type="text" name="name" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
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
          
          <div className="relative">
            <label className="block text-sm font-black text-slate-800 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" 
            />
            {/* ডাইনামিক ফিল্টার্ড সাজেশন ওভারলে */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border border-slate-300 rounded-xl shadow-lg mt-1 z-50 overflow-hidden divide-y">
                {suggestions.map((acc, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleSelectSuggestion(acc)}
                    className="p-3 text-sm font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    {acc.email}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" 
            />
          </div>

          {/* কন্ডিশনাল ড্রপডাউন ফিল্টারিং: Become Tutor থেকে আসলে Role Selection অপশন থাকবে না */}
          {isSignUp && !customRole && (
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1">Join Platform As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-3.5 bg-teal-600 text-white font-black rounded-xl shadow-md cursor-pointer text-base uppercase tracking-wider mt-4">
            {isSignUp ? 'Register Account' : 'Log in'}
          </button>
        </form>
        <p className="text-sm text-center font-bold text-slate-600 mt-5">
          {isSignUp ? 'Already registered?' : 'New to MediQueue?'}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setSuggestions([]); }} className="text-teal-600 font-black hover:underline bg-transparent border-none cursor-pointer">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;