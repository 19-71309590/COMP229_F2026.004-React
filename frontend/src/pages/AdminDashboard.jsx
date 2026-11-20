import { Link, Route, Routes } from 'react-router-dom'
import AdminReferences from './AdminReferences'
import AdminProjects from './AdminProjects'
import AdminServices from './AdminServices'
import AdminUsers from './AdminUsers'

const sections = ['Users', 'Projects', 'Services', 'References']

export default function AdminDashboard() {
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <ul>
        {sections.map(section => (
          <li key={section}><Link to={'/admin/' + section.toLowerCase()}>{section}</Link></li>
        ))}
      </ul>
      <Routes>
        <Route path="users" element={<AdminUsers />} />
        <Route path="references" element={<AdminReferences />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="services" element={<AdminServices />} />
      </Routes>
    </main>
  )
}
