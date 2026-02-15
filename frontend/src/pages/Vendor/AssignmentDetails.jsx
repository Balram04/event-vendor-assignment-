import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const AssignmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendor/assignments');
      const foundAssignment = response.data.find(a => a._id === id);
      
      if (!foundAssignment) {
        setError('Assignment not found');
        setAssignment(null);
      } else {
        setAssignment(foundAssignment);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/vendor/assignments/${id}/accept`);
      await fetchAssignmentDetails();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept assignment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this assignment?')) return;
    
    try {
      setActionLoading(true);
      await api.patch(`/vendor/assignments/${id}/reject`);
      await fetchAssignmentDetails();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject assignment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm('Mark this assignment as completed?')) return;
    
    try {
      setActionLoading(true);
      await api.patch(`/vendor/assignments/${id}/complete`);
      await fetchAssignmentDetails();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete assignment');
    } finally {
      setActionLoading(false);
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
        <p className="text-xl">Loading assignment details...</p>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/vendor/assignments')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            ← Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 mb-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Assignment Details</h1>
        <button
          onClick={() => navigate('/vendor/assignments')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Back to Assignments
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {assignment && (
          <>
            {/* Assignment Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {assignment.eventId?.title || 'N/A'}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded font-semibold ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className={`px-3 py-1 rounded font-semibold ${getEventStatusColor(assignment.eventId?.status)}`}>
                    Event: {assignment.eventId?.status || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {assignment.status === 'assigned' && (
                  <>
                    <button
                      onClick={handleAccept}
                      disabled={actionLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {actionLoading ? 'Processing...' : 'Accept Assignment'}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      Reject Assignment
                    </button>
                  </>
                )}
                {assignment.status === 'accepted' && (
                  <button
                    onClick={handleComplete}
                    disabled={actionLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Completed'}
                  </button>
                )}
                {assignment.status === 'completed' && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                    ✓ This assignment has been completed
                  </div>
                )}
                {assignment.status === 'rejected' && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    ✗ This assignment was rejected
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Event Title</p>
                  <p className="text-lg font-semibold">{assignment.eventId?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="text-lg font-semibold">
                    {assignment.eventId?.date 
                      ? new Date(assignment.eventId.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Status</p>
                  <p className="text-lg">
                    <span className={`px-3 py-1 rounded font-semibold ${getEventStatusColor(assignment.eventId?.status)}`}>
                      {assignment.eventId?.status || 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Service Required</p>
                    <p className="text-lg font-semibold">{assignment.vendorId?.serviceType || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Assignment Timeline */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Assignment Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  <div className="ml-4">
                    <p className="font-semibold">Assignment Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(assignment.createdAt).toLocaleString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {assignment.updatedAt !== assignment.createdAt && (
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
                      assignment.status === 'completed' ? 'bg-green-500' :
                      assignment.status === 'rejected' ? 'bg-red-500' :
                      assignment.status === 'accepted' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="ml-4">
                      <p className="font-semibold">Last Updated ({assignment.status})</p>
                      <p className="text-sm text-gray-500">
                        {new Date(assignment.updatedAt).toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Evaluation */}
            {assignment.score && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Performance Evaluation</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-green-600">{assignment.score}</p>
                    <p className="text-gray-500">out of 5</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 flex items-center justify-end pr-2"
                        style={{ width: `${(assignment.score / 5) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">
                          {((assignment.score / 5) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Performance Score
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment Lifecycle Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-900">Assignment Lifecycle</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Assigned:</strong> New assignment received - Accept or Reject</p>
                <p><strong>Accepted:</strong> Work in progress - Mark as Complete when done</p>
                <p><strong>Completed:</strong> Work finished - Awaiting admin evaluation</p>
                <p><strong>Rejected:</strong> Assignment declined - No further action needed</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;
