# Frontend Architecture & Developer Guide

## Project Architecture

### State Management

The application uses **React Context API** for state management across three main contexts:

#### 1. AuthContext
Manages user authentication state and operations.

**State:**
- `user`: Current logged-in user object
- `loading`: Authentication check loading state
- `error`: Authentication error messages
- `isAuthenticated`: Boolean flag

**Methods:**
- `signup(data)`: Register new user
- `login(email, password)`: Authenticate user
- `logout()`: Clear session
- `useAuth()`: Hook to use auth context

**Example:**
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.firstName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </>
  );
}
```

#### 2. AppointmentContext
Manages appointments and queue status.

**State:**
- `appointments`: Array of appointments
- `queue`: Current queue status
- `loading`: Data loading state
- `error`: Error messages

**Methods:**
- `fetchAppointments()`: Load all appointments
- `fetchQueueStatus()`: Load queue status (auto-polls every 5s)
- `createAppointment(data)`: Create new appointment
- `cancelAppointment(id)`: Cancel appointment
- `rescheduleAppointment(id, data)`: Reschedule appointment

#### 3. NotificationContext
Manages toast notifications system-wide.

**State:**
- `notifications`: Array of active notifications

**Methods:**
- `addNotification(message, type, duration)`: Show notification
  - Types: 'success', 'error', 'warning', 'info'
  - Duration: milliseconds (0 for no auto-dismiss)
- `removeNotification(id)`: Dismiss notification

## Component Hierarchy

```
App
├── AuthProvider
│   └── NotificationProvider
│       └── AppointmentProvider
│           ├── Home (public)
│           ├── Login (public)
│           ├── Signup (public)
│           └── ProtectedRoute (wrapper)
│               └── Layout
│                   ├── Dashboard
│                   ├── BookAppointment
│                   ├── AppointmentsList
│                   ├── QueueStatus
│                   ├── PatientHistory
│                   └── ScheduleManagement
```

## API Service Structure

File: `src/services/api.js`

### Axios Instance
```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### Request Interceptor
Automatically adds JWT token to all requests:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Modules

**authAPI:**
```javascript
authAPI.signup(data)        // POST /auth/signup
authAPI.login(data)         // POST /auth/login
authAPI.logout()            // POST /auth/logout
authAPI.verifyToken()       // GET /auth/verify
```

**appointmentAPI:**
```javascript
appointmentAPI.getAll()           // GET /appointments
appointmentAPI.create(data)       // POST /appointments
appointmentAPI.getById(id)        // GET /appointments/{id}
appointmentAPI.update(id, data)   // PUT /appointments/{id}
appointmentAPI.cancel(id)         // PUT /appointments/{id}/cancel
appointmentAPI.reschedule(id, data) // PUT /appointments/{id}/reschedule
```

**queueAPI:**
```javascript
queueAPI.getCurrentQueue()          // GET /queue/current
queueAPI.getQueueStatus()          // GET /queue/status
queueAPI.generateToken(appointmentId) // POST /queue/generate-token
queueAPI.updateQueueStatus(id, status) // PUT /queue/{id}
```

**scheduleAPI:**
```javascript
scheduleAPI.getSchedules()         // GET /schedules
scheduleAPI.getAvailableSlots()   // GET /schedules/available-slots
scheduleAPI.getStaff()            // GET /staff
scheduleAPI.updateSchedule(id, data) // PUT /schedules/{id}
scheduleAPI.getStaffSchedule(id)  // GET /schedules/staff/{id}
```

**historyAPI:**
```javascript
historyAPI.getHistory()            // GET /patient-history
historyAPI.getHistoryById(id)     // GET /patient-history/{id}
```

**notificationAPI:**
```javascript
notificationAPI.getNotifications()     // GET /notifications
notificationAPI.markAsRead(id)        // PUT /notifications/{id}/read
notificationAPI.markAllAsRead()       // PUT /notifications/mark-all-read
```

## Page Components

### Home Page (`pages/Home.jsx`)
Landing page for unauthenticated users.
- Features showcase
- How-it-works steps
- Call-to-action buttons
- No state management needed

### Authentication Pages
#### Login (`pages/Login.jsx`)
- Email and password fields
- Error display
- Loading state
- Link to signup

#### Signup (`pages/Signup.jsx`)
- Multi-field form
- Role selection (patient/doctor/staff)
- Password confirmation
- Phone number optional

### Dashboard (`pages/Dashboard.jsx`)
Role-based dashboard showing:
- Quick stats (appointments, queue, wait time)
- Action cards for main features
- Upcoming appointments list
- Different content based on user role

### Appointment Booking (`pages/BookAppointment.jsx`)
Multi-step form:
1. **Step 1**: Select doctor from grid
2. **Step 2**: Choose date and available time slots
3. **Step 3**: Enter reason and confirm

Features:
- Fetches available doctors on load
- Fetches time slots based on doctor and date
- Form validation
- Error handling

