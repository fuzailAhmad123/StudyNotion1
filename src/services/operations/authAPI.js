import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import toast from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sentOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("PRINTING SENDOTP RESPONSE");

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent ");
      navigate("/verify-email");
    } catch (e) {
      console.log("SENDOTP API ERROR............", e);
      toast.error("Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      console.log(otp);
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("PRINTING SIGNUP RESPONSE : ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Singup Successfully");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successfull");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
      ? response.data.user.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
     dispatch(setUser({ ...response.data.user, image: userImage }))
    localStorage.setItem("token", JSON.stringify(response.data.token))
    localStorage.setItem("user", JSON.stringify(response.data.user))
    navigate("/dashboard/my-profile")
    } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  };
}

export function getPasswordResetToken(email, setSentEmail) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        RESETPASSTOKEN_API,
        { email }
      );

      console.log("RESET PASSWORD TOKEN RESPONSE :", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(" Reset Email sent ");
      setSentEmail(true);
    } catch (error) {
      console.log("REST PASSWORD TOKEN ERROR", error);
      toast.error("Failed to sent email for reseting password");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token , navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      console.log(password, confirmPassword);
      const response = await apiConnector(
        "POST",
        RESETPASSWORD_API,
        { password, confirmPassword, token }
      );

      console.log("reset password response : ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(" Password Changed Successfully ");
      navigate("/login")
    } catch (e) {
      console.log("REST PASSWORD TOKEN ERROR", e);
      toast.error("Failed to change Password");
    }
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }
