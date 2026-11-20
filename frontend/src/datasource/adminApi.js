const apiUrl = import.meta.env.VITE_API_URL || 'https://comp229-f2026-004-react.onrender.com'

export async function adminRequest(resource, { id, method = 'GET', fields, signal } = {}) {
  const path = id ? resource + '/' + encodeURIComponent(id) : resource
  const response = await fetch(apiUrl.replace(/\/$/, '') + '/api/' + path, {
    method,
    signal,
    headers: fields ? { 'Content-Type': 'application/json' } : undefined,
    body: fields ? JSON.stringify(fields) : undefined,
  })
  const result = await response.json()
  if (!response.ok || !result.success) throw new Error('API request failed.')
  return result.data
}
