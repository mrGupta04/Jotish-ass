import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ChartPage from './pages/ChartPage'
import DetailsPage from './pages/DetailsPage'
import ListPage from './pages/ListPage'
import LoginPage from './pages/LoginPage'
import PhotoResultPage from './pages/PhotoResultPage'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/list"
        element={
          <ProtectedRoute>
            <ListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details/:id"
        element={
          <ProtectedRoute>
            <DetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/photo-result"
        element={
          <ProtectedRoute>
            <PhotoResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chart"
        element={
          <ProtectedRoute>
            <ChartPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
