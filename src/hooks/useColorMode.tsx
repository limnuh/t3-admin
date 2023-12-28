import { useEffect } from 'react';
import useLocalStorage, { type SetValue } from './useLocalStorage';

const useColorMode = (): [colorMode: string, setColorMode: (value: SetValue<string>) => void] => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    colorMode === 'dark' ? bodyClass.add(className) : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
