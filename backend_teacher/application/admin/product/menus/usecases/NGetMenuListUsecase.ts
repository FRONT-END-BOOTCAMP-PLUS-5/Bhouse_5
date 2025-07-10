import { GetMenuListDto } from '../dtos/GetMenuListDto'
import { MenuDto } from '../dtos/GetMenuDto'
import { GetMenuListQueryDto } from '../dtos/GetMenuListQueryDto'
import { MenuSearchCriteria } from '@/backend/domain/repositories/criteria/MenuSearchCriteria'
import { MenuRepository } from '@/backend/domain/repositories/MenuRepository'

// 관리자를 위한 메뉴 목록 조회 Usecase
export class NGetMenuListUsecase {
  // 의존성 주입을 위한 의존 객체
  private repository: MenuRepository

  // 생성자에서 의존성 주입
  constructor(repository: MenuRepository) {
    this.repository = repository
  }

  // 메뉴 목록 반환 메서드
  async execute(queryDto: GetMenuListQueryDto): Promise<GetMenuListDto> {
    // 1. 데이터 쿼리를 위해 사용자가 입력한 데이터를 Criteria로 변환하고
    let criteria: MenuSearchCriteria
    let currentPage: number
    let pageSize: number
    {
      // - 데이터 쿼리를 위한 변수 설정
      pageSize = 8 // 한 페이지에 표현할 레코드 크기를 정의
      currentPage = queryDto.page || 1 // 현재 페이지를 정의

      // - 페이지 번호를 offset과 limit으로 변환
      const offset = (currentPage - 1) * pageSize // 페이지당 10개 메뉴를 보여준다고 가정
      const limit = pageSize // 페이지당 10개 메뉴를 보여준다고 가정

      // - 데이터 쿼리를 위한 Criteria 객체
      criteria = new MenuSearchCriteria(
        queryDto.searchName || undefined,
        queryDto.categoryId ? Number(queryDto.categoryId) : undefined,
        undefined, // memberId는 관리자용이므로 undefined
        queryDto.sortField || 'createdAt',
        queryDto.ascending ?? false,
        !(queryDto.includeAll ?? false), // includeAll이 true면 publicOnly를 false로 설정 (모든 메뉴 조회)
        offset,
        limit,
      )
    }

    // 메뉴 목록 및 전체 개수 조회
    const menus = await this.repository.findAll(criteria, {
      includeImages: true,
    })
    const menuCount: number = await this.repository.count(criteria)

    console.log('============== menuCount : ', menuCount)
    console.log('============== menus.length : ', menus.length)
    console.log('============== pageSize : ', pageSize)
    console.log('============== endPage 계산 : ', Math.ceil(menuCount / pageSize))

    // 메뉴 목록을 DTO로 변환
    const menuDtos: MenuDto[] = menus.map(
      (m) =>
        new MenuDto(
          m.id ?? 0,
          m.korName ?? '',
          m.engName ?? '',
          m.price ?? 0,
          m.hasIce ?? false,
          m.createdAt ?? new Date(),
          m.isPublic ?? false,
          m.memberId ?? '',
          m.categoryId ?? 0,
          m.updatedAt ?? null,
          m.deletedAt ?? null,
          m.description ?? null,
          m.menuImages?.find((image) => image.isDefault)?.name ?? null,
        ),
    )

    // 메뉴 목록 DTO 생성 및 반환
    return {
      menus: menuDtos,
      currentPage: currentPage,
      endPage: Math.ceil(menuCount / pageSize),
    }
  }
}
