import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  HeadsetIcon, 
  Truck, 
  Car, 
  Package, 
  ShoppingCart, 
  Search,
  CheckCircle2
} from 'lucide-react';

// Define the step interface
interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface StepProgressTrackerProps {
  onStepClick: (stepId: string) => void;
  activeStep?: string;
}

const StepProgressTracker: React.FC<StepProgressTrackerProps> = ({ onStepClick, activeStep }) => {
  // Define the steps
  const [steps, setSteps] = useState<Step[]>([
    { id: 'customer', label: 'Customer', icon: <Users size={24} />, completed: false, active: false },
    { id: 'employee', label: 'Employee', icon: <User size={24} />, completed: false, active: false },
    { id: 'support', label: 'Support Staffs', icon: <HeadsetIcon size={24} />, completed: false, active: false },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck size={24} />, completed: false, active: false },
    { id: 'vehicles', label: 'Vehicles', icon: <Car size={24} />, completed: false, active: false },
    { id: 'products', label: 'Products', icon: <Package size={24} />, completed: false, active: false },
    { id: 'purchase', label: 'Purchase', icon: <ShoppingCart size={24} />, completed: false, active: false },
    { id: 'observation', label: 'Observation Library', icon: <Search size={24} />, completed: false, active: false },
  ]);

  // Update steps when activeStep changes
  useEffect(() => {
    if (activeStep) {
      const activeStepIndex = steps.findIndex(step => step.id === activeStep);
      if (activeStepIndex !== -1) {
        setSteps(prevSteps => {
          return prevSteps.map((step, index) => {
            if (index < activeStepIndex) {
              return { ...step, completed: true, active: false };
            } else if (index === activeStepIndex) {
              return { ...step, active: true, completed: false };
            } else {
              return { ...step, active: false, completed: false };
            }
          });
        });
      }
    }
  }, [activeStep, steps]);

  // Function to handle step click
  const handleStepClick = (stepId: string) => {
    // Call the parent's onStepClick function
    onStepClick(stepId);
  };

  // Function to handle the "Next" button click
  const handleNextClick = () => {
    setSteps(prevSteps => {
      // Find the index of the active step
      const activeStepIndex = prevSteps.findIndex(step => step.active);
      
      // If there's no active step or the last step is active, return the current state
      if (activeStepIndex === -1 || activeStepIndex === prevSteps.length - 1) {
        return prevSteps;
      }
      
      // Create a new array with updated steps
      const newSteps = prevSteps.map((step, index) => {
        // Mark the current active step as completed and not active
        if (index === activeStepIndex) {
          return { ...step, completed: true, active: false };
        }
        // Mark the next step as active
        else if (index === activeStepIndex + 1) {
          return { ...step, active: true };
        }
        // Keep other steps as they are
        else {
          return step;
        }
      });
      
      // Call onStepClick with the new active step
      const newActiveStep = newSteps.find(step => step.active);
      if (newActiveStep) {
        onStepClick(newActiveStep.id);
      }
      
      return newSteps;
    });
  };

  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-semibold mb-6">Progress Tracker</h3>
      
      {/* Steps container */}
      <div className="flex flex-wrap justify-between items-center mb-6 relative">
        {/* Horizontal line connecting all steps */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="flex flex-col items-center relative z-10"
          >
            {/* Step */}
            <div 
              className="flex flex-col items-center relative cursor-pointer mb-2"
              onClick={() => handleStepClick(step.id)}
            >
              {/* Checkmark for completed steps */}
              {step.completed && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full z-20">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
              )}
              
              {/* Icon container */}
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${step.active 
                    ? 'bg-green-500 text-white border-2 border-green-600 scale-110 shadow-lg' 
                    : step.completed 
                      ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                      : 'bg-white text-gray-500 border border-gray-300'
                  }`}
              >
                {step.icon}
              </div>
              
              {/* Label */}
              <span 
                className={`text-xs font-medium text-center max-w-[80px]
                  ${step.active 
                    ? 'text-green-600' 
                    : step.completed 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                  }`}
              >
                {step.label}
              </span>
              
              {/* Pending indicator for inactive and uncompleted steps */}
              {!step.active && !step.completed && (
                <span className="text-gray-400 text-xs mt-1">...</span>
              )}
            </div>
            
            {/* Step number */}
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* Next button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNextClick}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          Next Step
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepProgressTracker;
