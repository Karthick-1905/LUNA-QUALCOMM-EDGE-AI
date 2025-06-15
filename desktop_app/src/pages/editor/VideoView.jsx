import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoUpload from '../../components/layout/VideoPlayerSection'
import VideoTranscriptEditor from '../../components/editor/VideoTranscriptEditor'
import { useOutletContext } from 'react-router-dom'

const VideoView = () => {
  // Get transcription context
  const { transcription, setTranscription } = useOutletContext()
  
  // Local state
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [transcriptSegments, setTranscriptSegments] = useState([])
  const [audioUrl, setAudioUrl] = useState(null) // <-- new state
  const [customAudioUrl, setCustomAudioUrl] = useState(null)

  const handleVideoUpload = async (file,videoUrl) => {
    setLoading(true)
    try {
      // Create video URL and update state
      console.log(file)
      //const videoUrl = URL.createObjectURL(file)
      setUploadedVideo(videoUrl)
      setFileName(file.name)

      // Prepare form data
      const formData = new FormData()
      formData.append('file', file)

    

      const response = await fetch('/api/analyze-video/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      
      // Update transcription in context
      setTranscription(data)

      // Process segments if available
      if (data?.transcription?.segments) {
        const processedSegments = data.transcription.segments.map((seg, i) => ({
          ...seg,
          id: String(i),
          speaker: seg.speaker || 'Speaker 1',
          text: seg.text,
          start: seg.start,
          end: seg.end,
          confidence: seg.confidence || 1,
          isEditable: true
        }))
        setTranscriptSegments(processedSegments)
      }

    } catch (error) {
      console.error("Error processing video:", error)
      setTranscription(null)
      setTranscriptSegments([])
    } finally {
      setLoading(false)
    }
  }

  // Handle transcript edit and call /edit-transcript/
  const handleTranscriptEdit = async (updatedSegments) => {
    setLoading(true)
    try {
      const response = await fetch('/edit-transcript/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments: updatedSegments })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Get audio as blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      setCustomAudioUrl(audioUrl)
    } catch (error) {
      console.error('Error editing transcript:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <AnimatePresence>
        {!uploadedVideo && !customAudioUrl ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex items-center justify-center"
          >
            <VideoUpload onVideoUpload={handleVideoUpload} />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full gap-4 p-4"
          >
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-3/5"
            >
              <VideoUpload 
                uploadedVideo={uploadedVideo} 
                fileName={fileName}
                onVideoUpload={handleVideoUpload}
                customAudioUrl={customAudioUrl}
              />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-2/5"
            >
              <VideoTranscriptEditor 
                transcription={transcription}
                segments={transcriptSegments}
                isLoading={loading}
                onTranscriptEdit={handleTranscriptEdit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoView