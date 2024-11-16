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
import { ChangeEvent, Dispatch, Fragment, SetStateAction } from 'react'
import CInput from '@/components/custom/input'
import CDatePicker from '@/components/custom/datepicker'
import dayjs, { Dayjs } from 'dayjs'
import Uploader from '@/components/custom/uploader'
import { generateUUID } from '@/utils/generator/uuid'
import { TFileLike } from '@/utils/constants/constants'

import DeleteIcon from '@mui/icons-material/DeleteForever'
import CCheckbox from '@/components/custom/checkbox'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

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
type TImage = {
  id: string
  isExisting?: boolean
  file: File | TFileLike | null
  name: string
  isCover?: boolean
  isMain?: boolean
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
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    // If dropped outside the list or no change in position
    if (!destination || source.index === destination.index) return

    // Rearrange the array based on drag-and-drop
    const reorderedImages = Array.from(props.projectItem.data?.images || [])
    const [movedItem] = reorderedImages.splice(source.index, 1)
    reorderedImages.splice(destination.index, 0, movedItem)

    // Update the state with the new order
    if (props.projectItem.data) {
      props.setProjectItem({
        ...props.projectItem,
        data: {
          ...props.projectItem.data,
          images: reorderedImages,
        },
      })
    }
  }
  const RenderItems = ({ image }: { image: TImage }) => {
    return (
      <Fragment>
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
            url={`/static/projects/${image.name}`}
            uploadType='image'
            value={image.file}
            className='w-full'
          />
        </div>
        <div className='flex gap-1 min-w-[100px] flex items-center'>
          <CCheckbox
            checked={image.isMain}
            onClick={() => {
              const val = !image.isMain
              if (props.projectItem.data) {
                props.setProjectItem({
                  ...props.projectItem,
                  data: {
                    ...props.projectItem.data,
                    images: props.projectItem.data.images.map((x) => {
                      if (x.id === image.id) {
                        return {
                          ...x,
                          isMain: val,
                        }
                      }
                      if (val) return { ...x, isMain: false }
                      return { ...x }
                    }),
                  },
                })
              }
            }}
          />
          <small>Main Img</small>
        </div>
        <div className='flex gap-1 min-w-[100px] flex items-center'>
          <CCheckbox
            checked={image.isCover}
            onClick={() => {
              const val = !image.isCover
              if (props.projectItem.data) {
                props.setProjectItem({
                  ...props.projectItem,
                  data: {
                    ...props.projectItem.data,
                    images: props.projectItem.data.images.map((x) => {
                      if (x.id === image.id) {
                        return {
                          ...x,
                          isCover: val,
                        }
                      }
                      if (val) return { ...x, isCover: false }
                      return { ...x }
                    }),
                  },
                })
              }
            }}
          />
          <small>Cover Img</small>
        </div>
        <DeleteIcon
          className='cursor-pointer'
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
        />
      </Fragment>
    )
  }
  return (
    <Dialog open={props.projectItem.modal}>
      <DialogContent className='no-scrollbar'>
        <div className='mb-4 flex gap-1 items-center'>
          <CCheckbox
            checked={props.projectItem.data?.showOnHomeButton}
            onClick={() => {
              if (props.projectItem.data) {
                props.setProjectItem({
                  ...props.projectItem,
                  data: {
                    ...props.projectItem.data,
                    showOnHomeButton: !data?.showOnHomeButton,
                    buttonTextHome: !data?.showOnHomeButton
                      ? 'Our Latest Project'
                      : '',
                  },
                })
              }
            }}
          />
          <small>Show Project at Home menu</small>
        </div>
        {data?.showOnHomeButton && (
          <CInput
            className='mb-4'
            label='Home Button Text'
            value={data?.buttonTextHome}
            name='buttonTextHome'
            onChange={onChangeText}
          />
        )}
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='image-uploader-list'>
            {(provided) => (
              <div
                className='droppable'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data?.images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={String(image.id)}
                    index={index}
                  >
                    {(subprovided) => (
                      <div
                        ref={subprovided.innerRef}
                        {...subprovided.draggableProps}
                        {...subprovided.dragHandleProps}
                        className='flex gap-2 mb-2 items-center draggable p-2 border rounded'
                      >
                        <RenderItems image={image} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
