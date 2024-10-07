'use client'

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { TTag } from './hooks'
import { Dispatch, SetStateAction, useState } from 'react'
import CInput from '@/components/custom/input'
import { generateUUID } from '@/utils/generator/uuid'

type TModal = {
  modal: boolean
  data: TTag[]
}
type TProps = {
  modalTags: TModal
  setModalTags: Dispatch<SetStateAction<TModal>>
  onSubmit: () => void
}

const ModalCategories: React.FC<TProps> = ({
  modalTags,
  setModalTags,
  onSubmit,
}) => {
  const addCategory = () => {
    const insertedData: TTag = { id: generateUUID(), name: '', group: '' }
    setModalTags({ ...modalTags, data: [insertedData].concat(modalTags.data) })
  }
  const [focusID, setFocusID] = useState('')
  return (
    <Dialog open={modalTags.modal}>
      <DialogContent>
        <Button variant='contained' className='mb-3' onClick={addCategory}>
          Add Category
        </Button>
        {modalTags.data.map((item) => (
          <div className='flex gap-3 mb-2' key={item.id}>
            <div className=''>
              <CInput
                value={item.group}
                onClick={() => setFocusID('group-' + item.id)}
                autoFocus={focusID === 'group-' + item.id}
                onChange={(e) => {
                  setModalTags({
                    ...modalTags,
                    data: modalTags.data.map((x) => {
                      if (x.id === item.id)
                        return {
                          ...x,
                          group: e.target.value,
                        }
                      return x
                    }),
                  })
                }}
              />
            </div>
            <div className=''>
              <CInput
                value={item.name}
                onClick={() => setFocusID('name-' + item.id)}
                autoFocus={focusID === 'name-' + item.id}
                onChange={(e) => {
                  setModalTags({
                    ...modalTags,
                    data: modalTags.data.map((x) => {
                      if (x.id === item.id)
                        return {
                          ...x,
                          name: e.target.value,
                        }
                      return x
                    }),
                  })
                }}
              />
            </div>
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                setModalTags({
                  ...modalTags,
                  data: modalTags.data.filter((x) => x.id !== item.id),
                })
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='info'
          onClick={() => setModalTags({ ...modalTags, modal: false })}
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
export default ModalCategories
