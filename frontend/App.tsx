import { useEffect, useState } from 'react';

export const App = () => {
  const [asd, setAsd] = useState(1);

  useEffect(() => {
    setAsd(asd + 1);
  }, [asd]);

  return <h1>Change me.. {asd}</h1>;
};
