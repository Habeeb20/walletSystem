/* eslint-disable no-unused-vars */



// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboard, logout } from '../../redux/authSlice';
// import WalletLoadingAnimation from '../../resources/wallet';
// import { useNavigate } from 'react-router-dom';
// import ProfilePage from '../SideBars/Profile';
// import AirtimePage from '../SideBars/AirtimePage';
// import DashboardContent from '../SideBars/DashboardContent';
// import TransferPage from '../SideBars/TransferPage';
// import DataPage from '../SideBars/DataPage';


// import im from "../../assets/wallet2.png"
// import ElectricityPage from '../SideBars/ElectricityPage';
// import TvSubscriptionPage from '../SideBars/TvSubscriptionPage';

// const Transfer = () => <div>Transfer Component</div>;
// const Data = () => <div>Data Component</div>;
// const Airtime = () => <div> <AirtimePage /> </div>;
// const CableTV = () => <div><TvSubscriptionPage /></div>;
// const Electricity = () => <div><ElectricityPage /></div>;
// const Profile = () => <div> <ProfilePage /> </div>;
// const Settings = () => <div>Settings Component</div>;
// const Security = () => <div>Security Component</div>;
// const HelpSupport = () => <div>Help & Support Component</div>;

// const Dashboard = () => {
//   const [content, setContent] = useState(<DashboardContent />);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, dashboardData } = useSelector((state) => state.auth);
//   const token = localStorage.getItem("token");
  
//     const [activeMenu, setActiveMenu] = useState('Dashboard');
// console.log(token, "your token")


//   useEffect(() => {
//   const token = localStorage.getItem('token');
//   console.log('Token used:', token);
//   if (token) {
//     dispatch(fetchDashboard(token));
//   }
// }, [dispatch, token]);


