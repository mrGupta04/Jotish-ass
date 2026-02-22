const API_URL = import.meta.env.DEV
  ? '/api/gettabledata.php'
  : 'https://backend.jotish.in/backend_dev/gettabledata.php'

const API_PAYLOAD = {
  username: 'test',
  password: '123456',
}

const EMPLOYEE_CACHE_KEY = 'employeesCache'

export const parseSalary = (salaryText) =>
  Number(String(salaryText).replace(/[^\d.]/g, '')) || 0

export const mapEmployeeRow = (row, index) => ({
  id: index.toString(),
  name: row?.[0] ?? 'N/A',
  position: row?.[1] ?? 'N/A',
  city: row?.[2] ?? 'N/A',
  extension: row?.[3] ?? 'N/A',
  joiningDate: row?.[4] ?? 'N/A',
  salary: row?.[5] ?? '$0',
  salaryAmount: parseSalary(row?.[5]),
})

export async function fetchEmployees() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(API_PAYLOAD),
    })

    if (!response.ok) {
      throw new Error('Unable to fetch employee data. Please try again.')
    }

    const payload = await response.json()
    const rows = payload?.TABLE_DATA?.data ?? []
    return rows.map(mapEmployeeRow)
  } catch {
    throw new Error(
      'Unable to fetch employee data. If running locally, start with npm run dev so the Vite proxy can avoid CORS issues.',
    )
  }
}

export function cacheEmployees(employees) {
  localStorage.setItem(EMPLOYEE_CACHE_KEY, JSON.stringify(employees))
}

export function getCachedEmployees() {
  const raw = localStorage.getItem(EMPLOYEE_CACHE_KEY)
  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}
