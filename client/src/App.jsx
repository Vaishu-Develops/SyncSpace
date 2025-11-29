import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/EnhancedDashboard'));
const WorkspaceLayout = lazy(() => import('./components/WorkspaceLayout'));
const Board = lazy(() => import('./components/Board'));
const DocumentEditor = lazy(() => import('./components/DocumentEditor'));
const WorkspaceSettings = lazy(() => import('./pages/WorkspaceSettings'));
const WorkspacesPage = lazy(() => import('./pages/WorkspacesPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const WorkspaceOverview = lazy(() => import('./components/Workspace/WorkspaceOverview'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const FilesPage = lazy(() => import('./pages/FilesPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ChatPanel = lazy(() => import('./components/Chat/ChatPanel'));
const FileManager = lazy(() => import('./components/Files/FileManager'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MainLayout = lazy(() => import('./components/MainLayout'));

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 animate-pulse">Loading SyncSpace...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const ChatViewWrapper = () => {
  const { workspaceId } = useOutletContext();
  return <ChatPanel workspaceId={workspaceId} />;
};

const FilesViewWrapper = () => {
  const { workspaceId } = useOutletContext();
  return <FileManager workspaceId={workspaceId} />;
};


function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes with Sidebar Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="/project/:projectId" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route
                path="/workspaces"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <WorkspacesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TeamsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TasksPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <NotificationsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <FilesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <FavoritesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CalendarPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SettingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspace/:workspaceId"
                element={
                  <ProtectedRoute>
                    <WorkspaceLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<WorkspaceOverview />} />
                <Route path="board" element={<Board />} />
                <Route path="docs" element={<DocumentEditor />} />
                <Route path="chat" element={<ChatViewWrapper />} />
                <Route path="files" element={<FilesViewWrapper />} />
                <Route path="settings" element={<WorkspaceSettings />} />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={
                <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                    <Link to="/" className="text-primary hover:text-primary/80 underline">
                      Go back to home
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
