import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    if (user?.role === 'student') {
      axios.get(`http://localhost:5000/bookings?studentEmail=${user.email}`).then(res => {
        setEnrolled(res.data.filter(b => b.status === 'accepted'));
      });
    }
  }, [user]);

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
      gender: user.gender,
      hourlyPay: user.role === 'tutor' ? form.hourlyPay.value : '',
      courseType: user.role === 'tutor' ? form.courseType.value : ''
    };

    try {
      await axios.put('http://localhost:5000/users/profile', profileData);
      setUser({ ...user, ...profileData });
      Swal.fire('Success', 'Profile parameters saved successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to adjust parameters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = user.image || (user.gender === 'female' 
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
    : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans space-y-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col md:flex-row gap-6 items-center">
        <img src={currentAvatar} alt="" className="w-32 h-32 rounded-3xl object-cover border-4 border-teal-500 shadow-md bg-slate-100" />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900">{user.name || 'Anonymous Platform Member'}</h2>
          <p className="text-sm font-black text-teal-600 uppercase tracking-widest mt-1">{user.role} Account Hub</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className="block text-sm font-black text-slate-800 mb-1">Full Name</label><input type="text" name="name" defaultValue={user.name || ''} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
            <div><label className="block text-sm font-black text-slate-800 mb-1">Contact Number</label><input type="text" name="contact" defaultValue={user.contact || ''} placeholder="+88017..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
          </div>
          <div><label className="block text-sm font-black text-slate-800 mb-1">Address Location</label><input type="text" name="address" defaultValue={user.address || ''} placeholder="Dhaka, Bangladesh" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
          <div><label className="block text-sm font-black text-slate-800 mb-1">Dashboard Picture URL Link</label><input type="url" name="image" defaultValue={user.image || ''} placeholder="https://..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" /></div>
          
          {user.role === 'tutor' && (
            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-black text-teal-900 uppercase mb-1">Hourly Pay Scale</label><input type="text" name="hourlyPay" defaultValue={user.hourlyPay || ''} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold" /></div>
              <div><label className="block text-xs font-black text-teal-900 uppercase mb-1">Course Focus Core</label><input type="text" name="courseType" defaultValue={user.courseType || ''} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold" /></div>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-xl cursor-pointer uppercase tracking-wider">Save Parameters</button>
        </form>
      </div>

      {user.role === 'student' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-2xl font-black text-slate-900 mb-4">My Enrolled Course Schedules & Routines</h3>
          {enrolled.length === 0 ? <p className="text-sm font-bold text-slate-500">No verified course enrollments detected yet.</p> : (
            <div className="space-y-3">
              {enrolled.map(e => (
                <div key={e._id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex justify-between items-center font-bold">
                  <div>
                    <h4 className="text-base font-black text-slate-900">{e.language} Track</h4>
                    <p className="text-xs text-slate-500">Instructor Email: {e.tutorEmail}</p>
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