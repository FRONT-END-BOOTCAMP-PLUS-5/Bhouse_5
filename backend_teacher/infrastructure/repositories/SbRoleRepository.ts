import { SupabaseClient } from "@supabase/supabase-js";
import { RoleRepository } from "../../domain/repositories/RoleRepository";
import { Role } from "../../domain/entities/Role";
import { Mapper } from "../mappers/Mapper";
import { RoleTable } from "../types/database";

export class SbRoleRepository implements RoleRepository {
	constructor(private supabase: SupabaseClient) {}

	// 역할 전체 목록 조회
	async findAll(): Promise<Role[]> {
		// === 1. 쿼리 빌드하기
		const query = this.supabase.from("roles").select("*");

		// === 2. 쿼리 실행하기
		let result: RoleTable[] | null = null;
		{
			const { data, error } = await query;
			if (error) throw new Error(error.message);
			result = (data ?? []) as unknown as RoleTable[];
		}

		// === 3. 데이터 변환해서 담기
		const roles: Role[] = result.map((item) => Mapper.toRole(item));
		return roles;
	}

	// 역할 개수 조회 (필터링된 레코드 수)
	async count(): Promise<number> {
		// === 1. 쿼리 빌드하기
		const query = this.supabase.from("roles").select("*", { count: "exact" });

		// === 2. 쿼리 실행 및 개수 반환
		const { count, error } = await query;
		if (error) throw new Error(error.message);
		return count ?? 0;
	}

	// 역할 단건 조회
	async findById(id: number): Promise<Role | null> {
		const { data, error } = await this.supabase
			.from("roles")
			.select("*")
			.eq("id", id)
			.single();
		if (error) throw new Error(error.message);
		if (!data) return null;
		return Mapper.toRole(data as unknown as RoleTable);
	}

	// 역할 저장
	async save(role: Role): Promise<Role> {
		const { data, error } = await this.supabase
			.from("roles")
			.insert([
				{
					id: role.id,
					name: role.name,
					created_at: role.createdAt.toISOString(),
				},
			])
			.select()
			.single();
		if (error) throw new Error(error.message);
		return Mapper.toRole(data as unknown as RoleTable);
	}

	// 역할 수정
	async update(role: Role): Promise<Role> {
		const { data, error } = await this.supabase
			.from("roles")
			.update({
				id: role.id,
				name: role.name,
				created_at: role.createdAt.toISOString(),
			})
			.eq("id", role.id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return Mapper.toRole(data as unknown as RoleTable);
	}

	// 역할 삭제
	async delete(id: number): Promise<void> {
		const { error } = await this.supabase.from("roles").delete().eq("id", id);
		if (error) throw new Error(error.message);
	}
}
