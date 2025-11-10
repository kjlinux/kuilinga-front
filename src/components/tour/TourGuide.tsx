import React from 'react';
import Joyride, { CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useTour } from '@/contexts/TourContext';
import { tourSteps, defaultTourOptions } from '@/config/tour-steps';
import { motion, AnimatePresence } from 'framer-motion';

// Tooltip personnalisé avec animations Framer Motion
const CustomTooltip: React.FC<any> = ({
  continuous,
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  size,
  isLastStep,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...tooltipProps}
        className="bg-white rounded-lg shadow-2xl max-w-md border-2 border-primary"
        style={{
          ...tooltipProps.style,
          padding: 0,
        }}
      >
        {/* En-tête */}
        {step.title && (
          <div className="bg-primary text-white px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">{step.title}</h3>
          </div>
        )}

        {/* Contenu */}
        <div className="px-6 py-4">
          <div className="text-gray-700 text-base leading-relaxed">
            {step.content}
          </div>
        </div>

        {/* Pied de page avec actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-between border-t border-gray-200">
          {/* Progression */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {index + 1} / {size}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: size }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
            )}

            {continuous && !isLastStep && (
              <button
                {...primaryProps}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Suivant
              </button>
            )}

            {isLastStep && (
              <button
                {...primaryProps}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Terminer
              </button>
            )}

            <button
              {...skipProps}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Passer
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const TourGuide: React.FC = () => {
  const { activeTour, isRunning, stepIndex, setStepIndex, completeTour, skipTour } =
    useTour();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    // Gérer la fin du tour
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (status === STATUS.FINISHED && activeTour) {
        completeTour(activeTour);
      } else if (status === STATUS.SKIPPED) {
        skipTour();
      }
    }

    // Gérer le bouton fermer
    if (action === ACTIONS.CLOSE) {
      skipTour();
    }

    // Mettre à jour l'index de l'étape
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  };

  // Obtenir les étapes du tour actif
  const steps = activeTour ? tourSteps[activeTour] : [];

  if (!isRunning || !activeTour || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      stepIndex={stepIndex}
      run={isRunning}
      continuous={defaultTourOptions.continuous}
      showProgress={defaultTourOptions.showProgress}
      showSkipButton={defaultTourOptions.showSkipButton}
      disableOverlayClose={defaultTourOptions.disableOverlayClose}
      disableCloseOnEsc={defaultTourOptions.disableCloseOnEsc}
      hideBackButton={defaultTourOptions.hideBackButton}
      spotlightClicks={defaultTourOptions.spotlightClicks}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      locale={defaultTourOptions.locale}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#703D57', // Couleur primaire KUILINGA
          textColor: '#333',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#fff',
          beaconSize: 36,
        },
        spotlight: {
          borderRadius: 8,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    />
  );
};
