import { SupabaseClient } from "@supabase/supabase-js";
import { MemberRoleRepository } from "../../domain/repositories/MemberRoleRepository";
import { MemberRole } from "../../domain/entities/MemberRole";
import { Mapper } from "../mappers/Mapper";
import { MemberRoleTable } from "../types/database";

export class SbMemberRoleRepository implements MemberRoleRepository {
	constructor(private supabase: SupabaseClient) {}

	// 멤버 역할 전체 목록 조회
	async findAll(): Promise<MemberRole[]> {
		// === 1. 쿼리 빌드하기
		const query = this.supabase.from("member_roles").select("*");

		// === 2. 쿼리 실행하기
		let result: MemberRoleTable[] | null = null;
		{
			const { data, error } = await query;
			if (error) throw new Error(error.message);
			result = (data ?? []) as unknown as MemberRoleTable[];
		}

		// === 3. 데이터 변환해서 담기
		const memberRoles: MemberRole[] = result.map((item) =>
			Mapper.toMemberRole(item)
		);
		return memberRoles;
	}

	// 멤버 역할 개수 조회 (필터링된 레코드 수)
	async count(): Promise<number> {
		// === 1. 쿼리 빌드하기
		const query = this.supabase
			.from("member_roles")
			.select("*", { count: "exact" });

		// === 2. 쿼리 실행 및 개수 반환
		const { count, error } = await query;
		if (error) throw new Error(error.message);
		return count ?? 0;
	}

	// 멤버 역할 단건 조회
	async findById(memberId: string, roleId: number): Promise<MemberRole | null> {
		const { data, error } = await this.supabase
			.from("member_roles")
			.select("*")
			.eq("member_id", memberId)
			.eq("role_id", roleId)
			.single();
		if (error) throw new Error(error.message);
		if (!data) return null;
		return Mapper.toMemberRole(data as unknown as MemberRoleTable);
	}

	// 멤버 역할 저장
	async save(memberRole: MemberRole): Promise<MemberRole> {
		const { data, error } = await this.supabase
			.from("member_roles")
			.insert([
				{
					member_id: memberRole.memberId,
					role_id: memberRole.roleId,
					created_at: memberRole.createdAt.toISOString(),
				},
			])
			.select()
			.single();
		if (error) throw new Error(error.message);
		return Mapper.toMemberRole(data as unknown as MemberRoleTable);
	}

	// 멤버 역할 수정
	async update(memberRole: MemberRole): Promise<MemberRole> {
		const { data, error } = await this.supabase
			.from("member_roles")
			.update({
				member_id: memberRole.memberId,
				role_id: memberRole.roleId,
				created_at: memberRole.createdAt.toISOString(),
			})
			.eq("member_id", memberRole.memberId)
			.eq("role_id", memberRole.roleId)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return Mapper.toMemberRole(data as unknown as MemberRoleTable);
	}

	// 멤버 역할 삭제
	async delete(memberId: string, roleId: number): Promise<void> {
		const { error } = await this.supabase
			.from("member_roles")
			.delete()
			.eq("member_id", memberId)
			.eq("role_id", roleId);
		if (error) throw new Error(error.message);
	}
}
