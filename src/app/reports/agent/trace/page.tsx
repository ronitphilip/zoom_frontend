'use client'
import MainLayout from '@/components/layout/MainLayout'
import AgentTraceReport from '@/components/queue-reports/agent/AgentTraceReport'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState("2025-03-10");
  const [endDate, setEndDate] = useState("2025-03-16");
  return (
    <MainLayout>
      <AgentTraceReport
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </MainLayout>
  )
}

export default page