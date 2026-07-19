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

  const handleLogout = () => {
    setUser(null);
    setActiveTab('find');
    setRedirectTarget(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight cursor-pointer" onClick={() => handleTabClick('find')}>
                MediQueue Tutor Hub
              </span>
              <div className="flex gap-4 items-center">
                <button onClick={() => handleTabClick('find')} 
                  className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${activeTab === 'find' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                  Browse Tutors
                </button>
                <button onClick={() => handleTabClick('bookings')} 
                  className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                  My Bookings
                </button>
                <button onClick={() => handleTabClick('add')} 
                  className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${activeTab === 'add' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                  + Become Tutor
                </button>
                
                {user ? (
                  <div className="flex gap-2 items-center border-l pl-4 border-slate-200">
                    <button onClick={() => handleTabClick('profile')} 
                      className={`px-3 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-700 bg-slate-100'}`}>
                      Profile ({user.role})
                    </button>
                    <button onClick={handleLogout} className="px-3 py-2 text-sm font-bold rounded-xl bg-red-100 text-red-600 cursor-pointer">
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setRedirectTarget(null); handleTabClick('auth'); }} 
                    className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${activeTab === 'auth' ? 'bg-slate-900 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Dynamic Multi-Routing Core Component Rendering */}
        <main>
          {activeTab === 'find' && (
            <FindTutors user={user} setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />
          )}
          
          {activeTab === 'bookings' && (
            user ? <MyBookings user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="bookings" />
          )}
          
          {activeTab === 'add' && (
            user ? <AddTutor user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} fallbackTab="add" />
          )}

          {activeTab === 'auth' && (
            <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} />
          )}
          
          {activeTab === 'profile' && user && (
            <Profile user={user} setUser={setUser} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              MediQueue Tutor Hub
            </span>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              An advanced, premium booking gateway designed to bridge global language experts with enthusiastic learners seamlessly.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleTabClick('find')} className="hover:text-teal-400 transition-colors cursor-pointer bg-transparent border-none">Browse Tutors</button></li>
              <li><button onClick={() => handleTabClick('bookings')} className="hover:text-teal-400 transition-colors cursor-pointer bg-transparent border-none">My Bookings</button></li>
              <li><button onClick={() => handleTabClick('add')} className="hover:text-teal-400 transition-colors cursor-pointer bg-transparent border-none">Become Tutor</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">System Support</h3>
            <p className="text-sm">Technical support helpdesk gateway queries:</p>
            <p className="mt-2 text-sm font-bold text-teal-400">support@mediqueue.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;