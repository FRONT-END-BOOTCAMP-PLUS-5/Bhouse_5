import { NextRequest, NextResponse } from "next/server";
import { AuthRepositoryImpl } from "@be/infrastructure/repositories/AuthRepositoryImpl";
import { LoginSSOAuthUsecase } from "@be/application/auth/signup/usecases/LoginSSOAuthUsecase";

const loginUsecase = new LoginSSOAuthUsecase(new AuthRepositoryImpl());

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await loginUsecase.execute({
    provider: body.provider,
    providerId: body.providerId,
  });

  return NextResponse.json(result, { status: result.status });
}
