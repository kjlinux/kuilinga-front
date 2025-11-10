import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type TourType = 'dashboard' | 'attendance' | 'reports' | 'employees' | 'leaves' | 'devices' | 'organization' | 'admin' | 'settings' | 'onboarding' | null;

interface TourState {
  dashboardCompleted: boolean;
  attendanceCompleted: boolean;
  reportsCompleted: boolean;
  employeesCompleted: boolean;
  leavesCompleted: boolean;
  devicesCompleted: boolean;
  organizationCompleted: boolean;
  adminCompleted: boolean;
  settingsCompleted: boolean;
  onboardingCompleted: boolean;
  lastShown: string | null;
  skipCount: number;
  neverShowAgain: boolean;
}

interface TourContextType {
  activeTour: TourType;
  isRunning: boolean;
  stepIndex: number;
  startTour: (tourType: TourType) => void;
  stopTour: () => void;
  setStepIndex: (index: number) => void;
  completeTour: (tourType: TourType) => void;
  skipTour: () => void;
  resetAllTours: () => void;
  shouldShowTour: (tourType: TourType) => boolean;
  tourState: TourState;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_STATE_KEY = 'kuilinga-tour-state';

const getInitialTourState = (): TourState => {
  const stored = localStorage.getItem(TOUR_STATE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Si le parse échoue, retourner l'état par défaut
    }
  }
  return {
    dashboardCompleted: false,
    attendanceCompleted: false,
    reportsCompleted: false,
    employeesCompleted: false,
    leavesCompleted: false,
    devicesCompleted: false,
    organizationCompleted: false,
    adminCompleted: false,
    settingsCompleted: false,
    onboardingCompleted: false,
    lastShown: null,
    skipCount: 0,
    neverShowAgain: false,
  };
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeTour, setActiveTour] = useState<TourType>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourState, setTourState] = useState<TourState>(getInitialTourState);

  // Sauvegarder l'état dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(TOUR_STATE_KEY, JSON.stringify(tourState));
  }, [tourState]);

  // Démarrer le tour dashboard automatiquement au premier login
  useEffect(() => {
    if (isAuthenticated && !tourState.neverShowAgain) {
      // Attendre 2 secondes après le login pour laisser l'utilisateur s'orienter
      const timer = setTimeout(() => {
        if (!tourState.dashboardCompleted && !isRunning) {
          startTour('dashboard');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const startTour = useCallback((tourType: TourType) => {
    if (tourType && !tourState.neverShowAgain) {
      setActiveTour(tourType);
      setIsRunning(true);
      setStepIndex(0);
      setTourState((prev) => ({
        ...prev,
        lastShown: new Date().toISOString(),
      }));
    }
  }, [tourState.neverShowAgain]);

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setActiveTour(null);
    setStepIndex(0);
  }, []);

  const completeTour = useCallback((tourType: TourType) => {
    if (tourType) {
      setTourState((prev) => ({
        ...prev,
        [`${tourType}Completed`]: true,
      }));
    }
    stopTour();
  }, [stopTour]);

  const skipTour = useCallback(() => {
    setTourState((prev) => ({
      ...prev,
      skipCount: prev.skipCount + 1,
    }));
    stopTour();
  }, [stopTour]);

  const resetAllTours = useCallback(() => {
    setTourState({
      dashboardCompleted: false,
      attendanceCompleted: false,
      reportsCompleted: false,
      employeesCompleted: false,
      leavesCompleted: false,
      devicesCompleted: false,
      organizationCompleted: false,
      adminCompleted: false,
      settingsCompleted: false,
      onboardingCompleted: false,
      lastShown: null,
      skipCount: 0,
      neverShowAgain: false,
    });
    stopTour();
  }, [stopTour]);

  const shouldShowTour = useCallback(
    (tourType: TourType): boolean => {
      if (!tourType || tourState.neverShowAgain) return false;
      return !tourState[`${tourType}Completed` as keyof TourState];
    },
    [tourState]
  );

  const value: TourContextType = {
    activeTour,
    isRunning,
    stepIndex,
    startTour,
    stopTour,
    setStepIndex,
    completeTour,
    skipTour,
    resetAllTours,
    shouldShowTour,
    tourState,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
