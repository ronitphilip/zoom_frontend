'use client'
import MainLayout from '@/components/layout/MainLayout'
import AgentGroupSummaryReport from '@/components/queue-reports/agent/AgentGroupSummaryReport'
import React from 'react'

const page = () => {
  const initialFilterCriteria = {
    startDate: "2025-03-10",
    endDate: "2025-03-16",
  };
  return (
    <MainLayout>
      <AgentGroupSummaryReport
        initialFilterCriteria={initialFilterCriteria}
      />
    </MainLayout>
  )
}

export default page