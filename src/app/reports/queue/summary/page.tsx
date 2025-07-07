'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillSummaryDailyReport from '@/components/queue-reports/skill/SplitSkillSummaryDailyReport'
import React, { useState } from 'react'

const Page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  return (
    <MainLayout>
      <SplitSkillSummaryDailyReport startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate} />
    </MainLayout>
  )
}

export default Page