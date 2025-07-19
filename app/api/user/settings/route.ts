// app/api/user/settings/route.ts

import { NextRequest, NextResponse } from 'next/server'

import { GetUserSettingUseCase } from '@application/user/settings/usecases/GetUserSettingUseCase'
import { UpdateUserSettingUseCase } from '@application/user/settings/usecases/UpdateUserSettingUseCase'
import { SupabaseUserSettingRepository } from '@infrastructure/repositories/SupabaseUserSettingRepository'
import { GetUserSettingQueryDto } from '@application/user/settings/dtos/GetUserSettingQueryDto'
import { UpdateUserSettingDto } from '@application/user/settings/dtos/UpdateUserSettingDto'

import { verifyToken } from '@be/utils/auth'

/**
 * 유저 알림 설정을 조회하는 GET 요청 핸들러
 * GET /api/user/settings
 */
export async function GET(request: NextRequest) {
  const decoded = await verifyToken(request)

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = decoded.userId

  // 필수 필드 유효성 검사
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'user_id가 누락되었습니다.' },
      { status: 400 }, // Bad Request
    )
  }

  try {
    // 1. 인프라 계층의 레포지토리 구현체 생성
    const userSettingRepository = new SupabaseUserSettingRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getUserSettingUseCase = new GetUserSettingUseCase(userSettingRepository)

    // 3. 유즈케이스 실행
    const queryDto: GetUserSettingQueryDto = { userId }
    const settings = await getUserSettingUseCase.execute(queryDto)

    if (!settings) {
      // 해당 user_id에 대한 설정이 없는 경우
      return NextResponse.json(
        { success: false, error: '해당 유저의 알림 설정을 찾을 수 없습니다.' },
        { status: 404 }, // Not Found
      )
    }

    return NextResponse.json(
      { success: true, settings: settings },
      { status: 200 }, // OK
    )
  } catch (error: any) {
    console.error('알림 설정 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) // Internal Server Error
  }
}

/**
 * 유저 알림 설정을 수정하는 PATCH 요청 핸들러
 * PATCH /api/user/settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = decoded.userId

    const { reply, keyword } = await request.json()

    // 필수 필드 유효성 검사
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id가 누락되었습니다.' },
        { status: 400 }, // Bad Request
      )
    }

    // 업데이트할 데이터가 없는 경우 (예: user_id만 있고 reply, keyword가 모두 undefined)
    if (reply === undefined && keyword === undefined) {
      return NextResponse.json(
        { success: false, error: '업데이트할 알림 설정이 없습니다.' },
        { status: 400 }, // Bad Request
      )
    }

    // 'Y'/'N' 값 유효성 검사 (프레젠테이션 계층의 책임)
    if (reply !== undefined && reply !== 'Y' && reply !== 'N') {
      return NextResponse.json({ success: false, error: 'reply 값은 "Y" 또는 "N"이어야 합니다.' }, { status: 400 })
    }
    if (keyword !== undefined && keyword !== 'Y' && keyword !== 'N') {
      return NextResponse.json({ success: false, error: 'keyword 값은 "Y" 또는 "N"이어야 합니다.' }, { status: 400 })
    }

    // 1. 인프라 계층의 레포지토리 구현체 생성
    const userSettingRepository = new SupabaseUserSettingRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const updateUserSettingUseCase = new UpdateUserSettingUseCase(userSettingRepository)

    // 3. 유즈케이스 실행
    const updateDto: UpdateUserSettingDto = { userId: userId, reply, keyword }
    const updatedSettings = await updateUserSettingUseCase.execute(updateDto)

    return NextResponse.json(
      { success: true, message: '알림 설정이 성공적으로 업데이트되었습니다.', settings: updatedSettings },
      { status: 200 }, // OK
    )
  } catch (error: any) {
    console.error('알림 설정 업데이트 중 에러 발생:', error.message)
    if (error.message === '해당 유저의 알림 설정을 찾을 수 없거나 업데이트할 권한이 없습니다.') {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 }) // Not Found
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) // Internal Server Error
  }
}
