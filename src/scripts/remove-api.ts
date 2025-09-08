import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Parse args
const args = process.argv.slice(2);
const routeName = args.find((arg) => !arg.startsWith("--"));

if (!routeName) {
    console.error("🔴 Please provide a route name: ts-node delete-api.ts <routeName>");
    process.exit(1);
}

const kebabCase = routeName.toLowerCase();
const baseDir = path.join(process.cwd(), "src");

const files = {
    types: path.join(baseDir, "types", `${kebabCase}.types.ts`),
    model: path.join(baseDir, "models", `${kebabCase}.model.ts`),
    controller: path.join(baseDir, "controllers", `${kebabCase}.controller.ts`),
    service: path.join(baseDir, "services", `${kebabCase}.service.ts`),
    repository: path.join(baseDir, "repositories", `${kebabCase}.repository.ts`),
    route: path.join(baseDir, "routes", `${kebabCase}.routes.ts`),
    validator: path.join(baseDir, "validators", `${kebabCase}.validator.ts`),
};

// Confirm prompt
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(
    `⚠️  Are you sure you want to delete API files for '${routeName}'? (y/n): `,
    (answer) => {
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
            Object.values(files).forEach((file) => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    console.log(`🗑 Deleted: ${path.relative(process.cwd(), file)}`);
                } else {
                    console.log(`⚠️ Skipped (not found): ${path.relative(process.cwd(), file)}`);
                }
            });
            console.log(`🔵 Cleanup complete for '${routeName}'.`);
        } else {
            console.log("🔴 Operation cancelled.");
        }
        rl.close();
    }
);
