import { SupabaseClient } from "@supabase/supabase-js";
import { MenuRepository } from "../../domain/repositories/MenuRepository";
import { Menu } from "../../domain/entities/Menu";
import { MenuSearchCriteria } from "../../domain/repositories/criteria/MenuSearchCriteria";
import { MenuRelationsOptions } from "../../domain/repositories/options/MenuRelationsOptions";
import { BaseMapper } from "../mappers/BaseMapper";
import { MemberTable, MenuImageTable, MenuTable } from "../types/database";
import { MenuImage } from "@/backend/domain/entities/MenuImage";
import { Mapper } from "../mappers/Mapper";

export class SbMenuRepository implements MenuRepository {
	private supabase;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	/*
	findAll, count 메서드에서 공통으로 사용하는 필터링, 정렬, 검색 필드 매핑 코드를 집중화한 메서드
	*/
	private buildMenuQuery(
		base: string,
		selectStr: string,
		criteria: MenuSearchCriteria,
		options?: {
			skipSort?: boolean;
			skipPagination?: boolean;
			isCount?: boolean;
		}
	) {
		let query = this.supabase
			.from(base)
			.select(selectStr, options?.isCount ? { count: "exact" } : undefined);

		// criteria가 undefined인 경우 처리
		if (!criteria) {
			console.log("============== criteria가 undefined입니다!");
			return query;
		}

		// 공개 메뉴만 조회 (publicOnly가 true인 경우)
		if (criteria.publicOnly) {
			query = query.eq("is_public", true);
		}

		// 카테고리 필터링
		if (criteria.categoryId) {
			query = query.eq("category_id", criteria.categoryId);
		}

		// 검색어 필터링 (한글명 또는 영어명에 포함)
		if (criteria.searchWord) {
			query = query.or(
				`kor_name.ilike.%${criteria.searchWord}%,eng_name.ilike.%${criteria.searchWord}%`
			);
		}

		// 정렬 (skipSort이 true가 아닌 경우에만)
		if (!options?.skipSort) {
			// 정렬 필드를 데이터베이스 컬럼명으로 매핑
			const getSortField = (field: string): string => {
				switch (field) {
					case "createdAt":
						return "created_at";
					case "updatedAt":
						return "updated_at";
					case "korName":
						return "kor_name";
					case "engName":
						return "eng_name";
					case "price":
						return "price";
					default:
						return "created_at"; // 기본값
				}
			};

			if (criteria.sortField) {
				const dbSortField = getSortField(criteria.sortField);
				query = query.order(dbSortField, { ascending: criteria.ascending });
			} else {
				// 기본 정렬: 생성일 내림차순
				query = query.order("created_at", { ascending: false });
			}
		}

		// 페이지네이션 (skipPagination이 true가 아닌 경우에만)
		if (!options?.skipPagination) {
			query = query.range(
				criteria.offset,
				criteria.offset + criteria.limit - 1
			);
		}

		return query;
	}

	// MenuSearchCriteria를 이용해서 메뉴 목록 조회
	async findAll(
		criteria: MenuSearchCriteria,
		relations?: MenuRelationsOptions
	): Promise<Menu[]> {
		// === 1. 쿼리 빌드하기
		let query = null;
		{
			// 관계 데이터 포함 여부에 따라 select 쿼리 결정
			const selectArr = ["*"];
			if (relations?.includeImages) {
				selectArr.push("images:menu_images(*)");
			}
			if (relations?.includeMember) {
				selectArr.push("member:members(*)");
			}
			const selectStr = selectArr.join(", ");

			query = this.buildMenuQuery("menus", selectStr, criteria);
		}

		// === 2. 쿼리 실행하기
		let result: MenuTable[] | null = null;
		{
			const { data, error } = await query;
			if (error) throw new Error(error.message);

			result = (data ?? []) as unknown as MenuTable[];
		}

		// === 3. 데이터 변환해서 담기
		const menus: Menu[] = result.map((menu) => Mapper.toMenu(menu));

		// === 4. images관계 데이터 변환하기
		// images(관계 데이터) 포함 옵션이 있을 때만 추가 변환
		if (relations?.includeImages && result && Array.isArray(result)) {
			// menus와 data는 1:1 매칭이므로, 같은 인덱스끼리 매핑
			menus.forEach((menu, idx) => {
				// Supabase 원본 데이터에서 menu_images(관계 데이터) 추출
				// 타입 단언을 통해 menu_images가 MenuImageTable[]임을 명확히 함
				const raw = result[idx] as unknown as MenuTable & {
					menu_images?: MenuImageTable[];
				};

				// menu_images가 존재하고 배열일 때만 변환
				if (raw.menu_images && Array.isArray(raw.menu_images)) {
					// menu_images 배열을 MenuImage 엔티티 배열로 변환하여 menu.menuImages에 할당
					menu.menuImages = raw.menu_images.map((img) =>
						Mapper.toMenuImage(img)
					) as MenuImage[];
				}
			});
		}

		// === 5. member관계 데이터 변환하기
		if (relations?.includeMember && result && Array.isArray(result)) {
			menus.forEach((menu, idx) => {
				const raw = result[idx] as unknown as MenuTable & {
					member?: MemberTable;
				};
				menu.member = raw.member ? Mapper.toMember(raw.member) : undefined;
			});
		}

		return menus;
	}

