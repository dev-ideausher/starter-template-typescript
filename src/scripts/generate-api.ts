import * as fs from "fs";
import * as path from "path";

// Get command line arguments
const args = process.argv.slice(2);
const routeName = args[0];

if (!routeName) {
    console.error("🔴 Please provide a route name: ts-node generate-api.ts <routeName>");
    process.exit(1);
}

// Convert routeName to different cases
const pascalCase = routeName.charAt(0).toUpperCase() + routeName.slice(1).toLowerCase();
const camelCase = routeName.charAt(0).toLowerCase() + routeName.slice(1).toLowerCase();
const kebabCase = routeName.toLowerCase();

// Define directory structure
const baseDir = path.join(process.cwd(), "src");
const dirs = {
    controllers: path.join(baseDir, "controllers"),
    services: path.join(baseDir, "services"),
    repositories: path.join(baseDir, "repositories"),
    routes: path.join(baseDir, "routes"),
    types: path.join(baseDir, "types"),
    models: path.join(baseDir, "models"),
    validators: path.join(baseDir, "validators"),
};

// Create directories if they don't exist
Object.values(dirs).forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// MongoDB model
const modelTemplate = `import mongoose, { Schema } from 'mongoose';

export interface I${pascalCase} {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ${camelCase}Schema = new Schema<I${pascalCase}>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const ${pascalCase} = mongoose.model<I${pascalCase}>('${pascalCase}', ${camelCase}Schema);
`;

// Controller with static methods
const controllerTemplate = `import { Response } from 'express';
import { ${pascalCase}Service } from '../services';
import { I${pascalCase} } from '../models';
import { AuthRequest } from "../middlewares";
import { asyncHandler, sendResponse, ApiError } from '../utils';
import httpStatus from "http-status";

export class ${pascalCase}Controller {
  static getAll = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const ${camelCase}s = await ${pascalCase}Service.getAll(req.query);    
    sendResponse(res, httpStatus.OK, ${camelCase}s, 'All ${pascalCase} documents fetched successfully');
  });

  static getById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const ${camelCase} = await ${pascalCase}Service.getById(id);    
    sendResponse(res, httpStatus.OK, ${camelCase}, '${pascalCase} fetched successfully');
  });

  static create = asyncHandler(async (req: AuthRequest<Partial<I${pascalCase}>>, res: Response): Promise<void> => {
    const createDto: Partial<I${pascalCase}> = req.body;
    const ${camelCase} = await ${pascalCase}Service.create(createDto);
    sendResponse(res, httpStatus.CREATED, ${camelCase}, '${pascalCase} created successfully');
  });

  static update = asyncHandler(async (req: AuthRequest<Partial<I${pascalCase}>>, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateDto: Partial<I${pascalCase}> = req.body;
    const ${camelCase} = await ${pascalCase}Service.update(id, updateDto);    
    sendResponse(res, httpStatus.OK, ${camelCase}, '${pascalCase} updated successfully');
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await ${pascalCase}Service.delete(id);    
    sendResponse(res, httpStatus.OK, deleted, '${pascalCase} deleted successfully');
  });
}
`;

// Service with static methods
const serviceTemplate = `import { ${pascalCase}Repository } from '../repositories';
import { ${pascalCase}, I${pascalCase} } from "../models"
import { PipelineStage } from "mongoose";
import { PaginationQuery, ApiError } from "../utils";
import httpStatus from "http-status";

export class ${pascalCase}Service {
  static async getAll(options: PaginationQuery): Promise<I${pascalCase}[]> {
    const filters: PipelineStage[] = [];
    return await ${pascalCase}Repository.findAll(filters, options);
  }

  static async getById(id: string): Promise<I${pascalCase}> {
    const ${camelCase} = await ${pascalCase}Repository.findById(id);
    if(!${camelCase}){
      throw new ApiError(httpStatus.NOT_FOUND, "${pascalCase} not found")
    }
    return ${camelCase};
  }

  static async create(data: Partial<I${pascalCase}>): Promise<I${pascalCase}> {
    return ${pascalCase}Repository.create(data);
  }

  static async update(id: string, data: Partial<I${pascalCase}>): Promise<I${pascalCase} | null> {
    const ${camelCase} = await ${pascalCase}Repository.update(id, data);
    if(!${camelCase}){
      throw new ApiError(httpStatus.NOT_FOUND, "${pascalCase} not found")
    }
    return ${camelCase};
  }

  static async delete(id: string): Promise<boolean> {
    return ${pascalCase}Repository.delete(id);
  }
}
`;

// Repository with real MongoDB ops
const repositoryTemplate = `import { PipelineStage } from "mongoose";
import {${pascalCase}, I${pascalCase}} from "../models";
import { pagination, PaginationQuery } from "../utils";

export class ${pascalCase}Repository {
  static async findAll(filters: PipelineStage[], options: PaginationQuery): Promise<I${pascalCase}[]> {
    const pipeline: PipelineStage[] = [...filters, ...pagination(options)];
    return ${pascalCase}.aggregate(pipeline);
  }

  static async findById(id: string): Promise<I${pascalCase} | null> {
    return ${pascalCase}.findById(id);
  }

  static async create(data: Partial<I${pascalCase}>): Promise<I${pascalCase}> {
    const newDoc = new ${pascalCase}(data);
    return newDoc.save();
  }

  static async update(id: string, data: Partial<I${pascalCase}>): Promise<I${pascalCase} | null> {
    return ${pascalCase}.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string): Promise<boolean> {
    const result = await ${pascalCase}.findByIdAndDelete(id);
    return result !== null;
  }
}
`;

