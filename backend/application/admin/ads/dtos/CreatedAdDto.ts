// CreateAdDto.ts
export interface CreateAdDto {
  redirectUrl: string;
  isActive: any;
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
  isActive: boolean;
  type: string;
}