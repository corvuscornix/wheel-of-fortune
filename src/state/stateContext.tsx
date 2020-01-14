import React, { FunctionComponent } from 'react';
import { AppState, State } from './state';

const AppStateContext = React.createContext<State | null>(null);
AppStateContext.displayName = 'AppStateContext';

declare const window: any;

export const StateProvider: FunctionComponent = ({ children }) => {
  const appState = AppState.getInstance();

  window.appState = appState;

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const stateContext = React.useContext(AppStateContext);
  if (!stateContext) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useAppState must be used within a StateProvider.');
  }
  return stateContext;
};
