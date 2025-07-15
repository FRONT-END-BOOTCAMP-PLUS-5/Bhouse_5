import instance from '@utils/instance'

const PATH = '/api/auth'

export const signinService = async (data: { username: string; password: string }) => {
  await instance.post(`${PATH}/signin`, null, {
    auth: data,
  })
}
