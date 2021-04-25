import createStore from 'zustand';
import { useActiveQueueStore } from './active-queue';
import shallow from 'zustand/shallow';
import { useEffect } from 'react';
import { useFiltersStore } from './filters';
import { PaginationConfig } from '@/config/pagination';

type TState = {
  perPage: number;
  page: number;
  changePerPage: (perPage: number) => void;
  changePage: (page: number) => void;
};

export const usePaginationStore = createStore<TState>((set) => ({
  page: 0,
  perPage: PaginationConfig.perPageOptions[1],

  changePage: (page) => set({ page }),
  changePerPage: (perPage) => set({ perPage }),
}));

export const useRunPaginationSideEffects = () => {
  const changePage = usePaginationStore((state) => state.changePage);
  useEffect(() => {
    const effect = () => changePage(0);
    const unsubFilters = useFiltersStore.subscribe(
      effect,
      (state) => [state.order, state.statuses, state.jobId],
      shallow,
    );
    const unsubActiveQueue = useActiveQueueStore.subscribe(
      effect,
      (state) => state.active,
    );
    return () => {
      unsubActiveQueue();
      unsubFilters();
    };
  }, []);
};