	// 특정 메뉴 조회
	async findById(
		id: number,
		relations?: MenuRelationsOptions
	): Promise<Menu | null> {
		// === 1. 쿼리 빌드하기
		let query = null;
		{
			const selectArr = ["*"];
			if (relations?.includeImages) {
				selectArr.push("images:menu_images(*)");
			}
			if (relations?.includeMember) {
				selectArr.push("member:members(*)");
			}
			const selectStr = selectArr.join(", ");

			// 쿼리 빌더 사용
			query = this.supabase
				.from("menus")
				.select(selectStr)
				.eq("id", id)
				.single();
		}

		// === 2. 쿼리 실행하기
		let result: MenuTable | null = null;
		{
			const { data, error } = await query;
			if (error) throw new Error(error.message);
			if (!data) return null;

			result = data as unknown as MenuTable;
		}

		// === 3. 데이터 변환해서 담기
		const menu: Menu = BaseMapper.mapToCamelCase<MenuTable, Menu>(result);

		// === 4. images관계 데이터 변환하기
		if (relations?.includeImages && result) {
			const raw = result as unknown as MenuTable & {
				menu_images?: MenuImageTable[];
			};
			if (raw.menu_images && Array.isArray(raw.menu_images)) {
				menu.menuImages = raw.menu_images.map((img) =>
					Mapper.toMenuImage(img)
				) as MenuImage[];
			}
		}

		// === 5. member관계 데이터 변환하기
		if (relations?.includeMember && result) {
			const raw = result as unknown as MenuTable & {
				member?: MemberTable;
			};
			menu.member = raw.member ? Mapper.toMember(raw.member) : undefined;
		}

		return menu;
	}

	// 메뉴 개수 조회 (필터링된 레코드 수)
	async count(criteria: MenuSearchCriteria): Promise<number> {
		const query = this.buildMenuQuery("menus", "*", criteria, {
			skipSort: true,
			skipPagination: true,
			isCount: true,
		});
		const { count, error } = await query;
		if (error) throw new Error(error.message);
		return count ?? 0;
	}

	// 메뉴 저장
	async save(menu: Menu): Promise<Menu> {
		const { data, error } = await this.supabase
			.from("menus")
			.insert({
				kor_name: menu.korName,
				eng_name: menu.engName,
				price: menu.price,
				description: menu.description,
				member_id: menu.memberId,
				category_id: menu.categoryId,
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to save menu: ${error.message}`);
		}

		// Return the saved menu
		return Mapper.toMenu(data);
	}

	// 메뉴 수정
	async update(menu: Menu): Promise<Menu> {
		if (!menu.id) throw new Error("Menu id is required for update");
		const { data, error } = await this.supabase
			.from("menus")
			.update(menu)
			.eq("id", menu.id)
			.select()
			.single();
		if (error) throw new Error(error.message);

		return BaseMapper.mapToCamelCase<MenuTable, Menu>(data);
	}

	async delete(id: number): Promise<void> {
		const { error } = await this.supabase.from("menus").delete().eq("id", id);
		if (error) throw new Error(error.message);
	}
}
