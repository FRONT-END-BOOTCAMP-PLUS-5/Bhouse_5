import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SbMenuRepository } from "@/backend/infrastructure/repositories/SbMenuRepository";

export async function GET(
	request: NextRequest,
	// 서버 컴포넌트에서 13+ 버전 이상에서 params는 무조건 비동기로 처리해야 함.
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const supabase = await createClient();
		const menuRepository = new SbMenuRepository(supabase);

		const resolvedParams = await params;
		const menuId = parseInt(resolvedParams.id);
		if (isNaN(menuId)) {
			return NextResponse.json({ error: "Invalid menu ID" }, { status: 400 });
		}

		// 이미지 정보가 포함된 메뉴 데이터 조회
		const menuWithImage = await menuRepository.findById(menuId, {
			includeImages: true,
		});

		console.log(menuWithImage);

		if (!menuWithImage) {
			return NextResponse.json({ error: "Menu not found" }, { status: 404 });
		}

		return NextResponse.json(menuWithImage);
	} catch (error) {
		console.error("Error fetching menu with image:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
