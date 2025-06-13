'use client'
import MainLayout from '@/components/layout/MainLayout'
import AgentSplitSkillReport from '@/components/queue-reports/agent/AgentSplitSkillReport'
import React from 'react'

const page = () => {
  const initialFilterCriteria = {
    startDate: "2025-03-10",
    endDate: "2025-03-16",
  };
  return (
    <MainLayout>
      <AgentSplitSkillReport initialFilterCriteria={initialFilterCriteria} />
    </MainLayout>
  )
}

export default page