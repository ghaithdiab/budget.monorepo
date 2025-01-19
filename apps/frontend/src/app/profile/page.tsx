import { getProfile } from '@/lib/actions'
import React from 'react'

const Profile =  async () => {
  const user  =  await getProfile(); 
  return (
    <div>
      {user.message}
      {user.name}
      </div>
  )
}

export default Profile