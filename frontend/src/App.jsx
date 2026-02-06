import './App.css'
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

/* LAYOUTS */
import MainLayOut from './layouts/MainLayOut'
import EmploeeLayout from './layouts/EmployeeLayout'

/* PROTECTED */
import ProtectedRoute from './components/ProtectedRoute'

/* EMPLOYEE (normal import) */
import Home from './role/Employee/Home'
import MyComplaints from './role/Employee/MyComplaints'
import MyAnnouncements from './role/Employee/MyAnnouncements'

/* LAZY LOAD */
const Login = React.lazy(() => import('./auth/Login'))
const Register = React.lazy(() => import('./auth/Register'))
const NotFound = React.lazy(() => import('./role/Employee/NotFound'))

/* MANAGER */
const Dashboard = React.lazy(() => import('./role/Manager/Dashboard'))
const Finance = React.lazy(() => import('./role/Manager/Finance'))
const Tasks = React.lazy(() => import('./role/Manager/Tasks'))
const Logs = React.lazy(() => import('./role/Manager/Logs'))
const Vacations = React.lazy(() => import('./role/Manager/Vacations'))
const Settings = React.lazy(() => import('./role/Manager/Settings'))
const Complaints = React.lazy(() => import('./role/Manager/Complaints'))
const Employees = React.lazy(() => import('./role/Manager/Employees'))
const Leaves = React.lazy(() => import('./role/Manager/Leaves'))
const Announcements = React.lazy(() => import('./role/Manager/Announcements'))
const Archieve = React.lazy(() => import('./role/Manager/Archieve'))
const TasksArchieve = React.lazy(() => import('./role/Manager/TasksArchieve'))
const ComplaintsArchieve = React.lazy(() =>
  import('./role/Manager/ComplaintsArchieve'),
)
const AnnouncementsArchieve = React.lazy(() =>
  import('./role/Manager/AnnouncementsArchieve'),
)
const EmployeesArchieve = React.lazy(() =>
  import('./role/Manager/EmployeesArchieve'),
)

/* EMPLOYEE */
const MyTasks = React.lazy(() => import('./role/Employee/MyTasks'))
const MyVacations = React.lazy(() => import('./role/Employee/MyVacations'))
const MyLeaves = React.lazy(() => import('./role/Employee/MyLeaves'))
const MyProfile = React.lazy(() => import('./role/Employee/MyProfile'))
const MyProfit = React.lazy(() => import('./role/Employee/MyProfit'))
const MyAnalitics = React.lazy(() => import('./role/Employee/MyAnalitics'))

function App() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/90">
          <span className="text-cyan-400 font-mono">Loading...</span>
        </div>
      }
    >
      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/auth/signin" element={<Login />} />
        <Route path="/auth/signup" element={<Register />} />

        {/* ================= MANAGER ================= */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <MainLayOut />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="finance" element={<Finance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="logs" element={<Logs />} />
          <Route path="vacations" element={<Vacations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="announcemenets" element={<Announcements />} />

          <Route path="archieve" element={<Archieve />}>
            <Route path="tasksArchieve" element={<TasksArchieve />} />
            <Route path="complaintsArchieve" element={<ComplaintsArchieve />} />
            <Route
              path="announcementsArchieve"
              element={<AnnouncementsArchieve />}
            />
            <Route path="employeesArchieve" element={<EmployeesArchieve />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ================= EMPLOYEE ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmploeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="myhome" element={<Home />} />
          <Route path="mycomplaints" element={<MyComplaints />} />
          <Route path="mytasks" element={<MyTasks />} />
          <Route path="myvacations" element={<MyVacations />} />
          <Route path="myleaves" element={<MyLeaves />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="myprofit" element={<MyProfit />} />
          <Route path="myannouncements" element={<MyAnnouncements />} />
          <Route path="myanalitics" element={<MyAnalitics />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ================= ROOT ================= */}
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />

        {/* ================= GLOBAL 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
