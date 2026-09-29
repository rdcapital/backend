import { useEffect, useMemo, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const initialForm = {
  name: '',
  age: '',
  gender: 'Male',
  location: '',
  phoneNumber: '',
}

const fallbackStudents = [
  {
    _id: 'demo-1',
    name: 'Ruth Mensah',
    age: 20,
    gender: 'Female',
    location: 'Accra',
    phoneNumber: 233244123456,
  },
  {
    _id: 'demo-2',
    name: 'Rodney Ansong',
    age: 40,
    gender: 'Male',
    location: 'Kumasi',
    phoneNumber: 233543765432,
  },
  {
    _id: 'demo-3',
    name: 'Faith Asante',
    age: 19,
    gender: 'Female',
    location: 'Tema',
    phoneNumber: 233501334455,
  },
]

const API_URL = '/api/student'

const Home = () => {
  const [students, setStudents] = useState(fallbackStudents)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const stats = useMemo(() => {
    const total = students.length
    const averageAge = total
      ? Math.round(students.reduce((sum, student) => sum + Number(student.age || 0), 0) / total)
      : 0
    const locations = new Set(students.map((student) => student.location)).size

    return {
      total,
      averageAge,
      locations,
    }
  }, [students])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Unable to fetch student list.')

      const data = await response.json()
      const nextStudents = Array.isArray(data) ? data : []

      setStudents(nextStudents.length ? nextStudents : fallbackStudents)
      setMessage({
        type: 'success',
        text: nextStudents.length
          ? 'Student records loaded successfully.'
          : 'No students have been saved yet. Add the first one below.',
      })
    } catch (error) {
      setStudents(fallbackStudents)
      setMessage({
        type: 'error',
        text: 'The backend is not running yet, so demo data is being displayed.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        phoneNumber: Number(form.phoneNumber),
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Student could not be created.')
      }

      const createdStudent = await response.json()
      setStudents((currentStudents) => [createdStudent, ...currentStudents])
      setForm(initialForm)
      setMessage({
        type: 'success',
        text: 'Student added successfully.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Student registration failed. Please check the backend connection.',
      })
    }
  }

  return (
    <div className="page-shell">
      <NavBar />

      <main className="home-page">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Student management</span>
            <h1>Build a brighter future for every learner.</h1>
            <p>
              Keep student information organized, track student growth, and manage your
              campus records from one place.
            </p>
            <div className="hero-actions">
              <a href="#student-form" className="primary-btn">
                Add student
              </a>
              <button type="button" className="secondary-btn" onClick={loadStudents}>
                Refresh list
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total students</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Average age</span>
              <strong>{stats.averageAge} yrs</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Locations</span>
              <strong>{stats.locations}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid" id="student-form">
          <div className="panel form-panel">
            <div className="panel-header">
              <h2>Register student</h2>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Age
                  <input
                    type="number"
                    name="age"
                    min="1"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Gender
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <label>
                Location
                <input
                  type="text"
                  name="location"
                  placeholder="City or town"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              {message.text ? (
                <p className={`form-message ${message.type}`}>{message.text}</p>
              ) : null}

              <button type="submit" className="submit-btn">
                Save student
              </button>
            </form>
          </div>

          <div className="panel list-panel">
            <div className="panel-header list-header">
              <h2>Student directory</h2>
              <span>{students.length} records</span>
            </div>

            {loading ? (
              <p className="empty-state">Loading students...</p>
            ) : (
              <ul className="student-list">
                {students.map((student) => (
                  <li key={student._id || `${student.name}-${student.phoneNumber}`} className="student-item">
                    <div className="student-main">
                      <h3>{student.name}</h3>
                      <p>{student.location}</p>
                    </div>
                    <div className="student-meta">
                      <span>{student.gender}</span>
                      <span>{student.age} years</span>
                    </div>
                    <a href={`tel:${student.phoneNumber}`}>{student.phoneNumber}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
