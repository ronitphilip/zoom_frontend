'use client'
import MainLayout from '@/components/layout/MainLayout'
import SkillCallProfile from '@/components/queue-reports/skill/SkillCallProfile'
import React, { useState } from 'react'

const page = () => {
  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  return (
    <MainLayout>
      <SkillCallProfile startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate} />
    </MainLayout>
  )
}

export default page