export class BoardGame {
  constructor(
    public boardgameId: number, // required
    public difficulty: number, // required
    public name: string, // required
    public imgUrl: string, // required
    public minPlayers: number, // required
    public maxPlayers: number, // required
    public minPlayTime: number, // required
    public maxPlayTime: number, // required
    public yearPublished: number, // required
    public genreId?: number, // optional
    public description?: string, // optional
    public createdAt?: Date, // optional
    public updatedAt?: Date // optional

  ) {}
}