import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'
const servicesUrl = apiUrl.replace(/\/$/, '') + '/api/services'
const emptyForm = { title: '', description: '' }

export default function AdminServices() {
  const [services, setServices] = useState([])
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

    async function loadServices() {
      try {
        const response = await fetch(servicesUrl, { signal: controller.signal })
        const result = await response.json()

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error('Could not load services.')
        }

        if (!controller.signal.aborted) setServices(result.data)
      } catch {
        if (!controller.signal.aborted) setError('Could not load services. Please reload the page to try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadServices()
    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  function startEditing({ id, title, description }) {
    setEditingId(id)
    setForm({ title: title ?? '', description: description ?? '' })
    setSaveError('')
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setSaveError('')
  }

  async function saveService(event) {
    event.preventDefault()
    const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    if (Object.values(fields).some(value => !value)) {
      setSaveError('Please fill in every field.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const url = editingId ? servicesUrl + '/' + encodeURIComponent(editingId) : servicesUrl
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok || !result.success || (!editingId && !result.data?.id)) {
        throw new Error('Could not save service.')
      }

      if (editingId) {
        setServices(previous => previous.map(service =>
          service.id === editingId ? { ...service, ...fields } : service
        ))
      } else {
        setServices(previous => [...previous, result.data])
      }
      resetForm()
    } catch {
      setSaveError('Could not save service. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteService(service) {
    if (busy || !window.confirm('Delete the service ' + service.title + '?')) return

    setDeletingId(service.id)
    setDeleteError('')
    try {
      const response = await fetch(servicesUrl + '/' + encodeURIComponent(service.id), {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('Could not delete service.')

      setServices(previous => previous.filter(item => item.id !== service.id))
      if (editingId === service.id) resetForm()
    } catch {
      setDeleteError('Could not delete the service. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <h2>Manage Services</h2>
      <h3>{editingId ? 'Edit Service' : 'Add a Service'}</h3>
      <form onSubmit={saveService}>
        <fieldset disabled={loading || busy}>
          <label htmlFor="service-title">Title</label>
          <input id="service-title" name="title" value={form.title} onChange={handleChange} required />
          <label htmlFor="service-description">Description</label>
          <textarea id="service-description" name="description" value={form.description} onChange={handleChange} required />
          <button type="submit">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Service'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </fieldset>
        {saveError && <p role="alert">{saveError}</p>}
      </form>
      {loading && <p role="status">Loading services...</p>}
      {error && <p role="alert">{error}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}
      {!loading && !error && services.length === 0 && <p>No services yet.</p>}
      {services.length > 0 && (
        <ul>
          {services.map(service => (
            <li key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button type="button" disabled={busy} onClick={() => startEditing(service)}>Edit</button>
              <button type="button" disabled={busy} onClick={() => deleteService(service)}>
                {deletingId === service.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
