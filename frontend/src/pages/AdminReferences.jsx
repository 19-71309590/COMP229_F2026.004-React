import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'
const referencesUrl = apiUrl.replace(/\/$/, '') + '/api/references'

export default function AdminReferences() {
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <section>
      <h2>Manage References</h2>
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
