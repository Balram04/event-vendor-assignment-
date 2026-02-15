import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, assignmentsRes] = await Promise.all([
        api.get('/vendor/performance-summary'),
        api.get('/vendor/assignments')
      ]);
      setPerformanceSummary(summaryRes.data);
      setAssignments(assignmentsRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusCount = (status) => {
    return assignments.filter(a => a.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 mb-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/vendor/assignments')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            My Assignments
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Performance Summary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Events */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Events Handled</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {performanceSummary?.totalEventsHandled || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {performanceSummary?.averageScore?.toFixed(1) || '0.0'} / 5
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Assignments */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Assignments</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {getStatusCount('assigned') + getStatusCount('accepted')}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Assignment Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Assigned</p>
              <p className="text-2xl font-bold text-blue-600">{getStatusCount('assigned')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('accepted')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{getStatusCount('completed')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</p>
            </div>
          </div>
        </div>

        {/* Recent Evaluations */}
        {performanceSummary?.recentEvaluations && performanceSummary.recentEvaluations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Evaluations</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {performanceSummary.recentEvaluations.map((evaluation) => (
                    <tr key={evaluation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{evaluation.eventId?.title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        {evaluation.eventId?.date 
                          ? new Date(evaluation.eventId.date).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-bold text-green-600">{evaluation.score} / 5</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(evaluation.status)}`}>
                          {evaluation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Assignments</h2>
            <button
              onClick={() => navigate('/vendor/assignments')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {assignments.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No assignments yet</p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignments.slice(0, 5).map((assignment) => (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{assignment.eventId?.title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        {assignment.eventId?.date 
                          ? new Date(assignment.eventId.date).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(assignment.eventId?.status)}`}>
                          {assignment.eventId?.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/vendor/assignments/${assignment._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;