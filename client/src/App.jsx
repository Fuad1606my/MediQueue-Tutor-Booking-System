import './index.css';
import React, { useState, useEffect } from 'react';
import AddTutor from './pages/AddTutor';
import FindTutors from './pages/FindTutors';
import MyBookings from './pages/MyBookings';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import axios from 'axios';

function App() {
  // রিফ্রেশ দিলেও যেন একই পেজ থাকে, সেজন্য sessionStorage দিয়ে ট্র্যাক করা হচ্ছে
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('mediqueue_active_tab') || 'find';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mediqueue_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    sessionStorage.setItem('mediqueue_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediqueue_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediqueue_session');
    }
  }, [user]);

  // ব্রাউজারের ব্যাক/ফরওয়ার্ড (Go Back) বাটন হ্যান্ডলিং লজিক
  useEffect(() => {
    const handlePopState = () => {
      const currentTab = sessionStorage.getItem('mediqueue_active_tab') || 'find';
      // যদি ইউজার লগআউট অবস্থায় থাকে এবং সিকিউর পেজে যাওয়ার চেষ্টা করে
      if (!user && (currentTab === 'bookings' || currentTab === 'add' || currentTab === 'profile')) {
        setActiveTab('auth');
      } else {
        setActiveTab(currentTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'tutor') {
      axios.get(`http://localhost:5000/bookings?tutorEmail=${user.email}`)
        .then(res => {
          const pending = res.data.filter(b => b.status === 'pending');
          setPendingCount(pending.length);
        })
        .catch(err => console.error(err));
    } else {
      setPendingCount(0);
    }
  }, [user, activeTab]);

  const handleTabClick = (targetTab) => {
    // ব্রাউজার হিস্ট্রি পুশ করা হচ্ছে যেন গো-ব্যাক বাটন ট্র্যাক রাখতে পারে
    window.history.pushState(null, '', '');
    setActiveTab(targetTab);
    if (!user && (targetTab === 'bookings' || targetTab === 'add')) {
      setRedirectTarget({ type: 'tab', value: targetTab });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mediqueue_session');
    setUser(null);
    setActiveTab('find');
    setRedirectTarget(null);
    sessionStorage.setItem('mediqueue_active_tab', 'find');

    // লগআউট করার পর 'Go Back' অপশন পুরোপুরি লক করার সিকিউরিটি মেকানিজম
    window.history.pushState(null, document.title, window.location.href);
    const blockBack = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    window.addEventListener('popstate', blockBack);
  };

  const getUserAvatar = () => {
    if (user?.image) return user.image;
    return user?.gender === 'female' ? '/female-avatar.jpg' : '/male-avatar.jpg';
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <span className="text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight cursor-pointer" onClick={() => handleTabClick('find')}>
                MediQueue Tutor Hub
              </span>
              <div className="flex gap-4 items-center">
                <button onClick={() => handleTabClick('find')} className={`px-5 py-2.5 text-base font-black rounded-xl cursor-pointer transition-all ${activeTab === 'find' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                  Browse Tutors
                </button>
                <button onClick={() => handleTabClick('bookings')} className={`relative px-5 py-2.5 text-base font-black rounded-xl cursor-pointer transition-all ${activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                  My Bookings
                  {user?.role === 'tutor' && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white font-black text-xs px-2 py-0.5 rounded-full shadow animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
                {user?.role === 'tutor' ? (
                  <button onClick={() => handleTabClick('add')} className={`px-5 py-2.5 text-base font-black rounded-xl cursor-pointer transition-all ${activeTab === 'add' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                    My Subjects
                  </button>
                ) : (
                  <button onClick={() => handleTabClick('add')} className={`px-5 py-2.5 text-base font-black rounded-xl cursor-pointer transition-all ${activeTab === 'add' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                    + Become Tutor
                  </button>
                )}
                
                {user ? (
                  <div className="flex gap-3 items-center border-l pl-4 border-slate-300">
                    <img src={getUserAvatar()} alt="Profile" onClick={() => handleTabClick('profile')} className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm cursor-pointer transition-all ${activeTab === 'profile' ? 'border-teal-600 scale-105' : 'border-slate-300 hover:border-teal-400'}`} />
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-black rounded-xl bg-red-50 text-red-600 border border-red-200 cursor-pointer">
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setRedirectTarget(null); handleTabClick('auth'); }} className={`px-5 py-2.5 text-base font-black rounded-xl shadow-md cursor-pointer transition-all ${activeTab === 'auth' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main>
          {activeTab === 'find' && <FindTutors user={user} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />}
          {activeTab === 'bookings' && (user ? <MyBookings user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="bookings" />)}
          {activeTab === 'add' && (user ? <AddTutor user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="add" customRole="tutor" />)}
          {activeTab === 'auth' && <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />}
          {activeTab === 'profile' && user && <Profile user={user} setUser={setUser} />}
        </main>
      </div>
    </div>
  );
}

export default App;