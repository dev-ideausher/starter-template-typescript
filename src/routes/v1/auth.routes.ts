import { Router } from "express";

import { AuthController } from "@controllers";
import {
    // firebaseAuth,
    upload, validate
} from "@middlewares";
import { AuthSchema } from "@validators";

const router = Router();

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new client user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 example: johndoe
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (optional)
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Client'
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict (user already exists or username taken)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized (invalid or missing Firebase token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/register",
    // firebaseAuth(userTypes.CLIENT),
    upload.single("avatar"),
    validate(AuthSchema.register),
    AuthController.register
);

/**
 * @swagger
 * /v1/auth/admin-secret-register:
 *   post:
 *     summary: Register a new admin user (secret endpoint)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict (user already exists or username taken)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized (invalid or missing Firebase token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/admin-secret-register",
    // firebaseAuth(userTypes.ADMIN),
    validate(AuthSchema.register),
    AuthController.register
);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Logs in an existing user (Client or Admin).
 *       The user must already exist in the database and have a valid Firebase token.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/Client'
 *                         - $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized (invalid or expired Firebase token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found (user doesn't exist in database)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (user is blocked or deleted)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", 
    // firebaseAuth(userTypes.ALL),
     AuthController.login);

export default router;
