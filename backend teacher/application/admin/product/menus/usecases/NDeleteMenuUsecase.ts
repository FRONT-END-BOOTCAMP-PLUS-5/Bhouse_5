import { MenuRepository } from "@/backend/domain/repositories/MenuRepository";

/**
 * 메뉴 삭제 유스케이스
 * - 메뉴 ID를 받아 해당 메뉴를 삭제한다.
 */
export class NDeleteMenuUsecase {
	constructor(private menuRepository: MenuRepository) {}

	/**
	 * 메뉴 삭제 실행
	 * @param menuId 삭제할 메뉴의 ID
	 */
	async execute(menuId: number): Promise<void> {
		// (필요하다면) 삭제 전 검증 로직 추가 가능
		await this.menuRepository.delete(menuId);
	}
}
