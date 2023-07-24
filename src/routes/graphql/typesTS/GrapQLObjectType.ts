import { GetResult } from "@prisma/client/runtime/library.js";
import { GraphQLObjectType } from "graphql";

export type GraphQlObject<T extends Record<string | number | symbol, unknown>> = GraphQLObjectType<GetResult<T, { [x: string]: () => unknown; }> & object, unknown>