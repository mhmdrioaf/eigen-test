import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const BOOKS = [
    {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 1,
    },
    {
      code: 'SHR-1',
      title: 'A Study in Scarlet',
      author: 'Arthur Conan Doyle',
      stock: 1,
    },
    {
      code: 'TW-11',
      title: 'Twilight',
      author: 'Stephenie Meyer',
      stock: 1,
    },
    {
      code: 'HOB-83',
      title: 'The Hobbit, or There and Back Again',
      author: 'J.R.R. Tolkien',
      stock: 1,
    },
    {
      code: 'NRN-7',
      title: 'The Lion, the Witch and the Wardrobe',
      author: 'C.S. Lewis',
      stock: 1,
    },
  ];

  const MEMBERS = [
    {
      code: 'M001',
      name: 'Angga',
      isPenalized: true,
      penalizedAt: new Date(),
    },
    {
      code: 'M002',
      name: 'Ferry',
      isPenalized: false,
      penalizedAt: null,
    },
    {
      code: 'M003',
      name: 'Putri',
      isPenalized: false,
      penalizedAt: null,
    },
  ];

  await prisma.$transaction([
    prisma.book.createMany({ data: BOOKS, skipDuplicates: true }),
    prisma.member.createMany({ data: MEMBERS, skipDuplicates: true }),
  ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
