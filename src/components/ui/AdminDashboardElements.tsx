import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import { 
  FaTachometerAlt,
  FaLayerGroup,
  FaQuestionCircle,
  FaBlog,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useThemeStore } from "../../Store/TeamToggle"; // Import theme store for dark/light mode
import { useEffect, useState } from "react"; // Import React hooks
import {useAuthStore} from "../../Store/authStore.ts" // Import auth store for user data and actions
import toast from "react-hot-toast"; // Import toast notifications

const AdminDashboardElements = () => {

  const { isDark } = useThemeStore(); // Get current theme state
  const {user,updateProfile,logout} = useAuthStore() // Get user and auth functions

  const [editShow, setEditShow] = useState(false) // State to show/hide password modal
  const [showPassword,setSowPassword] = useState(false) // State for password visibility
  const [userName,setUserName] = useState<string>(); // State for username input
  const [form, setForm] = useState({ // State for password form inputs
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if(user?.username){ // Set username when user data changes
      setUserName(user.username)
    }
  },[user?.username])

  const change = () => { // Toggle password visibility
    setSowPassword(!showPassword)
  }

  const handleChange =  ( // Handle form input changes
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearAll = () => { // Reset modal form and close
    setEditShow(false)
    setForm({currentPassword: "", newPassword: "" });
    setSowPassword(false)
  }

  const handleOpen = async () => { // Open password modal
    setEditShow(true)
  };

  const UpdateAdminPassword = async () => { // Handle password update
    if (!userName || !form.currentPassword || !form.newPassword) {
      toast.error("All fields are required"); // Show error if fields empty
      return;
    }

    try{
      await updateProfile({username: userName?.trim() ?? "",
                            currentPassword: form.currentPassword,
                            newPassword: form.newPassword}) // Call updateProfile
      setForm({currentPassword: "", newPassword: "" });} // Clear form
    catch(error){
      console.log(error) // Log errors
    }
    finally{
      setEditShow(false) // Close modal
    }
  }

  const AdminLogout = async () => { // Handle admin logout
    await logout()
    window.location.reload() // Reload page after logout
  }

  return (

      <div className={`container ${isDark ? "HeaderToggle" : ""}`} style={{marginTop : "7rem"}}>
        {/* Header section */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between  shadow-sm p-4 rounded mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex justify-content-center align-items-center  rounded-circle" style={{ width: "50px", height: "50px" }}>
              <FaShieldAlt className="text-dark fs-3" /> {/* Dashboard icon */}
            </div>
            <div>
              <h1 className="h5 fw-bold mb-1 ">Admin Dashboard</h1>
              <p className="text-muted small mb-0">Manage your educational platform</p>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 mt-3 mt-md-0" style={{ fontSize: "0.85rem", fontWeight: "600" }} 
              onClick={() => handleOpen()}>
              Change Password {/* Open password modal */}
            </button>

            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 mt-3 mt-md-0" style={{ fontSize: "0.85rem", fontWeight: "600" }} 
              onClick={() => AdminLogout()}>
              <FaSignOutAlt /> {/* Logout icon */}
              Logout
            </button>
          </div>
        </div>


      {/* Navigation menu */}
      <nav className={` bg-white shadow-sm rounded p-3 ${isDark ? "HeaderToggle" : ""}`} >
        <ul className="adminColLink nav flex-column flex-lg-row gap-2 gap-lg-3">
          <li className={` nav-item flex-fill text-center `}>
            <NavLink to="/admin" end className={({ isActive }) =>
              `adminColorLink nav-link fw-semibold py-2 px-3 rounded  ${isActive ? "bg-success text-white" : "text-dark"}`
            }>
              <FaTachometerAlt className="me-1 " /> Overview {/* Nav link for Overview */}
            </NavLink>
          </li>
          <li className="nav-item flex-fill text-center">
            <NavLink to="/admin/chapters" className={({ isActive }) =>
              `adminColorLink nav-link fw-semibold py-2 px-3 rounded ${isActive ? "bg-success text-white" : "text-dark"}`
            }>
              <FaLayerGroup className="me-1" /> Chapters {/* Nav link for Chapters */}
            </NavLink>
          </li>
          <li className="nav-item flex-fill text-center">
            <NavLink to="/admin/question" className={({ isActive }) =>
              `adminColorLink nav-link fw-semibold py-2 px-3 rounded ${isActive ? "bg-success text-white" : "text-dark"}`
            }>
              <FaQuestionCircle className="me-1" /> Questions {/* Nav link for Questions */}
            </NavLink>
          </li>
          <li className="nav-item flex-fill text-center">
            <NavLink to="/admin/blogpost" className={({ isActive }) =>
              `adminColorLink nav-link fw-semibold py-2 px-3 rounded ${isActive ? "bg-success text-white" : "text-dark"}`
            }>
              <FaBlog className="me-1" /> Blog Posts {/* Nav link for Blog Posts */}
            </NavLink>
          </li>
        </ul>
      </nav>

      {editShow && ( // Show password update modal
        <>
          <div className="modal show fade d-block d-flex justify-content-center align-items-center p-5" tabIndex={-1} role="dialog" style={{maxWidth:"120rem"}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0 ">
                <div>
                  <h4 className="fw-bold mb-0 text-dark">Update Password</h4>
                  <small className="text-muted">Change New Password</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={clearAll} // Close modal and reset form
                ></button>
              </div>

              <form   onSubmit={(e) => {
                        e.preventDefault(); 
                        UpdateAdminPassword(); // Submit password update
                      }}>
                <div className="modal-body pt-2">
                <div className="mb-3">
                    <label className="form-label text-dark">User Name</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter UserName"
                      value={userName}
                      readOnly // Username is not editable
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Current Password</label>
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" :  "password"} // Toggle visibility
                        name="currentPassword"
                        className="form-control rounded-pill bg-light text-dark"
                        placeholder="Enter Current Password"
                        value={form.currentPassword}
                        onChange={handleChange} // Handle input change
                      />
                      {showPassword ? <span onClick={change} style={{cursor:"pointer"}}><i className={`fa-solid fa-eye`} style={{color:"black"}}></i></span> : <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye-slash" style={{color:"black"}}></i></span>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">New Password</label>
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" :  "password"} // Toggle visibility
                        name="newPassword"
                        className="form-control rounded-pill bg-light text-dark"
                        placeholder="Enter New Password"
                        value={form.newPassword}
                        onChange={handleChange} // Handle input change
                      />
                      {showPassword ? <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye" style={{color:"black"}}></i></span> : <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye-slash" style={{color:"black"}}></i></span>}
                    </div>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                    onClick={UpdateAdminPassword} // Redundant, handled in form submit
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>

      </>
      )} 

    </div>
  );
};

export default AdminDashboardElements; // Export component
