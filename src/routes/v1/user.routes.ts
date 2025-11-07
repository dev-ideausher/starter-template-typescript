import { userTypes } from "@config";
import { UserController } from "@controllers";
import {
    firebaseAuth,
    upload,
    validate
} from "@middlewares";
import { UserSchema } from "@validators";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /v1/users/username-available/{username}:
 *   get:
 *     summary: Check if username is available
 *     tags: [Users]
 *     description: |
 *       Checks if a username is available for registration.
 *       Returns whether the username is available or already taken.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: '^[a-zA-Z0-9_]+$'
 *         description: Username to check (3-30 characters, alphanumeric and underscores only)
 *         example: johndoe
 *     responses:
 *       200:
 *         description: Username availability checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         available:
 *                           type: boolean
 *                           example: true
 *                           description: true if username is available, false if already taken
 *       400:
 *         description: Bad request (invalid username format)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    "/username-available/:username",
    validate(UserSchema.checkUsername),
    UserController.checkUsername
);

/**
 * @swagger
 * /v1/users/updateDetails:
 *   patch:
 *     summary: Update user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Updates the authenticated user's profile information.
 *       Can update name, username, and/or avatar.
 *       At least one field must be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John Doe
 *                 description: User's display name (optional)
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 example: johndoe
 *                 description: New username (optional, must be unique)
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (optional)
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *       400:
 *         description: Bad request (validation error or invalid data)
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
 *       409:
 *         description: Conflict (username already taken)
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
router.patch(
    "/updateDetails",
    firebaseAuth(userTypes.ALL),
    upload.single("avatar"),
    validate(UserSchema.editProfile),
    UserController.updateUser
);

export default router;
