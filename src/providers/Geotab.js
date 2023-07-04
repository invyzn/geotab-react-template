import React, { createContext, useState, useEffect, useRef } from 'react';

const GeotabContext = createContext();

export const useGeotabContext = () => React.useContext(GeotabContext);

export const GeotabProvider = ({ name, callbacks, children }) => {
  const [api, setApi] = useState(null);
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const callbacksRef = useRef({});

  const initialize = (api, state, callback) => {
    setApi(api);
    setState(state);
    callback();
    setIsLoading(false); // Set isLoading to false when initialize is done
    if (callbacksRef.current.initialize) {
      callbacksRef.current.initialize(api, state);
    }
  };

  const focus = (api, state) => {
    // Call the registered focus callback
    if (callbacksRef.current.focus) {
      callbacksRef.current.focus(api, state);
    }
  };

  const blur = (api, state) => {
    if (callbacksRef.current.blur) {
      callbacksRef.current.blur(api, state);
    }
  };

  if(!window.geotab.reactAddin[name]?.initialize) {
    window.geotab.reactAddin[name] = {
      initialize,
      focus,
      blur
    };  
  }

  const events = { initialize, focus, blur };

  useEffect(() => {
    if(callbacks) {
        callbacks.forEach((call) => {
            events[call.type](...call.args);
        })
        callbacks = [];
    }
  }, []);

  const providerValue = {
    initialize,
    focus,
    blur,
    api,
    state,
  };

  return (
    <GeotabContext.Provider value={providerValue}>
      {isLoading ? <div>Loading...</div> : children}
    </GeotabContext.Provider>
  );
};
