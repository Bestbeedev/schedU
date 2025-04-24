import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersState {
  selectedStage: string;
  selectedDepartment: string;
  showAll: boolean;
  setSelectedStage: (stage: string) => void;
  setSelectedDepartment: (department: string) => void;
  setShowAll: (showAll: boolean) => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      selectedStage: '',
      selectedDepartment: '',
      showAll: false,
      setSelectedStage: (stage) => set({ selectedStage: stage }),
      setSelectedDepartment: (department) => set({ selectedDepartment: department }),
      setShowAll: (showAll) => set({ showAll }),
    }),
    {
      name: 'filters-storage',
    }
  )
); 