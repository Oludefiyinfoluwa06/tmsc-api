"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'UNDEFINED');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
    console.error('Failed to start the application:', error);
});
//# sourceMappingURL=main.js.map