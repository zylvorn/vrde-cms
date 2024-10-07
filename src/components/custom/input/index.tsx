import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material'
import React, { useMemo, useState } from 'react'

type TProps = Omit<OutlinedInputProps, 'variant'>
const CInput: React.FC<TProps> = ({ ...props }) => {
  const [show, setShow] = useState(false)
  const typeShow = useMemo(() => {
    if (props.type === 'password') {
      if (show) return 'text'
      return 'password'
    }
    return props.type
  }, [props.type, show])
  return (
    <FormControl variant='outlined' className='w-full'>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <OutlinedInput
        {...props}
        type={typeShow}
        endAdornment={
          props.type === 'password' ? (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={() => setShow(!show)}
                edge='end'
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
      />
    </FormControl>
  )
}
export default CInput
