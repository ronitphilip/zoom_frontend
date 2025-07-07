import React from 'react';
import { Calendar } from 'lucide-react';
import { ReportFilterCriteria } from '@/types/avayaReportTypes';

interface ReportFilterProps {
  filterCriteria: ReportFilterCriteria;
  onFilterChange: (criteria: ReportFilterCriteria) => void;
  onGenerateReport: () => void;
  showAgentFilter?: boolean;
  showAgentGroupFilter?: boolean;
  showSkillFilter?: boolean;
  showVdnFilter?: boolean;
  showTimeFilter?: boolean;
  showIntervalTypeFilter?: boolean;
  showServiceLevelFilter?: boolean;
}

export default function ReportFilter({
  filterCriteria,
  onFilterChange,
  onGenerateReport,
  showAgentFilter = false,
  showAgentGroupFilter = false,
  showSkillFilter = false,
  showVdnFilter = false,
  showTimeFilter = false,
  showIntervalTypeFilter = false,
  showServiceLevelFilter = false
}: ReportFilterProps) {
  // List of agents, skills, etc. would come from an API in real application
  const agents = [
    { id: 'agent1', name: 'John Smith' },
    { id: 'agent2', name: 'Jane Doe' },
    { id: 'agent3', name: 'Maria Rodriguez' },
    { id: 'agent4', name: 'David Johnson' },
    { id: 'agent5', name: 'Robert Williams' }
  ];
  
  const agentGroups = [
    { id: 'group1', name: 'Sales Team' },
    { id: 'group2', name: 'Support Team' },
    { id: 'group3', name: 'Billing Team' },
    { id: 'group4', name: 'Technical Team' }
  ];
  
  const skills = [
    { id: 'skill1000', name: 'General Inquiry' },
    { id: 'skill1001', name: 'Technical Support' },
    { id: 'skill1002', name: 'Billing Support' },
    { id: 'skill1003', name: 'Sales' },
    { id: 'skill1004', name: 'Customer Service' }
  ];
  
  const vdns = [
    { id: 'vdn1000', name: 'Main Line' },
    { id: 'vdn1001', name: 'Sales' },
    { id: 'vdn1002', name: 'Support' },
    { id: 'vdn1003', name: 'Billing' }
  ];
  
  const intervalTypes = [
    { value: 'fifteen', label: '15 Minutes' },
    { value: 'thirty', label: '30 Minutes' },
    { value: 'hourly', label: 'Hourly' }
  ];
  
  // Handler for form field changes
  const handleChange = (field: keyof ReportFilterCriteria, value: any) => {
    onFilterChange({
      ...filterCriteria,
      [field]: value
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow w-full p-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">From:</span>
            <input
              type="date"
              value={filterCriteria.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <span className="text-sm text-gray-500">to</span>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filterCriteria.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        
        {/* Time Range - Conditionally rendered */}
        {showTimeFilter && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Time:</span>
              <input
                type="time"
                value={filterCriteria.startTime || '00:00'}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
            <span className="text-sm text-gray-500">to</span>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={filterCriteria.endTime || '23:59'}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        )}
        
        {/* Agent Filter - Conditionally rendered */}
        {showAgentFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Agent:</span>
            <select
              value={filterCriteria.agentId || ''}
              onChange={(e) => handleChange('agentId', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Agent Group Filter - Conditionally rendered */}
        {showAgentGroupFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Group:</span>
            <select
              value={filterCriteria.agentGroup || ''}
              onChange={(e) => handleChange('agentGroup', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">All Groups</option>
              {agentGroups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Skill Filter - Conditionally rendered */}
        {showSkillFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Skill:</span>
            <select
              value={filterCriteria.splitSkillId || ''}
              onChange={(e) => handleChange('splitSkillId', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">All Skills</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* VDN Filter - Conditionally rendered */}
        {showVdnFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">VDN:</span>
            <select
              value={filterCriteria.vdnId || ''}
              onChange={(e) => handleChange('vdnId', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">All VDNs</option>
              {vdns.map((vdn) => (
                <option key={vdn.id} value={vdn.id}>{vdn.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Interval Type Filter - Conditionally rendered */}
        {showIntervalTypeFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Interval:</span>
            <select
              value={filterCriteria.intervalType || 'thirty'}
              onChange={(e) => handleChange('intervalType', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              {intervalTypes.map((interval) => (
                <option key={interval.value} value={interval.value}>{interval.label}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Service Level Filter - Conditionally rendered */}
        {showServiceLevelFilter && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Service Level (sec):</span>
            <input
              type="number"
              min="0"
              max="300"
              value={filterCriteria.serviceLevelThresholds?.[0] || 20}
              onChange={(e) => handleChange('serviceLevelThresholds', [parseInt(e.target.value)])}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-16"
            />
          </div>
        )}
        
        {/* Generate Report Button */}
        <button 
          onClick={onGenerateReport}
          className="ml-auto px-4 py-1.5 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 border border-blue-600 shadow-sm"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
