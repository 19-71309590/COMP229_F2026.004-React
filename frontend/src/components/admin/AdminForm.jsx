import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminRequest } from '../../datasource/adminApi'

export default function AdminForm({ resource, title, fields, base }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState({})
  const [loadedId, setLoadedId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const loading = Boolean(id && loadedId !== id)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    adminRequest(resource, { id, signal: controller.signal }).then(item => {
      if (!item) throw new Error('Expected an item.')
      if (controller.signal.aborted) return
      setValues(Object.fromEntries(fields.map(({ name, type }) => {
        if (type === 'password') return [name, '']
        const value = item[name] ?? ''
        return [name, type === 'date' ? value.slice(0, 10) : value]
      })))
      setLoadedId(id)
    }).catch(() => {
      if (!controller.signal.aborted) setError('Could not load the item. Reload to try again.')
    })
    return () => controller.abort()
  }, [resource, id, fields])

  async function save(event) {
    event.preventDefault()
    const payload = {}
    for (const { name, type, optional } of fields) {
      const raw = values[name] ?? ''
      const value = type === 'password' ? raw : raw.trim()
      if (id && type === 'password' && !value) continue
      if (!optional && !value.trim()) {
        setError('Please fill in the required fields.')
        return
      }
      payload[name] = type === 'date' && !value ? null : value
    }
    setSaving(true)
    setError('')
    try {
      await adminRequest(resource, { id, method: id ? 'PUT' : 'POST', fields: payload })
      navigate(base)
    } catch {
      setError('Could not save the item. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2>{id ? 'Edit' : 'Add'} {title}</h2>
      {loading && !error && <p role="status">Loading...</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={save}>
        <fieldset disabled={loading || saving}>
          {fields.map(({ name, label, type, optional }) => {
            const passwordOnEdit = id && type === 'password'
            const props = {
              id: resource + '-' + name,
              value: values[name] ?? '',
              required: !optional && !passwordOnEdit,
              onChange: event => {
                const value = event.target.value
                setValues(previous => ({ ...previous, [name]: value }))
              },
            }
            return (
              <div key={name}>
                <label htmlFor={props.id}>{passwordOnEdit ? 'New Password (optional)' : label}</label>
                {type === 'textarea' ? <textarea {...props} /> : (
                  <input {...props} type={type || 'text'} autoComplete={type === 'password' ? 'new-password' : undefined} />
                )}
              </div>
            )
          })}
          <button type="submit">{saving ? 'Saving...' : 'Save'}</button>
        </fieldset>
        <Link to={base}>Cancel</Link>
      </form>
    </section>
  )
}
