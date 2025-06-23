import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Provider } from "@smoodie/provider";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { RootRouter } from "../controllers/trpc/root.router";
import { ConfigService } from "./config.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class AppService {
	private app: express.Application;

	constructor(
		private readonly configService: ConfigService,
		private readonly rootRouter: RootRouter,
	) {
		this.app = express();
	}

	static Metadata = {
		construct: (provider: Provider) =>
			new AppService(
				provider.register(ConfigService).asSingleton(),
				provider.register(RootRouter).asSingleton(),
			),
	};

	async start() {
		this.app.listen(this.configService.get("PORT"), () => {
			console.log(
				`Server is running on port ${this.configService.get("PORT")}`,
			);
		});
	}

	async init() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.static(path.join(__dirname, "public")));

		// tRPC 미들웨어 추가
		this.app.use(
			"/trpc",
			createExpressMiddleware({
				router: this.rootRouter.create(),
			}),
		);
	}
}
