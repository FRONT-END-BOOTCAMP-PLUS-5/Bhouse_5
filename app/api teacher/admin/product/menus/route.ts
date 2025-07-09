import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { SbMenuRepository } from "@/backend/infrastructure/repositories/SbMenuRepository";
import { GetMenuListQueryDto } from "@/backend/application/admin/product/menus/dtos/GetMenuListQueryDto";
import { NGetMenuListUsecase } from "@/backend/application/admin/product/menus/usecases/NGetMenuListUsecase";
import { NCreateMenuUsecase } from "@/backend/application/admin/product/menus/usecases/NCreateMenuUsecase";
import { CreateMenuDto } from "@/backend/application/admin/product/menus/dtos/CreateMenuDto";
import { SbFileRepository } from "@/backend/infrastructure/repositories/SbFileRepository";
import { SbMenuImageRepository } from "@/backend/infrastructure/repositories/SbMenuImageRepository";

// 관리자를 위한 메뉴 목록 조회 API
// GET /api/admin/product/menus
export async function GET(request: NextRequest) {
	// 1. URL에서 쿼리 파라미터를 가져와서
	const url: URL = new URL(request.url);
	const pageParam: string = url.searchParams.get("p") || "1";
	const categoryIdParam: string | null = url.searchParams.get("c");
	const searchNameParam: string | null = url.searchParams.get("n");
	const sortFieldParam: string | null = url.searchParams.get("sf"); // 정렬 필드
	const ascendingParam: string | null = url.searchParams.get("asc"); // 정렬 순서 (asc 또는 desc)

	// 2. 쿼리를 위해 전달할 DTO 생성한 후
	const queryDto = new GetMenuListQueryDto(
		Number(pageParam),
		categoryIdParam,
		searchNameParam,
		sortFieldParam, // 정렬 기준 필드, 기본값은 "order" 필드
		ascendingParam === "true" // 정렬 순서, 기본값은 true(오름차순)
	);

	// 3. 쿼리를 위해 전달할 DTO를 Usecase에게 전달해서 실행한다.
	// Usecase에게 주입할 infrastructure 계층의 Repository 생성
	const supabase: SupabaseClient = await createClient();
	const menuRepository = new SbMenuRepository(supabase);

	// Usecase에게 의존성을 주입
	// *** 메뉴 목록 조회하는 업무로직 *** 실행
	const getMenuListUsecase = new NGetMenuListUsecase(menuRepository);
	const menus = await getMenuListUsecase.execute(queryDto);

	// 메뉴 목록을 JSON 형식으로 반환
	return NextResponse.json(menus);
}

export async function POST(request: NextRequest) {
	try {
		// multipart/form-data 파싱
		const formData = await request.formData();
		const korName = formData.get("korName") as string;
		const engName = formData.get("engName") as string;
		const price = formData.get("price") as string;
		const categoryId = formData.get("categoryId") as string;
		const description = formData.get("description") as string;
		const defaultImage = formData.get("defaultImage");

		// 로그 추가: 파일 정보 확인
		if (defaultImage) {
			console.log("[route] defaultImage type:", typeof defaultImage);
			console.log(
				"[route] defaultImage instanceof File:",
				defaultImage instanceof File
			);
			console.log("[route] defaultImage:", defaultImage);
			if (typeof File !== "undefined" && defaultImage instanceof File) {
				console.log("[route] defaultImage.name:", defaultImage.name);
				console.log("[route] defaultImage.type:", defaultImage.type);
				console.log("[route] defaultImage.size:", defaultImage.size);
			}
		} else {
			console.log("[route] defaultImage is null or undefined");
		}

		// 필수값 검증
		if (!korName || !engName || !price || !categoryId) {
			return NextResponse.json(
				{ success: false, error: "필수 입력값이 누락되었습니다." },
				{ status: 400 }
			);
		}

		// CreateMenuDto 객체 생성
		const createMenuDto: CreateMenuDto = {
			korName,
			engName,
			price: Number(price),
			categoryId: Number(categoryId),
			description,
			defaultImage: defaultImage as File | null,
		};

		// 1. SupabaseClient 생성 및 Repository DI
		const supabase = await createClient();
		const menuRepository = new SbMenuRepository(supabase);
		const fileRepository = new SbFileRepository(supabase, "image");
		const menuImageRepository = new SbMenuImageRepository(supabase);
		// 2. Usecase 생성 및 실행 (FileRepository도 주입)
		const createMenuUsecase = new NCreateMenuUsecase(
			menuRepository,
			fileRepository,
			menuImageRepository
		);
		const menu = await createMenuUsecase.execute(createMenuDto);

		// 3. 성공 응답
		return NextResponse.json({ success: true, menu });
	} catch (error) {
		console.error("메뉴 등록 오류:", error);
		return NextResponse.json(
			{ success: false, error: "메뉴 등록 중 오류가 발생했습니다." },
			{ status: 500 }
		);
	}
}