// Routes
const routeTemplate = `import { Router } from 'express';
import { ${pascalCase}Controller } from '../controllers';
import { validate, firebaseAuth } from "../middlewares";
import { ${pascalCase}Schema } from "../validators";

const router = Router();

router.get('/', firebaseAuth(), validate(${pascalCase}Schema.getAll), ${pascalCase}Controller.getAll);
router.get('/:id', firebaseAuth(), validate(${pascalCase}Schema.getOne), ${pascalCase}Controller.getById);
router.post('/', firebaseAuth(), validate(${pascalCase}Schema.create), ${pascalCase}Controller.create);
router.put('/:id', firebaseAuth(), validate(${pascalCase}Schema.update), ${pascalCase}Controller.update);
router.delete('/:id', firebaseAuth(), validate(${pascalCase}Schema.deleteOne), ${pascalCase}Controller.delete);

export default router;
`;

// Validators
const validatorTemplate = `import Joi from "joi";
import { CustomSchema } from "./custom.validator";

export const ${pascalCase}Schema = {
    create: {
        body: Joi.object().keys({
            name: Joi.string().required(),
        }),
    },
    update: {
        body: Joi.object().keys({
            name: Joi.string().required(),
        }),
    },
    getOne: {
        params: Joi.object().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    deleteOne: {
        params: Joi.object().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    getAll: {
        query: Joi.object().keys({
            ...CustomSchema.dbOptionsSchema,
        }),
    },
};
`;

function updateIndexFile(indexFilePath: string, className: string, fileName: string) {
    // Read existing index.ts
    let content = "";
    if (fs.existsSync(indexFilePath)) {
        content = fs.readFileSync(indexFilePath, "utf8");
    }

    // Create import line
    const importLine = `import { ${className} } from "./${fileName}";`;

    // If not already imported, add it
    if (!content.includes(importLine)) {
        content = importLine + "\n" + content;
    }

    // Ensure it's in the export block
    const exportRegex = /export\s*{\s*([^}]*)}/s;
    if (exportRegex.test(content)) {
        // Already has an export block → inject
        content = content.replace(exportRegex, (match, exports) => {
            if (!exports.includes(className)) {
                return `export { ${exports.trim()}, ${className} }`;
            }
            return match;
        });
    } else {
        // No export block yet → add one
        content += `\nexport { ${className} };`;
    }

    // Write back to file
    fs.writeFileSync(indexFilePath, content, "utf8");
    console.log(`✅ Updated ${indexFilePath} with ${className}`);
}

function updateModelIndexFile(indexFilePath: string, className: string, fileName: string) {
    // Read existing index.ts
    let content = "";
    if (fs.existsSync(indexFilePath)) {
        content = fs.readFileSync(indexFilePath, "utf8");
    }

    // Create import line
    const importLine = `import { ${className}, I${className} } from "./${fileName}";`;

    // If not already imported, add it
    if (!content.includes(importLine)) {
        content = importLine + "\n" + content;
    }

    // Ensure it's in the export block
    const exportRegex = /export\s*{\s*([^}]*)}/s;
    if (exportRegex.test(content)) {
        // Already has an export block → inject
        content = content.replace(exportRegex, (match, exports) => {
            if (!exports.includes(className)) {
                return `export { ${exports.trim()} ${className}, I${className} }`;
            }
            return match;
        });
    } else {
        // No export block yet → add one
        content += `\nexport { ${className}, I${className} };`;
    }

    // Write back to file
    fs.writeFileSync(indexFilePath, content, "utf8");
    console.log(`✅ Updated ${indexFilePath} with ${className}`);
}

// File paths
const files = {
    types: path.join(dirs.types, `${kebabCase}.types.ts`),
    model: path.join(dirs.models, `${kebabCase}.model.ts`),
    controller: path.join(dirs.controllers, `${kebabCase}.controller.ts`),
    service: path.join(dirs.services, `${kebabCase}.service.ts`),
    repository: path.join(dirs.repositories, `${kebabCase}.repository.ts`),
    route: path.join(dirs.routes, `${kebabCase}.routes.ts`),
    validator: path.join(dirs.validators, `${kebabCase}.validator.ts`),
};

// Check if files already exist
const existingFiles = Object.entries(files).filter(([, filePath]) => fs.existsSync(filePath));

if (existingFiles.length > 0) {
    console.log("⚠️  The following files already exist:");
    existingFiles.forEach(([type, filePath]) =>
        console.log(`   - ${path.relative(process.cwd(), filePath)}`)
    );
    process.exit(1);
}

// Create files
try {
    fs.writeFileSync(files.model, modelTemplate);
    updateModelIndexFile(path.join(dirs.models, "index.ts"), `${pascalCase}`, `${kebabCase}.model`);

    fs.writeFileSync(files.controller, controllerTemplate);
    updateIndexFile(
        path.join(dirs.controllers, "index.ts"),
        `${pascalCase}Controller`,
        `${kebabCase}.controller`
    );

    fs.writeFileSync(files.service, serviceTemplate);
    updateIndexFile(
        path.join(dirs.services, "index.ts"),
        `${pascalCase}Service`,
        `${kebabCase}.service`
    );

    fs.writeFileSync(files.repository, repositoryTemplate);
    updateIndexFile(
        path.join(dirs.repositories, "index.ts"),
        `${pascalCase}Repository`,
        `${kebabCase}.repository`
    );

    fs.writeFileSync(files.route, routeTemplate);

    fs.writeFileSync(files.validator, validatorTemplate);
    updateIndexFile(
        path.join(dirs.validators, "index.ts"),
        `${pascalCase}Schema`,
        `${kebabCase}.validator`
    );

    console.log(`🔵 Successfully generated TypeScript API files for '${routeName}':\n`);
    Object.values(files).forEach((file) => console.log(`📁 ${path.relative(process.cwd(), file)}`));
} catch (error) {
    console.error(
        "🔴 Error creating files:",
        error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
}
