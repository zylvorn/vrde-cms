'use client'

import { FormControl } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'

type TProps = {
  // @ts-ignore
  onChange?: (v: any) => void
  // @ts-ignore
  onClose?: (v: any) => void
  label?: string
  value?: Dayjs
  min?: string
  max?: string
  className?: string
}

const CDatePicker: React.FC<TProps> = ({
  className,
  onChange,
  onClose,
  label,
  value,
  min,
  max,
}) => {
  return (
    <FormControl sx={{ width: '100%' }} className={className}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          onAccept={onClose}
          openTo='day'
          label={label}
          orientation='portrait'
          format='DD/MM/YYYY'
          views={['year', 'month', 'day']}
          value={value ? value : null}
          onChange={onChange}
          maxDate={max}
          minDate={min}
        />
        {/* <DemoContainer components={['Datepicker']}>
        </DemoContainer> */}
      </LocalizationProvider>
    </FormControl>
  )
}
export default CDatePicker
