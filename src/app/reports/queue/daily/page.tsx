'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillDailyReport from '@/components/queue-reports/skill/SplitSkillDailyReport'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState("2025-05-10");
  const [endDate, setEndDate] = useState("2025-05-16");
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