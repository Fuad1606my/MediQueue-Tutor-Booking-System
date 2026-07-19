import React, { useState, useEffect } from 'react';
import { User, Mail, Image, Globe, PlusCircle, Loader2, Upload, Edit, Trash2, BookOpen, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddTutor = () => {
  const [myTutors, setMyTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [imageType, setImageType] = useState('url');
  const [imagePreview, setImagePreview] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [feeType, setFeeType] = useState('Hourly Rate');
  const [editingTutor, setEditingTutor] = useState(null);

  const fetchMyTutors = () => {
    axios.get('http://localhost:5000/tutors')
      .then(res => {
        setMyTutors(res.data);
        setListLoading(false);
      })
      .catch(error => {
        console.error(error);
        setListLoading(false);
      });
  };

  useEffect(() => {
    fetchMyTutors();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTutor = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const language = form.language.value;
    const price = form.price.value;
    const description = form.description.value;
    const finalImage = imageType === 'url' ? form.imageUrl.value : imagePreview;

    if (!finalImage) {
      Swal.fire({ title: 'Error', text: 'Please provide an image.', icon: 'error' });
      setLoading(false);
      return;
    }

    const tutorData = { name, email, image: finalImage, language, price: parseFloat(price), currency, feeType, description };

    try {
      if (editingTutor) {
        const res = await axios.put(`http://localhost:5000/tutors/${editingTutor._id}`, tutorData);
        if (res.data.modifiedCount > 0) {
          Swal.fire('Updated!', 'Tutor profile updated successfully.', 'success');
          setEditingTutor(null);
        }
      } else {
        const res = await axios.post('http://localhost:5000/tutors', { ...tutorData, review: 0 });
        if (res.data.insertedId) {
          Swal.fire('Success!', 'New tutor profile published.', 'success');
        }
      }
      form.reset();
      setImagePreview('');
      fetchMyTutors();
    } catch (error) {
      console.error(error);
      Swal.fire('Failed', 'Connection error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tutor) => {
    setEditingTutor(tutor);
    setImageType('url');
    setImagePreview(tutor.image);
    setCurrency(tutor.currency || 'BDT');
    setFeeType(tutor.feeType || 'Hourly Rate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTutor = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This profile will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/tutors/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire('Deleted!', 'Profile has been removed.', 'success');
              fetchMyTutors();
            }
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans space-y-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-8 text-center sm:px-12 relative">
          {editingTutor && (
            <button onClick={() => { setEditingTutor(null); setImagePreview(''); }} className="absolute top-4 right-4 text-white hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-3xl font-extrabold text-white flex justify-center items-center gap-3">
            <PlusCircle className="w-8 h-8" /> {editingTutor ? 'Update Tutor Profile' : 'Become a Premium Tutor'}
          </h2>
        </div>

        <form onSubmit={handleAddTutor} className="p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input type="text" name="name" required defaultValue={editingTutor?.name || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" name="email" required defaultValue={editingTutor?.email || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
              <input type="text" name="language" required defaultValue={editingTutor?.language || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Costing Strategy</label>
              <div className="flex gap-2">
                <select value={feeType} onChange={(e) => setFeeType(e.target.value)} className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option value="Hourly Rate">Hourly Rate</option>
                  <option value="Course Fee">Course Fee</option>
                </select>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                  <option value="BDT">৳ BDT</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
            <input type="number" name="price" required defaultValue={editingTutor?.price || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Image Source</label>
              <div className="flex bg-slate-200 rounded-lg p-0.5 text-xs font-bold">
                <button type="button" onClick={() => setImageType('url')} className={`px-3 py-1 rounded-md ${imageType === 'url' ? 'bg-white text-teal-600' : ''}`}>URL</button>
                <button type="button" onClick={() => setImageType('file')} className={`px-3 py-1 rounded-md ${imageType === 'file' ? 'bg-white text-teal-600' : ''}`}>File</button>
              </div>
            </div>
            {imageType === 'url' ? (
              <input type="url" name="imageUrl" defaultValue={editingTutor?.image || ''} onChange={(e) => setImagePreview(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl" />
            ) : (
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="w-full" />
            )}
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-teal-500" />}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bio & Description</label>
            <textarea name="description" rows="4" required defaultValue={editingTutor?.description || ''} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-teal-600 to-cyan-600 font-bold cursor-pointer">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : editingTutor ? 'Update Profile' : 'Publish Profile'}
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Registered Tutors</h3>
        {listLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
        ) : myTutors.length === 0 ? (
          <p className="text-sm text-slate-500 text-center">No tutors registered yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {myTutors.map(tutor => (
              <div key={tutor._id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <img src={tutor.image} alt="" className="w-12 h-12 object-cover rounded-xl" onError={(e) => {e.target.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}} />
                  <div>
                    <h4 className="font-bold text-slate-800">{tutor.name}</h4>
                    <p className="text-xs text-slate-500">{tutor.language} • {tutor.currency === 'BDT' ? '৳' : '$'}{tutor.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(tutor)} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteTutor(tutor._id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
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