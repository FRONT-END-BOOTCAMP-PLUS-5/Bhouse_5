/**
 * 데이터베이스 스네이크 케이스와 도메인 객체 카멜 케이스 간의 기본 매핑 유틸리티
 * 타입스크립트의 언어적인 한계, 즉 RTTI 지원 문제로 유틸 제작에 어려움이 있음
 * 따라서 이 파일은 데이터베이스 테이블과 도메인 객체 간의 매핑을 위한 유틸리티 파일로 사용되며,
 * 특정 도메인 객체에 대한 매핑 로직은 별도의 매퍼 파일(Mapper.ts)에서 구현하고 있음.
 */

export class BaseMapper {
  /**
   * 스네이크 케이스를 카멜 케이스로 변환
   */
  static toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  }

  /**
   * 카멜 케이스를 스네이크 케이스로 변환
   */
  static toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  /**
   * S 타입 객체를 카멜 케이스로 변환하여 T 타입으로 반환
   */
  static mapToCamelCase<S, T>(source: S): T {
    const result = {} as Record<string, unknown>
    for (const [key, value] of Object.entries(source as object)) {
      const camelKey = this.toCamelCase(key)
      result[camelKey] = value
    }
    return result as T
  }

  /**
   * 객체의 모든 키를 카멜 케이스에서 스네이크 케이스로 변환
   */
  static mapToSnakeCase<T extends Record<string, unknown>>(obj: Record<string, unknown>): T {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = this.toSnakeCase(key)
      result[snakeKey] = value
    }

    return result as T
  }

  /**
   * S[] 배열을 카멜 케이스로 변환하여 T[] 타입으로 반환
   */
  static mapArrayToCamelCase<S, T>(source: S[]): T[] {
    return source.map((item) => this.mapToCamelCase<S, T>(item))
  }

  /**
   * 배열의 모든 객체를 카멜 케이스에서 스네이크 케이스로 변환
   */
  static mapArrayToSnakeCase<T extends Record<string, unknown>>(arr: Record<string, unknown>[]): T[] {
    return arr.map((item) => this.mapToSnakeCase<T>(item))
  }
}
