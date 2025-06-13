'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillDailyReport from '@/components/queue-reports/skill/SplitSkillDailyReport'
import React from 'react'

const page = () => {
  const initialFilterCriteria = {
    startDate: "2025-03-10",
    endDate: "2025-03-10",
  };
  return (
    <MainLayout>
      <SplitSkillDailyReport initialFilterCriteria={initialFilterCriteria}/>
    </MainLayout>
  )
}

export default page