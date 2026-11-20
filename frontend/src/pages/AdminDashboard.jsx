import { Link, Route, Routes } from 'react-router-dom'
import AdminReferences from './AdminReferences'
import AdminProjects from './AdminProjects'

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
        {sections.filter(section => section !== 'References' && section !== 'Projects').map(section => (
          <Route key={section} path={section.toLowerCase()} element={<h2>Manage {section}</h2>} />
        ))}
        <Route path="references" element={<AdminReferences />} />
        <Route path="projects" element={<AdminProjects />} />
      </Routes>
    </main>
  )
}
