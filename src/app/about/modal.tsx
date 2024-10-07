'use client'

import CInput from '@/components/custom/input'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
type TModal = {
  modal: { isOpen: boolean; value: string }
  setModal: Dispatch<SetStateAction<{ isOpen: boolean; value: string }>>
  onSubmit: () => void
}
const ModalAddSection: React.FC<TModal> = ({ modal, setModal, onSubmit }) => {
  return (
    <Dialog open={modal.isOpen}>
      <DialogContent>
        <CInput
          label='Section Name'
          onChange={(e) => setModal({ ...modal, value: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='info'
          onClick={() => setModal({ isOpen: false, value: '' })}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ModalAddSection
