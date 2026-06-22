import axios, { AxiosError, AxiosResponse } from "axios";

const sendOTP = async (data: string): Promise<AxiosResponse<any> | null> => {
  try {
    const sendOtp = await axios.get(`/api/mfa/${data}`);
    return sendOtp;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      console.log("Error response:", error.response.data);
      return error.response;
    } else if (error.request) {
      console.log("Error request:", error.request);
    } else {
      console.log("Error message:", error.message);
    }
    return null;
  }
};

const verifyOTP = async (email: string, data: string) => {
  try {
    const login = await axios.post(`/api/mfa/${email}`, { otp: data }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return login;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      console.log("Error response:", error.response.data);
      return error.response;
    } else if (error.request) {
      console.log("Error request:", error.request);
    } else {
      console.log("Error message:", error.message);
    }
    return null;
  }
};

export { sendOTP, verifyOTP };
