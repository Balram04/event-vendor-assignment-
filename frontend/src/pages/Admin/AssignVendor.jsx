import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AssignVendor = () => {
  const [events, setEvents] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    vendorId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    event: '',
    vendor: '',
    service: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, vendorsRes, assignmentsRes] = await Promise.all([
        api.get('/admin/events'),
        api.get('/admin/vendors'),
        api.get('/admin/assignments')
      ]);
      setEvents(eventsRes.data);
      setVendors(vendorsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  // Filter out completed events from assignment dropdown
  const availableEvents = events.filter(event => event.status !== 'completed');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/admin/assignments', formData);
      setSuccess('Vendor assigned successfully!');
      setFormData({ eventId: '', vendorId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign vendor');
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    if (filters.status && assignment.status !== filters.status) {
      return false;
    }
    if (filters.event && assignment.eventId?._id !== filters.event) {
      return false;
    }
    if (filters.vendor && assignment.vendorId?._id !== filters.vendor) {
      return false;
    }
    if (filters.service && assignment.vendorId?.serviceType !== filters.service) {
      return false;
    }
    return true;
  });

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      event: '',
      vendor: '',
      service: ''
    });
  };

  // Get unique service types from vendors
  const serviceTypes = [...new Set(vendors.map(v => v.serviceType))].filter(Boolean);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Assign Vendors to Events</h2>

      {/* Assignment Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">New Assignment</h3>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an event...</option>
              {availableEvents.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()} ({event.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vendor
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a vendor...</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.userId?.name || 'Unknown'} - {vendor.serviceType}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Vendor'}
          </button>
        </form>
      </div>

      {/* Assignments List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Current Assignments</h3>
        
        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Event Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event
              </label>
              <select
                value={filters.event}
                onChange={(e) => setFilters({ ...filters, event: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <select
                value={filters.vendor}
                onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.userId?.name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={filters.service}
                onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="mb-2 text-sm text-gray-600">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Event</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No assignments match the selected filters
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="px-4 py-3 text-sm">{assignment.eventId?.title}</td>
                    <td className="px-4 py-3 text-sm">{assignment.vendorId?.userId?.name}</td>
                    <td className="px-4 py-3 text-sm">{assignment.vendorId?.serviceType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
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

export default AssignVendor;