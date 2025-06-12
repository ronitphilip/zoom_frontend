import React from 'react';
import SideBar from './SideBar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 p-5 overflow-y-auto h-screen">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;