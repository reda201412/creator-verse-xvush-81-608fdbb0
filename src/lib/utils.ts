
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Golden ratio calculation utility
export function goldenRatio(value: number): number {
  const phi = 1.618;
  return value * phi;
}

// Helper to format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format durations (for videos/audio)
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper to generate gradient backgrounds based on mood
export function getMoodGradient(mood: string): string {
  switch (mood) {
    case 'energetic':
      return 'linear-gradient(135deg, rgba(255,124,67,0.6) 0%, rgba(255,186,71,0.6) 100%)';
    case 'calm':
      return 'linear-gradient(135deg, rgba(67,182,212,0.6) 0%, rgba(107,196,255,0.6) 100%)';
    case 'creative':
      return 'linear-gradient(135deg, rgba(174,122,250,0.6) 0%, rgba(238,109,220,0.6) 100%)';
    case 'focused':
      return 'linear-gradient(135deg, rgba(76,110,219,0.6) 0%, rgba(90,97,195,0.6) 100%)';
    default:
      return 'linear-gradient(135deg, rgba(139,92,246,0.6) 0%, rgba(236,72,153,0.6) 100%)';
  }
}

// Helper for adaptive UI based on time of day
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

// Generate deterministic color based on username (for personalization)
export function getUserColor(username: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to RGB
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Trigger haptic feedback if available (for micro-rewards)
export function triggerHapticFeedback(intensity: 'light' | 'medium' | 'strong' = 'medium'): void {
  if ('vibrate' in navigator) {
    switch (intensity) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate([30, 10, 30]);
        break;
      case 'strong':
        navigator.vibrate([50, 20, 100]);
        break;
    }
  }
}

// Detect if system prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create seeded random function for deterministic animations
export function seedRandom(seed: number) {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}
