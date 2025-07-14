'use client'

import { signinService } from 'models/services/auth.service'
import { getProfileService } from 'models/services/profile.service'
import Link from 'next/link'
import { useAuthStore } from 'store/auth.store'

function SigninPage() {
  const { setLogin, ...rest } = useAuthStore()

  const handleClick = async () => {
    try {
      await signinService({ username: 'test12@example.com', password: 'test123' })

      const res = await getProfileService()
      if (res) {
        setLogin(res)
      }
    } catch (error) {
      alert('에러가 발생했습니다.')
      console.log(error)
    }
  }

  return (
    <div>
      <button onClick={handleClick}>test</button>
      <button
        onClick={() => {
          console.log(rest)
        }}
      >
        test2
      </button>

      <Link href="/">Home</Link>
    </div>
  )
}

export default SigninPage
