import React, { useMemo, useRef } from 'react'
import 'jodit'
import JoditEditor from 'jodit-react'

type TProps = {
  value: string
  onChange: (v: string) => void
  height?: number
}

const Editor: React.FC<TProps> = ({ value, onChange, height }) => {
  const editorRef = useRef(null)
  const config = useMemo(() => {
    const cfg = {
      height: height || 'calc(100vh - 250px)',
      allowResizeY: true,
      readonly: false,
      triggerChangeEvent: true,
      uploader: {
        insertImageAsBase64URI: true,
        // @ts-ignore
        process: (response: any) => {
          console.log(response.data)
        },
      },
    }
    return cfg
  }, [height])
  return (
    <JoditEditor
      ref={editorRef}
      config={config}
      onBlur={onChange}
      onChange={onChange}
      value={value}
    />
  )
}
export default Editor
