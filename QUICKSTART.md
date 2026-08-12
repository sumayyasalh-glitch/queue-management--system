# QueueCare Frontend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
- Node.js v16+ installed
- npm or yarn package manager
- Backend API running (default: http://localhost:5000/api)

### 2. Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. First Time Setup

**Backend API Configuration:**
Edit `src/services/api.js` and set your backend URL:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 4. Test the Application

**Signup as a Patient:**
1. Go to `http://localhost:5173/signup`
2. Fill in the form
3. Select "Patient" as account type
4. Click "Create Account"

**Login:**
1. Go to `http://localhost:5173/login`
2. Enter your credentials
3. Click "Login"

**Book an Appointment:**
1. Click "Book Appointment" in the sidebar
2. Select a doctor
3. Choose date and time
4. Enter reason
5. Confirm booking

**Check Queue:**
1. Click "Queue Status" in the sidebar
2. See real-time queue updates

## 📁 Project Structure Quick Reference

```
frontend/
├── src/
│   ├── pages/          # All page components
│   ├── components/     # Reusable components
│   ├── contexts/       # React Context providers
│   ├── services/       # API service calls
│   ├── styles/         # CSS files
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   ├── App.css         # Global styles
│   └── index.css       # Root styles
├── public/             # Static assets
├── dist/               # Build output (generated)
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── FRONTEND_README.md  # Full documentation
```

## 🔑 Key Features

### Authentication
- Signup with email, password, role
- Login with email/password
- JWT token management
- Protected routes

### Appointments
- Book appointments with doctors
- View all appointments
- Reschedule appointments
- Cancel appointments
- Filter and sort

### Queue Management
- Real-time queue status
- Current serving token display
- Waiting list
- Estimated wait times
- Auto-updates every 5 seconds

### Schedules
- View doctor availability
- Manage working hours (for doctors)
- Toggle working days
- Save/edit schedules

### History
- View past appointments
- Filter by status and month
- Medical information
- Appointment statistics

## 🎯 Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check code quality

# Cleanup
rm -rf node_modules    # Remove node_modules
rm -rf dist            # Remove build output
```

## 🔐 Authentication Flow

### Signup
```
User fills form → API call to /auth/signup → Token returned → Stored in localStorage → Redirect to dashboard
```

### Login
```
Enter credentials → API call to /auth/login → Token returned → Stored in localStorage → Redirect to dashboard
```

### Protected Routes
```
Access protected page → Check if logged in → If not → Redirect to login → If yes → Load page
```

## 📲 User Roles & Access

### Patient
- ✅ Book appointments
- ✅ View own appointments
- ✅ Cancel/reschedule
- ✅ Check queue status
- ✅ View history
- ❌ Cannot manage schedules
- ❌ Cannot view other patients

### Doctor/Staff
- ✅ View all appointments
- ✅ Manage schedule
- ✅ Monitor queue
- ❌ Cannot book appointments
- ❌ Cannot cancel appointments

## 🎨 Color Reference

```
Primary Teal:    #0d4d52
Dark Teal:       #0a3a3e
Light Gray:      #f5f5f5
Medium Gray:     #e0e0e0
Dark Gray:       #999
Text Dark:       #333
Text Medium:     #666
```

## 🔗 Important API Endpoints

```
GET  /auth/verify                    - Verify user token
POST /auth/login                     - User login
POST /auth/signup                    - User registration

GET  /appointments                   - List appointments
POST /appointments                   - Create appointment
PUT  /appointments/{id}              - Update appointment
PUT  /appointments/{id}/cancel       - Cancel appointment
PUT  /appointments/{id}/reschedule   - Reschedule appointment

GET  /queue/current                  - Current serving token
GET  /queue/status                   - Queue status

GET  /staff                          - List doctors/staff
GET  /schedules/available-slots      - Get available slots
PUT  /schedules/{id}                 - Update schedule

GET  /patient-history                - Patient's history
```

## 📝 Example API Calls (from Console)

```javascript
// Check token
console.log(localStorage.getItem('token'));

// Check user data
console.log(JSON.parse(localStorage.getItem('user')));

// Make API call (if needed)
const response = await fetch('http://localhost:5000/api/appointments', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const data = await response.json();
console.log(data);
```

## 🐛 Debugging Tips

### Check Console
Press `F12` to open DevTools → Console tab
- Look for error messages
- Check network requests
- View state/props

### Check Network Tab
DevTools → Network tab
- Monitor API calls
- Check request/response
- Verify status codes

### Check Application Tab
DevTools → Application → localStorage
- Verify token stored
- Check user data

### React DevTools Extension
Install browser extension
- Inspect component tree
- View props and state
- Profile performance

## 🚨 Common Errors & Fixes

### "Cannot GET /"
- Backend API not running
- Wrong API URL in `api.js`

### "401 Unauthorized"
- Token expired
- Token not sent in header
- Invalid token

### "CORS error"
- Backend CORS not configured
- Check backend `Access-Control-Allow-Origin`

### "Cannot read property 'token'"
- Login response format incorrect
- Check API response structure

### Blank page after login
- Check localStorage for token
- Check if redirect working
- Check browser console errors

## 📱 Responsive Testing

### Test on Different Sizes
```
Mobile:         375px × 667px
Tablet:         768px × 1024px
Desktop:        1920px × 1080px
```

Use browser DevTools device emulation (F12 → ⌚ icon)

## 🔄 Real-time Updates

Queue status auto-updates every 5 seconds:
```javascript
// In AppointmentContext.jsx
useEffect(() => {
  fetchQueueStatus();
  const interval = setInterval(fetchQueueStatus, 5000);
  return () => clearInterval(interval);
}, [fetchQueueStatus]);
```

Change interval:
```javascript
const QUEUE_UPDATE_INTERVAL = 3000; // 3 seconds
```

## 📤 Environment Variables

Create `.env.local` in root:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=QueueCare
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🎓 Learning Resources

### React Docs
- https://react.dev
- https://react.dev/reference/react

### React Router
- https://reactrouter.com

### Axios
- https://axios-http.com

### Vite
- https://vitejs.dev

## 💡 Tips & Tricks

### Hot Module Replacement
Changes automatically reload in browser without losing state

### Developer Console Logs
```javascript
import.meta.env.DEV // true in dev, false in prod
```

### Environment-specific API
```javascript
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api'
  : 'https://api.production.com/api';
```

### Quick Components
Use ES6 shorthand:
```javascript
// Before
import Dashboard from './pages/Dashboard';
export { Dashboard };

// After
import Dashboard from './pages/Dashboard';
export default Dashboard;
```

## 🔗 Useful Links

- [Frontend README](./FRONTEND_README.md) - Detailed documentation
- [Architecture Guide](./ARCHITECTURE.md) - Technical architecture
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)

## 🆘 Getting Help

1. **Check Console**: F12 → Console tab
2. **Network Tab**: Check API responses
3. **Docs**: Read FRONTEND_README.md
4. **Architecture**: Read ARCHITECTURE.md
5. **Browser DevTools**: Inspect elements and state

## 📞 Contact

For technical issues or questions, contact the development team.

---

**Quick Start Version**: 1.0.0  
**Last Updated**: 2024-08-12

Happy coding! 🚀
