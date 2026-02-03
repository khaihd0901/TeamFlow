import React from 'react'
import { useAuthStore } from '../stores/authStore'

const HomePage = () => {
  const {user} = useAuthStore();
  return (
    <div>HomePage: {user?.name}</div>
  )
}

export default HomePage