import type { Context } from "hono";
import userServiceAuth from "../services/authService";
import { ErrorResponse, SuccessResponse } from "../utils/responseCodes";
import { StatusCodes } from "../Data/Enums/StatusCodes";

class AuthController {
  
  async GetUser(c: Context, token: string) {
    try {
      const result = await userServiceAuth.GetUser(token);

      if (!token) {
        return ErrorResponse(c, "Missing user token", {
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }
      if (!result.success) {
        return ErrorResponse(c, "Failed to Retrieve User", {
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      return SuccessResponse( c, result.data, {message: "user retrieved" });
    } catch (error: any) {
      return ErrorResponse(c, "Something went wrong", {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async GetProfile(c: Context) {
    try {
      const token = c.get("token") as string;
      const result = await userServiceAuth.GetProfile(token);
      if (result.success === false) {
        return ErrorResponse(c, "Invalid request", {
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }else{
        return SuccessResponse( c, result.data, {message: "user profile retrieved" });
      }
     
    } catch (error: any) {
      return ErrorResponse(c, "Something went wrong", {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
  
}

export default new AuthController();
