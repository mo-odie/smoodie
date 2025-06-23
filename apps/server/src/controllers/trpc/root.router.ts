import type { Provider } from "@smoodie/provider";
import { BaseRouter } from "./router";
import { ScriptRouter } from "./script.router";

export class RootRouter extends BaseRouter {
	static Metadata = {
		construct: (provider: Provider) =>
			new RootRouter(provider.register(ScriptRouter).asSingleton()),
	};
	constructor(private readonly scriptRouter: ScriptRouter) {
		super();
	}

	create() {
		return this.router({
			script: this.scriptRouter.create(),
		});
	}
}

export type AppRouter = ReturnType<RootRouter["create"]>;
