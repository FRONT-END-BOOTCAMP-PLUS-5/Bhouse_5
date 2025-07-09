import { SupabaseClient } from "@supabase/supabase-js";
import {
	FileRepository,
	FileMetadata,
	FileSaveOptions,
} from "../../domain/repositories/FileRepository";

export class SbFileRepository implements FileRepository {
	private supabase: SupabaseClient;
	private bucket: string;

	constructor(supabase: SupabaseClient, bucket: string = "image") {
		this.supabase = supabase;
		this.bucket = bucket;
	}

	async save(
		path: string,
		fileName: string,
		file: Buffer | ArrayBuffer | Blob,
		options?: FileSaveOptions
	): Promise<string> {
		const onDuplicate = options?.onDuplicate ?? "serial";
		let finalFileName = fileName;
		if (onDuplicate === "serial") {
			const baseName = fileName.replace(/\.[^/.]+$/, "");
			const ext = fileName.split(".").pop();
			let idx = 1;
			while (await this.exists(path, finalFileName)) {
				finalFileName = `${baseName}(${idx}).${ext}`;
				idx++;
			}
		} else if (onDuplicate === "error") {
			if (await this.exists(path, finalFileName)) {
				throw new Error("동일한 파일명이 이미 존재합니다.");
			}
		}
		// overwrite는 별도 처리 없이 upsert: true로 동작

		const fullPath = path.endsWith("/")
			? path + finalFileName
			: path + "/" + finalFileName;
		const { error } = await this.supabase.storage
			.from(this.bucket)
			.upload(fullPath, file, {
				cacheControl: "3600",
				upsert: onDuplicate === "overwrite" ? true : false,
			});
		if (error) {
			throw new Error(`파일 저장 실패: ${error.message}`);
		}
		const { data: urlData } = this.supabase.storage
			.from(this.bucket)
			.getPublicUrl(fullPath);
		return urlData.publicUrl;
	}

	async delete(path: string, fileName: string): Promise<void> {
		const fullPath = path.endsWith("/")
			? path + fileName
			: path + "/" + fileName;
		const { error } = await this.supabase.storage
			.from(this.bucket)
			.remove([fullPath]);
		if (error) {
			throw new Error(`파일 삭제 실패: ${error.message}`);
		}
	}

	async exists(path: string, fileName: string): Promise<boolean> {
		const { data, error } = await this.supabase.storage
			.from(this.bucket)
			.list(path, {
				search: fileName,
			});
		if (error) {
			throw new Error(`파일 존재 확인 실패: ${error.message}`);
		}
		return data.some((file) => file.name === fileName);
	}

	async findAll(path: string): Promise<string[]> {
		const { data, error } = await this.supabase.storage
			.from(this.bucket)
			.list(path);
		if (error) {
			throw new Error(`파일 목록 조회 실패: ${error.message}`);
		}
		return data.map((file) => file.name);
	}

	async getMetadata(path: string, fileName: string): Promise<FileMetadata> {
		const { data, error } = await this.supabase.storage
			.from(this.bucket)
			.list(path, {
				search: fileName,
			});
		if (error) {
			throw new Error(`파일 메타데이터 조회 실패: ${error.message}`);
		}
		const file = data.find((f) => f.name === fileName);
		if (!file) {
			throw new Error("파일을 찾을 수 없습니다.");
		}
		return {
			size: file.metadata?.size || 0,
			contentType: file.metadata?.mimetype || "application/octet-stream",
			lastModified: new Date(file.updated_at || file.created_at || Date.now()),
			etag: file.metadata?.etag,
		};
	}
}
