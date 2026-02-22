import { useLocation, useNavigate } from 'react-router-dom'

const CAPTURED_PHOTO_KEY = 'capturedPhotoData'

function PhotoResultPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const storedPhotoRaw = localStorage.getItem(CAPTURED_PHOTO_KEY)
  let storedPhoto = null

  if (storedPhotoRaw) {
    try {
      storedPhoto = JSON.parse(storedPhotoRaw)
    } catch {
      storedPhoto = null
    }
  }

  const image = location.state?.image ?? storedPhoto?.image
  const employeeName = location.state?.employeeName ?? storedPhoto?.employeeName ?? 'Employee'
  const detailsId = location.state?.detailsId ?? storedPhoto?.detailsId

  if (!image) {
    return (
      <div className="page">
        <div className="card">
          <h2>No photo captured yet</h2>
          <button onClick={() => navigate('/list')}>Back to List</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Photo Result</h2>
        <p className="subtle">Captured for {employeeName}</p>
        <img src={image} alt="Captured" className="captured-image" />
        <div className="top-bar-actions">
          {detailsId && (
            <button className="secondary" onClick={() => navigate(`/details/${detailsId}`)}>
              Retake Photo
            </button>
          )}
          <button onClick={() => navigate('/list')}>Back to List</button>
        </div>
      </div>
    </div>
  )
}

export default PhotoResultPage
