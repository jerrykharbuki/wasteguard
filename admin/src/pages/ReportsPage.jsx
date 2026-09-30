// pages/ReportsPage.jsx — lists all reports in a table.
// Fetches from the shared 'incidents' collection; falls back to sample
// data if Firestore is empty (frontend-first development).

import { useEffect, useState } from 'react'
import { getReports } from '../services/reportService'
import { sampleReports } from '../services/sampleData'
import ReportsTable from '../components/ReportsTable'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getReports()
        if (!active) return
        if (data.length > 0) {
          setReports(data)
          setUsingSample(false)
        } else {
          setReports(sampleReports)
          setUsingSample(true)
        }
      } catch (err) {
        console.error('Failed to load reports:', err)
        if (active) {
          setReports(sampleReports)
          setUsingSample(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <div className="page-placeholder">Loading reports…</div>

  return (
    <div>
      <h2 className="page-title">Reports</h2>
      {usingSample && <p className="muted" style={{ marginBottom: 12 }}>Showing sample data (Firestore is empty).</p>}

      <div className="panel">
        <ReportsTable reports={reports} />
      </div>
    </div>
  )
}