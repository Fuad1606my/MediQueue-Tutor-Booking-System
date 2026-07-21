import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, GraduationCap, Briefcase, Users, Copy, Check } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TutorDetails = ({ tutor, user, onBack, setActiveTab, setAuthMode }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentSlots = tutor?.totalSlots ?? tutor?.totalSlot ?? 0;
  const isSlotEmpty = currentSlots <= 0;
  const isExpired = tutor?.sessionEndDate && new Date(tutor.sessionEndDate) < new Date();

  const handleOpenBooking = () => {
    const activeUser = user || JSON.parse(localStorage.getItem('mediqueue_session')) || JSON.parse(localStorage.getItem('user'));
    if (!activeUser || !activeUser.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You must login first to book a session!',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        if (setAuthMode) setAuthMode('login');
        if (setActiveTab) setActiveTab('auth');
      });
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Active Logged-in User Account
    const activeUser = user || JSON.parse(localStorage.getItem('mediqueue_session')) || JSON.parse(localStorage.getItem('user')) || {};

    const inputEmail = form.email.value.trim().toLowerCase();
    const loggedInAccountEmail = (activeUser.email || inputEmail).trim().toLowerCase();

    const bookingPayload = {
      tutorId: tutor._id,
      name: form.name.value,
      phone: form.phone.value,
      tutorName: tutor.name || tutor.tutorName,
      email: inputEmail,               // Custom input email
      studentEmail: inputEmail,        // Custom input email
      accountEmail: loggedInAccountEmail // MAIN LOGGED IN ACCOUNT EMAIL
    };

    try {
      const res = await axios.post(`${API_URL}/bookings`, bookingPayload);
      if (res.data.success || res.status === 201) {
        setShowBookingModal(false);
        setConfirmedBooking({
          token: res.data.bookingId || res.data.result?.insertedId || 'TOKEN-' + Math.random().toString(36).substr(2, 9),
          tutorName: tutor.name || tutor.tutorName,
          studentName: form.name.value
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Error',
        text: error.response?.data?.message || 'Failed to complete booking'
      });
    }
  };

  const handleCopyToken = () => {
    if (confirmedBooking?.token) {
      navigator.clipboard.writeText(confirmedBooking.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDoneBooking = () => {
    setConfirmedBooking(null);
    if (setActiveTab) setActiveTab('bookings');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 max-w-5xl mx-auto font-sans space-y-6">
      
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tutors
      </button>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-8">
        
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img 
              src={tutor.image || tutor.photoURL} 
              alt={tutor.name || tutor.tutorName} 
              className="w-32 h-32 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500'; }}
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900">{tutor.name || tutor.tutorName}</h1>
              <p className="text-xs font-bold text-blue-600 mt-0.5">{tutor.subject || tutor.language}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200">
                Mode: {tutor.teachingMode || 'Online'}
              </span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-3">
            <p className="text-3xl font-black text-slate-900">${tutor.price || tutor.hourlyFee}<span className="text-xs font-bold text-slate-400">/hr</span></p>
            <button 
              onClick={handleOpenBooking} 
              disabled={isSlotEmpty || isExpired}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer disabled:cursor-not-allowed"
            >
              {isSlotEmpty ? "Fully Booked" : isExpired ? "Deadline Expired" : "Book Session"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><GraduationCap className="w-3.5 h-3.5" /> Institution</p>
            <p className="text-xs font-black text-slate-800 truncate">{tutor.institution || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Briefcase className="w-3.5 h-3.5" /> Experience</p>
            <p className="text-xs font-black text-slate-800 truncate">{tutor.experience || tutor.about || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><MapPin className="w-3.5 h-3.5" /> Location</p>
            <p className="text-xs font-black text-slate-800 truncate">{tutor.location || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Users className="w-3.5 h-3.5" /> Total Slots</p>
            <p className={`text-xs font-black ${isSlotEmpty ? 'text-red-500' : 'text-blue-600'}`}>{currentSlots} available</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Clock className="w-3.5 h-3.5" /> Time Slot</p>
            <p className="text-xs font-black text-slate-800 truncate">{tutor.timeSlot || tutor.availableDaysTime || 'Sun - Thu 5:00 PM'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Calendar className="w-3.5 h-3.5" /> Session Start</p>
            <p className="text-xs font-black text-slate-800">{tutor.sessionStartDate ? new Date(tutor.sessionStartDate).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 col-span-2">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Calendar className="w-3.5 h-3.5" /> Session End / Deadline</p>
            <p className="text-xs font-black text-slate-800">{tutor.sessionEndDate ? new Date(tutor.sessionEndDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-black text-slate-900">About & Teaching Experience</h3>
          <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {tutor.experience || tutor.about || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100 font-sans">
            
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Book Session</h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Tutor: <span className="text-blue-600 font-black">{tutor.name || tutor.tutorName}</span>
                </p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs font-bold text-slate-700">
              
              <div>
                <label className="block mb-1">Student Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={user?.name || user?.displayName || ''} 
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" 
                  required 
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="+8801811394590" 
                  defaultValue="+8801811394590"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" 
                  required 
                />
              </div>

              <div>
                <label className="block mb-1">Tutor Name</label>
                <input 
                  type="text" 
                  name="tutorName" 
                  defaultValue={tutor.name || tutor.tutorName} 
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed" 
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1">Student Email</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={user?.email || ''} 
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" 
                  required 
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowBookingModal(false)} 
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP */}
      {confirmedBooking && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-center space-y-5 border border-slate-100 font-sans">
            
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>

            <div>
              <h3 className="font-black text-2xl text-slate-900">Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Your session with <span className="text-blue-600 font-black">{confirmedBooking.tutorName}</span> is successfully booked.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                Unique Booking Token ID
              </span>
              
              <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-xl font-mono text-xs font-black text-slate-800">
                <span className="truncate pr-2">{confirmedBooking.token}</span>
                <button 
                  onClick={handleCopyToken}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition text-[11px] font-black cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Token'}
                </button>
              </div>
            </div>

            <button 
              onClick={handleDoneBooking}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer uppercase tracking-wider"
            >
              DONE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TutorDetails;