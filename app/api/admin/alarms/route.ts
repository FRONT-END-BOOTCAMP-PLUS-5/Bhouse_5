// app/api/admin/alarms/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { SendGlobalAlarmUseCase } from 'backend/application/admin/alarms/usecases/SendGlobalAlarmUseCase'
import { SupabaseGlobalAlarmService } from 'backend/infrastructure/repositories/SupabaseGlobalAlarmService'
import { SendGlobalAlarmDto } from 'backend/application/admin/alarms/dtos/SendGlobalAlarmDto'
import { AlarmType } from '@domain/entities/Alarm' // AlarmType 필요 시 임포트
import { verifyToken } from '@be/utils/auth'

export async function POST(request: NextRequest) {
  //토큰 검증
  const decoded = await verifyToken(request)

  // 관리자 권한 확인
  if (!decoded || !decoded.roleId || decoded.roleId !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message, type } = await request.json()
    const alarmType: AlarmType = type // 타입을 AlarmType으로 명시적으로 캐스팅

    // 필수 파라미터 유효성 검사 (프레젠테이션 계층의 책임)
    if (!message || !alarmType) {
      return NextResponse.json(
        { success: false, error: 'message 또는 type 파라미터가 누락되었습니다.' },
        { status: 400 },
      )
    }

    // 유효한 알림 타입인지 확인 (Enum을 활용하여 유효성 검사)
    const validAlarmTypes: AlarmType[] = [AlarmType.TYPE1, AlarmType.TYPE2, AlarmType.TYPE3] // 실제 AlarmType enum 값 사용
    if (!validAlarmTypes.includes(alarmType)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 알림 타입입니다.' }, { status: 400 })
    }

    // 1. 인프라 계층의 구현체 생성
    const globalAlarmService = new SupabaseGlobalAlarmService()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 의존성 주입
    const sendGlobalAlarmUseCase = new SendGlobalAlarmUseCase(globalAlarmService)

    // 3. 유즈케이스 실행 (입력 DTO 사용)
    const sendDto: SendGlobalAlarmDto = { message, alarmType }
    await sendGlobalAlarmUseCase.execute(sendDto)

    // 성공 시 응답
    return NextResponse.json(
      { success: true, message: '전체 사용자에게 알림이 성공적으로 발송되었습니다.' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('알림 발송 중 에러 발생:', error.message)
    // 에러 발생 시 500 응답
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
