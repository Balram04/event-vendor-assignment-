import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CreatEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/admin/events', formData);
      setSuccess('Event created successfully!');
      setFormData({ title: '', date: '' });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (eventId, status) => {
    try {
      await api.patch(`/admin/events/${eventId}/status`, { status });
      setSuccess('Event status updated!');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>

      {/* Create Event Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Events</h3>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No events created yet</p>
          ) : (
            events.map((event) => (
              <div key={event._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'completed' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                      event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={event.status}
                      onChange={(e) => handleStatusUpdate(event._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatEvent;