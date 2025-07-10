import { NextRequest, NextResponse } from "next/server";
import { StoreRepositoryImpl } from "@be/infrastructure/repositories/StoreRepositoryImpl";
import { Store } from "@be/domain/entities/Store";

const repo = new StoreRepositoryImpl();

// POST: 매장 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newStore = new Store(
      0, // store_id는 Supabase가 자동 생성
      body.name,
      body.address,
      body.phone,
      body.description,
      body.imagePlaceUrl,
      body.imageMenuUrl,
      "", // createdBy는 내부에서 설정
      "", // ownerName도 내부에서 설정
      body.openTime
    );

    await repo.create(newStore);
    return NextResponse.json({ message: "매장 생성 완료" }, { status: 201 });
  } catch (error) {
    console.error("POST /stores error:", error);
    return NextResponse.json({ error: "매장 생성에 실패했습니다." }, { status: 500 });
  }
}

// PUT: 매장 수정
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const storeId = body.storeId;
    const createdBy = body.createdBy; // 수정하려는 매장의 owner id

    await repo.update(storeId, createdBy, body);
    return NextResponse.json({ message: "매장 수정 완료" });
  } catch (error: unknown) {
    console.error("PUT /stores error:", error);
    return NextResponse.json({ error: error.message || "매장 수정 실패" }, { status: 403 });
  }
}

// DELETE: 매장 삭제
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const storeId = body.storeId;

    await repo.delete(storeId);
    return NextResponse.json({ message: "매장 삭제 완료" });
  } catch (error: unknown) {
    console.error("DELETE /stores error:", error);
    return NextResponse.json({ error: error.message || "매장 삭제 실패" }, { status: 403 });
  }
}
