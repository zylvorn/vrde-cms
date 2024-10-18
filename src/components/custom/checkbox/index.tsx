'use client'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

type TProps = {
  checked?: boolean
  onClick: (c: boolean) => void
}
const CCheckbox: React.FC<TProps> = ({ checked, onClick }) => {
  return checked ? (
    <CheckBoxIcon
      className='cursor-pointer'
      onClick={() => onClick(!checked)}
    />
  ) : (
    <CheckBoxOutlineBlankIcon
      className='cursor-pointer'
      onClick={() => onClick(!checked)}
    />
  )
}
export default CCheckbox
