import React, { useState } from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { useTour, TourType } from '@/contexts/TourContext';
import { tourTitles } from '@/config/tour-steps';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const TourButton: React.FC = () => {
  const { startTour, resetAllTours, tourState } = useTour();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartTour = (tourType: TourType) => {
    setIsOpen(false);
    startTour(tourType);
  };

  const handleResetTours = () => {
    setIsOpen(false);
    resetAllTours();
    // Démarrer automatiquement le tour dashboard après reset
    setTimeout(() => startTour('dashboard'), 500);
  };

  // Compter le nombre de tours complétés
  const completedCount = [
    tourState.dashboardCompleted,
    tourState.attendanceCompleted,
    tourState.reportsCompleted,
    tourState.employeesCompleted,
    tourState.leavesCompleted,
    tourState.devicesCompleted,
    tourState.organizationCompleted,
    tourState.adminCompleted,
    tourState.settingsCompleted,
    tourState.onboardingCompleted,
  ].filter(Boolean).length;

  const totalTours = 10;
  const allCompleted = completedCount === totalTours;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10 transition-colors"
          title="Aide et visite guidée"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <HelpCircle className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Badge de progression */}
          {!allCompleted && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-semibold"
            >
              {completedCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Visites guidées</span>
          <span className="text-xs text-gray-500">
            {completedCount}/{totalTours}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Liste des tours disponibles */}
        {Object.entries(tourTitles).map(([key, title]) => {
          const tourKey = key as keyof typeof tourState;
          const isCompleted = tourState[`${tourKey}Completed` as keyof typeof tourState];

          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleStartTour(key as TourType)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {title}
              </span>
              {isCompleted && (
                <span className="text-green-600 text-xs">✓ Complété</span>
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Option pour réinitialiser tous les tours */}
        <DropdownMenuItem
          onClick={handleResetTours}
          className="flex items-center gap-2 cursor-pointer text-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Recommencer tous les tours
        </DropdownMenuItem>

        {allCompleted && (
          <div className="px-2 py-3 text-center">
            <p className="text-xs text-green-600 font-medium">
              Félicitations ! Vous avez complété tous les tours 🎉
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
