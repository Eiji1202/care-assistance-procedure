import React from 'react';
import { FiLoader } from 'react-icons/fi';

export default function Loader() {
  return (
    <FiLoader
      className="animate-spin text-muted-foreground"
      size={20}
    />
  );
}
