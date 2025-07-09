import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SbMenuRepository } from "@/backend/infrastructure/repositories/SbMenuRepository";
import { NDeleteMenuUsecase } from "@/backend/application/admin/product/menus/usecases/NDeleteMenuUsecase";

export async function GET(
	request: NextRequest,
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

		const menu = await menuRepository.findById(menuId);
		if (!menu) {
			return NextResponse.json({ error: "Menu not found" }, { status: 404 });
		}

		return NextResponse.json(menu);
	} catch (error) {
		console.error("Error fetching menu:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// 1. 파라미터 확인
		const resolvedParams = await params;
		const menuId = parseInt(resolvedParams.id);
		if (isNaN(menuId)) {
			return NextResponse.json({ error: "Invalid menu ID" }, { status: 400 });
		}

		// 2. 메뉴 삭제 유스케이스 위한 의존성 주입
		const supabase = await createClient();
		const menuRepository = new SbMenuRepository(supabase);
		const deleteMenuUsecase = new NDeleteMenuUsecase(menuRepository);

		// 3. 메뉴 삭제 실행
		await deleteMenuUsecase.execute(menuId);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting menu:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
