import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CreatVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    serviceType: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const serviceTypes = [
    'Catering',
    'Security',
    'Decoration',
    'Photography',
    'Music & Entertainment',
    'Transportation',
    'Venue Management'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendorsRes, usersRes] = await Promise.all([
        api.get('/admin/vendors'),
        api.get('/admin/available-vendor-users')
      ]);
      setVendors(vendorsRes.data);
      setAvailableUsers(usersRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      serviceType: prev.serviceType.includes(service)
        ? prev.serviceType.filter(s => s !== service)
        : [...prev.serviceType, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/admin/vendors', formData);
      setSuccess('Vendor created successfully!');
      setFormData({ userId: '', serviceType: [] });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>

      {/* Create Vendor Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Vendor</h3>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User (Role: Vendor)
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a user...</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {availableUsers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No available vendor users. All vendors have been assigned.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Types (Select one or more)
            </label>
            <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg bg-white">
              {serviceTypes.map((service) => (
                <label
                  key={service}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.serviceType.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
            {formData.serviceType.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.serviceType.map(service => (
                  <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || availableUsers.length === 0 || formData.serviceType.length === 0}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Vendor'}
          </button>
          {formData.serviceType.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select at least one service type</p>
          )}
        </form>
      </div>

      {/* Vendors List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Vendors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Types</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Performance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Events Handled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No vendors created yet
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td className="px-4 py-3 text-sm font-medium">{vendor.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{vendor.userId?.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(vendor.serviceType) && vendor.serviceType.length > 0 ? (
                          vendor.serviceType.map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                            {vendor.serviceType || 'N/A'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        vendor.performanceScore >= 4 ? 'bg-green-100 text-green-800' :
                        vendor.performanceScore >= 3 ? 'bg-yellow-100 text-yellow-800' :
                        vendor.performanceScore > 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vendor.performanceScore ? vendor.performanceScore.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{vendor.totalEventsHandled || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreatVendors;