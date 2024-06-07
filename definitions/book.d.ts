type TBook = {
  code: string;
  title: string;
  author: string;
  stock: number;
};

interface IBorrowBookDto {
  memberCode: string;
  bookCodes: string[];
}
