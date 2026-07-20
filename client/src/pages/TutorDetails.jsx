import React, { useState } from 'react';
import { ArrowLeft, Star, Award, GraduationCap, MapPin, Monitor, Calendar, Clock, Users, ZoomIn, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TutorDetails = ({ tutor, user, onBack, setActiveTab, setRedirectTarget, setAuthMode }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleBookClick = () => {
    if (!user) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Please log in to book a session',
        showConfirmButton: false,
        timer: 1500
      });

      if (setRedirectTarget) {
        setRedirectTarget({ type: 'tab', value: 'find' });
      }

      if (setAuthMode) {
        setAuthMode('login');
      }

      setTimeout(() => {
        if (setActiveTab) {
          setActiveTab('auth');
        }
      }, 1200);

      return;
    }

    setShowBookingModal(true);
  };

  const handleBookingConfirm = async (e) => {
    e.preventDefault();
    const token = `MQ-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const bookingData = {
      tutorName: tutor.name,
      tutorEmail: tutor.email,
      studentName: user.name,
      studentEmail: user.email,
      language: tutor.language || tutor.subject,
      price: tutor.price,
      sessionToken: token,
      bookingDate: e.target.date.value,
      timeSlot: tutor.timeSlot || '4:00 PM – 8:00 PM',
      status: 'accepted'
    };

    try {
      await axios.post(`${API_URL}/bookings`, bookingData);
      setShowBookingModal(false);
      Swal.fire({
        title: 'Session Booked!',
        html: `<p class="text-sm font-bold text-slate-600">Your session with <b>${tutor.name}</b> is confirmed.</p><p class="mt-2 text-xs text-slate-400">Session Token:</p><b class="text-blue-600 font-mono text-lg">${token}</b>`,
        icon: 'success'
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to complete booking', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-12 max-w-6xl mx-auto space-y-6 font-sans">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-blue-600 cursor-pointer transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Tutors
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 relative"></div>

        <div className="p-8 pt-0 space-y-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-20">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
              <div className="relative group/avatar cursor-pointer" onClick={() => setIsZoomed(true)}>
                <img 
                  src={tutor.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'} 
                  alt={tutor.name} 
                  className="w-36 h-36 rounded-2xl border-4 border-white shadow-lg object-cover object-top bg-slate-100 group-hover/avatar:brightness-90 transition-all" 
                  onError={(e)=>e.target.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'} 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all text-white font-black text-xs gap-1 bg-black/40 rounded-2xl">
                  <ZoomIn className="w-4 h-4" /> Zoom
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900">{tutor.name}</h1>
                <p className="text-sm font-black text-blue-600 font-mono">{tutor.language || tutor.subject || 'Mathematics'}</p>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black pt-1">
                  <Star className="w-4 h-4 fill-current" /> 4.9 <span className="text-slate-400 font-bold">(127 reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0">
              <span className="text-3xl font-black text-slate-900">${tutor.price || 45}<span className="text-sm font-bold text-slate-400">/hr</span></span>
              <button onClick={handleBookClick} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition-all hover:scale-105">
                Book Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Institution</p>
              <p className="text-xs font-black text-slate-900">{tutor.institution || 'MIT / Harvard'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <Award className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Experience</p>
              <p className="text-xs font-black text-slate-900">{tutor.experience || '8 years'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Location</p>
              <p className="text-xs font-black text-slate-900">{tutor.location || 'Cambridge, MA'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <Monitor className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Mode</p>
              <p className="text-xs font-black text-slate-900">{tutor.teachingMode || 'Online'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Available Days</p>
              <p className="text-xs font-black text-slate-900">{tutor.availableDays || 'Mon – Fri'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Time Slot</p>
              <p className="text-xs font-black text-slate-900">{tutor.timeSlot || '4:00 PM – 8:00 PM'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Slots</p>
              <p className="text-xs font-black text-slate-900">{tutor.totalSlots || 8} available</p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-2">
            <h3 className="text-lg font-black text-slate-900">About</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-4xl">
              {tutor.about || "PhD in Applied Mathematics from MIT. Specialises in calculus, linear algebra, and advanced statistics. Known for breaking complex problems into approachable steps that click on the first try."}
            </p>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <div className="relative bg-white p-3 rounded-3xl max-w-lg w-full shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-2 pt-1">
              <h3 className="text-sm font-black text-slate-900">{tutor.name}</h3>
              <button onClick={() => setIsZoomed(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center border">
              <img src={tutor.image} alt="" className="w-full h-full object-contain max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border shadow-2xl">
            <h3 className="text-xl font-black text-slate-900">Book Session</h3>
            <p className="text-xs text-slate-500 font-bold">Tutor: <span className="text-blue-600">{tutor.name}</span></p>
            <form onSubmit={handleBookingConfirm} className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700">Select Date</label>
                <input type="date" name="date" required className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold mt-1 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer shadow">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDetails;