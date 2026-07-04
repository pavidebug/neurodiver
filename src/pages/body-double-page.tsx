import { useState } from 'react'
import { Calendar, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BODY_DOUBLE_SESSIONS } from '@/lib/data'
import { cn } from '@/lib/utils'

export function BodyDoublePage() {
  const [booked, setBooked] = useState<Set<string>>(new Set())
  const [joined, setJoined] = useState<string | null>(null)

  const handleBook = (id: string) => {
    setBooked((prev) => new Set(prev).add(id))
  }

  const handleJoin = (id: string) => {
    setJoined(id)
  }

  return (
    <div className="page-enter space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Body Doubling
        </h1>
        <p className="mt-2 text-base text-text-muted">
          Work alongside others. Gentle accountability, no pressure.
        </p>
      </header>

      {joined && (
        <Card className="border-green/30 bg-green-muted/60">
          <CardContent className="p-5 text-center">
            <p className="font-semibold text-green">
              You&apos;re in the session!
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Focus at your own pace. You&apos;re not alone.
            </p>
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => setJoined(null)}
            >
              Leave session
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {BODY_DOUBLE_SESSIONS.map((session) => {
          const isBooked = booked.has(session.id)
          const isJoined = joined === session.id
          const spotsLeft = session.spots

          return (
            <Card
              key={session.id}
              className={cn(
                'transition-all duration-200',
                isJoined && 'border-green ring-2 ring-green/20',
              )}
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text">
                      {session.title}
                    </h2>
                    <p className="text-sm text-text-muted">
                      Hosted by {session.host}
                    </p>
                  </div>
                  <Badge
                    variant={
                      session.vibe === 'Quiet'
                        ? 'default'
                        : session.vibe === 'Chatty'
                          ? 'yellow'
                          : 'orange'
                    }
                  >
                    {session.vibe}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {session.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {session.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {spotsLeft} spots left
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  {!isBooked ? (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleBook(session.id)}
                    >
                      Book spot
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      disabled={isJoined}
                      onClick={() => handleJoin(session.id)}
                    >
                      {isJoined ? 'Joined' : 'Join session'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
