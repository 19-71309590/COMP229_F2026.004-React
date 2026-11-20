import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminRequest } from '../../datasource/adminApi'

export default function AdminList({ resource, title, fields, base }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const columns = fields.filter(field => field.type !== 'password')

  useEffect(() => {
    const controller = new AbortController()
    adminRequest(resource, { signal: controller.signal }).then(data => {
      if (!Array.isArray(data)) throw new Error('Expected a list.')
      if (!controller.signal.aborted) setItems(data)
    }).catch(() => {
      if (!controller.signal.aborted) setError('Could not load the list. Reload to try again.')
    })
    return () => controller.abort()
  }, [resource])

  async function removeItem(id) {
    if (!window.confirm('Delete this item?')) return
    setDeleting(id)
    setError('')
    try {
      await adminRequest(resource, { id, method: 'DELETE' })
      setItems(previous => previous.filter(item => item.id !== id))
    } catch {
      setError('Could not delete the item. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section>
      <h2>{title} List</h2>
      <Link to={base + '/add'}>Add {title}</Link>
      {error && <p role="alert">{error}</p>}
      {!items && !error && <p role="status">Loading...</p>}
      {items?.length === 0 && <p>No items yet.</p>}
      {items?.length > 0 && (
        <div className="admin-table">
          <table>
            <thead>
              <tr>{columns.map(field => <th key={field.name} scope="col">{field.label}</th>)}<th scope="col">Actions</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(({ name, type }) => (
                    <td key={name}>{type === 'date' ? item[name]?.slice(0, 10) || 'In progress' : item[name]}</td>
                  ))}
                  <td>
                    <Link to={base + '/' + encodeURIComponent(item.id) + '/edit'}>Edit</Link>{' '}
                    <button disabled={deleting !== null} onClick={() => removeItem(item.id)}>
                      {deleting === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
