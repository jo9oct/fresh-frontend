
import React, { useEffect, useState } from "react"
import  OverView  from "../components/ui/OverView.tsx";
import AddCourses from "../components/AddCourses.tsx";
import Analytics from "../components/Analytics.tsx";
import Permission from "../components/Permission.tsx";
import {useThemeStore} from "../Store/TeamToggle"
import toast from "react-hot-toast";
import {useAuthStore} from "../Store/authStore.ts"

const SuperAdmin: React.FC = () => {

  const { logout, user, updateProfile } = useAuthStore();

  // Logout handler for Super Admin
  const SuperLogout = () => {
    logout(); // call logout from auth store
  };
  
  console.log("super", user); // debug: log current user
  
  const [editShow, setEditShow] = useState(false); // toggle for edit password modal
  const [showPassword, setSowPassword] = useState(false); // toggle to show/hide password
  const [userName, setUserName] = useState<string>(); // store current username
  const [form, setForm] = useState({
    currentPassword: "", // field for current password
    newPassword: "", // field for new password
  });
  
  // populate username when user data is available
  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
    }
  });
  
  // toggle password visibility
  const change = () => {
    setSowPassword(!showPassword);
  };
  
  // update form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // reset form and close modal
  const clearAll = () => {
    setEditShow(false);
    setForm({ currentPassword: "", newPassword: "" });
    setSowPassword(false);
  };
  
  // open edit password modal
  const handleOpen = async () => {
    setEditShow(true);
  };
  
  // update Super Admin password
  const UpdateSuperAdminPassword = async () => {
    if (!userName || !form.currentPassword || !form.newPassword) {
      toast.error("All fields are required"); // validation
      return;
    }
  
    try {
      await updateProfile({
        username: userName?.trim() ?? "",
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "" }); // reset form
    } catch (error) {
      console.log(error); // log any errors
    } finally {
      setEditShow(false); // close modal after update
    }
  };
  
  // dynamic class for tabs based on selected tab
  const getTabClass = (tab: string) =>
    `flex-fill text-center py-2 fw-bold border-end ${
      click === tab ? "btn btn-success text-white" : "btn btn-light"
    }`;
  
  const { isDark } = useThemeStore(); // theme store for dark mode
  const [click, setClick] = useState<String>(); // track active tab
  

    return (
      <>
        <div className={`container py-4 ${isDark ? "HeaderToggle" : ""}`} style={{marginTop:"7rem"}}>

          <div className={`d-flex flex-wrap align-items-center justify-content-between shadow-sm p-3 mb-4 bg-white rounded ${isDark ? "HeaderToggle" : ""}`} >
                <div className={`d-flex align-items-center`}>
                    <img
                        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7JUoFWZxxc/pbsotss7_expires_30_days.png"
                        alt="Admin"
                        className={`rounded me-3 `}
                        style={{ width: 64, height: 64 }}
                    />
                <div>
                    <h3 className="mb-1 fw-bold " >Super Admin Dashboard</h3>
                    <p className="mb-0 text-muted">Manage your Admin</p>
                </div>
                </div>
                <div className="d-flex gap-3">
                  <button
                      className={`btn btn-outline-dark d-flex align-items-center gap-2  ${isDark ? "HeaderToggle" : ""}`}
                      onClick={() => handleOpen()}
                      >
                      <i className="fa-solid fa-pen-nib"></i>
                      <strong>Change Password</strong>
                  </button>
                  <button
                      className={`btn btn-outline-dark d-flex align-items-center gap-2  ${isDark ? "HeaderToggle" : ""}`}
                      onClick={() => SuperLogout()}
                      >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <strong>Logout</strong>
                  </button>
                </div>
          </div>

          <div className={`d-flex flex-wrap my-5 shadow-sm rounded overflow-hidden bg-white ${isDark ? "HeaderToggle" : ""}`} style={{color: "black"}}>
            <div className={`flex-fill text-center py-2 fw-bold border-start border-end ${getTabClass("Overview")} ${isDark ? "HeaderToggle" : ""}`} style={{cursor:"pointer"}} onClick={() => setClick("Overview")}>Overview</div>
            <div className={`flex-fill text-center py-2 fw-bold border-start border-end ${getTabClass("Courses")} ${isDark ? "HeaderToggle" : ""}`} style={{cursor:"pointer"}} onClick={() => setClick("Courses")}>Courses</div>
            <div className={`flex-fill text-center py-2 fw-bold border-start border-end ${getTabClass("Permission")} ${isDark ? "HeaderToggle" : ""}`} style={{cursor:"pointer"}} onClick={() => setClick("Permission")}>Permission</div>
            <div className={`flex-fill text-center py-2 fw-bold border-end ${getTabClass("Analytics")} ${isDark ? "HeaderToggle" : ""}`} style={{cursor:"pointer"}} onClick={() => setClick("Analytics")}>Analytics</div>
          </div>

            {click === "Overview" && <OverView/>}
            {click === "Courses" && <AddCourses/>}
            {click === "Permission" && <Permission/>}
            {click === "Analytics" && <Analytics/>}
          
        </div>

        {editShow && (
        <>
          <div className="modal show fade d-block d-flex justify-content-center align-items-center p-5" tabIndex={-1} role="dialog" style={{maxWidth:"120rem"}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0 text-dark">Update Password</h4>
                  <small className="text-muted">Change New Password</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={clearAll}
                ></button>
              </div>

              <form onSubmit={(e) => {
                        e.preventDefault(); 
                        UpdateSuperAdminPassword(); 
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
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Current Password</label>
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" :  "password"}
                        name="currentPassword"
                        className="form-control rounded-pill bg-light text-dark"
                        placeholder="Enter Current Password"
                        value={form.currentPassword}
                        onChange={handleChange}
                      />
                      {showPassword ? <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye"></i></span> : <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye-slash"></i></span>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">New Password</label>
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" :  "password"}
                        name="newPassword"
                        className="form-control rounded-pill bg-light text-dark"
                        placeholder="Enter New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                      />
                      {showPassword ? <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye"></i></span> : <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye-slash"></i></span>}
                    </div>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                    onClick={UpdateSuperAdminPassword}
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

        </>
      );

}

export default SuperAdmin;