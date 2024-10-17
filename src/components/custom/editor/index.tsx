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
      controls: {
        font: {
          component: 'select',
          list: {
            'Source Sans Pro': 'Source Sans Pro',
            Arial: 'Arial, sans-serif',
            'Courier New': 'Courier New',
            Georgia: 'Georgia',
            Grotta: 'Grotta',
            Lora: 'Lora',
            'Lucida Sans Unicode': 'Lucida Sans Unicode',
            Tahoma: 'Tahoma',
            'Times New Roman': 'Times New Roman',
            'Trebuchet MS': 'Trebuchet MS',
            Helvetica: 'Helvetica',
            Impact: 'Impact',
            Verdana: 'Verdana',
          },
        },
      },
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
      // @ts-ignore
      config={config}
      onBlur={onChange}
      onChange={onChange}
      value={value}
    />
  )
}
export default Editor
