import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export class dbObject {
  static client: prismaType;

  static setPrismaClient(client: prismaType) {
    dbObject.client = client;
}
}