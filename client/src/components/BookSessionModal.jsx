import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookSessionModal = ({ tutor, user, onClose, refetch }) => {
  const currentSlots = tutor?.totalSlots ?? tutor?.totalSlot ?? 0;
  const isSlotEmpty = currentSlots <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const bookingPayload = {
      tutorId: tutor._id,
      name: form.name.value,
      phone: form.phone.value,
      tutorName: form.tutorName.value,
      email: form.email.value,
      studentEmail: user?.email || form.email.value
    };

    try {
      const res = await axios.post(`${API_URL}/bookings`, bookingPayload);
      if (res.data.success || res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: 'Session booked successfully.',
          timer: 1500
        });
        if (refetch) refetch();
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Error',
        text: error.response?.data?.message || 'Failed to complete booking'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100 font-sans">
        
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-xl text-slate-900">Book Session</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Available Slots: <span className={`font-bold ${isSlotEmpty ? 'text-red-500' : 'text-blue-600'}`}>{currentSlots} slots left</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold text-slate-700">
          
          <div>
            <label className="block mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={user?.displayName || user?.name || ''} 
              placeholder="Your Name"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl" 
              required 
            />
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              placeholder="017XX-XXXXXX" 
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl" 
              required 
            />
          </div>

          <div>
            <label className="block mb-1">Tutor Name</label>
            <input 
              type="text" 
              name="tutorName" 
              defaultValue={tutor?.name || tutor?.tutorName || ''} 
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl" 
              required 
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={user?.email || ''} 
              placeholder="your@email.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl" 
              required 
            />
          </div>

          {isSlotEmpty && (
            <p className="text-red-500 text-xs text-center font-bold">
              This session is fully booked. No slots available!
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded-xl text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSlotEmpty} 
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl disabled:bg-slate-300"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookSessionModal;