
import React, { useState, useEffect } from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import useLazyLoad from '@/hooks/use-lazy-load';

// Type de contenu
const contentTypeData = [
  { name: 'Vidéos', value: 420 },
  { name: 'Photos', value: 180 },
  { name: 'Tutoriels', value: 320 },
  { name: 'Lives', value: 280 }
];

interface ContentTypeBarChartProps {
  className?: string;
}

const ContentTypeBarChart: React.FC<ContentTypeBarChartProps> = ({ className }) => {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { elementRef, isVisible, hasLoaded } = useLazyLoad({ threshold: 0.2 });
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initialize
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Calculate dimensions based on container element
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setChartWidth(width);
      setChartHeight(height);
    }
  }, [isVisible, elementRef]);

  const activeBarColor = '#0ea5e9';
  const hoverColor = '#0284c7';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  return (
    <div 
      ref={elementRef} 
      className={`w-full h-full min-h-[200px] ${className || ''}`}
    >
      {(isVisible || hasLoaded) && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={contentTypeData}
            margin={isMobile ? 
              { top: 5, right: 10, left: 0, bottom: 20 } : 
              { top: 10, right: 30, left: 10, bottom: 30 }
            }
            barSize={isMobile ? 15 : 30}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setActiveIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval={0}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />
            <YAxis 
              width={isMobile ? 30 : 40} 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => isMobile ? `$${value / 100}` : `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenu']} 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '4px',
                fontSize: isMobile ? '10px' : '12px',
                padding: '8px'
              }} 
              wrapperStyle={{
                zIndex: 1000
              }}
            />
            <Bar 
              dataKey="value" 
              name="Revenu ($)" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1000}
            >
              {contentTypeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === activeIndex ? hoverColor : activeBarColor}
                  style={{
                    filter: index === activeIndex ? 'drop-shadow(0 0 3px rgba(14, 165, 233, 0.5))' : 'none',
                    transition: 'fill 0.3s ease, filter 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      {!hasLoaded && !isVisible && (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
          <p className="text-muted-foreground text-sm">Chargement du graphique...</p>
        </div>
      )}
    </div>
  );
};

export default ContentTypeBarChart;
