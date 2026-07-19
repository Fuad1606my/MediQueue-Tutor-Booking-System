import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2, Edit, Trash2, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddTutor = ({ user }) => {
  const [myTutors, setMyTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [currency, setCurrency] = useState('BDT');
  const [feeType, setFeeType] = useState('Hourly Rate');
  const [editingTutor, setEditingTutor] = useState(null);

  const fetchMyTutors = () => {
    axios.get(`http://localhost:5000/tutors?email=${user.email}`)
      .then(res => {
        setMyTutors(res.data);
        setListLoading(false);
      });
  };

  useEffect(() => {
    fetchMyTutors();
  }, [user]);

  const handleAddTutor = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    
    const tutorData = {
      name: user.name,
      email: user.email,
      image: user.image || (user.gender === 'female' ? 'https://i.ibb.co.com/zWzH4xG/female-avatar.png' : 'https://i.ibb.co.com/mC384Yx/male-avatar.png'),
      language: form.language.value,
      price: parseFloat(form.price.value),
      currency,
      feeType,
      timeSlot: form.timeSlot.value,
      description: form.description.value
    };

    try {
      if (editingTutor) {
        await axios.put(`http://localhost:5000/tutors/${editingTutor._id}`, tutorData);
        Swal.fire('Updated!', 'Subject criteria adjusted successfully.', 'success');
        setEditingTutor(null);
      } else {
        await axios.post('http://localhost:5000/tutors', { ...tutorData, review: 0 });
        Swal.fire('Published!', 'New subject schedule published successfully.', 'success');
      }
      form.reset();
      fetchMyTutors();
    } catch (error) {
      Swal.fire('Failed', 'Action processing failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTutor = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Remove this subject curriculum schedule?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/tutors/${id}`).then(() => {
          Swal.fire('Removed!', 'Subject itinerary dropped.', 'success');
          fetchMyTutors();
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans space-y-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-8 text-center relative">
          {editingTutor && <button onClick={() => setEditingTutor(null)} className="absolute top-4 right-4 text-white"><X className="w-5 h-5" /></button>}
          <h2 className="text-3xl font-black text-white flex justify-center items-center gap-3"><PlusCircle className="w-8 h-8" /> {editingTutor ? 'Modify Subject Parameters' : 'Deploy New Subject Track'}</h2>
        </div>
        <form onSubmit={handleAddTutor} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">Subject/Topic/Skill</label>
              <input type="text" name="language" placeholder="e.g., English, Full-Stack Web Development" required defaultValue={editingTutor?.language || ''} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">Time Slot Option (AM/PM Zone)</label>
              <input type="text" name="timeSlot" placeholder="e.g., 10:00 AM - 12:00 PM EST" required defaultValue={editingTutor?.timeSlot || ''} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">Costing Tier Setup</label>
              <div className="flex gap-2">
                <select value={feeType} onChange={(e) => setFeeType(e.target.value)} className="w-1/2 p-2.5 border border-slate-300 rounded-xl font-bold bg-white">
                  <option value="Hourly Rate">Hourly Rate</option>
                  <option value="Course Fee">Course Fee</option>
                  <option value="Monthly Fee">Monthly Fee</option>
                  <option value="Day-wise Fee">Day-wise Fee</option>
                </select>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-1/2 p-2.5 border border-slate-300 rounded-xl font-black bg-white">
                  <option value="BDT">৳ BDT</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">Pricing Amount</label>
              <input type="number" name="price" required defaultValue={editingTutor?.price || ''} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">Course Track Description</label>
            <textarea name="description" rows="4" required defaultValue={editingTutor?.description || ''} className="w-full p-4 border border-slate-300 rounded-xl font-bold resize-none"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-white bg-slate-900 hover:bg-teal-600 font-black tracking-wide uppercase shadow-md cursor-pointer">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : editingTutor ? 'Save Subject Update' : 'Publish Course Subject'}
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <h3 className="text-2xl font-black text-slate-900 mb-6">Active Managed Course Tracks</h3>
        {listLoading ? <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" /> : myTutors.length === 0 ? <p className="text-base font-bold text-slate-500 text-center">No active subjects initialized.</p> : (
          <div className="divide-y divide-slate-200">
            {myTutors.map(t => (
              <div key={t._id} className="flex items-center justify-between py-4 font-bold text-slate-800">
                <div>
                  <h4 className="text-lg font-black text-slate-900">{t.language}</h4>
                  <p className="text-sm text-slate-500">{t.timeSlot} • {t.currency === 'BDT' ? '৳' : '$'}{t.price} ({t.feeType})</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingTutor(t); setFeeType(t.feeType); setCurrency(t.currency); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteTutor(t._id)} className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTutor;