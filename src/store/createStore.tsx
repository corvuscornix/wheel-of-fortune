import React, { FunctionComponent } from 'react';
import { TStore, Store } from './store';
import { useLocalStore } from 'mobx-react';

const storeContext = React.createContext<TStore | null>(null);
storeContext.displayName = 'Store';

declare const window: any;

const createStore = (): TStore => {
  return new Store('Welcome to wheel of fortune');
};

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
