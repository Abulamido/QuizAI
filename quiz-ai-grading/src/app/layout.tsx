import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuizAI — Online Quiz with AI Grading',
  description: 'An intelligent online quiz platform powered by AI for automated grading and personalized feedback. Designed for modern educators and students.',
  keywords: ['online quiz', 'AI grading', 'education', 'assessment', 'e-learning'],
  authors: [{ name: 'QuizAI Team' }],
  openGraph: {
    title: 'QuizAI — Intelligent Online Assessment Platform',
    description: 'Take quizzes and get instant AI-powered grading with detailed feedback.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Animated Background Layers */}
        <div className="global-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="noise-overlay"></div>
        </div>
        
        {/* Main Application Content */}
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  )
}
