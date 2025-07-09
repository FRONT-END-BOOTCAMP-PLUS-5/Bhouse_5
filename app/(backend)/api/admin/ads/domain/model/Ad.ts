export class Ad {
  constructor(
    public readonly id: number,
    public title: string,
    public imgUrl: string,
    public redirectUrl: string,
    public isActive: boolean
  ) {}
}
