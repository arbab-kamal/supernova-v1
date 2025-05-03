import React, { useState, HTMLAttributes, useEffect } from 'react'
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
import { Share2, X, Mail, Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ShareNotesProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  showButton?: boolean;
}

export default function ShareNotes({ 
  className = '', 
  isOpen: controlledIsOpen, 
  onOpenChange,
  showButton = true
}: ShareNotesProps) {
  const [users, setUsers] = useState<{ id: number; email: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sharingUserId, setSharingUserId] = useState<number | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [emailMode, setEmailMode] = useState(false)
  const [manualEmail, setManualEmail] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [loadingNotes, setLoadingNotes] = useState(false)
  
  // Determine if modal is open based on props or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const currentProject = useSelector(selectCurrentProject)
  
  // Handle different formats of currentProject
  const projectName = 
    typeof currentProject === 'object' && currentProject !== null
      ? currentProject.title || currentProject.name
      : typeof currentProject === 'string'
        ? currentProject
        : null;
  
  const canShare = Boolean(projectName)
  
  useEffect(() => {
    console.log("ShareNotes - Current Project:", currentProject)
    console.log("Project Name detected:", projectName)
    console.log("Can Share:", canShare)
  }, [currentProject, projectName, canShare])

  // Fetch users when modal opens
  useEffect(() => {
    if (!isOpen) return
    
    setLoading(true)
    setError(null)
    axios
      .get('http://localhost:8080/getAllUsers')
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))

    // Also fetch notes when modal opens
    if (projectName) {
      fetchNoteContent()
    }
  }, [isOpen, projectName])

  // Set default email subject when project changes
  useEffect(() => {
    if (projectName) {
      setEmailSubject(`Sharing Notes: ${projectName}`)
    }
  }, [projectName])

  const fetchNoteContent = async () => {
    if (!projectName) return
    
    setLoadingNotes(true)
    try {
      const response = await axios.get("http://localhost:8080/getNotes", {
        params: { projectName },
      })

      let parsedContent = ''
      
      if (typeof response.data === "string") {
        try {
          const parsed = JSON.parse(response.data)
          // If parsed data is an array, use the most recent note
          if (Array.isArray(parsed)) {
            const sortedNotes = [...parsed].sort((a, b) => 
              (b.timestamp || 0) - (a.timestamp || 0)
            )
            parsedContent = sortedNotes.length > 0 ? sortedNotes[0].content : ''
          } else if (parsed && typeof parsed === 'object' && parsed.content) {
            parsedContent = parsed.content
          } else {
            parsedContent = response.data
          }
        } catch {
          parsedContent = response.data
        }
      } else if (Array.isArray(response.data)) {
        // Sort by timestamp and use the most recent note
        const sortedNotes = [...response.data].sort((a, b) => 
          (b.timestamp || 0) - (a.timestamp || 0)
        )
        parsedContent = sortedNotes.length > 0 ? sortedNotes[0].content : ''
      } else if (response.data && typeof response.data === 'object' && response.data.content) {
        parsedContent = response.data.content
      }
      
      setNoteContent(parsedContent)
    } catch (err) {
      console.error("Error fetching notes:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoadingNotes(false)
    }
  }

  const openModal = () => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setInternalIsOpen(true);
    }
  }

  const closeModal = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
    setShareError(null)
    setShareSuccess(null)
    setEmailMode(false)
    setManualEmail('')
  }

  const shareTo = (email: string, userId: number) => {
    if (!projectName) return
    setSharingUserId(userId)
    setShareError(null)
    setShareSuccess(null)

    axios
      .post('http://localhost:8080/shareNotes', null, {
        params: { projectName, receiverEmail: email },
      })
      .then(() => setShareSuccess(`Notes shared with ${email}`))
      .catch(err =>
        setShareError(err.response?.data?.message || err.message)
      )
      .finally(() => setSharingUserId(null))
  }

  const sendEmail = (email: string) => {
    if (!projectName) return
    setSendingEmail(true)
    setShareError(null)
    setShareSuccess(null)

    // Use the custom subject and the actual note content
    const subject = emailSubject || `Sharing Notes: ${projectName}`
    const body = noteContent || `Shared notes from project: ${projectName}`
    
    axios
      .post('http://localhost:8080/send-email', null, {
        params: { 
          emailId: email,
          subject: subject,
          body: body
        },
      })
      .then(() => {
        setShareSuccess(`Email sent to ${email}`)
        setManualEmail('')
      })
      .catch(err =>
        setShareError(err.response?.data?.message || err.message)
      )
      .finally(() => setSendingEmail(false))
  }

  const toggleEmailMode = () => {
    setEmailMode(!emailMode)
    setManualEmail('')
    setShareError(null)
    setShareSuccess(null)
  }

  return (
    <>
      {showButton && (
        <Button
          variant="ghost"
          className={`flex-1 flex justify-start items-center text-white hover:bg-white/10 ${className}`}
          disabled={!canShare}
          onClick={openModal}
        >
          <Share2 className="w-4 h-4 mr-2 text-white" />
          Share Notes
          {!canShare && <span className="ml-1 text-xs opacity-70">(No project selected)</span>}
        </Button>
      )}

      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg shadow-lg w-[600px] max-w-[90vw] max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">
                {projectName
                  ? `Share "${projectName}" Notes`
                  : 'No Project Selected'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {!canShare ? (
                <p className="py-4 text-red-600">
                  Please select a project before sharing.
                </p>
              ) : (
                <>
                  {shareError && <p className="mb-2 text-red-600">{shareError}</p>}
                  {shareSuccess && <p className="mb-2 text-green-600">{shareSuccess}</p>}

                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {emailMode ? "Send Email" : "Share with Users"}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleEmailMode}
                      className="text-gray-900 dark:text-white"
                    >
                      {emailMode ? (
                        <>Share with Users</>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Email Mode
                        </>
                      )}
                    </Button>
                  </div>

                  {emailMode ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Email Address
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="email-input"
                            type="email"
                            placeholder="Enter email address"
                            value={manualEmail}
                            onChange={(e) => setManualEmail(e.target.value)}
                            className="flex-1 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                          />
                          <Button
                            disabled={!manualEmail || sendingEmail}
                            onClick={() => sendEmail(manualEmail)}
                          >
                            {sendingEmail ? 'Sending...' : 'Send Email'}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email-subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Email Subject
                        </label>
                        <Input
                          id="email-subject"
                          type="text"
                          placeholder="Email subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email-body" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Email Content
                        </label>
                        {loadingNotes ? (
                          <div className="flex justify-center py-2">Loading note content...</div>
                        ) : (
                          <Textarea
                            id="email-body"
                            placeholder="Email content"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="w-full h-32 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                          />
                        )}
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="flex justify-center py-10">Loading…</div>
                  ) : error ? (
                    <p className="text-red-600">Error: {error}</p>
                  ) : users.length === 0 ? (
                    <p className="py-4 text-gray-600">No users found to share with.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='text-gray-900 dark:text-white'>Email</TableHead>
                          <TableHead className="text-right text-gray-900 dark:text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="text-gray-900 dark:text-white">
                              {user.email}
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={sendingEmail}
                                onClick={() => sendEmail(user.email)}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                {sendingEmail && user.email === manualEmail ? 'Sending…' : 'Email'}
                              </Button>
                              <Button
                                size="sm"
                                disabled={sharingUserId === user.id}
                                onClick={() => shareTo(user.email, user.id)}
                              >
                                {sharingUserId === user.id ? 'Sharing…' : 'Share'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <Button
                variant="outline"
                onClick={closeModal}
                className="hover:text-gray-900 hover:bg-gray-500 text-white bg-gray-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}