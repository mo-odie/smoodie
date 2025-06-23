import { initTRPC } from "@trpc/server";
import type { OpenApiMeta } from "trpc-openapi";

const t = initTRPC.meta<OpenApiMeta>().create();

export abstract class BaseRouter {
	protected router = t.router;
	protected publicProcedure = t.procedure;

	abstract create(): ReturnType<typeof t.router>;
}

export const router = t.router;
export const publicProcedure = t.procedure;
