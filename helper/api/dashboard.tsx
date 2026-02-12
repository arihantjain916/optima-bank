import axios, { AxiosError } from "axios";
import { updateProfileType } from "@/types/userType";
import { FundTransfer } from "@/types/fundTransfer";

const DashboardApi = async (data: any) => {
  try {
    const dashboard = await axios.get(`/api/dashboard/${data}`);
    return dashboard;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      
      return error.response;
    } else if (error.request) {
      console.log("Error request:", error.request);
    } else {
      console.log("Error message:", error.message);
    }
    return null;
  }
};

const TransactionApi = async (data: any) => {
  try {
    const transaction = await axios.get(`/api/transaction/${data}`);
    return transaction;
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

// Update Profile

const updateProfile = async (email: string, data: updateProfileType) => {
  console.log(data);
  try {
    const profile = await axios.put(`/api/dashboard/${email}`, data);

    return profile;
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

// update password

const updatePassword = async (
  email: string,
  password: { old: string; new: string },
) => {
  try {
    const profile = await axios.patch(`/api/dashboard/${email}`, password, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return profile;
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

const transferFund = async (data: FundTransfer) => {
  try {
    const fund = await axios.post(`/api/transfer`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return fund;
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

const getCardInfo = async () => {
  try {
    const card = await axios.get(`/api/card`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return card;
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

const getCardnumber = async (id: string) => {
  try {
    const card = await axios.get(`/api/card/${id}/reveal/number`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return card;
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

const getCardCVV = async (id: string) => {
  try {
    const card = await axios.get(`/api/card/${id}/reveal/cvv`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return card;
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
export {
  DashboardApi,
  TransactionApi,
  updateProfile,
  updatePassword,
  transferFund,
  getCardInfo,
  getCardnumber,
  getCardCVV,
};
