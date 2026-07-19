import React, { useState } from 'react';
import AddTutor from './pages/AddTutor';
import FindTutors from './pages/FindTutors';
import MyBookings from './pages/MyBookings';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('find');
  const [user, setUser] = useState(null);
  const [redirectTarget, setRedirectTarget] = useState(null);

  const handleTabClick = (targetTab) => {
    setActiveTab(targetTab);
    if (!user && (targetTab === 'bookings' || targetTab === 'add')) {
      setRedirectTarget({ type: 'tab', value: targetTab });
    }
  };

  const getUserAvatar = () => {
    if (user?.image) return user.image;
    return user?.gender === 'female' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
      : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
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
                <button onClick={() => handleTabClick('bookings')} className={`px-5 py-2.5 text-base font-black rounded-xl cursor-pointer transition-all ${activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                  My Bookings
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
                    <button onClick={() => handleTabClick('profile')} className={`flex items-center gap-2 px-3 py-2 text-sm font-black rounded-xl cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-800 bg-slate-100 border border-slate-200'}`}>
                      <img src={getUserAvatar()} alt="" className="w-7 h-7 rounded-full object-cover border border-teal-500" />
                      <span>Dashboard</span>
                    </button>
                    <button onClick={() => { setUser(null); setActiveTab('find'); }} className="px-4 py-2 text-sm font-black rounded-xl bg-red-50 text-red-600 border border-red-200 cursor-pointer">
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setRedirectTarget(null); handleTabClick('auth'); }} className="px-5 py-2.5 text-base font-black rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-md">
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main>
          {activeTab === 'find' && <FindTutors user={user} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />}
          {activeTab === 'bookings' && (user ? <MyBookings user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="bookings" customRole="student" />)}
          {activeTab === 'add' && (user ? <AddTutor user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="add" customRole="tutor" />)}
          {activeTab === 'auth' && <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />}
          {activeTab === 'profile' && user && <Profile user={user} setUser={setUser} />}
        </main>
      </div>
    </div>
  );
}

export default App;