import { profileSuccess, profileError } from "./reducer";
import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export const editProfile = (formData: FormData) => async (dispatch: any) => {
  try {
    const response: any = await api.create(
      "/api/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ UPDATE SESSION STORAGE (CRITICAL)
    const stored = sessionStorage.getItem("authUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      sessionStorage.setItem(
        "authUser",
        JSON.stringify({
          ...parsed,
          user: response.admin,
        })
      );
    }

    dispatch(profileSuccess(response));
  } catch (error: any) {
    dispatch(
      profileError(
        error?.response?.data?.message ||
          error?.message ||
          "Profile update failed"
      )
    );
  }
};

export const resetProfileFlag = () => (dispatch: any) => {
  dispatch({ type: "Profile/resetProfileFlagChange" });
};
