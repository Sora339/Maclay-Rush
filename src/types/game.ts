export interface Book {
    id: string;
    volumeInfo: {
      title: string;
      description?: string;
      imageLinks?: {
        smallThumbnail: string;
      };
      previewLink: string;
    };
    saleInfo?: {
      saleability: string;
      buyLink?: string;
    };
  }
