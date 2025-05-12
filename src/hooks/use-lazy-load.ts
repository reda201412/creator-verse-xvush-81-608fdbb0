
import { useState, useEffect, useRef, MutableRefObject } from 'react';

export interface UseLazyLoadOptions {
  threshold?: number; // Visibility threshold (0-1)
  rootMargin?: string; // Margin around the root
  once?: boolean; // Load only once or keep observing
}

export interface UseLazyLoadReturn {
  elementRef: MutableRefObject<HTMLDivElement | null>;
  isVisible: boolean;
  hasLoaded: boolean;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}): UseLazyLoadReturn {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  
  const { 
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        
        if (isElementVisible) {
          setIsVisible(true);
          setHasLoaded(true);
          
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else {
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, once]);
  
  return { elementRef, isVisible, hasLoaded };
}

export default useLazyLoad;
