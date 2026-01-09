import { APIClient } from "../../../helpers/api_helper";
import { userForgetPasswordError, userForgetPasswordSuccess } from "./reducer";

const api = new APIClient();

export const userForgetPassword =
  (user: any) => async (dispatch: any) => {
    try {
      await api.create("/api/forgot-password", {
        email: user.email,
      });

      dispatch(
        userForgetPasswordSuccess(
          "Reset link sent to your email address"
        )
      );
    } catch (error: any) {
      dispatch(
        userForgetPasswordError(
          error?.message || "Failed to send reset link"
        )
      );
    }
  };
