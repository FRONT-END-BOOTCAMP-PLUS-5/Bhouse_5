export class Ad {
  constructor(
    public readonly id: number,
    public title: string,
    public content: string,
    public isActive: boolean
  ) {}
}
