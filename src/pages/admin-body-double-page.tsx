import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarPlus, Clock, Pencil, Trash2, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  createFocusSession,
  deleteFocusSession,
  subscribeToAdminFocusSessions,
  updateFocusSession,
  type AdminFocusSessionInput,
} from '@/lib/focus-sessions'
import type { FocusSession, SessionPlatform } from '@/types/body-doubling'

const EMPTY_FORM = {
  title: 'Focus Together Session',
  startsAt: '',
  durationMinutes: '60',
  platform: 'Google Meet' as SessionPlatform,
  meetingLink: 'To be sent',
  capacity: '20',
  isActive: true,
}

type SessionForm = typeof EMPTY_FORM

function toLocalInputValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function sessionToForm(session: FocusSession): SessionForm {
  return {
    title: session.title,
    startsAt: toLocalInputValue(session.startsAt),
    durationMinutes: String(session.durationMinutes),
    platform: session.platform,
    meetingLink: session.meetingLink,
    capacity: String(session.capacity),
    isActive: session.isActive,
  }
}

export function AdminBodyDoublePage() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [form, setForm] = useState<SessionForm>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    return subscribeToAdminFocusSessions(
      (nextSessions) => { setSessions(nextSessions); setLoading(false) },
      () => { setError('Could not load Body Double sessions.'); setLoading(false) },
    )
  }, [])

  const upcomingCount = useMemo(
    () => sessions.filter((session) => session.isActive && session.startsAt.getTime() >= Date.now()).length,
    [sessions],
  )

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const startsAt = new Date(form.startsAt)
    const durationMinutes = Number(form.durationMinutes)
    const capacity = Number(form.capacity)

    if (!form.title.trim() || Number.isNaN(startsAt.getTime()) || durationMinutes < 1 || capacity < 1) {
      setError('Add a title, valid date and time, duration, and capacity.')
      return
    }

    const input: AdminFocusSessionInput = {
      title: form.title,
      startsAt,
      durationMinutes,
      platform: form.platform,
      meetingLink: form.meetingLink,
      capacity,
      isActive: form.isActive,
    }

    setPending(true)
    setError(null)
    setMessage(null)
    try {
      if (editingId) {
        await updateFocusSession(editingId, input)
        setMessage('Session updated. The user screen will refresh automatically.')
      } else {
        await createFocusSession(input)
        setMessage('Session added. It is now available on the user screen.')
      }
      resetForm()
    } catch {
      setError('Could not save this session. Please try again.')
    } finally {
      setPending(false)
    }
  }

  async function handleDelete(sessionId: string) {
    setPending(true)
    setError(null)
    try {
      await deleteFocusSession(sessionId)
      setConfirmDeleteId(null)
      if (editingId === sessionId) resetForm()
      setMessage('Session deleted and removed from the user screen.')
    } catch {
      setError('Could not delete this session. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="page-enter grid gap-7 xl:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.2fr)]">
      <section className="h-fit rounded-3xl border border-border bg-surface-solid p-5 shadow-sm sm:p-6 xl:sticky xl:top-28">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green text-white">
            <CalendarPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-text">{editingId ? 'Edit session' : 'Add a session'}</h2>
            <p className="mt-1 text-sm text-text-muted">Dates use your current local timezone.</p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormField label="Session title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </FormField>
          <FormField label="Date and time">
            <Input type="datetime-local" required value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Duration (minutes)">
              <Input type="number" min="1" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
            </FormField>
            <FormField label="Capacity">
              <Input type="number" min="1" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} />
            </FormField>
          </div>
          <FormField label="Platform">
            <select
              value={form.platform}
              onChange={(event) => setForm({ ...form, platform: event.target.value as SessionPlatform })}
              className="h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text outline-none focus:border-green"
            >
              <option>Google Meet</option>
              <option>Microsoft Teams</option>
            </select>
          </FormField>
          <FormField label="Meeting information">
            <Input
              type="text"
              placeholder="To be sent"
              value={form.meetingLink}
              onChange={(event) => setForm({ ...form, meetingLink: event.target.value })}
            />
            <p className="text-xs text-text-muted">Use “To be sent” until the meeting link is confirmed.</p>
          </FormField>
          <div className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Visible to users</p>
              <p className="text-xs text-text-muted">Inactive sessions stay saved in admin.</p>
            </div>
            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
          </div>
          {error ? <p className="rounded-xl bg-orange/10 px-3 py-2 text-sm text-orange" role="alert">{error}</p> : null}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="flex-1 rounded-2xl bg-green px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {pending ? 'Saving…' : editingId ? 'Save changes' : 'Add session'}
            </button>
            {editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-border px-4 py-3 text-sm font-medium text-text">Cancel</button> : null}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text">Scheduled sessions</h2>
            <p className="mt-1 text-sm text-text-muted">{upcomingCount} active upcoming {upcomingCount === 1 ? 'session' : 'sessions'}</p>
          </div>
        </div>
        {message ? <p className="rounded-2xl bg-green-muted/70 px-4 py-3 text-sm text-green" role="status">{message}</p> : null}
        {loading ? <p className="text-sm text-text-muted">Loading sessions…</p> : sessions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center text-sm text-text-muted">No sessions yet. Add the first date using the form.</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <article key={session.id} className="rounded-3xl border border-border bg-surface-solid p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-text">{session.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${session.isActive ? 'bg-green-muted text-green' : 'bg-cream-dark text-text-muted'}`}>{session.isActive ? 'Active' : 'Hidden'}</span>
                    </div>
                    <p className="mt-2 font-medium text-text">{session.startsAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{session.durationMinutes} minutes</span>
                      <span className="inline-flex items-center gap-1.5"><Video className="h-4 w-4" />{session.platform}</span>
                      <span>Capacity {session.capacity}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => { setEditingId(session.id); setForm(sessionToForm(session)); setMessage(null); setError(null) }} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text hover:bg-cream">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    {confirmDeleteId === session.id ? (
                      <button type="button" disabled={pending} onClick={() => void handleDelete(session.id)} className="rounded-xl bg-[#B4584D] px-3 py-2 text-sm font-semibold text-white">Confirm delete</button>
                    ) : (
                      <button type="button" onClick={() => setConfirmDeleteId(session.id)} aria-label={`Delete ${session.title}`} className="rounded-xl border border-[#B4584D]/25 px-3 py-2 text-[#B4584D] hover:bg-[#B4584D]/5"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="text-sm font-medium text-text">{label}</span>{children}</label>
}
