'use client'

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { TProject } from './hooks'
import { Dispatch, SetStateAction } from 'react'

type TModal = {
  modal: boolean
  data: TProject | null
}

type TProps = {
  modalDelete: TModal
  setModalDelete: Dispatch<SetStateAction<TModal>>
  onSubmit: () => void
}
const ModalDelete: React.FC<TProps> = ({
  modalDelete,
  setModalDelete,
  onSubmit,
}) => {
  return (
    <Dialog open={modalDelete.modal}>
      <DialogContent>
        <div>
          Are you sure want to delete <strong>{modalDelete.data?.name}</strong>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='info'
          onClick={() => setModalDelete({ modal: false, data: null })}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} variant='contained' color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ModalDelete
