'use client';

import { useEffect, useState } from 'react';

export default function useApiKey() {
  const [apiKey, setApiKey] = useState<string>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem('apiKey');
      if (key !== null) {
        setApiKey(key);
      }
    }
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem('apiKey', key);
    setApiKey(key);
  };

  return [apiKey, saveApiKey] as const;
}
