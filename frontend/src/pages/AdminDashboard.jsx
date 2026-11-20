import { Link, Route, Routes, useLocation } from 'react-router-dom'
import AdminForm from '../components/admin/AdminForm'
import AdminList from '../components/admin/AdminList'
import './AdminDashboard.css'

const sections = [
  { resource: 'users', title: 'User', fields: [
    { name: 'firstname', label: 'First Name' },
    { name: 'lastname', label: 'Last Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ] },
  { resource: 'projects', title: 'Project', fields: [
    { name: 'title', label: 'Title' },
    { name: 'completion', label: 'Completion Date', type: 'date', optional: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image URL or Path' },
  ] },
  { resource: 'services', title: 'Service', fields: [
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ] },
  { resource: 'references', title: 'Reference', fields: [
    { name: 'name', label: 'Name' },
    { name: 'position', label: 'Position' },
    { name: 'company', label: 'Company' },
    { name: 'testimonial', label: 'Testimonial', type: 'textarea' },
  ] },
]

export default function AdminDashboard() {
  const { pathname } = useLocation()

  return (
    <main className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <ul>
        {sections.map(({ resource, title }) => (
          <li key={resource}><Link to={'/admin/' + resource}>{title}s</Link></li>
        ))}
      </ul>
      <Routes>
        {sections.map(section => {
          const { resource } = section
          const props = { ...section, base: '/admin/' + resource }
          return (
            <Route key={resource} path={resource}>
              <Route index element={<AdminList key={resource} {...props} />} />
              <Route path="add" element={<AdminForm key={pathname} {...props} />} />
              <Route path=":id/edit" element={<AdminForm key={pathname} {...props} />} />
            </Route>
          )
        })}
        <Route index element={null} />
      </Routes>
    </main>
  )
}
