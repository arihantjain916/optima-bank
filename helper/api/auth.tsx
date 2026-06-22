import axios, { AxiosError } from "axios";
import { LoginUserType, RegisterUserType } from "@/types/userType";

const RegisterApi = async (data: RegisterUserType) => {
  try {
    const register = await axios.post("/api/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return register;
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

const LoginApi = async (data: LoginUserType) => {
  try {
    const login = await axios.post("/api/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return login;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
    return error.response ?? null;
  }
};

const Logout = async () => {
  try {
    const logout = await axios.post("/api/auth/logout");
    return logout;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
};

export { RegisterApi, LoginApi, Logout };
