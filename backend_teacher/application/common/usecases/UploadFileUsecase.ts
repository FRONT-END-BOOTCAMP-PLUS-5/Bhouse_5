import { FileRepository } from '../../../domain/repositories/FileRepository'

export interface UploadFileInput {
  file: Buffer | ArrayBuffer | Blob
  fileName: string
  path: string // 예: "product-images/", "profile/", "temp/"
}

export interface UploadFileOutput {
  url: string
}

export class UploadFileUsecase {
  constructor(private fileRepository: FileRepository) {}

  async execute(input: UploadFileInput): Promise<UploadFileOutput> {
    // 파일 저장 (업로드)
    const url = await this.fileRepository.save(input.path, input.fileName, input.file)

    return { url }
  }
}
