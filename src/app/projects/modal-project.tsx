'use client'

import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material'
import { TProject, TTag } from './hooks'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import CInput from '@/components/custom/input'
import CDatePicker from '@/components/custom/datepicker'
import dayjs, { Dayjs } from 'dayjs'
import Uploader from '@/components/custom/uploader'
import { generateUUID } from '@/utils/generator/uuid'
import { TFileLike } from '@/utils/constants/constants'

type TModal = {
  modal: boolean
  data: TProject | null
}
type TProps = {
  projectItem: TModal
  setProjectItem: Dispatch<SetStateAction<TModal>>
  options: TTag[]
  onSubmit: () => void
  loading: boolean
}
const ModalAddProject: React.FC<TProps> = (props) => {
  const {
    projectItem: { data },
  } = props
  const addImage = () => {
    const newImg: {
      name: string
      id: string
      isExisting?: boolean
      file: File | TFileLike | null
    }[] = [{ id: generateUUID(), isExisting: false, file: null, name: '' }]
    const old = props.projectItem.data?.images || []
    if (props.projectItem.data) {
      props.setProjectItem({
        ...props.projectItem,
        data: {
          ...props.projectItem.data,
          images: newImg.concat(old),
        },
      })
    }
  }
  const onChangeText = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (props.projectItem.data) {
      props.setProjectItem({
        ...props.projectItem,
        data: {
          ...props.projectItem.data,
          [e.target.name]: e.target.value,
        },
      })
    }
  }
  return (
    <Dialog open={props.projectItem.modal}>
      <DialogContent className='no-scrollbar'>
        <CInput
          className='mb-4'
          label='Project Name'
          value={data?.name}
          name='name'
          onChange={onChangeText}
        />
        <CInput
          className='mb-4'
          label='Client'
          value={data?.client}
          name='client'
          onChange={onChangeText}
        />
        <CInput
          className='mb-4'
          label='Location'
          value={data?.location}
          name='location'
          onChange={onChangeText}
        />
        <CDatePicker
          // className='mb-4'
          label='Project Date'
          value={dayjs(data?.date)}
          onClose={(date) => {
            const dd = date as Dayjs
            if (props.projectItem.data) {
              props.setProjectItem({
                ...props.projectItem,
                data: {
                  ...props.projectItem.data,
                  date: new Date(dd.format('YYYY-MM-DD')),
                },
              })
            }
          }}
        />
        <CInput
          className='mb-4'
          label='Team'
          value={data?.team}
          name='team'
          onChange={onChangeText}
        />
        <Autocomplete
          multiple
          className='mb-4'
          options={props.options}
          getOptionLabel={(s) => s.name}
          value={data?.tags || []}
          onChange={(_, value) => {
            if (props.projectItem.data) {
              props.setProjectItem({
                ...props.projectItem,
                data: {
                  ...props.projectItem.data,
                  tags: value,
                },
              })
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label='Select Categories' />
          )}
          renderOption={(props, option) => <li {...props}>{option?.name}</li>}
        />
        <Button onClick={addImage} variant='contained' className='!mb-4'>
          Add Image
        </Button>
        {data?.images.map((image) => (
          <div className='flex gap-2 mb-2' key={Math.random()}>
            <div className='w-full'>
              <Uploader
                id={image.id}
                maxSize={5 * 1024 * 1024}
                onChange={(img) => {
                  if (props.projectItem.data) {
                    props.setProjectItem({
                      ...props.projectItem,
                      data: {
                        ...props.projectItem.data,
                        images: props.projectItem.data.images.map((x) => {
                          if (x.id === image.id) {
                            return {
                              name: img.name,
                              id: x.id,
                              isExisting: false,
                              file: img,
                            }
                          }
                          return x
                        }),
                      },
                    })
                  }
                }}
                uploadType='image'
                value={image.file}
                className='w-full'
              />
            </div>
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                if (props.projectItem.data) {
                  props.setProjectItem({
                    ...props.projectItem,
                    data: {
                      ...props.projectItem.data,
                      images: props.projectItem.data.images.filter(
                        (x) => x.id !== image.id
                      ),
                    },
                  })
                }
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='info'
          onClick={() => props.setProjectItem({ modal: false, data: null })}
        >
          Cancel
        </Button>
        <Button
          disabled={props.loading}
          onClick={() => {
            if (!props.loading) props.onSubmit()
          }}
          variant='contained'
        >
          {props.loading ? <CircularProgress /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ModalAddProject
