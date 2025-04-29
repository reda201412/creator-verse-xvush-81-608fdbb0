
import React from 'react';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  className?: string;
}

export const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  className 
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={`bg-background border border-border rounded-md p-2 shadow-md text-xs ${className}`}>
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p 
          key={`item-${index}`}
          style={{ color: entry.color }}
          className="text-sm"
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};
