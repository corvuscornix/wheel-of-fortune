import React, { FunctionComponent } from 'react';
import { Store } from './store';
import { useLocalStore } from 'mobx-react';

const StoreContext = React.createContext<Store | null>(null);
StoreContext.displayName = 'Store';

declare const window: any;

const createStore = (): Store => {
  return new Store('Welcome to wheel of fortune');
};

export const StoreProvider: FunctionComponent = ({ children }) => {
  const store = useLocalStore(createStore);

  window.store = store;

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
