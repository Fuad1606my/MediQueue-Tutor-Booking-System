import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Camera, X, RefreshCw } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState([]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.image || '');

  useEffect(() => {
    if (user?.role === 'student') {
      axios.get(`http://localhost:5000/bookings?studentEmail=${user.email}`).then(res => {
        setEnrolled(res.data.filter(b => b.status === 'accepted'));
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      Swal.fire('Error', 'Please choose a valid local image file first.', 'error');
      return;
    }
    updateProfileDatabase({ ...user, image: imagePreview });
    setIsAvatarModalOpen(false);
  };

  const handleAvatarDelete = () => {
    let defaultAvatar = user.gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg';
    setImagePreview(defaultAvatar);
    updateProfileDatabase({ ...user, image: defaultAvatar });
    setIsAvatarModalOpen(false);
  };

  const updateProfileDatabase = async (updatedFields) => {
    try {
      await axios.put('http://localhost:5000/users/profile', updatedFields);
      setUser(updatedFields);
      Swal.fire('Success', 'Profile avatar adjustment synchronized!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Sync error occurred.', 'error');
    }
  };

  const handleGeneralProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    const profileData = {
      ...user,
      name: form.name.value,
      address: form.address.value,
      contact: form.contact.value,
      description: form.description.value,
      hourlyPay: user.role === 'tutor' ? form.hourlyPay.value : '',
      courseType: user.role === 'tutor' ? form.courseType.value : ''
    };

    try {
      await axios.put('http://localhost:5000/users/profile', profileData);
      setUser(profileData);
      Swal.fire('Success', 'Profile parameters saved!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Update processing failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = user.image || (user.gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans space-y-8">
      {/* Profile Header Header Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative group cursor-pointer" onClick={() => { setImagePreview(currentAvatar); setIsAvatarModalOpen(true); }}>
          <img src={currentAvatar} alt="" className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-md group-hover:opacity-80 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-all">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900">{user.name || 'Platform Member'}</h2>
          <p className="text-sm font-black text-teal-600 uppercase tracking-widest mt-1">Profile Dashboard Hub</p>
        </div>
      </div>

      {/* Main Account Info Roster */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <form onSubmit={handleGeneralProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className="block text-sm font-black text-slate-800 mb-1">Full Name</label><input type="text" name="name" defaultValue={user.name || ''} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
            <div><label className="block text-sm font-black text-slate-800 mb-1">Contact Number</label><input type="text" name="contact" defaultValue={user.contact || ''} placeholder="+88017..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
          </div>
          <div><label className="block text-sm font-black text-slate-800 mb-1">Address Location</label><input type="text" name="address" defaultValue={user.address || ''} placeholder="Dhaka, Bangladesh" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
          
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">Short Biography / Personal Description</label>
            <textarea name="description" rows="3" defaultValue={user.description || ''} placeholder="Tell us something about your expertise or targets..." className="w-full p-4 border border-slate-300 rounded-xl font-bold resize-none"></textarea>
          </div>

          {user.role === 'tutor' && (
            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-black text-teal-900 uppercase mb-1">Hourly Pay Scale</label><input type="text" name="hourlyPay" defaultValue={user.hourlyPay || ''} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold" /></div>
              <div><label className="block text-xs font-black text-teal-900 uppercase mb-1">Course Focus Core</label><input type="text" name="courseType" defaultValue={user.courseType || ''} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold" /></div>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-xl cursor-pointer uppercase tracking-wider">Save Parameters</button>
        </form>
      </div>

      {/* --- পিওর ডিভাইস আপলোডার ম্যানেজার পপ-আপ মডাল --- */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-slate-900 relative space-y-6">
            <button onClick={() => setIsAvatarModalOpen(false)} className="absolute top-4 right-4 bg-slate-100 p-1.5 rounded-full border border-slate-300 cursor-pointer text-slate-600 hover:text-black">
              <X className="w-5 h-5 stroke-[3]" />
            </button>
            <h3 className="text-xl font-black text-slate-900">Manage Display Avatar</h3>
            
            <div className="flex justify-center bg-slate-50 p-4 rounded-2xl border shadow-inner relative">
              <img src={imagePreview} alt="Preview Avatar" className="w-44 h-44 rounded-full object-cover border-4 border-teal-500 shadow-md bg-white" />
            </div>

            <form onSubmit={handleAvatarUpdateSubmit} className="space-y-4">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center hover:border-teal-500 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                />
                <p className="text-sm font-black text-slate-700">Click to Select Local Image File</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPEG, PNG up to 10MB</p>
              </div>
              
              <div className="flex gap-2">
                <button type="button" onClick={handleAvatarDelete} className="w-1/2 py-2.5 bg-red-100 border border-red-200 text-red-600 font-black text-sm rounded-xl cursor-pointer shadow-sm">
                  Reset Default
                </button>
                <button type="submit" className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-sm shadow cursor-pointer uppercase tracking-wider flex justify-center items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Save Picture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {user.role === 'student' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-2xl font-black text-slate-900 mb-4">My Enrolled Course Schedules & Routines</h3>
          {enrolled.length === 0 ? <p className="text-sm font-bold text-slate-500">No verified course enrollments detected yet.</p> : (
            <div className="space-y-3">
              {enrolled.map(e => (
                <div key={e._id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex justify-between items-center font-bold">
                  <div>
                    <h4 className="text-base font-black text-slate-900">{e.language} Track</h4>
                    <p className="text-xs text-slate-500">Instructor: {e.tutorName} ({e.tutorEmail})</p>
                  </div>
                  <span className="px-3 py-1 bg-teal-600 text-white text-xs font-black rounded-xl">{e.timeSlot}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;