import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'
const referencesUrl = apiUrl.replace(/\/$/, '') + '/api/references'
const emptyForm = { name: '', position: '', company: '', testimonial: '' }

export default function AdminReferences() {
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadReferences() {
      try {
        const response = await fetch(referencesUrl, { signal: controller.signal })
        const result = await response.json()

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error('Could not load references.')
        }

        if (!controller.signal.aborted) setReferences(result.data)
      } catch {
        if (!controller.signal.aborted) setError('Could not load references. Please reload the page to try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadReferences()
    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  async function addReference(event) {
    event.preventDefault()
    const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    if (Object.values(fields).some(value => !value)) {
      setSaveError('Please fill in every field.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const response = await fetch(referencesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok || !result.success || !result.data?.id) {
        throw new Error('Could not add reference.')
      }

      setReferences(previous => [...previous, result.data])
      setForm(emptyForm)
    } catch {
      setSaveError('Could not add reference. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2>Manage References</h2>
      <h3>Add a Reference</h3>
      <form onSubmit={addReference}>
        <fieldset disabled={loading || saving}>
          <label htmlFor="reference-name">Name</label>
          <input id="reference-name" name="name" value={form.name} onChange={handleChange} required />
          <label htmlFor="reference-position">Position</label>
          <input id="reference-position" name="position" value={form.position} onChange={handleChange} required />
          <label htmlFor="reference-company">Company</label>
          <input id="reference-company" name="company" value={form.company} onChange={handleChange} required />
          <label htmlFor="reference-testimonial">Testimonial</label>
          <textarea id="reference-testimonial" name="testimonial" value={form.testimonial} onChange={handleChange} required />
          <button type="submit">{saving ? 'Saving...' : 'Add Reference'}</button>
        </fieldset>
        {saveError && <p role="alert">{saveError}</p>}
      </form>
      {loading && <p role="status">Loading references...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && references.length === 0 && <p>No references yet.</p>}
      {references.length > 0 && (
        <ul>
          {references.map(reference => (
            <li key={reference.id}>
              <h3>{reference.name}</h3>
              <p>{reference.position} · {reference.company}</p>
              <blockquote>{reference.testimonial}</blockquote>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
