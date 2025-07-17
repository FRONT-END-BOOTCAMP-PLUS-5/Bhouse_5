// app/api/user/alarms/route.ts

import { NextResponse } from 'next/server'
import { supabaseClient } from 'backend/utils/supabaseClient' // 이미 정의된 클라이언트 임포트

import { GetAlarmsByUserIdAndTypeUseCase } from 'backend/application/user/alarms/usecases/GetAlarmsByUserIdAndTypeUseCase'
import { MarkAlarmAsReadUseCase } from 'backend/application/user/alarms/usecases/MarkAlarmAsReadUseCase' // 새로 추가된 유즈케이스 임포트
import { SupabaseAlarmRepository } from 'backend/infrastructure/repositories/SupabaseAlarmRepository'
import { GetAlarmsQueryDto } from 'backend/application/user/alarms/dtos/GetAlarmsQueryDto'
import { MarkAlarmsAsReadDto } from 'backend/application/user/alarms/dtos/MarkAlarmsAsReadDto' // 새로 추가된 DTO 임포트
import { AlarmType } from 'backend/domain/entities/Alarm'
import { verifyToken } from '@be/utils/auth'

/**
 * 특정 사용자의 알람 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/alarms?type={alarmType}
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url)
  const alarmTypeParam = searchParams.get('type') // 'type' 파라미터로 알림 타입 가져오기

  // 토큰 검증
  const decoded = await verifyToken(request)

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 인증된 사용자 ID를 decoded 토큰에서 가져옵니다.
  const userId = decoded.userId

  // 필수 파라미터 누락 시 에러 응답
  if (!userId || !alarmTypeParam) {
    return NextResponse.json({ success: false, error: 'type 파라미터가 누락되었습니다.' }, { status: 400 })
  }

  // 알림 타입 유효성 검사 및 AlarmType 또는 'ALL'로 변환
  let alarmType: AlarmType | 'ALL'
  const validAlarmTypes = Object.values(AlarmType) // Enum의 값들을 배열로 가져옴
  if (alarmTypeParam === 'ALL') {
    alarmType = 'ALL'
  } else if (validAlarmTypes.includes(alarmTypeParam as AlarmType)) {
    alarmType = alarmTypeParam as AlarmType
  } else {
    return NextResponse.json({ success: false, error: '유효하지 않은 알림 타입입니다.' }, { status: 400 })
  }

  try {
    // 1. 인프라 계층의 레포지토리 구현체 생성 (supabaseClient를 직접 사용)
    const alarmRepository = new SupabaseAlarmRepository() // 생성자에 인자를 넘길 필요 없음

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getAlarmsUseCase = new GetAlarmsByUserIdAndTypeUseCase(alarmRepository)

    // 3. 유즈케이스 실행 (입력 DTO 사용)
    const queryDto: GetAlarmsQueryDto = { userId, alarmType }
    const result = await getAlarmsUseCase.execute(queryDto)

    // 4. 성공 응답 반환 (출력 DTO 사용)
    // postId는 AlarmResponseDto에 이미 포함되어 있으므로, 여기서 별도 처리 필요 없음
    return NextResponse.json({ success: true, data: result.alarms, total: result.totalCount })
  } catch (error: any) {
    console.error('알람 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * 특정 알람 또는 모든 알람을 읽음 상태로 업데이트하는 API 엔드포인트입니다.
 * PATCH /api/user/alarms
 * 요청 본문: { "alarmId": 123 } 또는 { "markAll": true }
 */
export async function PATCH(request: Request) {
  // 토큰 검증
  const decoded = await verifyToken(request)

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = decoded.userId

  if (!userId) {
    return NextResponse.json({ success: false, error: '사용자 ID가 누락되었습니다.' }, { status: 400 })
  }

  try {
    const requestBody: MarkAlarmsAsReadDto = await request.json()

    // 1. 인프라 계층의 레포지토리 구현체 생성
    const alarmRepository = new SupabaseAlarmRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const markAlarmAsReadUseCase = new MarkAlarmAsReadUseCase(alarmRepository)

    // 3. 유즈케이스 실행 (입력 DTO 사용)
    // markAll이 true인 경우 userId를 함께 전달
    if (requestBody.markAll === true) {
      await markAlarmAsReadUseCase.execute({ markAll: true }, userId)
      return NextResponse.json({ success: true, message: '모든 알람이 읽음 처리되었습니다.' })
    } else if (requestBody.alarmId !== undefined && requestBody.alarmId !== null) {
      await markAlarmAsReadUseCase.execute({ alarmId: requestBody.alarmId })
      return NextResponse.json({ success: true, message: `알람 ${requestBody.alarmId}이(가) 읽음 처리되었습니다.` })
    } else {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 요청 본문입니다. alarmId 또는 markAll을 제공해야 합니다.' },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error('알람 읽음 처리 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
