import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddTutor = ({ user, setActiveTab }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: 'Mathematics',
    price: '',
    teachingMode: 'Online',
    institution: '',
    experience: '',
    location: '',
    availableDays: 'Mon – Fri',
    timeSlot: '4:00 PM – 8:00 PM',
    totalSlots: '8',
    image: '',
    about: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      totalSlots: Number(formData.totalSlots),
      reviews: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500'
    };

    try {
      await axios.post('http://localhost:5000/tutors', payload);
      Swal.fire({
        title: 'Tutor Added!',
        text: 'Your tutoring profile has been published successfully.',
        icon: 'success',
        confirmButtonColor: '#2563EB'
      });
      setActiveTab('find');
    } catch (err) {
      Swal.fire('Error', 'Failed to add tutor profile.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Add New Tutor Profile</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">Fill out the details to offer your tutoring services on MediQueue.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} readOnly className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Subject</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer">
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English Literature">English Literature</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="Web Development">Web Development</option>
                <option value="Graphics Design">Graphics Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Price Per Hour ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 45" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Teaching Mode</label>
              <select name="teachingMode" value={formData.teachingMode} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Institution</label>
              <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. MIT / Harvard" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 years" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Boston, MA" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">About Tutor</label>
            <textarea name="about" rows="3" value={formData.about} onChange={handleChange} placeholder="Brief description of teaching background and qualifications..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"></textarea>
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase rounded-xl tracking-wider shadow-md transition-all cursor-pointer">
            Publish Tutor Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTutor;