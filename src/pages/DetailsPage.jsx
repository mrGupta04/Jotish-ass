import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getCachedEmployees } from '../utils/employees'

const CAPTURED_PHOTO_KEY = 'capturedPhotoData'

function DetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const streamRef = useRef(null)

  const employeeFromState = location.state?.employee
  const employee =
    employeeFromState ?? getCachedEmployees().find((item) => item.id === id)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      setCameraError('Unable to access camera. Please allow camera permissions.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const capturedImage = canvas.toDataURL('image/png')
    localStorage.setItem(
      CAPTURED_PHOTO_KEY,
      JSON.stringify({
        image: capturedImage,
        employeeName: employee?.name ?? 'Employee',
        detailsId: id,
      }),
    )

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)

    navigate('/photo-result', {
      state: {
        image: capturedImage,
        employeeName: employee?.name ?? 'Employee',
        detailsId: id,
      },
    })
  }

  if (!employee) {
    return (
      <div className="page">
        <div className="card">
          <h2>Employee not found</h2>
          <button onClick={() => navigate('/list')}>Back to List</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Employee Details</h2>
        <div className="details-grid">
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Position:</strong> {employee.position}
          </p>
          <p>
            <strong>City:</strong> {employee.city}
          </p>
          <p>
            <strong>Extension:</strong> {employee.extension}
          </p>
          <p>
            <strong>Joining Date:</strong> {employee.joiningDate}
          </p>
          <p>
            <strong>Salary:</strong> {employee.salary}
          </p>
        </div>

        <div className="top-bar-actions">
          {!cameraActive && (
            <button onClick={startCamera}>Capture Photo Using Camera</button>
          )}
          <button className="secondary" onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>

        {cameraError && <p className="error-text">{cameraError}</p>}

        {cameraActive && (
          <div className="camera-box">
            <video ref={videoRef} autoPlay playsInline className="camera-video" />
            <button onClick={capturePhoto}>Click Photo</button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default DetailsPage
