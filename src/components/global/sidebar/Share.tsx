// src/components/ShareNotes.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectCurrentProject } from '@/store/projectSlice'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Share2 } from 'lucide-react'

export default function ShareNotes() {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<{ id: number; email: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sharingUserId, setSharingUserId] = useState<number | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)

  // ← pull your selectedProject out of Redux
  const currentProject = useSelector(selectCurrentProject)

  // guard against no project selected
  const projectName = currentProject?.name
  const canShare = Boolean(projectName)

  useEffect(() => {
    if (open) {
      setLoading(true)
      axios
        .get('http://localhost:8080/getAllUsers')
        .then(res => setUsers(res.data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [open])

  const shareTo = (email: string, userId: number) => {
    if (!projectName) return
    setSharingUserId(userId)
    setShareError(null)
    setShareSuccess(null)

    axios
      .post('http://localhost:8080/shareNotes', null, {
        params: {
          projectName,
          receiverEmail: email,
        },
      })
      .then(() => {
        setShareSuccess(`Notes shared with ${email}`)
      })
      .catch(err => {
        setShareError(err.response?.data?.message || err.message)
      })
      .finally(() => {
        setSharingUserId(null)
      })
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="w-full flex justify-start items-center text-white hover:bg-white/10"
        disabled={!canShare}
      >
        <Share2 className="w-4 h-4 text-white" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {projectName
                ? `Share “${projectName}” Notes`
                : 'No Project Selected'}
            </DialogTitle>
          </DialogHeader>

          {!canShare ? (
            <p className="text-red-600 px-6 py-4">
              You need to select a project before sharing.
            </p>
          ) : loading ? (
            <div className="flex justify-center py-10">Loading…</div>
          ) : error ? (
            <p className="text-red-600 px-6">{error}</p>
          ) : (
            <>
              {shareError && (
                <p className="text-red-600 mb-2 px-6">{shareError}</p>
              )}
              {shareSuccess && (
                <p className="text-green-600 mb-2 px-6">{shareSuccess}</p>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          disabled={sharingUserId === user.id}
                          onClick={() => shareTo(user.email, user.id)}
                        >
                          {sharingUserId === user.id
                            ? 'Sharing…'
                            : 'Share'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
