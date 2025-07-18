import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@be/utils/auth'
import { GetUserProfileUseCase } from '@be/application/user/profile/usecases/GetUserProfileUseCase'
import { GetUserProfileQueryDto } from '@be/application/user/profile/dtos/UserProfileDto'
import { UserRepositoryImpl } from '@be/infrastructure/repositories/UserRepositoryImpl'
import { UserTownRepositoryImpl } from '@be/infrastructure/repositories/UserTownRepositoryImpl'
import { UpdateUserProfileUseCase } from '@be/application/user/profile/usecases/UpdateUserProfileUseCase'

export async function GET(request: NextRequest) {
  try {
    // 토큰 검증
    const decoded = await verifyToken(request)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // UseCase 실행
    const usecase = new GetUserProfileUseCase(new UserRepositoryImpl(), new UserTownRepositoryImpl())
    const queryDto: GetUserProfileQueryDto = {
      userId: decoded.userId,
    }
    const userProfile = await usecase.execute(queryDto)

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: userProfile,
    })
  } catch (error: any) {
    console.error('Profile API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId

    const updateData = {
      nickname: body.nickname,
      profileImgUrl: body.profile_img_url,
      password: body.password,
      // location 정보는 별도 API에서 처리 (UserTown 관련)
    }

    const usecase = new UpdateUserProfileUseCase(new UserRepositoryImpl())
    const updatedUser = await usecase.execute(userId, updateData)

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error: any) {
    console.error('Profile API Error:', error)

    // 닉네임 중복 에러 처리
    if (error.message === '이미 사용 중인 닉네임입니다.') {
      return NextResponse.json(
        {
          error: '이미 사용 중인 닉네임입니다.',
          message: '다른 닉네임을 사용해주세요.',
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
