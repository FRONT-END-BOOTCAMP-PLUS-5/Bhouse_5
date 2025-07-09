export class Ad {
  constructor(
    public readonly id: number | undefined, // optional
    public readonly userId: string,
    public title: string,
    public imgUrl: string,
    public redirectUrl: string,
    public isActive: boolean,
    public type: string
  ) {}
}