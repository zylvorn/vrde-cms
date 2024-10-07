'use client'

import BaseLayout from '@/components/custom/base-layout'
import AuthLayout from '../auth'
import CustomCard from '@/components/custom/card'
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material'
import useAbout from './hooks'
import dynamic from 'next/dynamic'
import { Fragment, useEffect } from 'react'
import ModalAddSection from './modal'
import { generateUUID } from '@/utils/generator/uuid'
import CInput from '@/components/custom/input'
import Uploader from '@/components/custom/uploader'
const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
})

const About = () => {
  const {
    loading,
    getAbout,
    tab,
    setTab,
    focusID,
    setFocusID,
    section,
    setSection,
    aboutState,
    setAboutState,
    modal,
    setModal,
    submit,
    removeCurrentSection,
    addClient,
  } = useAbout()
  const tabClass = (selectedTab: 'sections' | 'clients') => {
    let defaultClass =
      'py-2 px-4 cursor-pointer hover:border-2 hover:rounded-md hover:border-blue '
    if (tab === selectedTab) {
      defaultClass += 'border-2 rounded-md border-blue'
    }
    return defaultClass
  }
  useEffect(() => {
    getAbout()
  }, [])
  return (
    <AuthLayout>
      <BaseLayout>
        <div className='flex justify-center'>
          <CustomCard size='lg'>
            <div className='flex gap-3'>
              <Button
                className='w-full mb-3'
                variant='contained'
                color='warning'
              >
                Preview
              </Button>
              <Button
                onClick={submit}
                className='w-full mb-3'
                variant='contained'
              >
                {loading ? (
                  <CircularProgress color='warning' size={10} />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
            <div className='flex justify-center gap-3 mb-2'>
              <div
                onClick={() => setTab('sections')}
                className={tabClass('sections')}
              >
                Sections
              </div>
              <div
                onClick={() => setTab('clients')}
                className={tabClass('clients')}
              >
                Clients
              </div>
            </div>
            <div className='overflow-y-scroll'>
              {tab === 'sections' && (
                <Fragment>
                  <ModalAddSection
                    modal={modal}
                    setModal={setModal}
                    onSubmit={() => {
                      setAboutState({
                        ...aboutState,
                        sections: aboutState.sections.concat([
                          { name: modal.value, id: generateUUID(), html: '' },
                        ]),
                      })
                      setModal({ value: '', isOpen: false })
                    }}
                  />
                  <div className='mb-1 mt-1 flex gap-3'>
                    <Button
                      onClick={() => setModal({ ...modal, isOpen: true })}
                      variant='contained'
                    >
                      Add Section
                    </Button>
                    <Autocomplete
                      className='w-[50%]'
                      onChange={(_, value) => {
                        if (value) setSection(value)
                      }}
                      options={aboutState.sections}
                      getOptionLabel={(s) => s.name}
                      renderInput={(params) => (
                        <TextField {...params} label='Select Section' />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>{option?.name}</li>
                      )}
                      value={section}
                    />
                    <Button
                      onClick={removeCurrentSection}
                      variant='contained'
                      color='error'
                    >
                      Remove This Section
                    </Button>
                  </div>
                  <Editor
                    onChange={(html) => {
                      setSection({ ...section, html })
                      setAboutState({
                        ...aboutState,
                        sections: aboutState.sections.map((item) => {
                          if (item.id === section.id) {
                            return {
                              ...item,
                              html,
                            }
                          }
                          return item
                        }),
                      })
                    }}
                    value={section.html}
                    height={500}
                  />
                </Fragment>
              )}
              {tab === 'clients' && (
                <Fragment>
                  <Button
                    onClick={() => addClient()}
                    variant='contained'
                    className='mb-2'
                  >
                    Add Client
                  </Button>
                  <div className='overflow-y-scroll'>
                    {aboutState.clients.map((item) => (
                      <div
                        className='flex gap-2 items-center mb-3'
                        key={Math.random()}
                      >
                        <div className='w-[50%]'>
                          <CInput
                            value={item.name}
                            className='h-[45px]'
                            autoFocus={focusID === item.id}
                            onClick={() => setFocusID(item.id)}
                            onChange={(e) => {
                              setAboutState({
                                ...aboutState,
                                clients: aboutState.clients.map((i) => {
                                  if (i.id === item.id)
                                    return {
                                      ...i,
                                      name: e.target.value,
                                    }
                                  return i
                                }),
                              })
                            }}
                          />
                        </div>
                        <Uploader
                          className='min-w-[400px]'
                          maxSize={5 * 1024 * 1024}
                          uploadType='image'
                          onChange={(image) => {
                            setAboutState({
                              ...aboutState,
                              clients: aboutState.clients.map((i) => {
                                if (i.id === item.id)
                                  return {
                                    ...i,
                                    image,
                                    existingImage: false,
                                  }
                                return i
                              }),
                            })
                          }}
                          id={item.id}
                          value={item.image}
                        />
                        <Button
                          variant='contained'
                          color='error'
                          className='h-[45px]'
                          onClick={() => {
                            setAboutState({
                              ...aboutState,
                              clients: aboutState.clients.filter(
                                (i) => i.id !== item.id
                              ),
                            })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
          </CustomCard>
        </div>
      </BaseLayout>
    </AuthLayout>
  )
}
export default About
