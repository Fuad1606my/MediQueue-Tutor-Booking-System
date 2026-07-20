import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddTutor = ({ user, setActiveTab }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const tutorData = {
      name: form.name.value,
      email: user.email,
      image: form.image.value,
      language: form.subject.value,
      price: parseFloat(form.price.value),
      timeSlot: form.timeSlot.value,
      teachingMode: form.teachingMode.value,
      experience: form.experience.value,
      location: form.location.value
    };

    try {
      await axios.post('http://localhost:5000/tutors', tutorData);
      Swal.fire('Published!', 'Tutor profile published successfully!', 'success');
      setActiveTab('find');
    } catch (err) {
      Swal.fire('Error', 'Failed to publish profile', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 max-w-2xl mx-auto font-sans">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Add Tutor Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-black">Tutor Name</label><input type="text" name="name" defaultValue={user?.name || ''} required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
            <div><label className="text-xs font-black">Subject / Category</label><input type="text" name="subject" placeholder="Mathematics, Physics" required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-black">Photo URL</label><input type="url" name="image" placeholder="https://..." required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
            <div><label className="text-xs font-black">Hourly Fee ($)</label><input type="number" name="price" placeholder="45" required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-black">Available Time Slot</label><input type="text" name="timeSlot" placeholder="Mon - Fri, 5:00 PM" required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
            <div><label className="text-xs font-black">Teaching Mode</label>
              <select name="teachingMode" className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-black">Location</label><input type="text" name="location" placeholder="Boston, MA" required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
            <div><label className="text-xs font-black">Experience</label><input type="text" name="experience" placeholder="5+ Years" required className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-bold mt-1" /></div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 cursor-pointer shadow">
            Publish Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTutor;