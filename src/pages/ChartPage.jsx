import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getCachedEmployees } from '../utils/employees'

const CHART_COLORS = ['#2563eb', '#0f766e', '#7c3aed', '#ea580c', '#b91c1c', '#0891b2']

function ChartPage() {
  const navigate = useNavigate()

  const chartData = useMemo(() => {
    return getCachedEmployees()
      .slice(0, 10)
      .map((employee) => ({
        name: employee.name,
        salaryAmount: employee.salaryAmount,
      }))
  }, [])

  const cityDistributionData = useMemo(() => {
    const cityMap = getCachedEmployees().reduce((accumulator, employee) => {
      accumulator[employee.city] = (accumulator[employee.city] ?? 0) + 1
      return accumulator
    }, {})

    return Object.entries(cityMap)
      .map(([city, employees]) => ({ city, employees }))
      .sort((a, b) => b.employees - a.employees)
  }, [])

  const citySalaryData = useMemo(() => {
    const grouped = getCachedEmployees().reduce((accumulator, employee) => {
      if (!accumulator[employee.city]) {
        accumulator[employee.city] = { total: 0, count: 0 }
      }

      accumulator[employee.city].total += employee.salaryAmount
      accumulator[employee.city].count += 1
      return accumulator
    }, {})

    return Object.entries(grouped)
      .map(([city, values]) => ({
        city,
        averageSalary: Math.round(values.total / values.count),
      }))
      .sort((a, b) => b.averageSalary - a.averageSalary)
  }, [])

  return (
    <div className="page">
      <div className="card">
        <h2>Salary Bar Graph (First 10 Employees)</h2>
        <p className="subtle">Data shown in USD based on API response.</p>

        {chartData.length === 0 ? (
          <div>
            <p className="error-text">
              No employee data found. Open list page first to load data.
            </p>
            <button onClick={() => navigate('/list')}>Go to List Page</button>
          </div>
        ) : (
          <div className="chart-grid">
            <div className="chart-container">
              <h3>Salary by Employee (Top 10)</h3>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" height={90} interval={0} />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Bar dataKey="salaryAmount" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Employees by City</h3>
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={cityDistributionData}
                    dataKey="employees"
                    nameKey="city"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {cityDistributionData.map((entry, index) => (
                      <Cell key={entry.city} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Average Salary by City</h3>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={citySalaryData} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Line type="monotone" dataKey="averageSalary" stroke="#0f766e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <button className="secondary" onClick={() => navigate('/list')}>
          Back to List
        </button>
      </div>
    </div>
  )
}

export default ChartPage
