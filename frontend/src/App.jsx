import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home           from './pages/Home'
import SocialAnalyzer from './pages/SocialAnalyzer'
import VoiceDetector  from './pages/VoiceDetector'
import About          from './pages/About'
import Dashboard      from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/social"    element={<SocialAnalyzer />} />
        <Route path="/voice"     element={<VoiceDetector />} />
        <Route path="/about"     element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App