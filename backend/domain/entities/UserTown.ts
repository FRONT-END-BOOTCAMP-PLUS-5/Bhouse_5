export class UserTown {
  constructor(
    public readonly id: number,
    public readonly userId: string,
    public readonly townName: string,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly createdAt: Date,
    public readonly isPrimary: boolean = false, // 추가: 주요 도시 여부
  ) {}
}
