import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { firebaseAdminAuth, firebaseAdmin } from "@config";
import { AuthService } from "@services";
import { ApiError } from "@utils";
import { ParsedQs } from "qs";
import { IUser, IClient, IAdmin } from "@models";
import { Inject, Service, Container } from "typedi";

export interface AuthRequest<
  T = any,
  U extends ParsedQs = ParsedQs,
> extends Request {
  user?: IUser | IClient | IAdmin;
  newUser?: firebaseAdmin.auth.DecodedIdToken;
  routeType?: string;
  body: T;
  query: U;
}

export interface CustomRequest<
  T = any,
  U extends ParsedQs = ParsedQs,
> extends Request {
  user?: IUser | IClient | IAdmin;
  newUser?: firebaseAdmin.auth.DecodedIdToken;
  routeType?: string;
  body: T;
  query: U;
}
@Service()
class FirebaseAuthMiddleware {
  // We inject the services via the constructor
  constructor(
    @Inject() private authService: AuthService,
    private fbAuth: any,
  ) {}

  /**
   * This mimics your original function signature.
   * It returns the actual middleware handler.
   */
  public middleware = (allowUserType: string = "All") => {
    return async (
      req: CustomRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Please Authenticate!");
        }

        // Verify Firebase Token
        const payload = await this.fbAuth.verifyIdToken(token, true);

        // Fetch user from your DB service
        const user = await this.authService.getUserByFirebaseUid(payload.uid);

        if (!user) {
          this.handleNewUser(req, payload, allowUserType);
        } else {
          this.validateExistingUser(user, allowUserType);
          req.user = user;
        }

        next();
      } catch (err: any) {
        this.handleError(err, next);
      }
    };
  };

  private handleNewUser(
    req: CustomRequest,
    payload: any,
    allowUserType: string,
  ) {
    const isRegisterRoute =
      ["/register"].includes(req.path) || req.path.includes("secret-register");

    if (isRegisterRoute) {
      req.newUser = payload;
      req.routeType = allowUserType;
    } else {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User doesn't exist. Please create account",
      );
    }
  }

  private validateExistingUser(user: any, allowUserType: string) {
    const isAllowedType =
      allowUserType === "All" || allowUserType.split(",").includes(user.__t);

    if (!isAllowedType) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Sorry, but you can't access this",
      );
    }

    if (user.__t === "Client") {
      if (user.isBlocked)
        throw new ApiError(httpStatus.FORBIDDEN, "User is blocked");
      if (user.isDeleted)
        throw new ApiError(httpStatus.GONE, "User doesn't exist anymore");
    }
  }

  private handleError(err: any, next: NextFunction) {
    if (err.code === "auth/id-token-expired") {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Session is expired"));
    }
    console.error("FirebaseAuthError:", err);
    next(new ApiError(httpStatus.UNAUTHORIZED, "Failed to authenticate"));
  }
}

// Instantiate the class with its dependencies
const authMiddlewareInstance = new FirebaseAuthMiddleware(
  Container.get(AuthService),
  firebaseAdminAuth,
);

// Export the method as 'firebaseAuth' so the router remains unchanged
export const firebaseAuth = authMiddlewareInstance.middleware;
