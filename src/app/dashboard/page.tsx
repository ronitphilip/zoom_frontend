'use client'

import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ZoomBilling from '@/components/dashboard/ZoomBilling';
import ZoomUsage from '@/components/dashboard/ZoomUsage';
import ZoomUX from '@/components/dashboard/ZoomUX';
import MainLayout from '@/components/layout/MainLayout'
import { Headers } from '@/services/commonAPI';
import { DashboardRequestBody, fetchDashboardDataAPI, zoomDataAttributes } from '@/services/dashboardAPI';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [startDate, setStartDate] = useState<string>('2025-07-01');
    const [endDate, setEndDate] = useState<string>('2025-07-02');

    const [data, setData] = useState<zoomDataAttributes | undefined>({
        total_calls: '0',
        inbound_calls: '0',
        outbound_calls: '0',
        missed_calls: '0',
        abandoned_calls: '0',
        avg_call_duration: '0',
        total_channel_count: '0',
        voice_channel_percentage: '0',
        video_channel_percentage: '0',
        chat_channel_percentage: '0',
        email_channel_percentage: '0',
        call_success_rate: '0',
        avg_speed_to_answer: '0',
        max_speed_to_answer: '0',
        min_speed_to_answer: '0',
        inbound_call_minutes: '0',
        outbound_call_minutes: '0',
        total_call_minutes: '0',
        avg_inbound_call_duration: '0',
        avg_outbound_call_duration: '0',
    });

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const reqBody: DashboardRequestBody = {
                from: startDate,
                to: endDate
            }

            const header: Headers = {
                authorization: `Bearer ${sessionStorage.getItem('tk') ? JSON.parse(sessionStorage.getItem('tk')!) : "tk"}`
            }
            const result = await fetchDashboardDataAPI(reqBody, header);
            if (result.success) {
                setData(result.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <MainLayout>
            <div className='flex flex-col'>
                <DashboardOverview
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    data={data}
                    fetchReports={fetchData}
                />
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    <ZoomBilling />
                    <ZoomUsage data={data} />
                    <ZoomUX data={data} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Page