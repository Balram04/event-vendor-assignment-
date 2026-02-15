# Event Vendor Assignment System

A full-stack MERN application for managing event vendor assignments with role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd Backend
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-vendor-db
JWT_SECRET=your-secret-key-here" > .env

# Start server
npm start
```

Backend runs on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### 3. First Time Usage

1. **Signup as Admin**
   - Open http://localhost:5173
   - Click "Sign Up"
   - Enter details and select "Admin" role
   - Login with credentials

2. **Signup as Vendor** (in new browser tab/incognito)
   - Sign up with "Vendor" role
   - Note the User ID (check browser console or MongoDB)

3. **Admin Flow**
   - Create events in Events tab
   - Create vendor profile in Vendors tab (use Vendor User ID)
   - Assign vendors to events in Assignments tab
   - Update event status as needed
   - Evaluate vendors after event completion

4. **Vendor Flow**
   - Login as vendor
   - View assignments
   - Accept/Reject/Complete tasks
   - View performance scores

## 📋 Features

### Admin
- ✅ Event management (CRUD + status lifecycle)
- ✅ Vendor profile creation
- ✅ Vendor-to-event assignments
- ✅ Performance evaluation (1-5 score)
- ✅ Business rules enforcement

### Vendor
- ✅ View assigned events
- ✅ Accept/Reject/Complete assignments
- ✅ Performance dashboard
- ✅ Evaluation history

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS 4

## 📚 Documentation

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for:
- Complete API documentation
- Data models
- Business rules
- Detailed setup instructions
- Troubleshooting guide

## 🔐 Security

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- CORS configuration

## 📝 API Endpoints

**Auth:** `/api/auth` - signup, login  
**Admin:** `/api/admin` - events, vendors, assignments, evaluation  
**Vendor:** `/api/vendor` - assignments, performance  

## 🏗️ Project Structure

```
.
├── Backend/
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── middlewares/ # Auth middleware
│   │   ├── models/      # Mongoose models
│   │   └── routes/      # API routes
│   └── app.js
├── frontend/
│   └── src/
│       ├── api/         # Axios config
│       ├── pages/       # React pages
│       └── App.jsx
└── PROJECT_DOCUMENTATION.md
```

## 🐛 Troubleshooting

**Backend won't start:** Check MongoDB is running and .env is configured  
**CORS errors:** Verify backend CORS origin matches frontend URL  
**Auth fails:** Clear cookies, check JWT_SECRET is set  
**Styles missing:** Ensure Tailwind is imported in index.css  

## 📖 Usage Tips

- **Get Event ID:** Events tab shows ID below each event
- **Get Vendor ID:** Create vendor profile, check MongoDB or API response
- **Assignment IDs:** Vendors can see their assignment IDs in the dashboard
- **Event Status:** Cannot complete event until all vendors are done/rejected

## 🚧 Known Limitations

- No GET endpoint for vendors list (requires manual ID entry)
- No dropdown selectors for IDs
- No real-time updates (manual refresh needed)
- Basic error handling with alerts (no toast notifications)

## 🎯 Future Improvements

- [ ] Vendor list endpoint + dropdown selectors
- [ ] Real-time notifications (WebSockets)
- [ ] Calendar view for events
- [ ] File uploads for event documents
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Export reports (PDF/Excel)
- [ ] Vendor search and filtering

## 📄 License

MIT

---

**Made with ❤️ for Event Management**
