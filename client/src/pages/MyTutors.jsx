import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyTutors = () => {
  const [myTutors, setMyTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTutor, setEditingTutor] = useState(null);
  const [photoInput, setPhotoInput] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchMyTutors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tutors?email=${user.email || ''}`);
      setMyTutors(res.data || []);
    } catch (error) {
      console.error("Failed to fetch my tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTutors();
  }, []);

  const handleEditClick = (tutor) => {
    setEditingTutor(tutor);
    setPhotoInput(tutor.image || tutor.photoURL || '');
  };

  // Convert File to Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoInput(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${API_URL}/tutors/${id}`);
          if (res.data.success || res.status === 200) {
            Swal.fire('Deleted!', 'Tutor entry has been deleted.', 'success');
            fetchMyTutors();
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Failed to delete tutor', 'error');
        }
      }
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedData = {
      name: form.tutorName.value,
      tutorName: form.tutorName.value,
      image: photoInput,
      photoURL: photoInput,
      language: form.subject.value,
      subject: form.subject.value,
      timeSlot: form.availableDaysTime.value,
      availableDaysTime: form.availableDaysTime.value,
      price: parseFloat(form.hourlyFee.value),
      hourlyFee: parseFloat(form.hourlyFee.value),
      totalSlots: parseInt(form.totalSlot.value),
      totalSlot: parseInt(form.totalSlot.value),
      sessionStartDate: form.sessionStartDate.value,
      sessionEndDate: form.sessionEndDate.value,
      institution: form.institution.value,
      experience: form.experience.value,
      location: form.location.value,
      teachingMode: form.teachingMode.value,
      email: user.email
    };

    try {
      const res = await axios.put(`${API_URL}/tutors/${editingTutor._id}`, updatedData);
      if (res.data.success || res.status === 200) {
        Swal.fire('Success!', 'Tutor details updated successfully!', 'success');
        setEditingTutor(null);
        fetchMyTutors();
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update tutor details', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      <h1 className="text-3xl font-black text-center text-slate-900">My Posted Tutors</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[13px] font-black text-slate-800">
                <th className="py-4 px-4">Tutor ID</th>
                <th className="py-4 px-4">Tutor Name</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Hourly Fee</th>
                <th className="py-4 px-4">Total Slots</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="inline-flex items-center gap-3 text-blue-600 font-bold">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading your posted tutors...
                    </div>
                  </td>
                </tr>
              ) : myTutors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-medium">
                    No tutors posted yet.
                  </td>
                </tr>
              ) : (
                myTutors.map((tutor) => (
                  <tr key={tutor._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{tutor._id}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{tutor.name || tutor.tutorName}</td>
                    <td className="py-3.5 px-4">{tutor.language || tutor.subject}</td>
                    <td className="py-3.5 px-4">${tutor.price || tutor.hourlyFee}/hr</td>
                    <td className="py-3.5 px-4">{tutor.totalSlots ?? tutor.totalSlot ?? 0}</td>
                    <td className="py-3.5 px-4 text-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(tutor)} 
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-black transition cursor-pointer"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => handleDelete(tutor._id)} 
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[11px] font-black transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTutor && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-slate-900">Update Tutor Details</h3>
              <button onClick={() => setEditingTutor(null)} className="text-slate-400 hover:text-slate-600 font-black cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Tutor Name</label>
                <input type="text" name="tutorName" defaultValue={editingTutor.name || editingTutor.tutorName} className="w-full px-3 py-2 border rounded-xl" required />
              </div>

              {/* Photo Input: URL & File Upload */}
              <div className="space-y-2 border p-3 rounded-xl bg-slate-50">
                <label className="block text-slate-900 font-black">Tutor Image (URL or Upload File)</label>
                <input 
                  type="text" 
                  name="photoURL" 
                  value={photoInput} 
                  onChange={(e) => setPhotoInput(e.target.value)} 
                  placeholder="https://... image url" 
                  className="w-full px-3 py-2 bg-white border rounded-xl" 
                />
                
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">OR Upload Device File:</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="text-xs cursor-pointer" 
                  />
                </div>

                {photoInput && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-bold">Image Preview:</span>
                    <img src={photoInput} alt="Preview" className="w-12 h-12 rounded-xl object-cover border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Subject / Category</label>
                <input type="text" name="subject" defaultValue={editingTutor.language || editingTutor.subject} className="w-full px-3 py-2 border rounded-xl" required />
              </div>

              <div>
                <label className="block mb-1">Available Days and Time</label>
                <input type="text" name="availableDaysTime" defaultValue={editingTutor.timeSlot || editingTutor.availableDays} className="w-full px-3 py-2 border rounded-xl" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Hourly Fee ($)</label>
                  <input type="number" name="hourlyFee" defaultValue={editingTutor.price || editingTutor.hourlyFee} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block mb-1">Total Slot</label>
                  <input type="number" name="totalSlot" defaultValue={editingTutor.totalSlots ?? editingTutor.totalSlot ?? 10} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Session Start Date</label>
                  <input type="date" name="sessionStartDate" defaultValue={editingTutor.sessionStartDate ? new Date(editingTutor.sessionStartDate).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block mb-1">Session End Date / Deadline</label>
                  <input type="date" name="sessionEndDate" defaultValue={editingTutor.sessionEndDate ? new Date(editingTutor.sessionEndDate).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
              </div>

              <div>
                <label className="block mb-1">Institution</label>
                <input type="text" name="institution" defaultValue={editingTutor.institution} className="w-full px-3 py-2 border rounded-xl" required />
              </div>

              <div>
                <label className="block mb-1">Experience</label>
                <textarea name="experience" defaultValue={editingTutor.experience || editingTutor.about} className="w-full px-3 py-2 border rounded-xl" required></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Location</label>
                  <input type="text" name="location" defaultValue={editingTutor.location} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block mb-1">Teaching Mode</label>
                  <select name="teachingMode" defaultValue={editingTutor.teachingMode || 'Online'} className="w-full px-3 py-2 border rounded-xl" required>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setEditingTutor(null)} className="px-4 py-2 border rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-black rounded-xl cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTutors;