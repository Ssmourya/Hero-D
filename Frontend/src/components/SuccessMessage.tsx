import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
      <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
