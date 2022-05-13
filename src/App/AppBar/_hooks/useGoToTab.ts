import usePushWindowHash from '../../_hooks/usePushWindowHash';
import type TabType from '../../_types/TabType';

const useGoToTab = () => {
  const pushWindowHash = usePushWindowHash();

  return (tab: TabType) => {
    const activeWindow = tab.windows[tab.selectedWindowIdx];

    pushWindowHash(activeWindow, { tabOverride: tab.id });
  };
};

export default useGoToTab;