


import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, logout } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../SideBars/Profile';

const Dashboard1 = () => (
  <div className="p-6 pt-10 md:pt-4">
    <div className="text-gray-700 text-lg">Welcome back, <span className="text-black font-bold">{useSelector((state) => state.auth.dashboardData?.user?.fullName) || localStorage.getItem('userFullName') || ''}</span></div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2">
        <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm">Total Balance</h3>
            <h1 className="text-3xl font-bold">NGN 12,847.50</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-sm text-green-800">Income</h3>
            <h1 className="text-2xl font-bold text-green-800">NGN 4,850.00</h1>
          </div>
          <span className="text-green-600 text-xl">⬆️</span>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-sm text-red-800">Expenses</h3>
            <h1 className="text-2xl font-bold text-red-800">NGN 2,340.00</h1>
          </div>
          <span className="text-red-600 text-xl">⬇️</span>
        </div>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <button className="bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
            <span className="text-lg">Add Money</span>
          </button>
          <button className="bg-orange-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
            <span className="text-lg">Transfer</span>
          </button>
          <button className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
            <span className="text-lg">Airtime</span>
          </button>
          <button className="bg-pink-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
            <span className="text-lg">Data</span>
          </button>
          <button className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center h-16 w-full">
            <span className="text-lg">Transfer</span>
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
        <ul className="mt-4 space-y-2">
          <li className="text-green-600 flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>Payment received from Alex Johnson <span className="text-gray-500 ml-2">2 hours ago</span></li>
          <li className="text-blue-600 flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>Card payment at Target <span className="text-gray-500 ml-2">5 hours ago</span></li>
          <li className="text-purple-600 flex items-center"><span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>Monthly salary deposited <span className="text-gray-500 ml-2">1 day ago</span></li>
        </ul>
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">✔️</span>
            <div>
              <div>Payment from Emmanuel</div>
              <div className="text-gray-500 text-sm">Today, 2:30 PM</div>
            </div>
          </div>
          <div className="text-green-600 font-semibold">+NGN 2,500.00</div>
        </div>
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">🚛</span>
            <div>
              <div>1gb MTN sme</div>
              <div className="text-gray-500 text-sm">Yesterday, 6:15 AM</div>
            </div>
          </div>
          <div className="text-red-600 font-semibold">-NGN 15.99</div>
        </div>
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">⚡</span>
            <div>
              <div>Electricity</div>
              <div className="text-gray-500 text-sm">Dec 5, 3:45 PM</div>
            </div>
          </div>
          <div className="text-red-600 font-semibold">-NGN 89.99</div>
        </div>
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">📺</span>
            <div>
              <div>Cable TV</div>
              <div className="text-gray-500 text-sm">Dec 14, 8:20 AM</div>
            </div>
          </div>
          <div className="text-red-600 font-semibold">-NGN 5.45</div>
        </div>
      </div>
      <a href="#" className="text-blue-600 mt-2 inline-block font-medium">View All →</a>
    </div>
  </div>
);

const Transfer = () => <div>Transfer Component</div>;
const Data = () => <div>Data Component</div>;
const Airtime = () => <div>Airtime Component</div>;
const CableTV = () => <div>Cable TV Component</div>;
const Electricity = () => <div>Electricity Component</div>;
const Profile = () => <div><ProfilePage /> </div>;
const Settings = () => <div>Settings Component</div>;
const Security = () => <div>Security Component</div>;
const HelpSupport = () => <div>Help & Support Component</div>;

const Dashboard = () => {
  const [content, setContent] = useState(<Dashboard1 />);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, dashboardData } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (dashboardData?.user?.fullName) {
      localStorage.setItem('userFullName', dashboardData.user.fullName);
    }
  }, [dashboardData]);

  const handleNavigation = (component) => {
    setContent(component);
    if (window.innerWidth < 768) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <WalletLoadingAnimation className="w-48 h-48" />
        </div>
      )}
      {/* Custom Navbar for Dashboard */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 flex justify-between items-center z-20 shadow-lg md:h-16">
        <div className="text-xl font-semibold">Dashboard</div>
        <div className="text-sm text-green-100 font-bold"> {dashboardData?.user?.fullName || localStorage.getItem('userFullName') || ''}</div>
        <div className="md:hidden">
          <button onClick={() => { setIsMenuOpen(!isMenuOpen); console.log("Toggle menu:", !isMenuOpen); }} className="text-white focus:outline-none z-30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-y-16 left-0 w-64 h-[calc(100%-4rem)] bg-white shadow-lg z-10 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 md:inset-y-16 md:h-[calc(100%-4rem)]`}>
        <nav className="mt-2">
          <a href="#" onClick={() => handleNavigation(<Dashboard1 />)} className="block py-2.5 px-4 text-white bg-gradient-to-r from-green-900 to-green-700 rounded-l-lg flex items-center"><span className="mr-2">🏠</span>Dashboard</a>
          <a href="#" onClick={() => handleNavigation(<Transfer />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">💸</span>Transfer</a>
          <a href="#" onClick={() => handleNavigation(<Data />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">📊</span>Data</a>
          <a href="#" onClick={() => handleNavigation(<Airtime />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">📞</span>Airtime</a>
          <a href="#" onClick={() => handleNavigation(<CableTV />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">📺</span>Cable TV</a>
          <a href="#" onClick={() => handleNavigation(<Electricity />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">⚡</span>Electricity</a>
          <div className="mt-1">
            <h3 className="px-4 text-sm font-semibold text-gray-500">ACCOUNT</h3>
            <a href="#" onClick={() => handleNavigation(<Profile />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">👤</span>Profile</a>
            <a href="#" onClick={() => handleNavigation(<Settings />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">⚙️</span>Settings</a>
            <a href="#" onClick={() => handleNavigation(<Security />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">🔒</span>Security</a>
            <a href="#" onClick={() => handleNavigation(<HelpSupport />)} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">❓</span>Help & Support</a>
            <a href="#" onClick={handleLogout} className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center"><span className="mr-2">🚪</span>Logout</a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-0 p-6 overflow-y-auto ml-4 md:ml-4 pt-16 md:pt-16">
        {content}
        <div className="mt-4 flex justify-end">
          <input type="text" placeholder="Search transactions..." className="p-2 rounded-lg border border-gray-300 w-full md:w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


