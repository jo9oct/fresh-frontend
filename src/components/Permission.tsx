
import React, { useEffect, useState } from "react";
import api from "../lib/axios.tsx"
import toast from "react-hot-toast";
import {FaTrash,FaEdit} from "react-icons/fa";
import Loader1 from "./ui/Loader1.tsx";
import { formatDate } from "../lib/utils.ts";
import type{AdminLog} from "../types/AdminLog.ts"
import {useAuthStore} from "../Store/authStore.ts"
import { useThemeStore } from "../Store/TeamToggle"

const Permission: React.FC = () => {
  
  const { isLoading, signUp, fetchAdminLog, adminLog, ResetPassword } = useAuthStore(); 
  // Zustand store for auth: loading state, signup, fetch admin logs, admin data, and password reset
  
  const adminList = adminLog ?? []; 
  // Fallback to empty array if adminLog is undefined
  
  const { isDark } = useThemeStore(); 
  // Theme state for dark/light mode
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchAdminLog(); 
      // Fetch admin logs on component mount
    };
    fetchData();
  }, []); 
  
  const [show, setShow] = useState(false); 
  // State to show/hide modal for adding admin
  
  const [showPassword, setSowPassword] = useState(false); 
  // Toggle visibility of password input
  
  const [popUp, setPopup] = useState<Boolean>(); 
  // General-purpose popup state
  
  const [popUpDeletion, setPopUpDeletion] = useState<Boolean>(); 
  // Popup for deletion confirmation
  
  const [popUpUpdate, setPopUpUpdate] = useState<Boolean>(); 
  // Popup for updating/resetting password
  
  const [Verify, setVerify] = useState<any>(); 
  // State to track verification status
  
  const [UserName, setUserName] = useState<any>(); 
  // Store currently selected admin username
  
  const [password, setPassword] = useState<any>(); 
  // Temporary password for reset
  
  const [form, setForm] = useState({
    UserName: "",
    Password: "",
    Email: ""
  }); 
  // Form state for adding new admin
  
  const change = () => setSowPassword(!showPassword); 
  // Toggle password visibility
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value); 
    // Update password state on input change
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value }); 
    // Update form state dynamically based on input name
  };
  
  const handleOpen = () => setShow(true); 
  // Open add admin modal
  
  const CheckDeletion = (log: AdminLog) => {
    setUserName(log.username); 
    setPopUpDeletion(true); 
    // Prepare deletion popup with selected admin
  };
  
  const CheckResetPassword = async (log: AdminLog) => {
    setUserName(log.username); 
    setPopUpUpdate(true); 
    // Open reset password popup for selected admin
  };
  
  const resetPassword = async (userName: string) => {
    setPopUpUpdate(false); 
    await ResetPassword(userName, password); 
    setPassword(""); 
    // Reset password for user and clear temp password
  };
  
  const DeleteAdmin = async (log: String) => {
    setPopUpDeletion(false); 
    if (!log) {
      console.error("No UserName provided for deletion.");
      return;
    }
    try {
      await api.post("/auth/deleteAdmin", { userName: log }); 
      toast.success("Admin Deleted successfully"); 
      await api.post("/api/View/del", { userName: log }); 
      // Delete admin and related view data
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin. Please try again later."); 
    } finally {
      fetchAdminLog(); 
      // Refresh admin list
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!form.UserName || !form.Password) {
      toast.error("Please fill in all fields."); 
      return;
    }
    try {
      signUp(form.UserName, form.Email, form.Password, "admin"); 
      setForm({ UserName: "", Password: "", Email: "" }); 
      window.location.reload(); 
      // Add new admin and reset form
    } catch (error) {
      throw error; 
    }
  };
  
  const checkVerify = async (log: AdminLog, status: boolean) => {
    setVerify(status); 
    setUserName(log.username); 
    setPopup(true); 
    // Prepare verification popup
  };
  
  const changeVerifyStatus = async (log: String, status: boolean) => {
    setPopup(false); 
    if (!log || typeof status !== 'boolean') {
      toast.error("UserName or Verification not Exit."); 
      return;
    }
    try {
      await api.post("/auth/IsVerified", {
        username: log,
        isVerified: !status
      }); 
      toast.success(`Permission ${!status ? "Active" : "DisActive"} Successfully`); 
      // Toggle admin verification status
    } catch (error) {
      console.log("error in give permission", error); 
    } finally {
      fetchAdminLog(); 
      // Refresh admin list
    }
  };
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Teacher Permissions</h3>
            <button className="btn btn-success fw-bold" onClick={() => handleOpen()}>+ Add Teacher</button>
      </div>

      <div className="container mt-4 shadow">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th className="border-0">UserName</th>
                <th className="border-0">Created At</th>
                <th className="border-0">Status</th>
                <th className="border-0">Change Status</th>
                <th className="border-0">Action</th>
              </tr>
            </thead>
            <tbody >
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <Loader1 />
                  </td>
                </tr>
              ) :
               adminList.length > 0 ? (
                  adminList.map((log, idx) => (
                  <tr key={idx}>
                    <td className="border-0">{log.username}</td>
                    <td className="border-0">{formatDate(log.createdAt)}</td>
                    <td className="border-0">
                      {log.isVerified === true
                        ? "Active"
                        : log.isVerified === false
                        ? "DisActive"
                        : "Pending..."}
                    </td>
                    <td className="border-0">
                      <button
                        className="btn btn-primary bg-primary btn-sm d-flex align-items-center gap-1  text-white"
                        onClick={() => checkVerify(log, log.isVerified)}
                      >
                        <FaEdit /> Set Permission
                      </button>
                    </td>
                    <td className="border-0 d-flex gap-3 justify-content-right">
                      <button
                        className="btn btn-danger bg-danger btn-sm d-flex align-items-center gap-1  text-white"
                        onClick={() => CheckResetPassword(log)}
                      >
                         <FaEdit /> Reset Password 
                      </button>
                      <button
                        className="btn btn-danger bg-danger btn-sm d-flex align-items-center gap-1 text-white"
                        onClick={() => CheckDeletion(log)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted text-center"
                    style={{ fontSize: "xx-large" }}
                  >
                    <span className="text-danger fw-bold fs-2">No Users</span> available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {show && (
        <>
          <div className="modal show fade d-block d-flex justify-content-center align-items-center p-5" tabIndex={-1} role="dialog" style={{maxWidth:"120rem"}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0 text-black">Add Admins</h4>
                  <small className="text-muted">Create A New Admin</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShow(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body pt-2">
                  <div className="mb-3">
                    <label className="form-label text-black">User Name</label>
                    <input
                      type="text"
                      name="UserName"
                      className="form-control rounded-pill bg-light"
                      style={{color:"black"}}
                      placeholder="Enter Course CourseIcon"
                      value={form.UserName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Email</label>
                    <input
                      type="email"
                      name="Email"
                      className="form-control rounded-pill bg-light"
                      style={{color:"black"}}
                      placeholder="Enter Course CourseIcon"
                      value={form.Email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Password</label>
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <input
                        type={showPassword ? "text" :  "password"}
                        name="Password"
                        className="form-control rounded-pill bg-light "
                        style={{color:"black"}}
                        placeholder="Enter Course Code"
                        value={form.Password}
                        onChange={handleChange}
                      />
                      {showPassword ? <span onClick={change} style={{cursor:"pointer"}}><i className={`fa-solid fa-eye`} style={{color:"black"}}></i></span> : <span onClick={change} style={{cursor:"pointer"}}><i className="fa-solid fa-eye-slash" style={{color:"black"}}></i></span>}
                    </div>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                  >
                    Add Admin 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>

      </>
      )}

      {popUpUpdate && 
        <div
        className="toast show position-fixed top-50 start-50"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ 
          zIndex: 9999, 
          transform: "translate(-50%, -50%)",
          minWidth: "300px" 
        }}
      >
        <div className="toast-header bg-danger text-white">
          <strong className="me-auto">Confirm Deletion</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setPopUpUpdate(false)}
          ></button>
        </div>
        <div className="toast-body">
        <div className="mb-3">
          <label className="form-label text-black">Password</label>
          <input
            type="text"
            name="Password"
            className="form-control rounded-pill bg-light "
            style={{color:"black"}}
            placeholder="Enter The Reset Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-danger btn-sm bg-danger text-white" onClick={() => UserName &&  resetPassword(UserName)}>
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm bg-secondary text-white"
              data-bs-dismiss="toast"
              onClick={() => setPopUpUpdate(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      }

      {popUpDeletion && 
        <div
        className="toast show position-fixed top-50 start-50"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ 
          zIndex: 9999, 
          transform: "translate(-50%, -50%)",
          minWidth: "300px" 
        }}
      >
        <div className="toast-header bg-danger text-white">
          <strong className="me-auto">Confirm Deletion</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setPopUpDeletion(false)}
          ></button>
        </div>
        <div className="toast-body">
          <pre className="text-dark">Are you sure you want to delete this Admin?</pre>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-danger btn-sm bg-danger text-white" onClick={() => UserName &&  DeleteAdmin(UserName)}>
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm bg-secondary text-white"
              data-bs-dismiss="toast"
              onClick={() => setPopUpDeletion(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      }

      {popUp && 
        <div
        className="toast show position-fixed top-50 start-50"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ 
          zIndex: 9999, 
          transform: "translate(-50%, -50%)",
          minWidth: "300px" 
        }}
      >
        <div className="toast-header bg-danger text-white">
          <strong className="me-auto">Change Permission</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setPopup(false)}
          ></button>
        </div>
        <div className="toast-body">
          <pre className={`${isDark ? "text-dark" : "text-dark"}`}>Do you want to Change the Status?</pre>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-danger  bg-danger text-white btn-sm" onClick={() => UserName &&  changeVerifyStatus(UserName,Verify)}>
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm bg-secondary text-white"
              data-bs-dismiss="toast"
              onClick={() => setPopup(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      }

    </>

  );
};

export default Permission;
