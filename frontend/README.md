# Event Vendor Assignment - Frontend

React frontend for the Event Vendor Assignment System with role-based dashboards.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with credentials support
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Build tool and dev server

## Features

### Pages

1. **Login (`/`)**
   - Login/Signup toggle
   - Role selection for signup (Admin/Vendor)
   - Form validation and error handling

2. **Admin Dashboard (`/admin`)**
   - 4 tabs: Events, Vendors, Assignments, Evaluate
   - Create and manage events
   - Create vendor profiles
   - Assign vendors to events
   - Evaluate vendor performance

3. **Vendor Dashboard (`/vendor`)**
   - View assigned events
   - Accept/Reject/Complete assignments
   - Performance summary with scores
   - Recent evaluations

### Protected Routes

Routes are protected based on user role stored in localStorage:
- Admin can only access `/admin`
- Vendor can only access `/vendor`
- Unauthorized access redirects to login

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with base config
├── pages/
│   ├── Login.jsx         # Login/Signup page
│   ├── AdminDashboard.jsx
│   └── VendorDashboard.jsx
├── App.jsx               # Main app with routing
├── App.css
├── index.css             # Tailwind imports
└── main.jsx              # App entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Axios Configuration
```javascript
// Configured in src/api/axios.js
baseURL: 'http://localhost:5000/api'
withCredentials: true // For HTTP-only cookies
```

## Environment

No environment variables needed for development. Backend URL is hardcoded in `src/api/axios.js`.

For production, update the baseURL in axios config.

## Design & UX

- Clean, modern UI with Tailwind CSS
- Responsive design for mobile and desktop
- Color-coded status indicators
- Interactive buttons with hover states
- Form validation with error messages
- Loading states for async operations

## Development

### Prerequisites
- Node.js 18+
- Backend server running on port 5000

### Local Development

1. Ensure backend is running
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

### Building

```bash
npm run build
```

Output will be in `dist/` folder.

## Troubleshooting

**Styles not loading:**
- Check that index.css has `@import "tailwindcss";`
- Restart dev server

**API calls failing:**
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Clear browser cookies if authentication fails

**Pages not found:**
- Check React Router configuration in App.jsx
- Ensure role is set in localStorage after login

## Future Enhancements

- [ ] Add dropdown selectors for event/vendor IDs
- [ ] Add real-time notifications
- [ ] Add calendar view for events
- [ ] Add data tables with sorting/filtering
- [ ] Add pagination for large lists
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add loading skeletons
- [ ] Add toast notifications instead of alerts
- [ ] Add form validation libraries (e.g., Formik, React Hook Form)
- [ ] Add TypeScript for type safety

## Notes

- User role and ID are stored in localStorage
- JWT token is stored in HTTP-only cookie (secure)
- All API calls include credentials for authentication
- Error handling shows user-friendly messages

