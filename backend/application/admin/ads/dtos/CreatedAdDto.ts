// CreateAdDto.ts
export interface CreateAdDto {
  type: any;
  title: string;
  description: string;
  imageUrl: string;
}

// CreatedAdDto.ts
export interface CreatedAdDto {
  id: string;
  title: string;
  createdAt: Date;
}