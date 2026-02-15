import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const res = await api.get('/admin/events');
    setEvents(res.data);
  };

  const createEvent = async () => {
    await api.post('/admin/events', { title, date });
    setTitle('');
    setDate('');
    fetchEvents();
  };

  const assignVendor = async () => {
    await api.post('/admin/assignments', { eventId, vendorId });
    alert('Vendor assigned');
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/events/${id}/status`, { status });
    fetchEvents();
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    navigate('/login');
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <nav className='bg-gray-800 text-white p-4 mb-6 justify-between flex items-center'>
        <h1 className='text-xl font-semibold'>Event Management Admin</h1>
        <button onClick={handleLogout} className='ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded '>Logout  </button>
      </nav>
      

      <h3>Create Event</h3>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={createEvent}>Create</button>

      <h3>Assign Vendor</h3>
      <input placeholder="Event ID" onChange={e => setEventId(e.target.value)} />
      <input placeholder="Vendor ID" onChange={e => setVendorId(e.target.value)} />
      <button onClick={assignVendor}>Assign</button>

      <h3>Events</h3>
      {events.map(event => (
        <div key={event._id} style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
          <p><b>{event.title}</b> – {event.status}</p>
          <button onClick={() => updateStatus(event._id, 'scheduled')}>Schedule</button>
          <button onClick={() => updateStatus(event._id, 'ongoing')}>Start</button>
          <button onClick={() => updateStatus(event._id, 'completed')}>Complete</button>
        </div>
      ))}
    </div>
  );
}
