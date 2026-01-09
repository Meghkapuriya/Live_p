import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
} from "./reducer";

import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export const registerUser = (formData: FormData) => async (dispatch: any) => {
  try {
    const response = await api.create("/api/register", formData, {});

    dispatch(registerUserSuccessful(response));
  } catch (error: any) {
    dispatch(registerUserFailed(error.response?.data || error));
  }
};

export const resetRegisterFlag = () => {
  return resetRegisterFlagChange();
};
