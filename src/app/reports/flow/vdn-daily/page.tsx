'use client'
import MainLayout from '@/components/layout/MainLayout'
import VdnDailyReport from '@/components/queue-reports/vdn/VdnDailyReport'
import React from 'react'

const page = () => {
  const initialFilterCriteria = {
    startDate: "2025-03-10",
    endDate: "2025-03-16",
  };

  return (
    <MainLayout>
      <VdnDailyReport initialFilterCriteria={initialFilterCriteria} />
    </MainLayout>
  )
}

export default page