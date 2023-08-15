'use client'

import { OrganizationForm } from '@/app/(app.domain.com)/_components/create-organization-form'
import { Modal } from '@/components/ui/modal'
import { useOrganizationModal } from '@/hooks/use-organization-modal'

export const OrganizationModal = () => {
  const organizationModal = useOrganizationModal()

  return (
    <Modal
      title='Create organization'
      description='Add a new organization to start managing your business.'
      isOpen={organizationModal.isOpen}
      onClose={organizationModal.onClose}
    >
      <OrganizationForm userId={organizationModal.userId} />
    </Modal>
  )
}
