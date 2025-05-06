import React, { useState, useEffect, useRef } from 'react';

interface StatProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  duration?: number;
}

const StatisticsCounter: React.FC<StatProps> = ({ 
  value, 
  label, 
  icon, 
  suffix = '+', 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    
    hasAnimated.current = true;
    
    let startTime: number;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, duration]);
  
  useEffect(() => {
    if (hasAnimated.current) {
      setCount(value);
    }
  }, [value]);
  
  return (
    <div ref={countRef} className="stat-card">
      <div className="flex items-center">
        <div className="mr-4 text-primary-600">
          {icon}
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-bold text-primary-700">
            {count}
            <span className="text-primary-600">{suffix}</span>
          </h4>
          <p className="text-neutral-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCounter;