'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillSummaryIntervalReport from '@/components/queue-reports/skill/SplitSkillSummaryIntervalReport'
import React, { useState } from 'react'

const Page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  return (
    <MainLayout>
      <SplitSkillSummaryIntervalReport
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </MainLayout>
  )
}

export default Page