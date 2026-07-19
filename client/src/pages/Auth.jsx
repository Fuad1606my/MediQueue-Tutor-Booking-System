import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, fallbackTab }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState('male');
  const [role, setRole] = useState('student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // ইমেলের প্রথম ২/৩টি ক্যারেক্টার মিললে লোকাল ডেটা পুট করার মেকানিজম
  useEffect(() => {
    if (!isSignUp && emailInput.length >= 2) {
      const savedCredentials = localStorage.getItem('mediqueue_vault');
      if (savedCredentials) {
        const { email, password } = JSON.parse(savedCredentials);
        if (email.toLowerCase().startsWith(emailInput.toLowerCase())) {
          setEmailInput(email);
          setPasswordInput(password);
        }
      }
    }
  }, [emailInput, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = isSignUp ? form.name.value : '';
    
    let defaultAvatar = gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg';
    const userData = { name, email, password, role, gender, image: defaultAvatar };

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:5000/users/signup', userData);
        if (res.status === 201) {
          Swal.fire({
            title: 'Remember Password?',
            text: "Would you like to securely store credentials on this local device?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0D9488',
            confirmButtonText: 'Yes, Save Securely',
            cancelButtonText: 'No, Cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem('mediqueue_vault', JSON.stringify({ email, password }));
            }
            setIsSignUp(false);
          });
        }
      } else {
        const res = await axios.post('http://localhost:5000/users/signin', { email: emailInput, password: passwordInput });
        if (res.data.email) {
          setUser(res.data);
          Swal.fire('Welcome', `Successfully authenticated!`, 'success');
          
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
      Swal.fire('Error', error.response?.data?.message || 'Authentication error', 'error');
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
                <input type="text" name="name" required autoComplete="off" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
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
            <input 
              type="email" 
              name="email" 
              required 
              autoComplete="off"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              autoComplete="off"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" 
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1">Join Platform As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-3.5 bg-teal-600 text-white font-black rounded-xl shadow-md cursor-pointer text-base uppercase tracking-wider mt-2">
            {isSignUp ? 'Register Account' : 'Authenticate Credentials'}
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