import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'
const projectsUrl = apiUrl.replace(/\/$/, '') + '/api/projects'
const emptyForm = { title: '', completion: '', image: '', description: '' }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
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

    async function loadProjects() {
      try {
        const response = await fetch(projectsUrl, { signal: controller.signal })
        const result = await response.json()

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error('Could not load projects.')
        }

        if (!controller.signal.aborted) setProjects(result.data)
      } catch {
        if (!controller.signal.aborted) setError('Could not load projects. Please reload the page to try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProjects()
    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  function startEditing({ id, title, completion, image, description }) {
    setEditingId(id)
    setForm({ title: title ?? '', completion: completion?.slice(0, 10) ?? '', image: image ?? '', description: description ?? '' })
    setSaveError('')
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setSaveError('')
  }

  async function saveProject(event) {
    event.preventDefault()
    const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    if (!fields.title || !fields.image || !fields.description) {
      setSaveError('Enter a title, description, and image path.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const url = editingId ? projectsUrl + '/' + encodeURIComponent(editingId) : projectsUrl
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, completion: fields.completion || null }),
      })
      const result = await response.json()
      if (!response.ok || !result.success || (!editingId && !result.data?.id)) {
        throw new Error('Could not save project.')
      }

      if (editingId) {
        setProjects(previous => previous.map(project =>
          project.id === editingId ? { ...project, ...fields } : project
        ))
      } else {
        setProjects(previous => [...previous, result.data])
      }
      resetForm()
    } catch {
      setSaveError('Could not save project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(project) {
    if (busy || !window.confirm('Delete the project ' + project.title + '?')) return

    setDeletingId(project.id)
    setDeleteError('')
    try {
      const response = await fetch(projectsUrl + '/' + encodeURIComponent(project.id), {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('Could not delete project.')

      setProjects(previous => previous.filter(item => item.id !== project.id))
      if (editingId === project.id) resetForm()
    } catch {
      setDeleteError('Could not delete the project. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <h2>Manage Projects</h2>
      <h3>{editingId ? 'Edit Project' : 'Add a Project'}</h3>
      <form onSubmit={saveProject}>
        <fieldset disabled={loading || busy}>
          <label htmlFor="project-title">Title</label>
          <input id="project-title" name="title" value={form.title} onChange={handleChange} required />
          <label htmlFor="project-completion">Completion Date</label>
          <input id="project-completion" type="date" name="completion" value={form.completion} onChange={handleChange} />
          <label htmlFor="project-image">Image URL or Path</label>
          <input id="project-image" name="image" value={form.image} onChange={handleChange} required />
          <label htmlFor="project-description">Description</label>
          <textarea id="project-description" name="description" value={form.description} onChange={handleChange} required />
          <button type="submit">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Project'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </fieldset>
        {saveError && <p role="alert">{saveError}</p>}
      </form>
      {loading && <p role="status">Loading projects...</p>}
      {error && <p role="alert">{error}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}
      {!loading && !error && projects.length === 0 && <p>No projects yet.</p>}
      {projects.length > 0 && (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.completion?.slice(0, 10) || 'In progress'}</p>
              <p>{project.description}</p>
              <p>Image: {project.image}</p>
              <button type="button" disabled={busy} onClick={() => startEditing(project)}>Edit</button>
              <button type="button" disabled={busy} onClick={() => deleteProject(project)}>
                {deletingId === project.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
