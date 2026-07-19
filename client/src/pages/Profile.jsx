import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    const profileData = {
      email: user.email,
      name: form.name.value,
      address: form.address.value,
      contact: form.contact.value,
      image: form.image.value,
      hourlyPay: user.role === 'tutor' ? form.hourlyPay.value : '',
      courseType: user.role === 'tutor' ? form.courseType.value : ''
    };

    try {
      const res = await axios.put('http://localhost:5000/users/profile', profileData);
      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        setUser({ ...user, ...profileData });
        Swal.fire('Success', 'Profile dashboard updated successfully!', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">My Profile Dashboard</h2>
        <p className="text-sm text-slate-500 mb-6">Manage and display your identity specifications inside MediQueue.</p>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" defaultValue={user.name || ''} required className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" disabled value={user.email} className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
              <input type="text" name="contact" defaultValue={user.contact || ''} placeholder="+88017..." className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Address Location</label>
              <input type="text" name="address" defaultValue={user.address || ''} placeholder="Dhaka, Bangladesh" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Profile Photo URL</label>
            <input type="url" name="image" defaultValue={user.image || ''} placeholder="https://..." className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
          </div>

          {user.role === 'tutor' && (
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-teal-800 uppercase mb-1">Hourly Pay Scale</label>
                <input type="text" name="hourlyPay" defaultValue={user.hourlyPay || ''} placeholder="e.g. 1500 BDT / Hr" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-black text-teal-800 uppercase mb-1">Course Type Focus</label>
                <input type="text" name="courseType" defaultValue={user.courseType || ''} placeholder="e.g. Language Crash Course" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl cursor-pointer">
            {loading ? 'Saving Parameters...' : 'Save Profile Adjustments'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;