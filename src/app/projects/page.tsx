'use client'
import React, { useEffect } from 'react'
import AuthLayout from '../auth'
import BaseLayout from '@/components/custom/base-layout'
import CustomCard from '@/components/custom/card'
import useProjects from './hooks'
import { Button, CircularProgress } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CInput from '@/components/custom/input'
import ModalAddProject from './modal-project'
import { generateUUID } from '@/utils/generator/uuid'
import ModalCategories from './modal-categories'
import dynamic from 'next/dynamic'
import ModalDelete from './modal-delete'
const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
})

const Projects = () => {
  const {
    getProjects,
    loading,
    tab,
    setTab,
    columns,
    rows,
    projectItem,
    setProjectItem,
    submitEditor,
    modalTags,
    setModalTags,
    projectState,
    submitUpdateTags,
    submitProject,
    setProjectState,
    submitDelete,
    modalDelete,
    setModalDelete,
    setSearchKey,
    searchKey,
  } = useProjects()
  const tabClass = (selectedTab: 'projects' | 'editor') => {
    let defaultClass =
      'py-2 px-4 cursor-pointer hover:border-2 hover:rounded-md hover:border-blue '
    if (tab === selectedTab) {
      defaultClass += 'border-2 rounded-md border-blue'
    }
    return defaultClass
  }
  useEffect(() => {
    getProjects()
  }, [])
  const addProject = () => {
    setProjectItem({
      modal: true,
      data: {
        client: '',
        date: new Date(),
        id: generateUUID(),
        images: [],
        location: '',
        name: '',
        tags: [],
        team: '',
      },
    })
  }
  const setupTags = () => {
    setModalTags({ modal: true, data: projectState.tags })
  }
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
                onClick={submitEditor}
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
            <div className='flex justify-center gap-3 mb-2 mt-2'>
              <div
                onClick={() => setTab('projects')}
                className={tabClass('projects')}
              >
                Projects
              </div>
              <div
                onClick={() => setTab('editor')}
                className={tabClass('editor')}
              >
                Editor
              </div>
            </div>
            {tab === 'projects' && (
              <div>
                <ModalDelete
                  modalDelete={modalDelete}
                  setModalDelete={setModalDelete}
                  onSubmit={submitDelete}
                />
                <ModalAddProject
                  onSubmit={submitProject}
                  projectItem={projectItem}
                  setProjectItem={setProjectItem}
                  options={projectState.tags}
                />
                <ModalCategories
                  onSubmit={submitUpdateTags}
                  modalTags={modalTags}
                  setModalTags={setModalTags}
                />
                <div className='flex justify-between mb-2 items-center'>
                  <div className='flex gap-3'>
                    <Button onClick={addProject} variant='contained'>
                      Add Project
                    </Button>
                    <Button
                      onClick={setupTags}
                      variant='contained'
                      color='secondary'
                    >
                      Setup Categories
                    </Button>
                  </div>
                  <div className='w-[40%]'>
                    <CInput
                      placeholder='Search Project Name'
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                </div>
                <div className='h-[500px] overflow-y-scroll'>
                  <DataGrid
                    columns={columns}
                    rows={rows}
                    rowSelection={false}
                  />
                </div>
              </div>
            )}
            {tab === 'editor' && (
              <Editor
                onChange={(html) => {
                  setProjectState({
                    ...projectState,
                    html,
                  })
                }}
                value={projectState.html}
              />
            )}
          </CustomCard>
        </div>
      </BaseLayout>
    </AuthLayout>
  )
}
export default Projects
