import { useState } from 'react';

interface FormData {
  [key: string]: string;
}

interface UseFormReturn {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  resetForm: () => void;
}

export const useForm = (initialState: FormData = {}): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    handleChange,
    setFormData,
    resetForm
  };
}; 