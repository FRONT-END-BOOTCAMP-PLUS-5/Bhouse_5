import { MenuImageRepository } from "@/backend/domain/repositories/MenuImageRepository";
import { GetMenuImageListDto } from "../dtos/GetMenuImageListDto";

export class NGetMenuImageListUsecase {
	private menuImageRepository: MenuImageRepository;

	constructor(menuImageRepository: MenuImageRepository) {
		this.menuImageRepository = menuImageRepository;
	}

	async execute(): Promise<GetMenuImageListDto> {
		const images = await this.menuImageRepository.findAll();
		const result: GetMenuImageListDto = {
			images: images.map((img) => ({
				id: img.id ?? 0,
				menuId: img.menuId ?? 0,
				name: img.name ?? "",
				isDefault: img.isDefault ?? false,
			})),
		};
		return result;
	}
}
