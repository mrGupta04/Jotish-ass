import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VALID_USERNAME = 'testuser'
const VALID_PASSWORD = 'Test123'

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true')
      setError('')
      navigate('/list')
      return
    }

    setError('Invalid credentials. Use testuser / Test123.')
  }

  return (
    <div className="page login-page">
      <div className="card login-card">
        <h1>Employee Portal</h1>
        <p className="subtle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="hint">Demo login: testuser / Test123</p>
      </div>
    </div>
  )
}

export default LoginPage
