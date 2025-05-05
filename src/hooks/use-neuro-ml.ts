
import { useState, useEffect, useCallback } from 'react';
import { useUserBehavior } from './use-user-behavior';
import { useNeuroAesthetic, NeuroAestheticConfig } from './use-neuro-aesthetic';
import { useLocalStorage } from './use-local-storage';

// Types for ML model
export interface MLPrediction {
  cognitiveProfile: 'visual' | 'analytical' | 'balanced' | 'immersive';
  confidence: number;
  moodIntensity: number;
  suggestedMood: 'energetic' | 'calm' | 'creative' | 'focused';
  interfaceDensity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface MLModelState {
  initialized: boolean;
  predictions: MLPrediction[];
  modelVersion: string;
  lastTrainingDate: string | null;
  coefficients: Record<string, number>;
  featureImportance: Record<string, number>;
  autoApply: boolean;
}

// Weight definition for different behaviors
interface FeatureWeights {
  interactionSpeed: number;
  sessionDuration: number;
  visualContent: number;
  analyticalContent: number;
  timeOfDay: number;
  scrollBehavior: number;
}

export function useNeuroML(options = {}) {
  const { behaviorData, getCognitiveProfile } = useUserBehavior();
  const { config, updateConfig } = useNeuroAesthetic();
  
  // Model state management
  const [modelState, setModelState] = useLocalStorage<MLModelState>('xvush_ml_model', {
    initialized: false,
    predictions: [],
    modelVersion: '1.0.0',
    lastTrainingDate: null,
    coefficients: {
      interactionSpeed: 0.25,
      sessionDuration: 0.15,
      visualContent: 0.3,
      analyticalContent: 0.2,
      timeOfDay: 0.05,
      scrollBehavior: 0.05
    },
    featureImportance: {},
    autoApply: true
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Extract features from user behavior
  const extractFeatures = useCallback(() => {
    const profile = getCognitiveProfile();
    const now = new Date();
    const hour = now.getHours();
    
    // Calculate interaction speed (inverse of avg time between interactions)
    const interactionHistory = behaviorData.interactionHistory;
    let avgInteractionTime = 0;
    
    if (interactionHistory.length > 5) {
      let totalGaps = 0;
      let gapCount = 0;
      
      for (let i = 1; i < Math.min(interactionHistory.length, 20); i++) {
        const current = new Date(interactionHistory[i-1].timestamp).getTime();
        const previous = new Date(interactionHistory[i].timestamp).getTime();
        const gap = (current - previous) / 1000; // in seconds
        
        if (gap < 300) { // Ignore large gaps (5 minutes)
          totalGaps += gap;
          gapCount++;
        }
      }
      
      avgInteractionTime = gapCount > 0 ? totalGaps / gapCount : 0;
    }
    
    // Normalized interaction speed (faster = higher value)
    const interactionSpeed = avgInteractionTime > 0 ? 
      Math.min(1, Math.max(0, 1 - (avgInteractionTime / 20))) : 0.5;
    
    // Calculate session duration factor
    const sessionDuration = Math.min(1, behaviorData.averageSessionDuration / 30);
    
    // Content type preferences
    const contentPrefs = behaviorData.preferredContentTypes;
    let visualContent = 0;
    let analyticalContent = 0;
    
    // Classify content types into visual or analytical
    Object.entries(contentPrefs).forEach(([type, count]) => {
      if (['image', 'video', 'gallery', 'visual'].includes(type.toLowerCase())) {
        visualContent += count;
      }
      if (['article', 'data', 'text', 'stats', 'analytics'].includes(type.toLowerCase())) {
        analyticalContent += count;
      }
    });
    
    const totalContent = Object.values(contentPrefs).reduce((sum, count) => sum + count, 0);
    visualContent = totalContent > 0 ? visualContent / totalContent : 0.5;
    analyticalContent = totalContent > 0 ? analyticalContent / totalContent : 0.5;
    
    // Time of day factor - morning and evening are different
    const timeOfDay = Math.sin((hour / 24) * Math.PI * 2) * 0.5 + 0.5;
    
    // Focus level from behavior
    const scrollBehavior = profile.focusLevel / 100;
    
    return {
      interactionSpeed,
      sessionDuration,
      visualContent, 
      analyticalContent,
      timeOfDay,
      scrollBehavior
    };
  }, [behaviorData, getCognitiveProfile]);
  
  // Run prediction model based on behavior data
  const predictOptimalConfiguration = useCallback(() => {
    if (!modelState.initialized || behaviorData.interactionCount < 10) {
      return null;
    }
    
    // Extract behavioral features
    const features = extractFeatures();
    
    // Simple weighted model (simulating ML prediction)
    const weights = modelState.coefficients;
    
    // Calculate scores for each profile
    const scores = {
      visual: features.visualContent * weights.visualContent + 
              features.interactionSpeed * weights.interactionSpeed,
              
      analytical: features.analyticalContent * weights.analyticalContent + 
                  features.sessionDuration * weights.sessionDuration,
                  
      balanced: 0.5,
      
      immersive: features.visualContent * weights.visualContent * 0.7 + 
                features.interactionSpeed * weights.interactionSpeed * 0.3
    };
    
    // Find highest score
    let bestProfile: 'visual' | 'analytical' | 'balanced' | 'immersive' = 'balanced';
    let maxScore = scores.balanced;
    
    Object.entries(scores).forEach(([profile, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestProfile = profile as any;
      }
    });
    
    // Determine mood based on time and interaction pattern
    let suggestedMood: 'energetic' | 'calm' | 'creative' | 'focused';
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) {
      suggestedMood = 'energetic';
    } else if (hour >= 20 || hour < 5) {
      suggestedMood = 'calm';
    } else if (features.visualContent > 0.6) {
      suggestedMood = 'creative';
    } else {
      suggestedMood = 'focused';
    }
    
    // Calculate mood intensity
    const moodIntensity = Math.round(
      50 + 
      (features.interactionSpeed * 20) - 
      (features.sessionDuration * 10) +
      (features.visualContent > 0.5 ? 10 : -10)
    );
    
    // Derive interface density from cognitive profile and features
    let interfaceDensity: 'low' | 'medium' | 'high';
    if (bestProfile === 'analytical' || features.sessionDuration > 0.7) {
      interfaceDensity = 'high';
    } else if (bestProfile === 'visual' || features.interactionSpeed > 0.7) {
      interfaceDensity = 'low';
    } else {
      interfaceDensity = 'medium';
    }
    
    // Calculate confidence based on data amount
    const confidenceBase = Math.min(0.7, behaviorData.interactionCount / 100);
    const confidence = confidenceBase + 
      (behaviorData.previousSessions.length > 3 ? 0.2 : 0) +
      (behaviorData.interactionHistory.length > 20 ? 0.1 : 0);
    
    const prediction: MLPrediction = {
      cognitiveProfile: bestProfile,
      confidence: parseFloat(confidence.toFixed(2)),
      moodIntensity: Math.max(20, Math.min(80, moodIntensity)),
      suggestedMood,
      interfaceDensity,
      timestamp: new Date().toISOString()
    };
    
    return prediction;
  }, [behaviorData, extractFeatures, modelState]);
  
  // Run the ML analysis
  const runAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    
    try {
      // Simulate progressive analysis
      for (let i = 0; i <= 100; i += 10) {
        setAnalysisProgress(i);
        // Artificial delay for better UX with progress indication
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const prediction = predictOptimalConfiguration();
      
      if (prediction) {
        setModelState(prev => ({
          ...prev,
          initialized: true,
          predictions: [prediction, ...prev.predictions].slice(0, 10),
          lastTrainingDate: new Date().toISOString()
        }));
        
        // Auto-apply if enabled
        if (modelState.autoApply) {
          applyPrediction(prediction);
        }
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [isAnalyzing, modelState.autoApply, predictOptimalConfiguration, setModelState]);
  
  // Apply a prediction to the system configuration
  const applyPrediction = useCallback((prediction: MLPrediction) => {
    if (!prediction) return;
    
    // Create update object for neuro-aesthetic configuration
    const configUpdate: Partial<NeuroAestheticConfig> = {
      cognitiveProfile: prediction.cognitiveProfile,
      adaptiveMood: prediction.suggestedMood,
      moodIntensity: prediction.moodIntensity,
      // Map interface density to other settings
      contrastLevel: prediction.interfaceDensity === 'high' ? 'high' : 
                    prediction.interfaceDensity === 'low' ? 'low' : 'standard',
      animationSpeed: prediction.interfaceDensity === 'high' ? 'reduced' : 
                      prediction.interfaceDensity === 'low' ? 'enhanced' : 'standard'
    };
    
    // Update the configuration
    updateConfig(configUpdate);
    
  }, [updateConfig]);
  
  // Auto-train the model as user behavior accumulates
  useEffect(() => {
    // Initialize model if enough data exists
    if (!modelState.initialized && 
        behaviorData.interactionCount > 20 && 
        behaviorData.interactionHistory.length > 10) {
      runAnalysis();
    }
    
    // Retrain periodically if auto-apply is on
    const lastTrainingDate = modelState.lastTrainingDate ? 
      new Date(modelState.lastTrainingDate) : null;
    
    const shouldRetrain = lastTrainingDate && 
      ((new Date().getTime() - lastTrainingDate.getTime()) > 24 * 60 * 60 * 1000); // 24 hours
    
    if (modelState.initialized && modelState.autoApply && shouldRetrain) {
      runAnalysis();
    }
  }, [behaviorData, modelState, runAnalysis]);
  
  // Toggle auto-apply setting
  const toggleAutoApply = useCallback(() => {
    setModelState(prev => ({
      ...prev,
      autoApply: !prev.autoApply
    }));
  }, [setModelState]);
  
  // Apply latest prediction
  const applyLatestPrediction = useCallback(() => {
    if (modelState.predictions.length > 0) {
      applyPrediction(modelState.predictions[0]);
    }
  }, [applyPrediction, modelState.predictions]);
  
  return {
    modelState,
    isAnalyzing,
    analysisProgress,
    runAnalysis,
    applyPrediction,
    toggleAutoApply,
    applyLatestPrediction,
    extractFeatures
  };
}

// Helper hook for local storage state
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  };

  return [storedValue, setValue] as const;
}
