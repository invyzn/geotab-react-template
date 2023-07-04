import React from 'react';
import ReactDOM from 'react-dom/client';
import { GeotabProvider } from '../providers/Geotab';

if(!window.geotab) {    
    window.geotab = {addin: {}}
}

const parseHash = (input) => {
    const regex = /#addin-(\w+)-([^,]+)/;
    const matches = input.match(regex);  
    if (matches && matches.length >= 3) {
      const [path, application, addin] = matches;
      const paramString = input.replace(`${path},`, '');
      const params = {};
  
      if (paramString && paramString !== "") {
        const paramsArray = paramString.split(/,(?![^\[\](){}]*[)\]}])/);
  
        paramsArray.forEach((param) => {
          const [key, ...values] = param.split(':');
          const value = values.join(':').trim();
          params[key.trim()] = value;
        });
      }
  
      return {
        application,
        addin,
        params
      };
    }  
    return null;
}

export const getPluginName = (name) => {
    const words = name.split(/[\s-]+/);
    const camelCaseWords = words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    return camelCaseWords.join('');
};;

export const getURLParams = () => {
    if(window.location.hash) {
        const content = parseHash(window.location.hash);
        if(content?.params)
            return content.params;
    }
    return {};
    
};

export const getCurrentFileName = () => {
    if(window.location.hash) {
        const content = parseHash(window.location.hash);
        if(content?.addin)
            return content.addin;
    }
    const url = new URL(import.meta.url);
    const filenameWithExtension = url.pathname.split('/').pop();
    const filename = filenameWithExtension.split('.')[0];
    return filename;
    
};

export const render = (Component) => {
    const name = getPluginName(getCurrentFileName());
    const root = ReactDOM.createRoot(document.getElementById("geotabApp"));
    const callbacks = [];
    let hooks = {};
  
    const registerCallback = (callbacks, type, args) => {
        callbacks.push({
            type,
            args
        });    
    }

    const addinFunction = (callbacks) => (() => {
        return {
            async initialize(api, state, callback) {
                if(window.geotab.reactAddin[name]?.initialize) 
                    window.geotab.reactAddin[name].initialize(api, state, callback) 
                else registerCallback(callbacks, "initialize", [api, state, callback]);
            },
            focus(api, state) {
                if(window.geotab.reactAddin[name]?.focus) 
                    window.geotab.reactAddin[name].focus(api, state) 
                else registerCallback(callbacks, "focus", [api, state]);
            },
            blur(api, state) {
                if(window.geotab.reactAddin[name]?.blur) 
                    window.geotab.reactAddin[name].blur(api, state) 
                else registerCallback(callbacks, "blur", [api, state]);
            }
        };
    })

    if(!window.geotab.addin[name]) {
        window.geotab.reactAddin = {[name]: {}};
        window.geotab.addin[name] = addinFunction(callbacks);
    }

    root.render(
        <GeotabProvider name={name} callbacks={callbacks}>
            <React.StrictMode>
                <Component></Component>
            </React.StrictMode>
        </GeotabProvider>
    );
}

export default {
    getPluginName,
    getCurrentFileName
}