// useEffect(() => {
//   const urlParams = new URLSearchParams(window.location.search);
//   if (urlParams.get('status') === 'success') {
//     dispatch(fetchDashboard(token));
//     window.history.replaceState({}, document.title, window.location.pathname); 
//   }
// }, [dispatch, token]);

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     if (dashboardData?.user?.fullName) {
//       localStorage.setItem('userFullName', dashboardData.user.fullName);
//     }
//   }, [dashboardData]);

//   const handleNavigation = (component) => {
//     setContent(component);
//     if (window.innerWidth < 768) setIsMenuOpen(false);
//   };

//    const handleMenuClick = (component, menuName) => {
//     setActiveMenu(menuName);
//     handleNavigation(component);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("token");
//     navigate('/login');
//   };


//   const baseClasses = 'block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center';

//   const activeClasses = 'block py-2.5 px-4 text-white bg-gradient-to-r from-green-900 to-green-700 rounded-l-lg flex items-center';

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {loading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
//           <WalletLoadingAnimation className="w-48 h-48" />
//         </div>
//       )}
//       {/* Custom Navbar for Dashboard */}
//       <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 flex justify-between items-center z-20 shadow-lg md:h-16">
//             <a href='/'>
      
//       <img 
//       className="h-12 font-bold tracking-wide text-green-200"
//         src={im}
//       />
//                      {/* <div className="text-3xl font-bold tracking-wide text-green-200">{APP_NAME}</div> */}
//             </a>
//         {/* <div className="text-xl font-semibold">Dashboard</div> */}
//         <div className="text-sm text-green-100 font-bold"> {dashboardData?.user?.fullName || localStorage.getItem('userFullName') || ''}</div>
//         <div className="md:hidden">
//           <button onClick={() => { setIsMenuOpen(!isMenuOpen); console.log("Toggle menu:", !isMenuOpen); }} className="text-white focus:outline-none z-30">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
//             </svg>
//           </button>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       <div
//       className={`fixed inset-y-16 left-0 w-64 h-[calc(100%-4rem)] bg-white shadow-lg z-10 transition-transform duration-300 ${
//         isMenuOpen ? 'translate-x-0' : '-translate-x-full'
//       } md:relative md:translate-x-0 md:w-64 md:inset-y-16 md:h-[calc(100%-4rem)]`}
//     >
//       <nav className="mt-2">
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<DashboardContent />, 'Dashboard')}
//           className={activeMenu === 'Dashboard' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">🏠</span>Dashboard
//         </a>
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<TransferPage />, 'Transfer')}
//           className={activeMenu === 'Transfer' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">💸</span>Transfer
//         </a>
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<DataPage />, 'Data')}
//           className={activeMenu === 'Data' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">📊</span>Data
//         </a>
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<Airtime />, 'Airtime')}
//           className={activeMenu === 'Airtime' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">📞</span>Airtime
//         </a>
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<CableTV />, 'Cable TV')}
//           className={activeMenu === 'Cable TV' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">📺</span>Cable TV
//         </a>
//         <a
//           href="#"
//           onClick={() => handleMenuClick(<Electricity />, 'Electricity')}
//           className={activeMenu === 'Electricity' ? activeClasses : baseClasses}
//         >
//           <span className="mr-2">⚡</span>Electricity
//         </a>
//         <div className="mt-1">
//           <h3 className="px-4 text-sm font-semibold text-gray-500">ACCOUNT</h3>
//           <a
//             href="#"
//             onClick={() => handleMenuClick(<Profile />, 'Profile')}
//             className={activeMenu === 'Profile' ? activeClasses : baseClasses}
//           >
//             <span className="mr-2">👤</span>Profile
//           </a>
//           <a
//             href="#"
//             onClick={() => handleMenuClick(<Settings />, 'Settings')}
//             className={activeMenu === 'Settings' ? activeClasses : baseClasses}
//           >
//             <span className="mr-2">⚙️</span>Settings
//           </a>
//           <a
//             href="#"
//             onClick={() => handleMenuClick(<Security />, 'Security')}
//             className={activeMenu === 'Security' ? activeClasses : baseClasses}
//           >
//             <span className="mr-2">🔒</span>Security
//           </a>
//           <a
//             href="#"
//             onClick={() => handleMenuClick(<HelpSupport />, 'Help & Support')}
//             className={activeMenu === 'Help & Support' ? activeClasses : baseClasses}
//           >
//             <span className="mr-2">❓</span>Help & Support
//           </a>
//           <a
//             href="#"
//             onClick={handleLogout}
//             className={activeMenu === 'Logout' ? activeClasses : baseClasses}
//           >
//             <span className="mr-2">🚪</span>Logout
//           </a>
//         </div>
//       </nav>
//     </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 md:ml-0 p-6 overflow-y-auto ml-4 md:ml-4 pt-16 md:pt-16">
//         {content}
//         {/* <div className="mt-4 flex justify-end">
//           <input type="text" placeholder="Search transactions..." className="p-2 rounded-lg border border-gray-300 w-full md:w-1/3" />
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




































/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, logout } from '../../redux/authSlice';
import WalletLoadingAnimation from '../../resources/wallet';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../SideBars/Profile';
import AirtimePage from '../SideBars/AirtimePage';
import DashboardContent from '../SideBars/DashboardContent';
import TransferPage from '../SideBars/TransferPage';
import DataPage from '../SideBars/DataPage';
import im from '../../assets/wallet2.png';
import ElectricityPage from '../SideBars/ElectricityPage';
import TvSubscriptionPage from '../SideBars/TvSubscriptionPage';

