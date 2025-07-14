// ESLint 규칙 설정 파일
export const customRules = {
  // 기본 규칙들

  // ===== 코드 품질 관련 규칙 =====

  // 파일의 최대 라인 수 제한
  'max-lines': ['warn', 300],

  // 중첩된 if문 깊이 제한 채원 : 좋아요
  'max-depth': ['warn', 4],

  // ===== 네이밍 컨벤션 ===== 채원 : 이거 다 넣져?

  // 변수, 함수, 클래스 네이밍 컨벤션 통합
  '@typescript-eslint/naming-convention': [
    'error',
    // 변수명은 camelCase, UPPER_CASE, PascalCase 허용
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'forbid',
      trailingUnderscore: 'forbid',
    },
    // 함수명은 camelCase, PascalCase 허용
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
    },
    // 클래스명은 PascalCase 강제
    {
      selector: 'class',
      format: ['PascalCase'],
    },
  ],

  // ===== 성능 관련 규칙 =====

  // 불필요한 return 금지 채원 : 좋아요
  'no-useless-return': 'error',

  // ===== 가독성 관련 규칙 =====

  // 일관된 return 문 사용 채원 : 좋아요
  'consistent-return': 'error',

  // async 함수에서 await 누락 금지 채원 : 좋아요
  'require-await': 'error',

  // ===== 주석 관련 규칙 =====

  // 주석 관련 규칙: TODO, FIXME 주석에 이슈 번호나 담당자 추가 권장
  'no-warning-comments': [
    'warn',
    {
      terms: ['todo', 'fixme', 'hack', 'xxx'],

      location: 'anywhere',
    },
  ],

  // ===== 임포트/익스포트 관련 규칙 =====

  // 사용하지 않는 import 금지 채원 : 좋아요 동규 : 좋아요
  '@typescript-eslint/no-unused-vars': 'warn',

  // any 타입 사용 허용
  '@typescript-eslint/no-explicit-any': 'off',

  // any 타입 사용 허용
  '@typescript-eslint/no-explicit-any': 'off',

  // 중복된 import 금지 채원 : 이건 에러렌즈가 찾아주던대여? 동규: 굿
  'no-duplicate-imports': 'error',

  // 알 수 없는 전역 변수 사용 금지 채원 : 좋아요 좋아요
  'no-undef': 'error',
}
