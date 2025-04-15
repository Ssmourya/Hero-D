import React, { useState } from 'react';
import StepProgressTracker from './StepProgressTracker';

interface ProgressTrackerPageProps {
  onNavigate: (section: string) => void;
}

const ProgressTrackerPage: React.FC<ProgressTrackerPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<string>('customer');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Map step IDs to section names and descriptions
  const stepDetails: Record<string, { title: string, description: string }> = {
    'customer': {
      title: 'Customer Management',
      description: 'Manage customer information, view customer history, and track customer interactions.'
    },
    'employee': {
      title: 'Employee Management',
      description: 'Manage employee information, track attendance, and handle employee-related tasks.'
    },
    'support': {
      title: 'Support Staff Management',
      description: 'Manage support staff, assign tasks, and track support ticket resolution.'
    },
    'suppliers': {
      title: 'Supplier Management',
      description: 'Manage supplier information, track orders, and handle supplier-related tasks.'
    },
    'vehicles': {
      title: 'Vehicle Management',
      description: 'Manage vehicle inventory, track vehicle details, and handle vehicle-related tasks.'
    },
    'products': {
      title: 'Product Management',
      description: 'Manage product inventory, track product details, and handle product-related tasks.'
    },
    'purchase': {
      title: 'Purchase Management',
      description: 'Manage purchases, track purchase orders, and handle purchase-related tasks.'
    },
    'observation': {
      title: 'Observation Library',
      description: 'View and manage observations, track trends, and generate reports.'
    }
  };

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
    onNavigate(stepId);
  };

  const handleCompleteStep = () => {
    // Mark the current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }

    // Find the next step
    const steps = Object.keys(stepDetails);
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setActiveStep(nextStep);
      onNavigate(nextStep);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Progress Tracker</h1>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <StepProgressTracker 
          onStepClick={handleStepClick} 
          activeStep={activeStep}
        />
      </div>

      {/* Active Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{stepDetails[activeStep].title}</h2>
        <p className="text-gray-600 mb-6">{stepDetails[activeStep].description}</p>

        {/* Step Content */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
          <h3 className="text-lg font-medium mb-4">Step {Object.keys(stepDetails).indexOf(activeStep) + 1}: {stepDetails[activeStep].title}</h3>
          <p className="text-gray-600 mb-4">
            This is the content for the {stepDetails[activeStep].title.toLowerCase()} step. 
            Here you would typically see forms, data tables, or other UI elements related to this step.
          </p>

          {/* Sample UI for the step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Quick Actions</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New {activeStep.charAt(0).toUpperCase() + activeStep.slice(1, -1)}
                </li>
                <li className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  View All {activeStep.charAt(0).toUpperCase() + activeStep.slice(1)}
                </li>
                <li className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Generate Report
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Status</h4>
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Active: 24</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Pending: 8</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Inactive: 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const steps = Object.keys(stepDetails);
              const currentIndex = steps.indexOf(activeStep);
              if (currentIndex > 0) {
                const prevStep = steps[currentIndex - 1];
                setActiveStep(prevStep);
                onNavigate(prevStep);
              }
            }}
            disabled={Object.keys(stepDetails).indexOf(activeStep) === 0}
            className={`px-6 py-2 rounded-md flex items-center ${
              Object.keys(stepDetails).indexOf(activeStep) === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>
          <button
            onClick={handleCompleteStep}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            {Object.keys(stepDetails).indexOf(activeStep) === Object.keys(stepDetails).length - 1 ? 'Complete' : 'Next'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerPage;
