import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsModal } from '../components/Settings';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettingsOpen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsSettingsOpen(false);
    navigate('/');
  };

  return (
    <SettingsModal 
      isOpen={isSettingsOpen}
      onClose={handleClose}
    />
  );
};