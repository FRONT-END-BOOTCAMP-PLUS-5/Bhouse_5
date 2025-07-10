export class UserTown {
  constructor(
    public readonly id: number,
    public readonly userId: string,
    public readonly townName: string,
    public readonly createdAt: Date
  ) {}
}