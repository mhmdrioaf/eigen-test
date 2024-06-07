type TMember = {
  code: string;
  name: string;
  isPenalized: boolean;
  penalizedAt: Date | null;
};

type TMemberWithBooks = TMember & {
  borrowedBooks: number;
};