// Wrapper components (kept as per original code)
const Transfer = () => <div>Transfer Component</div>;
const Data = () => <div>Data Component</div>;
const Airtime = () => <div><AirtimePage /></div>;
const CableTV = () => <div><TvSubscriptionPage /></div>;
const Electricity = () => <div><ElectricityPage /></div>;
const Profile = () => <div><ProfilePage /></div>;
const Settings = () => <div>Settings Component</div>;
const Security = () => <div>Security Component</div>;
const HelpSupport = () => <div>Help & Support Component</div>;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, dashboardData } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Define navigation functions before useState
  const handleNavigation = (component) => {
    setContent(component);
    if (window.innerWidth < 768) setIsMenuOpen(false);
  };

  const handleMenuClick = (component, menuName) => {
    setActiveMenu(menuName);
    handleNavigation(component);
  };

  // Initialize content after function definitions
  const [content, setContent] = useState(<DashboardContent handleMenuClick={handleMenuClick} />);



  useEffect(() => {
    const token = localStorage.getItem('token');
 
    if (token) {
      dispatch(fetchDashboard(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
      dispatch(fetchDashboard(token));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch, token]);

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

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const baseClasses = 'block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center';
  const activeClasses = 'block py-2.5 px-4 text-white bg-gradient-to-r from-green-900 to-green-700 rounded-l-lg flex items-center';

  return (
    <div className="flex h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <WalletLoadingAnimation className="w-48 h-48" />
        </div>
      )}
      {/* Custom Navbar for Dashboard */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-900 to-green-700 text-white p-4 flex justify-between items-center z-20 shadow-lg md:h-16">
        <a href="/">
          <img className="h-12 font-bold tracking-wide text-green-200" src={im} alt="Logo" />
        </a>
        <div className="text-sm text-green-100 font-bold">
          {dashboardData?.user?.fullName || localStorage.getItem('userFullName') || ''}
        </div>
        <div className="md:hidden">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              console.log('Toggle menu:', !isMenuOpen);
            }}
            className="text-white focus:outline-none z-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-16 left-0 w-64 h-[calc(100%-4rem)] bg-white shadow-lg z-10 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-64 md:inset-y-16 md:h-[calc(100%-4rem)]`}
      >
        <nav className="mt-2">
          <a
            href="#"
            onClick={() => handleMenuClick(<DashboardContent handleMenuClick={handleMenuClick} />, 'Dashboard')}
            className={activeMenu === 'Dashboard' ? activeClasses : baseClasses}
          >
            <span className="mr-2">🏠</span>Dashboard
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick(<TransferPage />, 'Transfer')}
            className={activeMenu === 'Transfer' ? activeClasses : baseClasses}
          >
            <span className="mr-2">💸</span>Transfer
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick(<DataPage />, 'Data')}
            className={activeMenu === 'Data' ? activeClasses : baseClasses}
          >
            <span className="mr-2">📊</span>Data
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick(<AirtimePage />, 'Airtime')}
            className={activeMenu === 'Airtime' ? activeClasses : baseClasses}
          >
            <span className="mr-2">📞</span>Airtime
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick(<TvSubscriptionPage />, 'Cable TV')}
            className={activeMenu === 'Cable TV' ? activeClasses : baseClasses}
          >
            <span className="mr-2">📺</span>Cable TV
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick(<ElectricityPage />, 'Electricity')}
            className={activeMenu === 'Electricity' ? activeClasses : baseClasses}
          >
            <span className="mr-2">⚡</span>Electricity
          </a>
          <div className="mt-1">
            <h3 className="px-4 text-sm font-semibold text-gray-500">ACCOUNT</h3>
            <a
              href="#"
              onClick={() => handleMenuClick(<ProfilePage />, 'Profile')}
              className={activeMenu === 'Profile' ? activeClasses : baseClasses}
            >
              <span className="mr-2">👤</span>Profile
            </a>
            <a
              href="#"
              onClick={() => handleMenuClick(<Settings />, 'Settings')}
              className={activeMenu === 'Settings' ? activeClasses : baseClasses}
            >
              <span className="mr-2">⚙️</span>Settings
            </a>
            <a
              href="#"
              onClick={() => handleMenuClick(<Security />, 'Security')}
              className={activeMenu === 'Security' ? activeClasses : baseClasses}
            >
              <span className="mr-2">🔒</span>Security
            </a>
            <a
              href="#"
              onClick={() => handleMenuClick(<HelpSupport />, 'Help & Support')}
              className={activeMenu === 'Help & Support' ? activeClasses : baseClasses}
            >
              <span className="mr-2">❓</span>Help & Support
            </a>
            <a
              href="#"
              onClick={handleLogout}
              className={activeMenu === 'Logout' ? activeClasses : baseClasses}
            >
              <span className="mr-2">🚪</span>Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-0 p-6 overflow-y-auto ml-4 md:ml-4 pt-16 md:pt-16">
        {content}
      </div>
    </div>
  );
};

export default Dashboard;