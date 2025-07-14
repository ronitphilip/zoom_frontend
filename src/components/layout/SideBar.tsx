'use client'
import { decryptRole, RoleAttributes } from '@/utils/decryptRole';
import { BarChart3, Calendar, ChevronRight, Clock, LogOut, Phone, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Settings, Settings2, TrendingUp, User2, UserCog, UserCog2, UserRound, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type NavItem = {
    id: string;
    icon: React.ReactNode;
    label: string;
    hasChildren: boolean;
    children?: NavItem[];
    href?: string;
    permissionKey?: string;
};

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMap, setExpandedMap] = useState<Record<number, string>>({});
    const [userRole, setRole] = useState<RoleAttributes>();
    const [email, setEmail] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const pathToActive = getActivePath(phoneItems, pathname) || getActivePath(navItems, pathname);
        if (pathToActive) {
            const expandedByLevel: Record<number, string> = {};
            pathToActive.forEach((id, index) => {
                expandedByLevel[index + 1] = id;
            });
            
            const parentPath = pathToActive.slice(0, -1);
            parentPath.forEach((id, index) => {
                if (!expandedByLevel[index + 1]) {
                    expandedByLevel[index + 1] = id;
                }
            });
            setExpandedMap(expandedByLevel);
        }

        if (pathname.startsWith('/phones')) {
            setIsAdmin(false);
        } else {
            setIsAdmin(true);
        }
    }, [pathname]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '"user');
        if (user) {
            try {
                setEmail(user.email);
            } catch (error) {
                console.error("Failed to parse email:", error);
                setEmail('user@sysgrate.com');
            }
        } else {
            setEmail('user@sysgrate.com');
        }
        const decryptStoredRole = async () => {
            const encryptedRole = sessionStorage.getItem('rl');
            if (encryptedRole) {
                try {
                    const parsed = JSON.parse(encryptedRole);
                    const decrypted = await decryptRole(
                        parsed.encryptedData,
                        parsed.iv,
                        process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
                    );
                    setRole(decrypted);
                } catch (error) {
                    console.error("Decryption failed:", error);
                }
            } else {
                console.error("Decryption failed");
            }
        };

        decryptStoredRole();
    }, []);

    const navItems: NavItem[] = [
        {
            id: 'overview',
            icon: <BarChart3 size={20} />,
            label: 'Overview',
            hasChildren: false,
            href: '/dashboard',
            permissionKey: 'overview.view'
        },
        {
            id: 'historicalReports',
            icon: <Calendar size={20} />,
            label: 'Historical Reports',
            hasChildren: true,
            children: [
                {
                    id: 'agentReports',
                    icon: <UserRound size={16} />,
                    label: 'Agent Reports',
                    hasChildren: true,
                    children: [
                        { id: 'agentPerformance', icon: <UserRound size={16} />, label: 'Agent Performance', hasChildren: false, href: '/reports/agent/performance', permissionKey: 'historicalReports.agentReports' },
                        { id: 'agentTrace', icon: <UserRound size={16} />, label: 'Agent Trace Report', hasChildren: false, href: '/reports/agent/trace', permissionKey: 'historicalReports.agentReports' },
                        { id: 'agentLogin', icon: <UserRound size={16} />, label: 'Login Logout Report', hasChildren: false, href: '/reports/agent/login-report', permissionKey: 'historicalReports.agentReports' },
                        { id: 'agentSkill', icon: <UserRound size={16} />, label: 'Agent Skill Report', hasChildren: false, href: '/reports/agent/split-skill', permissionKey: 'historicalReports.agentReports' },
                        { id: 'agentGroupSummary', icon: <Users size={16} />, label: 'Group Summary', hasChildren: false, href: '/reports/agent/summary', permissionKey: 'historicalReports.agentReports' }
                    ],
                    permissionKey: 'historicalReports.agentReports'
                },
                {
                    id: 'queueReports',
                    icon: <TrendingUp size={16} />,
                    label: 'Queue Reports',
                    hasChildren: true,
                    children: [
                        { id: 'skillDaily', icon: <TrendingUp size={16} />, label: 'Skill Daily Report', hasChildren: false, href: '/reports/queue/daily', permissionKey: 'historicalReports.queueReports' },
                        { id: 'skillSummaryDaily', icon: <TrendingUp size={16} />, label: 'Skill Summary Daily', hasChildren: false, href: '/reports/queue/summary', permissionKey: 'historicalReports.queueReports' },
                        { id: 'skillSummaryInterval', icon: <TrendingUp size={16} />, label: 'Skill Summary Interval', hasChildren: false, href: '/reports/queue/interval', permissionKey: 'historicalReports.queueReports' },
                        { id: 'skillCallProfile', icon: <TrendingUp size={16} />, label: 'Skill Call Profile', hasChildren: false, href: '/reports/queue/profile', permissionKey: 'historicalReports.queueReports' },
                        { id: 'abandonedCalls', icon: <PhoneMissed size={16} />, label: 'Abandoned Calls', hasChildren: false, href: '/reports/queue/abandoned', permissionKey: 'historicalReports.queueReports' }
                    ],
                    permissionKey: 'historicalReports.queueReports'
                },
                {
                    id: 'flowReports',
                    icon: <PhoneCall size={16} />,
                    label: 'Flow Reports',
                    hasChildren: true,
                    children: [
                        { id: 'vdnDaily', icon: <PhoneCall size={16} />, label: 'VDN Daily Report', hasChildren: false, href: '/reports/flow/vdn-daily', permissionKey: 'historicalReports.flowReports' },
                        { id: 'vdnInterval', icon: <PhoneCall size={16} />, label: 'VDN Interval Report', hasChildren: false, href: '/reports/flow/vdn-interval', permissionKey: 'historicalReports.flowReports' }
                    ],
                    permissionKey: 'historicalReports.flowReports'
                }
            ],
            permissionKey: 'historicalReports'
        },
        {
            id: 'realTime',
            icon: <Clock size={20} />,
            label: 'Real-time',
            hasChildren: true,
            children: [
                { id: 'currentCalls', icon: <PhoneCall size={16} />, label: 'Current Calls', hasChildren: false, href: '/realtime/calls', permissionKey: 'realTime.currentCalls' },
                { id: 'agentStatus', icon: <Phone size={16} />, label: 'Agent Status', hasChildren: false, href: '/realtime/status', permissionKey: 'realTime.agentStatus' }
            ],
            permissionKey: 'realTime'
        },
        {
            id: 'userManagement',
            icon: <UserCog size={20} />,
            label: 'User Management',
            hasChildren: true,
            children: [
                { id: 'manageuser', icon: <Users size={16} />, label: 'Manage Users', hasChildren: false, href: '/users/manage-users', permissionKey: 'userManagement.manageuser' },
                { id: 'managerole', icon: <UserCog2 size={16} />, label: 'User Roles', hasChildren: false, href: '/users/user-roles', permissionKey: 'userManagement.managerole' }
            ],
            permissionKey: 'userManagement'
        },
        {
            id: 'teamManagement',
            icon: <Settings2 size={20} />,
            label: 'Team Management',
            hasChildren: false,
            href: '/team-management',
            permissionKey: 'teamManagement.view'
        },
        {
            id: 'settings',
            icon: <Settings size={20} />,
            label: 'Account Settings',
            hasChildren: false,
            href: '/settings',
            permissionKey: 'settings.view'
        }
    ];

    const phoneItems: NavItem[] = [
        {
            id: 'overview',
            icon: <BarChart3 size={20} />,
            label: 'Overview',
            hasChildren: false,
            href: '/dashboard',
            permissionKey: 'overview.view'
        },
        {
            id: 'phones',
            icon: <PhoneCall size={16} />,
            label: 'Phone Reports',
            hasChildren: true,
            permissionKey: 'phones',
            children: [
                { id: 'outboundCalls', icon: <PhoneOutgoing size={16} />, label: 'Outbound Calls', hasChildren: false, href: '/phones/outbound', permissionKey: 'phones.outboundCalls' },
                { id: 'inboundCalls', icon: <PhoneIncoming size={16} />, label: 'Inbound Calls', hasChildren: false, href: '/phones/inbound', permissionKey: 'phones.inboundCalls' },
                { id: 'rawData', icon: <BarChart3 size={16} />, label: 'Raw Call Data', hasChildren: false, href: '/phones/raw', permissionKey: 'phones.rawData' }
            ]
        }
    ];

    const hasPermission = (permissionKey?: string): boolean => {
        if (!permissionKey || !userRole?.permissions) return true;

        const [main, sub] = permissionKey.split('.');
        const section = (userRole.permissions as any)[main];

        if (!sub) {
            return section !== undefined;
        }

        return Array.isArray(section) && section.includes(sub);
    };

    const toggleExpand = (id: string, level: number) => {
        setExpandedMap((prev) => ({
            ...prev,
            [level]: prev[level] === id ? '' : id
        }));
    };

    const getActivePath = (items: NavItem[], currentPath: string, path: string[] = []): string[] | null => {
        for (const item of items) {
            if (item.href === currentPath) {
                return [...path, item.id];
            } else if (item.children) {
                const childPath = getActivePath(item.children, currentPath, [...path, item.id]);
                if (childPath) return childPath;
            }
        }
        return null;
    };

    const RenderSideBarOptions = (items: NavItem[], level = 1) => {
        return items
            .filter(item => {
                if (item.hasChildren && item.children) {
                    const visibleChildren = item.children.filter(child =>
                        child.hasChildren
                            ? child.children?.some(grandChild => hasPermission(grandChild.permissionKey))
                            : hasPermission(child.permissionKey)
                    );
                    return visibleChildren.length > 0;
                }
                return hasPermission(item.permissionKey);
            })
            .map(item => {
                const isExpanded = expandedMap[level] === item.id;
                const isActive = item.href && pathname === item.href;

                return (
                    <div key={item.id}>
                        {item.href ? (
                            <Link href={item.href}>
                                <div
                                    className={`flex items-center justify-between p-3 rounded-2xl hover:bg-blue-800 cursor-pointer ${isActive ? 'bg-blue-700' : ''}`}
                                >
                                    <div className='flex items-center'>
                                        {item.icon}
                                        {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                                    </div>
                                    {sidebarOpen && item.hasChildren && (
                                        <ChevronRight
                                            size={16}
                                            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleExpand(item.id, level);
                                            }}
                                        />
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div
                                className='flex items-center justify-between p-3 rounded-2xl hover:bg-blue-800 cursor-pointer'
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleExpand(item.id, level);
                                }}
                            >
                                <div className='flex items-center'>
                                    {item.icon}
                                    {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                                </div>
                                {sidebarOpen && item.hasChildren && (
                                    <ChevronRight
                                        size={16}
                                        className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                    />
                                )}
                            </div>
                        )}

                        {item.hasChildren && isExpanded && (
                            <div className="ml-5 border-l-2 border-blue-600 pl-1">
                                {RenderSideBarOptions(item.children!, level + 1)}
                            </div>
                        )}

                    </div>
                );
            });
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.clear();
        }
        router.push('/');
    };

    return (
        <>
            <div className={`${sidebarOpen ? 'w-75' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ease-in-out shadow-xl flex flex-col`}>
                <div className="p-5 flex justify-between items-center border-b border-blue-700/50">
                    {sidebarOpen ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-1.5 rounded-lg shadow-md flex items-center justify-center w-8 h-8">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 8H19.5C20.3284 8 21 7.32843 21 6.5C21 5.67157 20.3284 5 19.5 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19H17.5C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M12.5 8.5L15.5 11.5L12.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 11.5H8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight">Sysgrate</h1>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-blue-200 hover:text-white transition-colors rounded-full p-1 hover:bg-blue-700/40"
                            >
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mx-auto text-blue-200 hover:text-white transition-colors"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-1.5 rounded-lg shadow-md flex items-center justify-center w-8 h-8">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 8H19.5C20.3284 8 21 7.32843 21 6.5C21 5.67157 20.3284 5 19.5 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19H17.5C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M12.5 8.5L15.5 11.5L12.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 11.5H8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>
                <nav className='flex flex-col justify-between h-full'>
                    {sidebarOpen && hasPermission('phones') && (
                        <div className='px-5 space-y-3 py-3'>
                            <p className="text-xs text-blue-300 uppercase tracking-wider font-medium">Dashboard</p>
                            <div>
                                <button onClick={() => setIsAdmin(true)}
                                    className={`border border-white px-2 rounded ${isAdmin ? 'text-blue-800 bg-white' : 'text-white'} me-3 `}
                                >
                                    Contacts
                                </button>
                                <button onClick={() => setIsAdmin(false)}
                                    className={`border border-white px-2 rounded ${isAdmin ? 'text-white' : 'text-blue-800 bg-white'}`}
                                >
                                    Phones
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="px-4 max-h-135 overflow-y-auto">
                        {
                            isAdmin ? RenderSideBarOptions(navItems) : RenderSideBarOptions(phoneItems)}
                    </div>
                    <div className={`p-4 mt-auto border-t border-blue-700/50 ${sidebarOpen ? '' : 'flex justify-center'}`}>
                        {sidebarOpen ? (
                            <div className="flex items-center justify-between">
                                <div className='flex items-center'>
                                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium">
                                        <User2 size={18} />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{userRole?.role}</p>
                                        <p className="text-xs text-blue-300">{email}</p>
                                    </div>
                                </div>
                                <button onClick={handleLogout}><LogOut className='cursor-pointer' /></button>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">
                                {userRole?.role.split('')[0]?.toUpperCase() || 'S'}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </>
    );
};

export default SideBar;