import { NextRequest, NextResponse } from 'next/server'

// TODO: 로그인 기능 구현 태스크 (Route 우선 방식)
//
// 1단계: Route에서 직접 로그인 로직 구현
//    - POST /api/auth/signin route.ts에서 직접 구현
//      - 요청 데이터 파싱 (username 또는 email, password)
//      - 필수값 검증
//      - Supabase로 사용자 조회 (username 또는 email로)
//      - bcrypt로 비밀번호 검증
//      - JWT 토큰 생성 (jsonwebtoken 라이브러리 사용)
//        - 토큰 페이로드: { user_id, username, email, roles }
//        - 토큰 만료시간: 24시간 또는 7일
//        - JWT_SECRET 환경변수 사용
//      - 로그인 성공 시 토큰과 사용자 정보 반환
//      - 로그인 실패 응답
//      - 에러 처리 (사용자 없음, 비밀번호 틀림, 서버 오류)
//
// 2단계: 리팩토링 - DTO 분리
//    - backend/application/auth/signin/dtos/SigninAuthDto.ts
//      - username 또는 email (둘 중 하나만 필수)
//      - password (필수)
//    - backend/application/auth/signin/dtos/SigninAuthResponseDto.ts
//      - message, status, error (기본 응답)
//      - user 정보 (선택적)
//      - token 정보 (선택적)
//
// 3단계: 리팩토링 - UseCase 분리
//    - backend/application/auth/signin/usecases/SigninAuthUsecase.ts
//      - 입력 검증 (username/email, password 필수값 체크)
//      - 사용자 조회 (username 또는 email로)
//      - 비밀번호 검증 (bcrypt.compare)
//      - 로그인 성공 시 사용자 정보 반환
//      - 에러 처리 (사용자 없음, 비밀번호 틀림 등)
//
// 4단계: 리팩토링 - Repository 분리
//    - backend/domain/repositories/AuthRepository.ts
//      - findByUsernameOrEmail(username: string, email: string): Promise<User | null>
//      - signin 메서드 시그니처 업데이트
//    - backend/infrastructure/repositories/AuthRepositoryImpl.ts
//      - findByUsernameOrEmail 메서드 구현
//      - signin 메서드 구현 (필요시)
//
// 5단계: Route 최종 정리
//    - POST /api/auth/signin
//      - DTO로 요청 데이터 받기
//      - UseCase 실행
//      - 응답 반환
//
// 6단계: 추가 고려사항
//    - JWT 토큰 생성 (필요시)
//    - 세션 관리 (필요시)
//    - 로그인 시도 횟수 제한 (보안)
//    - 로그인 로그 기록 (감사)
//
// 7단계: 테스트 케이스
//    - 정상 로그인 (username으로)
//    - 정상 로그인 (email로)
//    - 잘못된 사용자명/이메일
//    - 잘못된 비밀번호
//    - 필수값 누락
//    - 서버 오류

export async function POST(req: NextRequest) {
  // TODO: 1단계 - Route에서 직접 로그인 로직 구현
  return NextResponse.json({ message: '로그인 기능 구현 예정', status: 501 })
}
