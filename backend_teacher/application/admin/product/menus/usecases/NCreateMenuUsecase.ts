import { MenuRepository } from '@/backend/domain/repositories/MenuRepository'
import { CreateMenuDto } from '@/backend/application/admin/product/menus/dtos/CreateMenuDto'
import { CreatedMenuDto } from '@/backend/application/admin/product/menus/dtos/CreatedMenuDto'
import { Menu } from '@/backend/domain/entities/Menu'
import { FileRepository } from '@/backend/domain/repositories/FileRepository'
import { MenuImage } from '@/backend/domain/entities/MenuImage'
import { MenuImageRepository } from '@/backend/domain/repositories/MenuImageRepository'

export class NCreateMenuUsecase {
  private menuRepository: MenuRepository
  private fileRepository: FileRepository
  private menuImageRepository: MenuImageRepository

  constructor(
    menuRepository: MenuRepository,
    fileRepository: FileRepository,
    menuImageRepository: MenuImageRepository,
  ) {
    this.menuRepository = menuRepository
    this.fileRepository = fileRepository
    this.menuImageRepository = menuImageRepository
  }

  async execute(menuDto: CreateMenuDto): Promise<CreatedMenuDto> {
    // Menu 엔티티 객체 생성 후 속성 대입
    const saveMenu = new Menu()
    saveMenu.korName = menuDto.korName
    saveMenu.engName = menuDto.engName
    saveMenu.price = Number(menuDto.price)
    saveMenu.memberId = 'e755441d-1979-4617-acd5-531f2f898b22' // 로그인 정보 필요, 임시 상수형 값
    saveMenu.categoryId = Number(menuDto.categoryId)
    saveMenu.description = menuDto.description ?? null

    // defaultImage가 파일로 들어오면 파일 정보 로그 출력 및 파일 저장
    let defaultImageUrl: string | undefined = undefined
    const bucket = 'image'
    const folder = 'product'
    if (menuDto.defaultImage && typeof menuDto.defaultImage !== 'string') {
      const file = menuDto.defaultImage
      // 로그 추가: 파일 정보 확인
      console.log('[usecase] defaultImage type:', typeof file)
      console.log('[usecase] defaultImage instanceof File:', file instanceof File)
      console.log('[usecase] defaultImage:', file)
      if (typeof File !== 'undefined' && file instanceof File) {
        console.log('[usecase] defaultImage.name:', file.name)
        console.log('[usecase] defaultImage.type:', file.type)
        console.log('[usecase] defaultImage.size:', file.size)
      }
      const fileName = file.name
      await this.fileRepository.save(folder, fileName, file, {
        onDuplicate: 'serial',
      })
      defaultImageUrl = `/${bucket}/${folder}/${fileName}`
    }

    // 필요시 옵션 필드 추가 대입
    // 예: saveMenu.defaultImageUrl = defaultImageUrl;
    const savedMenu = await this.menuRepository.save(saveMenu)
    const saveImage = new MenuImage()
    saveImage.id = undefined
    saveImage.menuId = savedMenu.id ?? 0
    saveImage.name = defaultImageUrl ?? ''
    saveImage.isDefault = true
    const savedImage = await this.menuImageRepository.save(saveImage)

    return {
      id: savedMenu.id ?? 0,
      category: String(savedMenu.categoryId),
      korName: savedMenu.korName ?? '',
      engName: savedMenu.engName ?? '',
      price: String(savedMenu.price),
      description: savedMenu.description ?? '',
      defaultImage: savedImage.name ?? '',
      createdAt: savedMenu.createdAt?.toISOString() ?? '',
      updatedAt: savedMenu.updatedAt?.toISOString() ?? '',
    }
  }
}
