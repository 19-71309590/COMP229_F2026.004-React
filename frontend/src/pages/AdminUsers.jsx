import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'
const usersUrl = apiUrl.replace(/\/$/, '') + '/api/users'
const emptyForm = { firstname: '', lastname: '', email: '', password: '' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const busy = saving || deletingId !== null

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(usersUrl, { signal: controller.signal })
        const result = await response.json()

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error('Could not load users.')
        }

        if (!controller.signal.aborted) setUsers(result.data)
      } catch {
        if (!controller.signal.aborted) setError('Could not load users. Please reload the page to try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  function startEditing({ id, firstname, lastname, email }) {
    setEditingId(id)
    setForm({ firstname: firstname ?? '', lastname: lastname ?? '', email: email ?? '', password: '' })
    setSaveError('')
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setSaveError('')
  }

  async function saveUser(event) {
    event.preventDefault()
    const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    if (!fields.firstname || !fields.lastname || !fields.email || (!editingId && !fields.password)) {
      setSaveError('Please fill in the required fields.')
      return
    }

    fields.password = form.password
    if (editingId && !fields.password) delete fields.password
    const { firstname, lastname, email } = fields

    setSaving(true)
    setSaveError('')
    try {
      const url = editingId ? usersUrl + '/' + encodeURIComponent(editingId) : usersUrl
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok || !result.success || (!editingId && !result.data?.id)) {
        throw new Error('Could not save user.')
      }

      if (editingId) {
        setUsers(previous => previous.map(user =>
          user.id === editingId ? { ...user, firstname, lastname, email } : user
        ))
      } else {
        setUsers(previous => [...previous, result.data])
      }
      resetForm()
    } catch {
      setSaveError('Could not save user. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser(user) {
    if (busy || !window.confirm('Delete the user ' + user.email + '?')) return

    setDeletingId(user.id)
    setDeleteError('')
    try {
      const response = await fetch(usersUrl + '/' + encodeURIComponent(user.id), {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('Could not delete user.')

      setUsers(previous => previous.filter(item => item.id !== user.id))
      if (editingId === user.id) resetForm()
    } catch {
      setDeleteError('Could not delete the user. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <h2>Manage Users</h2>
      <h3>{editingId ? 'Edit User' : 'Add a User'}</h3>
      <form onSubmit={saveUser}>
        <fieldset disabled={loading || busy}>
          <label htmlFor="user-firstname">First Name</label>
          <input id="user-firstname" name="firstname" value={form.firstname} onChange={handleChange} required />
          <label htmlFor="user-lastname">Last Name</label>
          <input id="user-lastname" name="lastname" value={form.lastname} onChange={handleChange} required />
          <label htmlFor="user-email">Email</label>
          <input id="user-email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="user-password">{editingId ? 'New Password (optional)' : 'Password'}</label>
          <input id="user-password" type="password" name="password" autoComplete="new-password" value={form.password} onChange={handleChange} required={!editingId} />
          <button type="submit">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add User'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </fieldset>
        {saveError && <p role="alert">{saveError}</p>}
      </form>
      {loading && <p role="status">Loading users...</p>}
      {error && <p role="alert">{error}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}
      {!loading && !error && users.length === 0 && <p>No users yet.</p>}
      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <h3>{user.firstname} {user.lastname}</h3>
              <p>{user.email}</p>
              <button type="button" disabled={busy} onClick={() => startEditing(user)}>Edit</button>
              <button type="button" disabled={busy} onClick={() => deleteUser(user)}>
                {deletingId === user.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
