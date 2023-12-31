import React from "react";
import {combineReducers} from "@reduxjs/toolkit"
import profileReducer from "../slices/profileSlice";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice"

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
})

export default rootReducer