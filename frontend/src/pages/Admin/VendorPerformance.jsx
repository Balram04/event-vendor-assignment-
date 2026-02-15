import { useState, useEffect } from 'react';
import api from '../../api/axios';

const VendorPerformance = () => {
  const [vendors, setVendors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendorsRes, assignmentsRes] = await Promise.all([
        api.get('/admin/vendors'),
        api.get('/admin/assignments')
      ]);
      setVendors(vendorsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post(`/admin/assignments/${selectedAssignment}/evaluate`, { 
        score: parseInt(score) 
      });
      setSuccess('Vendor evaluated successfully!');
      setSelectedAssignment('');
      setScore('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate vendor');
    } finally {
      setLoading(false);
    }
  };

  const completedAssignments = assignments.filter(
    a => a.status === 'completed' && a.eventId?.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vendor Performance</h2>

      {/* Evaluation Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Evaluate Vendor</h3>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleEvaluate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Completed Assignment
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an assignment...</option>
              {completedAssignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.eventId?.title} - {assignment.vendorId?.userId?.name}
                  {assignment.score ? ` (Score: ${assignment.score})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter score between 1 and 5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>

      {/* Vendors Performance Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Vendors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Performance Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No vendors yet
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td className="px-4 py-3 text-sm">{vendor.userId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm">{vendor.serviceType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        vendor.performanceScore >= 4 ? 'bg-green-100 text-green-800' :
                        vendor.performanceScore >= 3 ? 'bg-yellow-100 text-yellow-800' :
                        vendor.performanceScore > 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vendor.performanceScore ? vendor.performanceScore.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{vendor.totalEventsHandled || 0}</td>
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

export default VendorPerformance;