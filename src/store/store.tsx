import React, { FunctionComponent } from 'react';
import { createStore, TStore } from './createStore';
import { useLocalStore } from 'mobx-react';

const storeContext = React.createContext<TStore | null>(null);

declare const window: any;

export const StoreProvider: FunctionComponent = ({ children }) => {
  const store = useLocalStore(createStore);

  window.store = store;

  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
