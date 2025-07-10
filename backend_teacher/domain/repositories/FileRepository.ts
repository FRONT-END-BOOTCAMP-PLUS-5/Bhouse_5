export interface FileMetadata {
  size: number
  contentType: string
  lastModified: Date
  etag?: string
}

export interface FileSaveOptions {
  onDuplicate?: 'overwrite' | 'serial' | 'error'
}

export interface FileRepository {
  // 파일 저장 (업로드/로컬/DB 등 구현체에 따라 다름)
  save(path: string, fileName: string, file: Buffer | ArrayBuffer | Blob, options?: FileSaveOptions): Promise<string>

  // 파일 삭제
  delete(path: string, fileName: string): Promise<void>

  // 파일 존재 여부 확인
  exists(path: string, fileName: string): Promise<boolean>

  // 특정 경로의 모든 파일 목록 조회
  findAll(path: string): Promise<string[]>

  // 파일 메타데이터 조회 (크기, 타입 등)
  getMetadata(path: string, fileName: string): Promise<FileMetadata>
}
