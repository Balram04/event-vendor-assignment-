import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CreatEvent from './CreatEvent';
import CreatVendors from './CreatVendors';
import AssignVendor from './AssignVendor';
import VendorPerformance from './VendorPerformance';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');

  const handleLogout = async () => {
    await api.post('/auth/logout');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className='bg-gray-800 text-white p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition'
        >
          Logout
        </button>
      </nav>

      <div className='container mx-auto p-6'>
        {/* Tabs */}
        <div className='bg-white rounded-lg shadow-md mb-6'>
          <div className='flex border-b'>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-3 font-semibold transition ${
                activeTab === 'events'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`flex-1 px-6 py-3 font-semibold transition ${
                activeTab === 'vendors'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('assign')}
              className={`flex-1 px-6 py-3 font-semibold transition ${
                activeTab === 'assign'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Assign Vendors
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 px-6 py-3 font-semibold transition ${
                activeTab === 'performance'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          {activeTab === 'events' && <CreatEvent />}
          {activeTab === 'vendors' && <CreatVendors />}
          {activeTab === 'assign' && <AssignVendor />}
          {activeTab === 'performance' && <VendorPerformance />}
        </div>
      </div>
    </div>
  )
}
