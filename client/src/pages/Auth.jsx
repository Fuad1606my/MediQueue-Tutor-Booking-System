import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Auth = ({ setUser, setActiveTab, redirectTarget, setRedirectTarget, fallbackTab, customRole }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [gender, setGender] = useState('male');
  const [role, setRole] = useState(customRole || 'student');
  const [imagePreview, setImagePreview] = useState('');
  const [imageType, setImageType] = useState('url');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = isSignUp ? form.name.value : '';
    
    let defaultAvatar = gender === 'female' 
      ? 'https://i.ibb.co.com/zWzH4xG/female-avatar.png' 
      : 'https://i.ibb.co.com/mC384Yx/male-avatar.png';
      
    let image = isSignUp ? (imageType === 'url' ? form.imageUrl?.value : imagePreview) : '';
    if (isSignUp && !image) image = defaultAvatar;

    if (isSignUp && role === 'tutor' && !image) {
      Swal.fire('Required', 'Tutor profiles must contain a valid display image.', 'error');
      return;
    }

    const userData = { name, email, password, role, gender, image };

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:5000/users/signup', userData);
        if (res.status === 201) {
          Swal.fire('Success', 'Account registered! Please sign in.', 'success');
          setIsSignUp(false);
        }
      } else {
        const res = await axios.post('http://localhost:5000/users/signin', { email, password });
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Email Address</label>
            <input type="email" name="email" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
          </div>

          {/* সাইন-আপ করার সময় "Join Platform As" ড্রপডাউনটি এখন সবসময় গ্লোবালি সচল থাকবে */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1">Join Platform As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800">
                <option value="student">Student (Want to learn)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>
          )}

          {isSignUp && role === 'tutor' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase">Tutor Avatar Source</label>
              <div className="flex bg-slate-200 rounded-lg p-0.5 text-xs font-bold mb-2">
                <button type="button" onClick={() => setImageType('url')} className={`w-1/2 py-1 rounded-md ${imageType === 'url' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600'}`}>Web URL</button>
                <button type="button" onClick={() => setImageType('file')} className={`w-1/2 py-1 rounded-md ${imageType === 'file' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600'}`}>Upload File</button>
              </div>
              {imageType === 'url' ? (
                <input type="url" name="imageUrl" placeholder="Image URL link..." className="w-full px-3 py-2 border text-sm rounded-xl" />
              ) : (
                <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
              )}
              {imagePreview && <img src={imagePreview} alt="" className="w-14 h-14 object-cover rounded-xl mt-2 border border-teal-500" />}
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