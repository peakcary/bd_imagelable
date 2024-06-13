import { useState, useEffect } from 'react';
import localforage from 'localforage';

const useLocalForage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    localforage.getItem(key).then((value) => {
      if (value !== null) {
        setStoredValue(value);
      }
    }).catch((err) => {
      console.error(`Error getting data for key "${key}": `, err);
    });
  }, [key]);

  const setValue = (value) => {
    localforage.setItem(key, value).then(() => {
      setStoredValue(value);
    }).catch((err) => {
      console.error(`Error setting data for key "${key}": `, err);
    });
  };

  return [storedValue, setValue];
};

export default useLocalForage;
