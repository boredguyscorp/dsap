import { create } from 'zustand'

interface useOrganizationModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  userId: string
  setUserId: (userId: string) => void
}

export const useOrganizationModal = create<useOrganizationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  userId: '',
  setUserId: (userId: string) => set({ userId })
}))
