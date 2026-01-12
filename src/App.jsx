import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayOut from './layouts/MainLayOut'
import React, { Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'

const Login = React.lazy(() => import('./auth/Login'))
const Register = React.lazy(() => import('./auth/Register'))
const NotFound = React.lazy(() => import('./role/Employee/NotFound'))
const Announcements = React.lazy(() => import('./role/Manager/Announcements'))
const Archieve = React.lazy(() => import('./role/Manager/Archieve'))
const Complaints = React.lazy(() => import('./role/Manager/Complaints'))
const Dashboard = React.lazy(() => import('./role/Manager/Dashboard'))
const Employees = React.lazy(() => import('./role/Manager/Employees'))
const Finance = React.lazy(() => import('./role/Manager/Finance'))
const Logs = React.lazy(() => import('./role/Manager/Logs'))
const Settings = React.lazy(() => import('./role/Manager/Settings'))
const Tasks = React.lazy(() => import('./role/Manager/Tasks'))
const Vacations = React.lazy(() => import('./role/Manager/Vacations'))
const Leaves = React.lazy(() => import('./role/Manager/Leaves'))

const TasksArchieve = React.lazy(() => import('./role/Manager/TasksArchieve'))
const AnnouncementsArchieve = React.lazy(() =>
  import('./role/Manager/AnnouncementsArchieve'),
)
const ComplaintsArchieve = React.lazy(() =>
  import('./role/Manager/ComplaintsArchieve'),
)
const EmployeesArchieve = React.lazy(() =>
  import('./role/Manager/EmployeesArchieve'),
)

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md">
            <div className="relative flex items-center justify-center">
              {/* Tashqi aylanuvchi halqa */}
              <div className="absolute w-32 h-32 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>

              {/* O'rtadagi pulsatsiya qiluvchi halqa */}
              <div className="absolute w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-ping"></div>

              {/* Ichki qarama-qarshi aylanuvchi halqa */}
              <div className="absolute w-20 h-20 border-2 border-r-cyan-300 border-l-cyan-300 border-t-transparent border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

              {/* Markaziy nuqta va nur */}
              <div className="relative w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse"></div>
            </div>

            {/* Matn qismi */}
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                Loading Data
              </span>
              {/* Yuklanish chizig'i (progress bar ko'rinishida) */}
              <div className="w-32 h-[2px] bg-slate-800 overflow-hidden rounded-full">
                <div className="w-full h-full bg-cyan-500 -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              </div>
            </div>

            {/* Tailwind configga qo'shimcha shimmer animatsiyasi kerak bo'lsa yoki inline style bilan: */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `,
              }}
            />
          </div>
        }
      >
        <Routes>
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Dashboard />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/finance"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Finance />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tasks"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Tasks />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/logs"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Logs />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/vacations"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Vacations />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/settings"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Settings />
                </MainLayOut>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/complaints"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Complaints />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Employees />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/archieve"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Archieve />
                </MainLayOut>
              </ProtectedRoute>
            }
          >
            <Route element={<TasksArchieve />} path="tasksArchieve" />
            <Route element={<ComplaintsArchieve />} path="complaintsArchieve" />
            <Route
              element={<AnnouncementsArchieve />}
              path="announcementsArchieve"
            />
            <Route element={<EmployeesArchieve />} path="employeesArchieve" />
          </Route>
          <Route
            path="/manager/announcemenets"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Announcements />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/leaves"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Leaves />
                </MainLayOut>
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/signin" element={<Login />} />
          <Route path="/auth/signup" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
