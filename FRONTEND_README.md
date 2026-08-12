# QueueCare Frontend - Queue Management System

A modern React-based frontend application for managing appointments, queue tokens, doctor/staff schedules, and patient history efficiently.

## 🚀 Features

### For Patients
- **Easy Appointment Booking**: Multi-step appointment booking with doctor selection, date/time slots, and reason
- **Queue Status Tracking**: Real-time queue monitoring with estimated wait times
- **Appointment Management**: View, reschedule, and cancel appointments
- **Visit History**: Access complete history of past appointments and consultations
- **Notifications**: Real-time alerts for appointment confirmations and queue updates

### For Doctors/Staff
- **Appointment Management**: View and manage patient appointments
- **Schedule Management**: Set working hours and availability
- **Queue Management**: Monitor and manage queue tokens
- **Dashboard**: Quick overview of today's appointments and queue status

### Core Features
- **Role-based Access**: Different interfaces for Patients, Doctors, and Staff
- **JWT Authentication**: Secure login/signup with token-based session management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live queue status updates via polling
- **Dark/Light Mode Ready**: Modern UI with professional color scheme

## 📋 Project Structure

```
src/
├── components/
│   ├── Layout.jsx           # Main layout with sidebar navigation
│   ├── NotificationCenter.jsx # Toast notifications
│   └── ProtectedRoute.jsx    # Route protection middleware
├── contexts/
│   ├── AuthContext.jsx       # Authentication state management
│   ├── AppointmentContext.jsx # Appointments & queue state
│   └── NotificationContext.jsx # Notifications state
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Registration page
│   ├── Dashboard.jsx        # Main dashboard
│   ├── BookAppointment.jsx  # Appointment booking flow
│   ├── AppointmentsList.jsx # View all appointments
│   ├── QueueStatus.jsx      # Queue tracking
│   ├── PatientHistory.jsx   # View appointment history
│   └── ScheduleManagement.jsx # Manage staff schedules
├── services/
│   └── api.js              # API service with axios
├── styles/
│   ├── auth.css            # Authentication pages
│   ├── dashboard.css       # Dashboard styles
│   ├── appointments.css    # Appointment pages
│   ├── queue.css           # Queue status styles
│   ├── history.css         # Patient history styles
│   ├── schedule.css        # Schedule management
│   ├── layout.css          # Layout and sidebar
│   ├── notifications.css   # Notification styles
│   ├── appointments-list.css # Appointments list
│   └── home.css            # Home page
├── App.jsx                 # Main app with routing
├── index.css              # Global styles
└── main.jsx               # Entry point
```

## 🛠️ Technologies Used

- **React 19**: UI library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **Date-fns**: Date manipulation
- **Vite**: Build tool and dev server
- **CSS3**: Styling with responsive design

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone/Navigate to the project:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API Base URL:**
Edit `src/services/api.js` and update the `API_BASE_URL` to match your backend server:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. **Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Running in Production

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Lint code:
```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Signup**: Create account with role (Patient/Doctor/Staff)
   - User data stored locally
   - JWT token received from backend

2. **Login**: Authenticate with email and password
   - Token stored in localStorage
   - Token included in all API requests via axios interceptor

3. **Token Verification**: On app load, token validity is checked
   - Invalid tokens are cleared from localStorage
   - User redirected to login

4. **Logout**: Clear token and user data from localStorage

## 🎯 API Integration

All API calls are handled through `src/services/api.js`:

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/verify` - Verify token

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/{id}` - Update appointment
- `PUT /appointments/{id}/cancel` - Cancel appointment
- `PUT /appointments/{id}/reschedule` - Reschedule appointment

### Queue
- `GET /queue/current` - Get current serving token
- `GET /queue/status` - Get queue status
- `POST /queue/generate-token` - Generate token
- `PUT /queue/{id}` - Update token status

### Schedule
- `GET /schedules` - Get all schedules
- `GET /schedules/available-slots` - Get available time slots
- `GET /staff` - Get doctors/staff list
- `PUT /schedules/{id}` - Update schedule
- `GET /schedules/staff/{id}` - Get staff schedule

### Patient History
- `GET /patient-history` - Get patient history
- `GET /patient-history/{id}` - Get history details

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/{id}/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read

## 🎨 UI/UX Highlights

### Color Scheme
- **Primary**: #0d4d52 (Teal)
- **Primary Dark**: #0a3a3e
- **Background**: #f5f5f5
- **Text**: #333, #666, #999

### Responsive Breakpoints
- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

### Key Components

#### Authentication Pages
- Clean, centered forms
- Password strength indicators
- Error messaging
- Role selection during signup

#### Dashboard
- Quick stats cards
- Upcoming appointments
- Action cards for quick navigation
- Different layouts based on user role

#### Appointment Booking
- Multi-step form with visual indicators
- Doctor selection with detailed cards
- Available time slots
- Confirmation summary

#### Queue Status
- Large, easy-to-read current token display
- Real-time queue statistics
- Waiting list with position indicator
- Estimated wait time calculation

#### Patient History
- Filter by status and month
- Detailed appointment cards
- Medical information display
- Statistics overview

#### Schedule Management
- Toggle working days
- Set time slots per day
- Visual indication of working hours
- Easy editing interface

## 🔄 Real-time Updates

Queue status is updated every 5 seconds via polling:
```javascript
useEffect(() => {
  fetchQueueStatus();
  const interval = setInterval(fetchQueueStatus, 5000);
  return () => clearInterval(interval);
}, [fetchQueueStatus]);
```

## 🛡️ Security Features

- JWT token-based authentication
- Axios interceptor for automatic token inclusion
- Protected routes that redirect unauthenticated users
- Role-based access control
- Secure localStorage usage
- HTTPS-ready configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Error Handling

- API errors display in toast notifications
- Form validation on client-side
- Graceful handling of failed requests
- User-friendly error messages
- Automatic retry on token expiration

## 🎓 User Roles

### Patient
- Book appointments
- View and manage appointments
- Track queue position
- View medical history
- Receive notifications

### Doctor/Staff
- View patient appointments
- Manage availability/schedule
- Monitor queue tokens
- Access patient information

### Admin (Future)
- Manage users
- Configure system settings
- View analytics and reports

## 📝 Form Validation

- Email format validation
- Password strength requirements
- Required field checks
- Date/time validation
- Real-time feedback

## 🔔 Notification Types

- **Success**: Green - Operation completed successfully
- **Error**: Red - Operation failed
- **Warning**: Yellow - Important alert
- **Info**: Blue - Information message

Notifications auto-dismiss after 4 seconds (configurable).

## 🚀 Performance Optimizations

- Code splitting via React Router
- Lazy loading of components
- Axios request caching where appropriate
- CSS organization for faster rendering
- Minified production builds
- Gzip compression ready

## 📞 Support & Contact

For issues or feature requests, please contact the development team.

## 📄 License

All rights reserved. © 2024 QueueCare.

---

## Next Steps for Backend Integration

1. Ensure backend is running on the configured API_BASE_URL
2. Implement the required API endpoints
3. Set up CORS on backend to allow requests from frontend
4. Configure environment variables for different environments
5. Implement JWT token strategy on backend
6. Set up database models for appointments, users, queue tokens, etc.
7. Implement real-time notifications (Socket.IO optional for future enhancement)

## Environment Configuration

For different environments, create `.env.local` file:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=QueueCare
```

Update `src/services/api.js` to use these variables:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

---

**Version**: 1.0.0  
**Last Updated**: 2024-08-12
