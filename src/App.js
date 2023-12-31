import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { useState } from "react";
import Navbar from "./components/core/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import OpenRoute from "./components/core/Auth/OpenRoute";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Error from "./pages/Error";
import Settings from "./components/core/Dashboard/Settings";


function App() {
   // delete after replacing this code 
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  
  return(
 <div className="w-screen min-h-screen h-fit  bg-richblack-900 flex flex-col">
 <Navbar isLoggedIn={isLoggedIn}  setIsLoggedIn ={setIsLoggedIn}  />

<Routes>

<Route path="/" element = {<Home/>} />
<Route path="/login" 
element = {
    <OpenRoute>
        <Login setIsLoggedIn={setIsLoggedIn}/>
    </OpenRoute>  } />

<Route path="/signup" 
element = {
   <OpenRoute>
          <Signup setIsLoggedIn={setIsLoggedIn}/>
   </OpenRoute>
} />



<Route path="/forgot-password"
 element = {
     <OpenRoute>
           <ForgotPassword/>
     </OpenRoute>
 } />

<Route path="/update-password/:id"
 element = {
     <OpenRoute>
           <UpdatePassword/>
     </OpenRoute>
 } />
 
<Route path="/verify-email"
 element = {
     <OpenRoute>
         <VerifyEmail/>
     </OpenRoute>
 } />


<Route path="/about"
 element = {
     <OpenRoute>
        <AboutUs/>
     </OpenRoute>
 } />

<Route path="/contact"
 element = {
     <OpenRoute>
        <ContactUs/>
     </OpenRoute>
 } />


<Route path="/dashboard" element = {
   <PrivateRoute >
      <Dashboard/>
   </PrivateRoute>
} >

<Route path="/dashboard/my-profile" element={<MyProfile/>} />
<Route path="/dashboard/settings" element = {<Settings/>} /> 
</Route>




<Route path="*" element={<Error/>} />
</Routes>

 </div>
   
  )
}

export default App;
