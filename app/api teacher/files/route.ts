import { NextRequest, NextResponse } from "next/server";
import { SbFileRepository } from "../../../backend/infrastructure/repositories/SbFileRepository";
import { UploadFileUsecase } from "../../../backend/application/common/usecases/UploadFileUsecase";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
	try {
		// FormData 파싱
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const path = formData.get("path") as string;

		// 파라미터 검증
		if (!file) {
			return NextResponse.json(
				{ error: "파일이 필요합니다." },
				{ status: 400 }
			);
		}

		if (!path) {
			return NextResponse.json(
				{ error: "업로드 경로가 필요합니다." },
				{ status: 400 }
			);
		}

		// 파일 크기 검증 (예: 10MB 제한)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: "파일 크기는 10MB를 초과할 수 없습니다." },
				{ status: 400 }
			);
		}

		// 파일 타입 검증 (이미지 파일만 허용)
		const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: "지원하지 않는 파일 타입입니다." },
				{ status: 400 }
			);
		}

		// 파일을 Buffer로 변환
		const buffer = Buffer.from(await file.arrayBuffer());

		// 파일명 생성 (중복 방지)
		const timestamp = Date.now();
		const extension = file.name.split(".").pop();
		const fileName = `${timestamp}.${extension}`;

		// Usecase 실행
		const supabase = await createClient();
		const fileRepository = new SbFileRepository(supabase, "image");
		const uploadFileUsecase = new UploadFileUsecase(fileRepository);

		const result = await uploadFileUsecase.execute({
			file: buffer,
			fileName: fileName,
			path: path,
		});

		return NextResponse.json({
			success: true,
			url: result.url,
			fileName: fileName,
		});
	} catch (error) {
		console.error("파일 업로드 오류:", error);
		return NextResponse.json(
			{ error: "파일 업로드 중 오류가 발생했습니다." },
			{ status: 500 }
		);
	}
}

// GET 메서드: 파일 목록 조회 (선택사항)
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const path = searchParams.get("path");

		if (!path) {
			return NextResponse.json(
				{ error: "경로 파라미터가 필요합니다." },
				{ status: 400 }
			);
		}

		const supabase = await createClient();
		const fileRepository = new SbFileRepository(supabase, "image");
		const files = await fileRepository.findAll(path);

		return NextResponse.json({
			success: true,
			files: files,
		});
	} catch (error) {
		console.error("파일 목록 조회 오류:", error);
		return NextResponse.json(
			{ error: "파일 목록 조회 중 오류가 발생했습니다." },
			{ status: 500 }
		);
	}
}
