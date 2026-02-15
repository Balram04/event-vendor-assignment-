import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const MyAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [filter, assignments]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendor/assignments');
      setAssignments(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    if (filter === 'all') {
      setFilteredAssignments(assignments);
    } else {
      setFilteredAssignments(assignments.filter(a => a.status === filter));
    }
  };

  const handleAccept = async (assignmentId) => {
    try {
      setActionLoading(assignmentId);
      await api.patch(`/vendor/assignments/${assignmentId}/accept`);
      await fetchAssignments();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept assignment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (assignmentId) => {
    if (!confirm('Are you sure you want to reject this assignment?')) return;
    
    try {
      setActionLoading(assignmentId);
      await api.patch(`/vendor/assignments/${assignmentId}/reject`);
      await fetchAssignments();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject assignment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (assignmentId) => {
    if (!confirm('Mark this assignment as completed?')) return;
    
    try {
      setActionLoading(assignmentId);
      await api.patch(`/vendor/assignments/${assignmentId}/complete`);
      await fetchAssignments();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete assignment');
    } finally {
      setActionLoading(null);
    }
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

  const getEventStatusColor = (status) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 mb-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">My Assignments</h1>
        <button
          onClick={() => navigate('/vendor')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-semibold ${
                filter === 'all' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-4 py-2 font-semibold ${
                filter === 'assigned' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Assigned ({assignments.filter(a => a.status === 'assigned').length})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 font-semibold ${
                filter === 'accepted' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Accepted ({assignments.filter(a => a.status === 'accepted').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 font-semibold ${
                filter === 'completed' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({assignments.filter(a => a.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 font-semibold ${
                filter === 'rejected' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rejected ({assignments.filter(a => a.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAssignments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No assignments found</p>
              <p className="text-gray-400 text-sm mt-2">
                {filter !== 'all' 
                  ? `No assignments with status "${filter}"` 
                  : 'You have no assignments yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.eventId?.title || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Assigned: {new Date(assignment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
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
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getEventStatusColor(assignment.eventId?.status)}`}>
                          {assignment.eventId?.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {assignment.score ? (
                          <span className="font-bold text-green-600">{assignment.score} / 5</span>
                        ) : (
                          <span className="text-gray-400">Not rated</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {assignment.status === 'assigned' && (
                            <>
                              <button
                                onClick={() => handleAccept(assignment._id)}
                                disabled={actionLoading === assignment._id}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                              >
                                {actionLoading === assignment._id ? 'Loading...' : 'Accept'}
                              </button>
                              <button
                                onClick={() => handleReject(assignment._id)}
                                disabled={actionLoading === assignment._id}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {assignment.status === 'accepted' && (
                            <button
                              onClick={() => handleComplete(assignment._id)}
                              disabled={actionLoading === assignment._id}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                            >
                              {actionLoading === assignment._id ? 'Loading...' : 'Mark Complete'}
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/vendor/assignments/${assignment._id}`)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {filteredAssignments.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Shown</p>
                <p className="text-2xl font-bold">{filteredAssignments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Needs Action</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredAssignments.filter(a => a.status === 'assigned').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAssignments.filter(a => a.status === 'accepted').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-600">
                  {filteredAssignments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;
