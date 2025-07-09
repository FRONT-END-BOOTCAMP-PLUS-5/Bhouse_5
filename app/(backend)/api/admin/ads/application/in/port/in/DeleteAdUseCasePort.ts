export interface DeleteAdUseCasePort {
  execute(id: number): Promise<void>;
}