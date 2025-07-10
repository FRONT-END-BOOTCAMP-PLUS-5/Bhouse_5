import { NextRequest, NextResponse } from "next/server";
import { UserTownRepositoryImpl } from "@be/infrastructure/repositories/UserTownRepositoryImpl";
import { VerifyUserTownUseCase } from "@be/application/user/certify-town/VerifyUSerTownUseCase";
import { DeleteUserTownUseCase } from "@be/application/user/certify-town/DeleteUserTownUseCase";
import { supabaseClient } from "@bUtils/supabaseClient";
import { GetUserTownListUseCase } from "@be/application/user/certify-town/GetUserTownListUseCase";

const repo = new UserTownRepositoryImpl();
const verifyUseCase = new VerifyUserTownUseCase(repo);
const deleteUseCase = new DeleteUserTownUseCase(repo);
const getListUseCase = new GetUserTownListUseCase(repo); // 추가

// GET: 유저의 동네 목록 조회
export async function GET() {
  const supabase = supabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const towns = await getListUseCase.execute(user.id);
    return NextResponse.json(towns);
  } catch (e) {
    console.error("GET user towns error:", e);
    return NextResponse.json({ message: "Failed to fetch towns" }, { status: 500 });
  }
}

// POST: 동네 인증
export async function POST(req: NextRequest) {
  const supabase = supabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { townName, latitude, longitude } = await req.json();

    if (!townName || latitude == null || longitude == null) {
      return NextResponse.json({ message: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    const result = await verifyUseCase.execute(user.id, townName, latitude, longitude);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("POST user town error:", e);
    return NextResponse.json({ message: e.message || "Failed to verify town" }, { status: 400 });
  }
}

// DELETE: 동네 삭제
export async function DELETE(req: NextRequest) {
  const supabase = supabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await deleteUseCase.execute(id, user.id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("DELETE user town error:", e);
    return NextResponse.json({ message: e.message || "Failed to delete town" }, { status: 400 });
  }
}
