import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const VendorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    navigate('/login');
  };

  return (
    <div>
      <nav className='bg-gray-800 text-white p-4 mb-6 justify-between flex items-center'>
        <h1 className='text-xl font-semibold'>Vendor Dashboard</h1>
        <button onClick={handleLogout} className='ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'>Logout</button>
      </nav>
      <div className='p-4'>
        <p>Welcome to Vendor Dashboard</p>
      </div>
    </div>
  )
}

export default VendorDashboard