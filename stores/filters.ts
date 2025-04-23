import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersState {
  selectedStage: string;
  selectedDepartment: string;
  setSelectedStage: (stage: string) => void;
  setSelectedDepartment: (department: string) => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      selectedStage: '',
      selectedDepartment: '',
      setSelectedStage: (stage) => set({ selectedStage: stage }),
      setSelectedDepartment: (department) => set({ selectedDepartment: department }),
    }),
    {
      name: 'filters-storage',
    }
  )
); 