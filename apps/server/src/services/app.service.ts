import { Provider } from "@smoodie/provider";
import { fileURLToPath } from 'url';
import path, { dirname } from "path";
import { ConfigService } from "./config.service";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export class AppService {
  private app: express.Application;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.app = express();
  }

  static Metadata = {
    construct: (provider: Provider) => new AppService(
      provider.register(ConfigService).asSingleton()
    )
  }

  async start() {
    this.app.listen(this.configService.get('PORT'), () => {
      console.log(`Server is running on port ${this.configService.get('PORT')}`);
    });
  }

  async init() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }
}
