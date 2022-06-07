import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { WindowStateType } from '../_types/WindowStateType';
import setWindowImagesAtom from './_atoms/setWindowImagesAtom';
import windowStateAtom from './_atoms/windowStateAtom';
import useProfileState from './_hooks/useProfileState';
import ProfileStorageType from './_types/ProfileStorageType';
import WindowSetImagesType from './_types/WindowSetImagesType';

type WindowStateProviderProps = {
  setWindowImages: WindowSetImagesType;
  windowState: WindowStateType;
  profileState: ProfileStorageType;
};

function WindowStateProvider({
  setWindowImages,
  profileState,
  windowState,
}: WindowStateProviderProps) {
  const setCurrentState = useSetRecoilState(windowStateAtom);
  const setSetWindowImages = useSetRecoilState(setWindowImagesAtom);
  const [, , syncProfile] = useProfileState();

  useEffect(() => {
    if (windowState) {
      setCurrentState(windowState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(windowState)]);

  useEffect(() => {
    syncProfile(profileState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileState]);

  useEffect(() => {
    setSetWindowImages(() => setWindowImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setWindowImages]);

  return null;
}

export default WindowStateProvider;