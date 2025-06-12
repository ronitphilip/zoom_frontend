'use client'

import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ZoomBilling from '@/components/dashboard/ZoomBilling';
import ZoomUsage from '@/components/dashboard/ZoomUsage';
import ZoomUX from '@/components/dashboard/ZoomUX';
import MainLayout from '@/components/layout/MainLayout'
import React from 'react'

const Page = () => {
    return (
        <MainLayout>
            <div className='flex flex-col'>
                <DashboardOverview />
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    <ZoomBilling />
                    <ZoomUsage />
                    <ZoomUX />
                </div>
            </div>
        </MainLayout>
    );
};

export default Page