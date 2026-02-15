import Login from "./components/Login"
import Signup from "./components/Signup"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import VendorDashboard from "./pages/Vendor/VendorDashboard"
import MyAssignments from "./pages/Vendor/MyAssignments"
import AssignmentDetails from "./pages/Vendor/AssignmentDetails"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

const App = () => {
  return (
  <>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/vendor" element={<VendorDashboard/>}/>
        <Route path="/vendor/assignments" element={<MyAssignments/>}/>
        <Route path="/vendor/assignments/:id" element={<AssignmentDetails/>}/>
      </Routes>
  </BrowserRouter>
     </>
  )
}

export default App