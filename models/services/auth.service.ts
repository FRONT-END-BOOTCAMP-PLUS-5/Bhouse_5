import instance from '@utils/instance'
import { SignupSchemaType } from 'models/schemas/auth.schema'

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
