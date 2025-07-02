'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillDailyReport from '@/components/queue-reports/skill/SplitSkillDailyReport'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  return (
    <MainLayout>
      <SplitSkillDailyReport startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate} />
    </MainLayout>
  )
}

export default page