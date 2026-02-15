# Event Vendor Assignment - Backend API

Node.js/Express backend with MongoDB for the Event Vendor Assignment System.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually

# Start server
npm start

# For development with auto-reload (if nodemon is installed)
npm run dev
```

Server runs on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-vendor-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Environment Variables Explained

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
  - Local: `mongodb://localhost:27017/event-vendor-db`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- `JWT_SECRET` - Secret key for JWT token signing (use a strong random string)

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Parse cookies
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middlewares/
│   │   └── auth.js            # JWT auth & role check
│   ├── models/
│   │   ├── User.js            # User model (admin/vendor)
│   │   ├── Event.js           # Event model
│   │   ├── Vendor.js          # Vendor profile model
│   │   └── Assignment.js      # Assignment model
│   └── routes/
│       ├── auth.routes.js     # Signup/Login
│       ├── admin.routes.js    # Admin operations
│       └── vendor.routes.js   # Vendor operations
├── app.js                     # Main application file
├── package.json
└── .env                       # Environment variables (create this)
```

## API Routes

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user

### Admin (`/api/admin`)
Protected routes (admin role required):
- `POST /events` - Create event
- `GET /events` - Get all events
- `PATCH /events/:id/status` - Update event status
- `POST /vendors` - Create vendor profile
- `POST /assignments` - Assign vendor to event
- `POST /assignments/:id/evaluate` - Evaluate vendor

### Vendor (`/api/vendor`)
Protected routes (vendor role required):
- `GET /assignments` - Get my assignments
- `PATCH /assignments/:id/accept` - Accept assignment
- `PATCH /assignments/:id/reject` - Reject assignment
- `PATCH /assignments/:id/complete` - Mark completed
- `GET /performance-summary` - Get performance stats

### Health Check
- `GET /health` - Server status

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum ['admin', 'vendor'],
  timestamps: true
}
```

### Event
```javascript
{
  title: String,
  date: Date,
  status: enum ['draft', 'scheduled', 'ongoing', 'completed'],
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Vendor
```javascript
{
  userId: ObjectId (ref: User),
  serviceType: String,
  performanceScore: Number (default: 0),
  totalEventsHandled: Number (default: 0),
  timestamps: true
}
```

### Assignment
```javascript
{
  eventId: ObjectId (ref: Event),
  vendorId: ObjectId (ref: Vendor),
  status: enum ['assigned', 'accepted', 'rejected', 'completed'],
  score: Number (1-5),
  timestamps: true
}
```

## Middleware

### Auth Middleware (`auth`)
- Verifies JWT token from HTTP-only cookie
- Decodes and attaches user info to request
- Returns 401 if token is missing/invalid

### Role Check Middleware (`roleCheck(role)`)
- Verifies user has required role
- Returns 403 if role doesn't match

Usage:
```javascript
router.use(auth, roleCheck('admin'));  // Apply to all routes
router.get('/path', auth, roleCheck('admin'), handler);  // Single route
```

## Business Rules

1. **User & Vendor Profile**
   - Vendor profile is separate from user account
   - User with role 'vendor' needs a vendor profile created by admin
   - One user can have one vendor profile

2. **Event Lifecycle**
   - draft → scheduled → ongoing → completed
   - Cannot mark as completed if any assignment is pending
   - All assignments must be completed or rejected

3. **Assignment Workflow**
   - Admin assigns: status = 'assigned'
   - Vendor accepts: status = 'accepted'
   - Vendor rejects: status = 'rejected'
   - Vendor completes: status = 'completed'
   - Admin evaluates: score added (1-5)

4. **Evaluation Rules**
   - Can only evaluate after event is completed
   - Score range: 1-5
   - Updates vendor's average score automatically
   - Updates total events handled count

5. **Constraints**
   - Unique index on (eventId, vendorId) - no duplicate assignments
   - Only assigned tasks can be accepted/rejected
   - Only accepted tasks can be completed

## Authentication Flow

1. **Signup**
   - Password hashed with bcrypt (10 rounds)
   - User created in database
   - Returns success message

2. **Login**
   - Email/password validation
   - JWT token generated (24h expiry)
   - Token set in HTTP-only cookie
   - Returns userId, token, and role

3. **Protected Routes**
   - Token read from cookie
   - JWT verified and decoded
   - User info attached to request
   - Role checked if required

## Error Handling

All errors return JSON with message:
```javascript
{
  "message": "Error description"
}
```

Common error codes:
- **400** - Validation error or business rule violation
- **401** - Not authenticated (missing/invalid token)
- **403** - Forbidden (wrong role)
- **404** - Resource not found
- **500** - Server error

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration (1 day)
- HTTP-only cookies (prevents XSS)
- Role-based access control
- CORS configuration (frontend only)
- Mongoose injection prevention (built-in)

## Database Setup

### Local MongoDB

```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Ubuntu: apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod --dbpath /path/to/data

# Or use MongoDB Compass for GUI
```

### MongoDB Atlas (Cloud)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Add database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGODB_URI in .env

## Development

### Install Dependencies
```bash
npm install
```

### Required npm packages:
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Development Mode
```bash
# With nodemon (install globally: npm i -g nodemon)
nodemon app.js

# Or add to package.json scripts:
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## Testing

See [API_TESTING_GUIDE.md](../API_TESTING_GUIDE.md) for detailed testing instructions.

### Quick Test
```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## Troubleshooting

**Server won't start:**
- Check MongoDB is running
- Verify .env file exists and is configured
- Check port 5000 is not in use

**Database connection fails:**
- Verify MONGODB_URI is correct
- Check MongoDB service is running
- For Atlas, verify IP whitelist and credentials

**Authentication errors:**
- Check JWT_SECRET is set in .env
- Clear cookies in browser/client
- Verify token is sent in cookie

**CORS errors:**
- Check frontend URL in CORS config (app.js)
- Default is http://localhost:5173
- Update if frontend runs on different port

## Production Deployment

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production-db
JWT_SECRET=use-a-very-strong-random-secret-here
NODE_ENV=production
```

### Security Checklist
- [ ] Use strong JWT_SECRET (random, 32+ characters)
- [ ] Use MongoDB Atlas with restricted IP whitelist
- [ ] Enable HTTPS
- [ ] Update CORS to specific frontend domain
- [ ] Set secure cookie flags in production
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Set up logging
- [ ] Use environment-specific configs

### Deployment Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Modern platform with free tier
- **Render** - Free tier with persistent storage
- **DigitalOcean** - VPS for full control
- **AWS/Azure/GCP** - Enterprise solutions

## API Documentation

Full API documentation available at:
- [API Testing Guide](../API_TESTING_GUIDE.md)
- [Project Documentation](../PROJECT_DOCUMENTATION.md)

## License

MIT

---

**Built with ⚡ Node.js & Express**
