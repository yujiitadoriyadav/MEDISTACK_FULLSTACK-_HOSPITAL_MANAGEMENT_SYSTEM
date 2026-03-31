import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {
  const { user, getUserProfile, token } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Not Selected',
    dob: 'Not Selected',
    address: { line1: '', line2: '' },
  })

  useEffect(() => {
    if (token) {
      getUserProfile()
    }
  }, [token])

  useEffect(() => {
    if (user) {
      setImagePreview(user.image || '')
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || 'Not Selected',
        dob: user.dob || 'Not Selected',
        address: {
          line1: user.address?.line1 || '',
          line2: user.address?.line2 || '',
        },
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('phone', formData.phone)
      payload.append('gender', formData.gender)
      payload.append('dob', formData.dob === 'Not Selected' ? '' : formData.dob)
      payload.append('address', JSON.stringify(formData.address))

      if (imageFile) {
        payload.append('image', imageFile)
      }

      const { data } = await axios.put(
        'http://localhost:5000/api/user/updateuserProfile',
        payload,
        { headers: { token } }
      )

      if (data?.success) {
        await getUserProfile()
        setImageFile(null)
        setIsEdit(false)
        toast.success(data.message || 'Profile Updated')
      } else {
        toast.error(data?.message || 'Unable to update profile')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!token) {
    return <p className='text-sm text-gray-500'>Please login to view profile.</p>
  }

  if (!user) {
    return <p className='text-sm text-gray-500'>Loading profile...</p>
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {isEdit ? (
        <label className='w-36 cursor-pointer'>
          <img
            className='w-36 rounded'
            src={imagePreview || user.image}
            alt={user.name}
          />
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setImageFile(file)
              setImagePreview(URL.createObjectURL(file))
            }}
          />
          <p className='mt-1 text-xs text-primary'>Change photo</p>
        </label>
      ) : (
        <img className='w-36 rounded' src={user.image} alt={user.name} />
      )}
      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
          type='text'
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>
          {user.name || 'User'}
        </p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{user.email || 'Not Available'}</p>
          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52'
              type='text'
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className='text-blue-400'>
              {user.phone || 'Not Available'}
            </p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <p>
              <input
                className='bg-gray-50'
                type='text'
                value={formData.address.line1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className='bg-gray-50'
                type='text'
                value={formData.address.line2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p className='text-gray-500'>
              {user.address?.line1 || 'Not Available'}
              <br />
              {user.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>
          BASIC INFORMATION
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>
            Gender:
          </p>
          {isEdit ? (
            <select
              className='max-w-28 bg-gray-100'
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value='Not Selected'>Not Selected</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>
              {user.gender || 'Not Selected'}
            </p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-40 bg-gray-100'
              type='date'
              value={formData.dob === 'Not Selected' ? '' : formData.dob}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dob: e.target.value || 'Not Selected',
                }))
              }
            />
          ) : (
            <p className='text-gray-400'>
              {user.dob || 'Not Selected'}
            </p>
          )}
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? (
          <div className='flex gap-3'>
            <button
              className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed'
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save information'}
            </button>
            <button
              className='border border-gray-300 px-8 py-2 rounded-full hover:bg-gray-100 transition-all'
              onClick={() => {
                setIsEdit(false)
                setImageFile(null)
                setImagePreview(user.image || '')
                setFormData({
                  name: user.name || '',
                  phone: user.phone || '',
                  gender: user.gender || 'Not Selected',
                  dob: user.dob || 'Not Selected',
                  address: {
                    line1: user.address?.line1 || '',
                    line2: user.address?.line2 || '',
                  },
                })
              }}
              type='button'
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile