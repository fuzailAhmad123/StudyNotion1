
import { apiConnector } from "../apiconnector";
import toast from "react-hot-toast";
import {settingsEndpoints} from "../apis"
import {setLoading} from "../../slices/profileSlice"

const  {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
} = settingsEndpoints;