### Appointments List (`pages/AppointmentsList.jsx`)
- Display all appointments in card grid
- Filter by status
- Sort by date/status
- Modal for rescheduling
- Cancel appointments with confirmation

### Queue Status (`pages/QueueStatus.jsx`)
- Current serving token display
- Waiting list table
- Queue statistics
- Real-time updates (5s polling)
- Estimated wait time

### Patient History (`pages/PatientHistory.jsx`)
- All past appointments
- Filter by status and month
- Detailed appointment cards
- Medical information display
- Statistics overview

### Schedule Management (`pages/ScheduleManagement.jsx`)
For doctors/staff:
- Edit working hours per day
- Toggle working days
- View/save schedule
- Display current schedule

## Routing Structure

```
/                     → Home (public)
/login                → Login (public)
/signup               → Signup (public)
/dashboard            → Dashboard (protected)
/appointments/new     → Book Appointment (protected)
/appointments         → Appointments List (protected)
/queue                → Queue Status (protected)
/history              → Patient History (protected)
/schedule             → Schedule Management (protected, staff only)
/*                    → Redirect to Home
```

## Protected Routes Implementation

```javascript
<ProtectedRoute requiredRole="patient">
  <Component />
</ProtectedRoute>
```

**Logic:**
1. Check if user is authenticated
2. If not, redirect to login
3. If authenticated but requires specific role, check role
4. If role doesn't match, redirect to dashboard
5. Otherwise, render component

## Form Handling Patterns

### Controlled Components
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

### Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validate(formData)) {
    addNotification('Validation failed', 'error');
    return;
  }

  try {
    const result = await apiCall(formData);
    addNotification('Success', 'success');
    navigate('/');
  } catch (error) {
    addNotification(error.message, 'error');
  }
};
```

## Error Handling Strategy

### API Errors
```javascript
try {
  const response = await appointmentAPI.create(data);
} catch (error) {
  const message = error.response?.data?.message || 'Default error';
  addNotification(message, 'error');
}
```

### Form Validation
```javascript
const errors = {};

if (!email.includes('@')) {
  errors.email = 'Invalid email';
}

if (Object.keys(errors).length > 0) {
  // Display errors
  return;
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};

// In JSX
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Styling Strategy

### CSS File Organization
- **Global styles**: `App.css`, `index.css`
- **Component-specific**: Separate CSS files
- **Responsive**: Mobile-first with media queries

### CSS Naming Convention
```css
/* Component Block */
.component-name { }

/* Component Element */
.component-name__element { }

/* Component Modifier */
.component-name--modifier { }
```

### Responsive Breakpoints
```css
/* Mobile First */
/* Default: mobile */

/* Tablet */
@media (min-width: 481px) { }

/* Large Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

## Performance Optimization Tips

1. **Code Splitting**: React Router handles automatic code splitting
2. **Memoization**: Use `useMemo` for expensive computations
3. **Component Memoization**: Use `memo()` for frequently re-rendered components
4. **Lazy Loading**: Images and heavy components
5. **Debouncing**: Search and filter inputs
6. **Caching**: API responses where appropriate

## Browser DevTools Tips

1. **React DevTools**: Install Chrome/Firefox extension
   - Component tree inspection
   - Props and state debugging
   - Profiling

2. **Network Tab**: Monitor API calls
   - Check request/response
   - View headers and payload

3. **Console**: Debug errors and logs

4. **Application Tab**: Check localStorage
   - User token
   - Stored data

## Testing Setup (Future)

Recommended testing libraries:
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=QueueCare
VITE_LOG_LEVEL=debug
```

Usage:
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

## Common Issues & Solutions

### Issue: Token not persisting
**Solution**: Check localStorage in browser DevTools
```javascript
localStorage.getItem('token')
```

### Issue: CORS errors
**Solution**: Backend needs CORS headers
```javascript
// Backend setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: API calls failing
**Solution**: Check:
1. Backend is running
2. API_BASE_URL is correct
3. Token is valid
4. Network tab shows request

### Issue: Components not re-rendering
**Solution**: Check:
1. State updates properly
2. Key prop on lists
3. No console errors

## Deployment Checklist

- [ ] Update API_BASE_URL for production
- [ ] Set NODE_ENV to production
- [ ] Test all authentication flows
- [ ] Test all CRUD operations
- [ ] Check responsive design
- [ ] Verify error handling
- [ ] Test in incognito mode (no cache)
- [ ] Check browser console for errors
- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Verify build output size
- [ ] Set up HTTPS

## Future Enhancements

1. **Real-time Features**: Implement Socket.IO for live updates
2. **Offline Support**: Add Service Workers
3. **Dark Mode**: Implement theme switching
4. **Internationalization**: Multi-language support
5. **Analytics**: Track user behavior
6. **PDF Export**: Generate reports and receipts
7. **SMS Notifications**: Send appointment reminders
8. **Payment Integration**: In-app payments
9. **Video Consultations**: Telemedicine integration
10. **Mobile App**: React Native version

---

**Document Version**: 1.0.0  
**Last Updated**: 2024-08-12
