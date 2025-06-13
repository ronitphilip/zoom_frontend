'use client'
import MainLayout from '@/components/layout/MainLayout'
import SplitSkillSummaryDailyReport from '@/components/queue-reports/skill/SplitSkillSummaryDailyReport'
import React from 'react'

const page = () => {
    const initialFilterCriteria = {
    startDate: "2025-03-10",
    endDate: "2025-03-16",
  };
  return (
    <MainLayout>
      <SplitSkillSummaryDailyReport initialFilterCriteria={initialFilterCriteria}/>
    </MainLayout>
  )
}

export default page