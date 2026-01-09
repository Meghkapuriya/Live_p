import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";
import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

/* =========================
   LOGIN
========================= */
export const loginUser = (values: any) => async (dispatch: any) => {
  try {
    const response: any = await api.create("/api/login", values);

    /*
      BACKEND RESPONSES
      -----------------
      OTP:
      { status: "success", step: "otp_required" }

      SUCCESS:
      { token, admin }
    */

    // 🔐 OTP REQUIRED
    if (response?.step === "otp_required") {
      // OTP page ke liye email store
      sessionStorage.setItem("otp_email", values.email);

      // ❗ loginSuccess dispatch MAT karo
      return { step: "otp_required" };
    }

    // ✅ NORMAL LOGIN
    const token = response?.token || response?.accessToken;
    const user = response?.admin || response?.user;

    if (!token) {
      dispatch(apiError("Login API did not return token"));
      return { error: true };
    }

    sessionStorage.setItem(
      "authUser",
      JSON.stringify({ token, user })
    );

    dispatch(loginSuccess({ token, user }));
    return { step: "logged_in" };

  } catch (err: any) {
    dispatch(apiError(err || "Login failed"));
    return { error: true };
  }
};

/* =========================
   LOGOUT
========================= */
export const logoutUser = () => async (dispatch: any) => {
  try {
    await api.create("/api/logout");
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("otp_email");
    dispatch(logoutUserSuccess());
  } catch {
    dispatch(apiError("Logout failed"));
  }
};

/* =========================
   RESET LOGIN FLAG
========================= */
export const resetLoginFlag = () => (dispatch: any) => {
  dispatch(reset_login_flag());
};
