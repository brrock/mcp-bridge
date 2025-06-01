<<<<<<< HEAD
import { PrismaClient } from "./generated/prisma";
=======
import { PrismaClient } from './generated/prisma';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
