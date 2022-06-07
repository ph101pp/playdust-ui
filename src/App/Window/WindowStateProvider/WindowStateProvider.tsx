import React, { ReactNode, useContext, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { WindowStateType } from '../../_types/WindowStateType';
import windowStateAtom from '../_atoms/windowStateAtom';
import WindowSetImagesContext from '../_sharedComponents/WindowSetImagesContext';
import WindowSetImagesType from '../_types/WindowSetImagesType';
import WindowStateContext from './WindowStateContext';
import windowStateAvailableAtom from './_atoms/windowStateAvailableAtom';

function WindowStateListener() {
  const windowState = useContext(WindowStateContext);
  const setCurrentState = useSetRecoilState(windowStateAtom);

  useEffect(() => {
    if (windowState) {
      setCurrentState(windowState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(windowState), setCurrentState]);

  return null;
}

type WindowStateProviderProps = {
  setWindowImages: WindowSetImagesType;
  windowState: WindowStateType;
  children: ReactNode;
};

function WindowStateProvider({
  setWindowImages,
  windowState,
  children,
}: WindowStateProviderProps) {
  const windowStateAvailable = useRecoilValue(windowStateAvailableAtom);

  return (
    <WindowStateContext.Provider value={windowState}>
      <WindowStateListener />
      <WindowSetImagesContext.Provider value={setWindowImages}>
        {windowStateAvailable && children}
      </WindowSetImagesContext.Provider>
    </WindowStateContext.Provider>
  );
}

export default WindowStateProvider;