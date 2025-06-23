import path from "node:path";
import { Provider } from "@smoodie/provider";
import { AppService } from "./services/app.service";
import { ConfigService } from "./services/config.service";

const provider = new Provider();

const configService = provider
	.register(
		ConfigService.forRoot({
			envFilePaths: path.resolve(
				process.cwd(),
				`.env.${process.env.NODE_ENV || "development"}`,
			),
		}),
	)
	.asSingleton();

console.log(configService.get("PORT"), configService.get("BASE_URL"));

const appService = provider.register(AppService).asSingleton();

await appService.init();
await appService.start();
