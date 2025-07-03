'use client'
import MainLayout from '@/components/layout/MainLayout'
import VdnIntervalReport from '@/components/queue-reports/vdn/VdnIntervalReport'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState<string>('2025-06-01');
  const [endDate, setEndDate] = useState<string>('2025-06-23');
  return (
    <MainLayout>
      <VdnIntervalReport
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </MainLayout>
  )
}

export default page