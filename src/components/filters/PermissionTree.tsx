import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Feature } from '@/app/users/user-roles/page';

interface PermissionTreeProps {
  feature: Feature;
  actions: string[];
  selectedActions: { [key in Feature]?: string[] };
  toggle: (feature: Feature, action: string) => void;
}

const PermissionTree: React.FC<PermissionTreeProps> = ({ feature, actions, selectedActions, toggle }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const isChecked: boolean = selectedActions[feature]?.length === actions.length;
  const isIndeterminate: boolean = selectedActions[feature]?.length > 0 && !isChecked;

  const toggleAll = () => {
    actions.forEach((action) => toggle(feature, action));
  };

  return (
    <div className="rounded-lg bg-white">
      <div className="flex items-center p-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
        <input
          type="checkbox"
          checked={isChecked}
          ref={(el: HTMLInputElement | null) => {
            if (el) {
              el.indeterminate = isIndeterminate;
            }
          }}
          onChange={toggleAll}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="mr-2"
        />
        <span className="capitalize font-medium text-gray-800">{feature}</span>
      </div>
      {expanded && (
        <div className="pl-6">
          {actions.map((action) => (
            <div key={`${feature}-${action}`} className="flex items-center py-1 ps-8">
              <input
                type="checkbox"
                id={`${feature}-${action}`}
                checked={selectedActions[feature]?.includes(action) || false}
                onChange={() => toggle(feature, action)}
                className="mr-2"
              />
              <label htmlFor={`${feature}-${action}`} className="capitalize text-sm text-gray-700">
                {action}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionTree;