'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { FormEventHandler, useState } from 'react'

export default function CreateOrganization() {
  const { isLoaded, createOrganization } = useOrganizationList()
  const [organizationName, setOrganizationName] = useState('')

  if (!isLoaded) return null

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    createOrganization({ name: organizationName })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      })
    setOrganizationName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='border border-gray-300 rounded px-2 py-1 mr-2'
        type="text"
        name="organizationName"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.currentTarget.value)}
      />
            <input
        className='border border-gray-300 rounded px-2 py-1 mr-2'
        type="file"
        accept="image/*"
        name="logo"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            (e.target.files[0])
          }
        }}
      />
      <button type="submit">Create organization</button>
    </form>
  )
}