import React, { useState } from 'react';
import {
  Users,
  User,
  Headset,
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

interface ProgressTrackerProps {
  onStepClick: (stepId: string) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onStepClick }) => {
  // Define the steps
  const [steps, setSteps] = useState<Step[]>([
    { id: 'customer', label: 'Customer', icon: <Users size={24} />, completed: false, active: true },
    { id: 'employee', label: 'Employee', icon: <User size={24} />, completed: false, active: false },
    { id: 'support', label: 'Support Staffs', icon: <Headset size={24} />, completed: false, active: false },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck size={24} />, completed: false, active: false },
    { id: 'vehicles', label: 'Vehicles', icon: <Car size={24} />, completed: false, active: false },
    { id: 'products', label: 'Products', icon: <Package size={24} />, completed: false, active: false },
    { id: 'purchase', label: 'Purchase', icon: <ShoppingCart size={24} />, completed: false, active: false },
    { id: 'observation', label: 'Observation Library', icon: <Search size={24} />, completed: false, active: false },
  ]);

  // Function to handle step click
  const handleStepClick = (stepId: string) => {
    // Call the parent's onStepClick function
    onStepClick(stepId);

    // Update the steps state
    setSteps(prevSteps => {
      // Find the index of the clicked step
      const clickedStepIndex = prevSteps.findIndex(step => step.id === stepId);

      // Create a new array with updated steps
      return prevSteps.map((step, index) => {
        // Mark all previous steps as completed
        if (index < clickedStepIndex) {
          return { ...step, completed: true, active: false };
        }
        // Mark the clicked step as active and not completed
        else if (index === clickedStepIndex) {
          return { ...step, active: true, completed: false };
        }
        // Mark all future steps as not active and not completed
        else {
          return { ...step, active: false, completed: false };
        }
      });
    });
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
      return prevSteps.map((step, index) => {
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
    });
  };

  return (
    <div className="w-full py-8">
      {/* Steps container */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div
              className="flex flex-col items-center relative cursor-pointer"
              onClick={() => handleStepClick(step.id)}
            >
              {/* Checkmark for completed steps */}
              {step.completed && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
              )}

              {/* Icon container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-2
                  ${step.active
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : step.completed
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-200 text-gray-500 border border-gray-300'
                  }`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium text-center
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

            {/* Connector line (except after the last step) */}
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block h-0.5 flex-grow mx-2
                  ${index < steps.findIndex(s => s.active)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }`}
                style={{ maxWidth: '50px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleNextClick}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default ProgressTracker;
