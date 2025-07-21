import instance from '@utils/instance'

const PATH = '/api/auth'

export const EmailDuplicateService = async (email: string) => {
  try {
    const response = await instance.post(`${PATH}/email-verify`, { email })
    return response.data
  } catch (error: any) {
    throw error.response.data.error
  }
}

export const SignupService = async (data: {
  username: string
  email: string
  password: string
  phone: string
  roleId: number
  provider: string
  provider_id?: string | null
}) => {
  try {
    const response = await instance.post(`${PATH}/signup`, data)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const signinService = async (data: { username: string; password: string }) => {
  await instance.post(`${PATH}/signin`, null, {
    auth: data,
  })
}

export const signoutService = async () => {
  await instance.delete(`${PATH}/signout`)
}

export const findEmailService = async (data: { username: string; phone: string }) => {
  try {
    const response = await instance.post(`${PATH}/email-find`, data)
    return (response.data as { email: string }).email
  } catch (error: any) {
    throw error.response.data.error
  }
}

export const findPasswordService = async (data: { username: string; email: string; phone: string }) => {
  try {
    const response = await instance.post(`${PATH}/password-find`, data)
    return response.data
  } catch (error: any) {
    throw error.response.data.error
  }
}

export const passwordResetService = async (data: { userId: string; newPassword: string }) => {
  try {
    const response = await instance.patch(`${PATH}/password-reset`, data)
    return response.data
  } catch (error: any) {
    throw error.response.data.error
  }
}
