'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillSummaryDailyReport from '@/components/queue-reports/skill/SplitSkillSummaryDailyReport'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState("2025-06-10");
  const [endDate, setEndDate] = useState("2025-06-16");
  return (
    <MainLayout>
      <SplitSkillSummaryDailyReport startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate} />
    </MainLayout>
  )
}

export default page