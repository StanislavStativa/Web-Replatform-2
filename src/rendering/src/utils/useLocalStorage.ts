const useLocalStorage = () => {
  const setData = (key: string, value: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  };
  const setSessionData = (key: string, value: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  };

  const getData = <T>(key: string): T | undefined => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : undefined;
      } catch (error) {
        console.error(`Error getting localStorage key “${key}”:`, error);
        return;
      }
    }
    return;
  };
  const getSessionData = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting localStorage key “${key}”:`, error);
        return null;
      }
    }
    return null;
  };

  const removeData = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key “${key}”:`, error);
      }
    }
  };
  const removeSessionData = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key “${key}”:`, error);
      }
    }
  };

  return {
    setData,
    getData,
    removeData,
    removeSessionData,
    setSessionData,
    getSessionData,
  };
};

export default useLocalStorage;
