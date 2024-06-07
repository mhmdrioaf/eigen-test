interface IResponse {
  success: boolean;
  message?: string;
}

interface IGetBorrowedBooksResponse extends IResponse {
  member: TBorrowedBookMember;
  borrowedBooks: TBorrowedBook[];
}

type TBorrowedBookMember = {
  memberCode: string;
  memberName: string;
};

type TBorrowedBook = {
  borrowedAt: Data;
  bookCode: string;
  bookTitle: string;
};
