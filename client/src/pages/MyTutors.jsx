import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Edit2, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyTutors = ({ user }) => {
  const [myTutors, setMyTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTutor, setEditingTutor] = useState(null);

  const fetchMyTutors = () => {
    if (!user?.email) return;
    setLoading(true);
    axios.get(`${API_URL}/tutors?email=${user.email}`)
      .then(res => {
        setMyTutors(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMyTutors();
  }, [user]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Tutor Listing?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/tutors/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Tutor profile removed.', 'success');
            fetchMyTutors();
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete tutor.', 'error');
          });
      }
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/tutors/${editingTutor._id}`, editingTutor);
      Swal.fire('Updated!', 'Tutor profile updated successfully.', 'success');
      setEditingTutor(null);
      fetchMyTutors();
    } catch (err) {
      Swal.fire('Error', 'Failed to update tutor details.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Tutor Listings</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">Manage, update or remove your created tutor profiles.</p>
      </div>

      {myTutors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-black text-slate-800">No Tutor Profiles Created</h3>
          <p className="text-xs text-slate-500 font-medium">Use the "Add Tutor" tab to create your first tutor listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTutors.map(t => (
            <div key={t._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <img src={t.image} alt="" className="w-full h-44 rounded-xl object-cover bg-slate-100 mb-3" />
                <h3 className="text-lg font-black text-slate-900">{t.name}</h3>
                <p className="text-xs font-black text-blue-600">{t.subject || t.language}</p>
                <p className="text-xs text-slate-500 mt-2 font-bold">${t.price}/hr • {t.teachingMode}</p>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setEditingTutor(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer" title="Edit Profile">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer" title="Delete Profile">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ Update Tutor Modal */}
      {editingTutor && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-4 border">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Update Tutor Profile</h3>
              <button onClick={() => setEditingTutor(null)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Subject</label>
                <input type="text" value={editingTutor.subject || ''} onChange={(e) => setEditingTutor({ ...editingTutor, subject: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Price / hr ($)</label>
                  <input type="number" value={editingTutor.price || ''} onChange={(e) => setEditingTutor({ ...editingTutor, price: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Teaching Mode</label>
                  <select value={editingTutor.teachingMode || 'Online'} onChange={(e) => setEditingTutor({ ...editingTutor, teachingMode: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Location</label>
                <input type="text" value={editingTutor.location || ''} onChange={(e) => setEditingTutor({ ...editingTutor, location: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl uppercase tracking-wider transition-all mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTutors;