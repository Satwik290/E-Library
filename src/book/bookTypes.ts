export interface CloudinaryFile {
  url: string;
  publicId: string;
}

export interface BookType {
  title: string;
  author: string;
  description?: string;
  price?: number;
  coverImage: CloudinaryFile;
  file: CloudinaryFile;
  createdBy: string;
}
