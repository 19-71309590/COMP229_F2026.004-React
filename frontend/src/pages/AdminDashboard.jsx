import { Link, Route, Routes } from 'react-router-dom'

const sections = ['Users', 'Projects', 'Services', 'References']

export default function AdminDashboard() {
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <ul>
        {sections.map(section => (
          <li key={section}><Link to={section.toLowerCase()}>{section}</Link></li>
        ))}
      </ul>
      <Routes>
        {sections.map(section => (
          <Route key={section} path={section.toLowerCase()} element={<h2>Manage {section}</h2>} />
        ))}
      </Routes>
    </main>
  )
}
