import * as fs from "fs";
import * as path from "path";

// Get command line arguments
const args = process.argv.slice(2);
const routeName = args[0];
const force = args.includes("force");

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

// Types
const typesTemplate = `export interface I${pascalCase} {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Create${pascalCase}Dto {
  name: string;
}

export interface Update${pascalCase}Dto {
  name?: string;
}

export interface ${pascalCase}QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: keyof I${pascalCase};
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
`;

// MongoDB model
const modelTemplate = `import mongoose, { Schema, Document } from 'mongoose';
import { I${pascalCase} } from '../types/${kebabCase}.types';


const ${camelCase}Schema = new Schema<I${pascalCase}>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const ${pascalCase}Model = mongoose.model<I${pascalCase}>('${pascalCase}', ${camelCase}Schema);
`;

// Controller with static methods
const controllerTemplate = `import { Request, Response } from 'express';
import { ${pascalCase}Service } from '../services/${kebabCase}.service';
import { Create${pascalCase}Dto, Update${pascalCase}Dto, I${pascalCase} } from '../types/${kebabCase}.types';
import { asyncHandler, ApiResponse, ApiError } from '../utils';

export class ${pascalCase}Controller {
  static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const items = await ${pascalCase}Service.getAll();    
    res.status(200).json(new ApiResponse(200, items, 'All ${pascalCase} documents fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const item = await ${pascalCase}Service.getById(id);
    if (!item) throw new ApiError(404, '${pascalCase} not found');
    res.status(200).json(new ApiResponse(200, item, '${pascalCase} fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createDto: Create${pascalCase}Dto = req.body;
    const item = await ${pascalCase}Service.create(createDto);
    res.status(201).json(new ApiResponse(201, item, '${pascalCase} created successfully'));
  });

  static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateDto: Update${pascalCase}Dto = req.body;
    const item = await ${pascalCase}Service.update(id, updateDto);
    if (!item) throw new ApiError(404, '${pascalCase} not found');
    res.status(200).json(new ApiResponse(200, item, '${pascalCase} updated successfully'));
  });

  static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await ${pascalCase}Service.delete(id);
    if (!deleted) throw new ApiError(404, '${pascalCase} not found');
    res.status(200).json(new ApiResponse(200, {}, '${pascalCase} deleted successfully'));
  });
}
`;

// Service with static methods
const serviceTemplate = `import { ${pascalCase}Repository } from '../repositories/${kebabCase}.repository';
import { I${pascalCase}, Create${pascalCase}Dto, Update${pascalCase}Dto, ${pascalCase}QueryOptions } from '../types/${kebabCase}.types';

export class ${pascalCase}Service {
  static async getAll(options?: ${pascalCase}QueryOptions): Promise<I${pascalCase}[]> {
    return await ${pascalCase}Repository.findAll(options);
  }

  static async getById(id: string): Promise<I${pascalCase} | null> {
    return await ${pascalCase}Repository.findById(id);
  }

  static async create(data: Create${pascalCase}Dto): Promise<I${pascalCase}> {
    return await ${pascalCase}Repository.create(data);
  }

  static async update(id: string, data: Update${pascalCase}Dto): Promise<I${pascalCase} | null> {
    return await ${pascalCase}Repository.update(id, data);
  }

  static async delete(id: string): Promise<boolean> {
    return await ${pascalCase}Repository.delete(id);
  }
}
`;

// Repository with real MongoDB ops
const repositoryTemplate = `import { ${pascalCase}Model } from '../models/${kebabCase}.model';
import { I${pascalCase}, Create${pascalCase}Dto, Update${pascalCase}Dto, ${pascalCase}QueryOptions } from '../types/${kebabCase}.types';

export class ${pascalCase}Repository {
  static async findAll(options?: ${pascalCase}QueryOptions): Promise<I${pascalCase}[]> {
    const query = ${pascalCase}Model.find();
    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.skip(options.offset);
    if (options?.sortBy && options?.sortOrder) query.sort({ [options.sortBy]: options.sortOrder });
    return await query.exec();
  }

  static async findById(id: string): Promise<I${pascalCase} | null> {
    return await ${pascalCase}Model.findById(id).exec();
  }

  static async create(data: Create${pascalCase}Dto): Promise<I${pascalCase}> {
    const newDoc = new ${pascalCase}Model(data);
    return await newDoc.save();
  }

  static async update(id: string, data: Update${pascalCase}Dto): Promise<I${pascalCase} | null> {
    return await ${pascalCase}Model.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }).exec();
  }

  static async delete(id: string): Promise<boolean> {
    const result = await ${pascalCase}Model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
`;

// Routes
const routeTemplate = `import { Router } from 'express';
import { ${pascalCase}Controller } from '../controllers/${kebabCase}.controller';
import { validate } from "../middlewares";
import { ${pascalCase}Schema } from "../validators/${kebabCase}.validator";

const router = Router();

router.get('/', validate(${pascalCase}Schema.getAll), ${pascalCase}Controller.getAll);
router.get('/:id', validate(${pascalCase}Schema.getOne), ${pascalCase}Controller.getById);
router.post('/', validate(${pascalCase}Schema.create), ${pascalCase}Controller.create);
router.put('/:id', validate(${pascalCase}Schema.update), ${pascalCase}Controller.update);
router.delete('/:id', validate(${pascalCase}Schema.deleteOne), ${pascalCase}Controller.delete);

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
}

// Create files
try {
    fs.writeFileSync(files.types, typesTemplate);
    fs.writeFileSync(files.model, modelTemplate);
    fs.writeFileSync(files.controller, controllerTemplate);
    fs.writeFileSync(files.service, serviceTemplate);
    fs.writeFileSync(files.repository, repositoryTemplate);
    fs.writeFileSync(files.route, routeTemplate);
    fs.writeFileSync(files.validator, validatorTemplate);

    console.log(`🔵 Successfully generated TypeScript API files for '${routeName}':\n`);
    Object.values(files).forEach((file) => console.log(`📁 ${path.relative(process.cwd(), file)}`));
} catch (error) {
    console.error(
        "🔴 Error creating files:",
        error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
}
