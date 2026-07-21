import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddTutor = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const tutorPayload = {
      tutorName: form.tutorName.value,
      photoURL: form.photoURL.value,
      subject: form.subject.value,
      availableDaysTime: form.availableDaysTime.value,
      hourlyFee: parseFloat(form.hourlyFee.value),
      totalSlot: parseInt(form.totalSlot.value),
      sessionStartDate: form.sessionStartDate.value,
      sessionEndDate: form.sessionEndDate.value,
      institution: form.institution.value,
      experience: form.experience.value,
      location: form.location.value,
      teachingMode: form.teachingMode.value,
      email: user.email || "user@example.com"
    };

    try {
      const res = await axios.post(`${API_URL}/tutors`, tutorPayload);
      if (res.data.success || res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Tutor Added Successfully!',
          timer: 1500
        });
        form.reset();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add tutor'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-3xl mx-auto font-sans">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Add New Tutor</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Tutor Name</label>
            <input type="text" name="tutorName" placeholder="Akash" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
          </div>

          <div>
            <label className="block mb-1">Photo URL</label>
            <input type="url" name="photoURL" placeholder="https://..." className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
          </div>

          <div>
            <label className="block mb-1">Subject / Category</label>
            <select name="subject" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl cursor-pointer" defaultValue="" required>
              <option value="" disabled>Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Web Development">Web Development</option>
              <option value="English Literature">English Literature</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Available Days and Time</label>
            <input type="text" name="availableDaysTime" placeholder="Sun - Fri 6:00 PM - 8:00 PM" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Hourly Fee ($)</label>
              <input type="number" name="hourlyFee" placeholder="70" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
            </div>
            <div>
              <label className="block mb-1">Total Slot</label>
              <input type="number" name="totalSlot" placeholder="1" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Session Start Date</label>
              <input type="date" name="sessionStartDate" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl cursor-pointer" required />
            </div>
            <div>
              <label className="block mb-1">Session End Date / Deadline</label>
              <input type="date" name="sessionEndDate" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl cursor-pointer" required />
            </div>
          </div>

          <div>
            <label className="block mb-1">Institution</label>
            <input type="text" name="institution" placeholder="BST" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
          </div>

          <div>
            <label className="block mb-1">Experience</label>
            <textarea name="experience" placeholder="2 years" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Location (Area/City)</label>
              <input type="text" name="location" placeholder="khulna" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl" required />
            </div>
            <div>
              <label className="block mb-1">Teaching Mode</label>
              <select name="teachingMode" className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl cursor-pointer" defaultValue="" required>
                <option value="" disabled>Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition cursor-pointer mt-4">
            Add Tutor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTutor;