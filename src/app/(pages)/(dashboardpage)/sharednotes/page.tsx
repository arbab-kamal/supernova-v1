import React from 'react'
import SharedNoteDetail from '@/components/global/sharednote'
import { useParams } from 'next/navigation'

const SharedProject = () => {
  // Get route parameters using Next.js's useParams
  const params = useParams()
  
  return (
    <SharedNoteDetail params={params} />
  )
}

export default SharedProject