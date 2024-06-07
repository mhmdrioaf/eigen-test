type TBookBorrowed = {
  id: number;
  bookCode: string;
  memberCode: string;
  borrowedAt: Date;
  returnedAt: Date | null;
};

type TBookBorrowedWithMember = TBookBorrowed & {
  memberName: string;
};
