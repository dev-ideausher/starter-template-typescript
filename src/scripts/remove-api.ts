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
const pascalCase = routeName.charAt(0).toUpperCase() + routeName.slice(1);
const baseDir = path.join(process.cwd(), "src");

const files = {
    model: path.join(baseDir, "models", `${kebabCase}.model.ts`),
    controller: path.join(baseDir, "controllers", `${kebabCase}.controller.ts`),
    service: path.join(baseDir, "services", `${kebabCase}.service.ts`),
    repository: path.join(baseDir, "repositories", `${kebabCase}.repository.ts`),
    route: path.join(baseDir, "routes", `${kebabCase}.routes.ts`),
    validator: path.join(baseDir, "validators", `${kebabCase}.validator.ts`),
};

function removeFromIndexFile(indexFilePath: string, className: string, fileName: string) {
    if (!fs.existsSync(indexFilePath)) return;

    let content = fs.readFileSync(indexFilePath, "utf8");

    // Remove import line
    const importLine = `import { ${className} } from "./${fileName}";`;
    content = content.replace(importLine + "\n", "").replace(importLine, "");

    // Remove from export block
    const exportRegex = /export\s*{\s*([^}]*)}/s;
    if (exportRegex.test(content)) {
        content = content.replace(exportRegex, (match, exports) => {
            const items = exports
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);
            const filtered = items.filter((item: string) => item !== className);

            if (filtered.length > 0) {
                return `export { ${filtered.join(", ")} }`;
            }
            return "";
        });
    }

    fs.writeFileSync(indexFilePath, content.trim() + "\n", "utf8");
    console.log(`🗑 Removed ${className} from ${indexFilePath}`);
}

function removeFromModelIndexFile(indexFilePath: string, className: string, fileName: string) {
    if (!fs.existsSync(indexFilePath)) return;

    let content = fs.readFileSync(indexFilePath, "utf8");

    // Remove import line
    const importLine = `import { ${className}, I${className} } from "./${fileName}";`;
    content = content.replace(importLine + "\n", "").replace(importLine, "");

    // Remove from export block
    const exportRegex = /export\s*{\s*([^}]*)}/s;
    if (exportRegex.test(content)) {
        content = content.replace(exportRegex, (match, exports) => {
            const items = exports
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);
            const filtered = items.filter(
                (item: string) => item !== className && item !== `I${className}`
            );

            if (filtered.length > 0) {
                return `export { ${filtered.join(", ")} }`;
            }
            return "";
        });
    }

    fs.writeFileSync(indexFilePath, content.trim() + "\n", "utf8");
    console.log(`🗑 Removed ${className}, I${className} from ${indexFilePath}`);
}

// Confirm prompt
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(
    `⚠️  Are you sure you want to delete API files for '${routeName}'? (y/n): `,
    (answer) => {
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
            // model
            if (fs.existsSync(files.model)) {
                fs.unlinkSync(files.model);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.model)}`);
                removeFromModelIndexFile(
                    path.join(baseDir, "models", "index.ts"),
                    `${pascalCase}`,
                    `${kebabCase}.model`
                );
            }

            // controller
            if (fs.existsSync(files.controller)) {
                fs.unlinkSync(files.controller);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.controller)}`);
                removeFromIndexFile(
                    path.join(baseDir, "controllers", "index.ts"),
                    `${pascalCase}Controller`,
                    `${kebabCase}.controller`
                );
            }

            // service
            if (fs.existsSync(files.service)) {
                fs.unlinkSync(files.service);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.service)}`);
                removeFromIndexFile(
                    path.join(baseDir, "services", "index.ts"),
                    `${pascalCase}Service`,
                    `${kebabCase}.service`
                );
            }

            // repository
            if (fs.existsSync(files.repository)) {
                fs.unlinkSync(files.repository);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.repository)}`);
                removeFromIndexFile(
                    path.join(baseDir, "repositories", "index.ts"),
                    `${pascalCase}Repository`,
                    `${kebabCase}.repository`
                );
            }

            // route
            if (fs.existsSync(files.route)) {
                fs.unlinkSync(files.route);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.route)}`);
                removeFromIndexFile(
                    path.join(baseDir, "routes", "index.ts"),
                    `${pascalCase}Route`,
                    `${kebabCase}.route`
                );
            }

            // validator
            if (fs.existsSync(files.validator)) {
                fs.unlinkSync(files.validator);
                console.log(`🗑 Deleted: ${path.relative(process.cwd(), files.validator)}`);
                removeFromIndexFile(
                    path.join(baseDir, "validators", "index.ts"),
                    `${pascalCase}Schema`,
                    `${kebabCase}.validator`
                );
            }

            console.log(`🔵 Cleanup complete for '${routeName}'.`);
        } else {
            console.log("🔴 Operation cancelled.");
        }
        rl.close();
    }
);
