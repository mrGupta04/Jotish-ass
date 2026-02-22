import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cacheEmployees, fetchEmployees } from '../utils/employees'

function ListPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('salary-desc')
  const [page, setPage] = useState(1)

  const pageSize = 10

  const cityCount = useMemo(() => {
    return employees.reduce((accumulator, employee) => {
      accumulator[employee.city] = (accumulator[employee.city] ?? 0) + 1
      return accumulator
    }, {})
  }, [employees])

  const uniqueCities = useMemo(() => {
    return [...new Set(employees.map((employee) => employee.city))].sort((a, b) =>
      a.localeCompare(b),
    )
  }, [employees])

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = employees.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        employee.name.toLowerCase().includes(normalizedSearch) ||
        employee.position.toLowerCase().includes(normalizedSearch) ||
        employee.city.toLowerCase().includes(normalizedSearch)

      const matchesCity = cityFilter === 'all' || employee.city === cityFilter
      return matchesSearch && matchesCity
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'salary-asc') return a.salaryAmount - b.salaryAmount
      if (sortBy === 'salary-desc') return b.salaryAmount - a.salaryAmount
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      return 0
    })

    return sorted
  }, [employees, searchTerm, cityFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize)

  const averageSalary = useMemo(() => {
    if (filteredEmployees.length === 0) {
      return 0
    }
    const total = filteredEmployees.reduce(
      (accumulator, employee) => accumulator + employee.salaryAmount,
      0,
    )
    return Math.round(total / filteredEmployees.length)
  }, [filteredEmployees])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, cityFilter, sortBy])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const loadEmployees = async () => {
    setLoading(true)
    setError('')
    try {
      const list = await fetchEmployees()
      setEmployees(list)
      cacheEmployees(list)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/')
  }

  const goToDetails = (employee) => {
    navigate(`/details/${employee.id}`, {
      state: { employee },
    })
  }

  const exportFilteredToCsv = () => {
    if (filteredEmployees.length === 0) {
      return
    }

    const headers = ['Name', 'Position', 'City', 'Extension', 'Joining Date', 'Salary']
    const rows = filteredEmployees.map((employee) => [
      employee.name,
      employee.position,
      employee.city,
      employee.extension,
      employee.joiningDate,
      employee.salary,
    ])

    const escapeCsv = (value) => {
      const stringValue = String(value ?? '')
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replaceAll('"', '""')}"`
      }
      return stringValue
    }

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employees_filtered_export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div className="top-bar">
        <h2>Employees List</h2>
        <div className="top-bar-actions">
          <button className="secondary" onClick={() => navigate('/chart')}>
            View Salary Bar Graph
          </button>
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        {loading && <p>Loading employee data...</p>}
        {error && (
          <div>
            <p className="error-text">{error}</p>
            <button className="secondary" onClick={loadEmployees}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Employees</p>
                <h3>{employees.length}</h3>
              </div>
              <div className="stat-card">
                <p className="stat-label">Filtered Results</p>
                <h3>{filteredEmployees.length}</h3>
              </div>
              <div className="stat-card">
                <p className="stat-label">Average Salary</p>
                <h3>${averageSalary.toLocaleString()}</h3>
              </div>
            </div>

            <div className="list-controls">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, position, or city"
              />

              <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="salary-desc">Sort: Salary High to Low</option>
                <option value="salary-asc">Sort: Salary Low to High</option>
                <option value="name-asc">Sort: Name A to Z</option>
                <option value="name-desc">Sort: Name Z to A</option>
              </select>

              <button
                className="secondary"
                onClick={() => {
                  setSearchTerm('')
                  setCityFilter('all')
                  setSortBy('salary-desc')
                }}
              >
                Reset
              </button>

              <button onClick={exportFilteredToCsv} disabled={filteredEmployees.length === 0}>
                Export CSV
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>City</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} onClick={() => goToDetails(employee)}>
                      <td>{employee.name}</td>
                      <td>{employee.position}</td>
                      <td>{employee.city}</td>
                      <td>{employee.salary}</td>
                      <td>
                        <button
                          className="secondary"
                          onClick={(event) => {
                            event.stopPropagation()
                            goToDetails(employee)
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <p className="subtle">No employees found for your current filters.</p>
            )}

            <div className="pagination-row">
              <button
                className="secondary"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="secondary"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((currentPage) => Math.min(totalPages, currentPage + 1))
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {!loading && !error && (
        <div className="card city-card">
          <h3>Employees by City</h3>
          <div className="badge-grid">
            {Object.entries(cityCount).map(([city, count]) => (
              <span className="city-badge" key={city}>
                {city}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListPage
