
import React,{useEffect, useState} from "react";
import toast from "react-hot-toast";
import api from "../lib/axios.tsx";
import axios from "axios";
import { useCourseStore } from "../Store/CourseStore.tsx";
import Loader1 from "./ui/Loader1.tsx";
import RateLimitWarning from "./ui/TimeLimit.tsx";
import type {course} from "../types/Course.ts";
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from "../Store/TeamToggle.tsx";
import type{views} from "../types/View.ts"

const AddCourseData: React.FC = () => {

  // Manage course data, forms, modals, and CRUD operations for SuperAdmin dashboard
  const { isDark } = useThemeStore(); // Get theme toggle (dark/light)
  const navigate = useNavigate(); // Hook to programmatically navigate routes

  // Course store for fetching and managing course data
  const { CourseData, fetchCourseData, Loading, IsRateLimited } = useCourseStore();

  // Fetch course data on component mount
  useEffect(() => {
    fetchCourseData();
  }, []);

  // Modal and form state
  const [show, setShow] = useState(false); // Show add course modal
  const [editShow, setEditShow] = useState(false); // Show edit course modal
  const [id, setId] = useState<string | null>(null); // Store selected course ID for editing/deletion

  // Open add course modal
  const handleOpen = () => setShow(true);

  // Open edit modal with prefilled form values
  const handleEditOpen = (course: course) => {
    setEditShow(true)
    setForm({
      CourseIcon: course.CourseIcon,
      CourseCode: course.CourseCode,
      CourseTitle: course.CourseTitle,
      CourseDescription: course.CourseDescription,
      TotalChapter: course.TotalChapter.toString(),
    });
    setId(course._id);
  };

  // Close add course modal and refresh course data
  const clothPopup = () => {
    setShow(false)
    fetchCourseData()
  }

  // Form state for add/edit course
  const [form, setForm] = useState({
    CourseIcon: "",
    CourseCode: "",
    CourseTitle: "",
    CourseDescription: "",
    TotalChapter: "",
  });

  // Clear edit modal and reset form
  const clearAll = () => {
    setEditShow(false)
    setForm({ CourseIcon: "", CourseCode: "", CourseDescription: "", CourseTitle: "", TotalChapter: "" });
    fetchCourseData()
  }

  // Handle input changes for form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.CourseIcon || !form.CourseCode || !form.CourseTitle || !form.CourseDescription || !form.TotalChapter) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await api.post("/course", {
        CourseIcon: form.CourseIcon,
        CourseCode: form.CourseCode,
        CourseTitle: form.CourseTitle,
        CourseDescription: form.CourseDescription,
        TotalChapter: form.TotalChapter
      });
      toast.success("Course Submit Successfully");
      
      // Create initial view tracking for the course
      await api.post<views>("/view", {
        CourseCode: form.CourseCode,
        TotalCourseView: true,
        TotalQuestionView: true
      });

      setForm({ CourseIcon: "", CourseCode: "", CourseDescription: "", CourseTitle: "", TotalChapter: "" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Course already exists. Please use a different Course Code.");
        return
      }
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return
      }
      console.error("Error sending Course form:", error);
      toast.error("Failed to send TotalChapter. Please try again later.");
    }
  }

  // Update existing course
  const EditCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.log("No ID provided for editing course.");
      return;
    }

    try {
      await api.put(`/course/${id}`, {
        CourseIcon: form.CourseIcon,
        CourseCode: form.CourseCode,
        CourseTitle: form.CourseTitle,
        CourseDescription: form.CourseDescription,
        TotalChapter: form.TotalChapter
      });

      setForm({ CourseIcon: "", CourseCode: "", CourseDescription: "", CourseTitle: "", TotalChapter: "" });
      setEditShow(false);
      toast.success("Course Update successfully!");
      fetchCourseData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Course already exists. Please use a different Course Code.");
        return
      }
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return
      }
      console.error("Error sending Course form:", error);
      toast.error("Failed to send TotalChapter. Please try again later.");
    } finally {
      navigate("/superAdmin"); // Redirect after edit
    }
  }

  // Popup state for delete confirmation
  const [popUp, setPopup] = useState(false);

  // Open delete confirmation popup
  const CheckDeletion = (course: course) => {
    setId(course._id);
    setPopup(true);
    if (!course._id) {
      console.error("No ID provided for deletion.");
      return;
    }
  }

  // Delete a course
  const DeleteCourse = async (id: String) => {
    setPopup(false);

    if (!id) {
      console.error("No ID provided for deletion.");
      return;
    }
    try {
      await api.delete(`/course/${id}`);
      toast.success("Course deleted successfully!");
      fetchCourseData();
    } catch (error) {
      console.error("Error deleting course:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Course not found.");
      } else {
        toast.error("Failed to delete course. Please try again later.");
      }
    }
  }


  return (

    <>
      <div className= {`d-flex justify-content-between align-items-center mb-4 `}>
          <h3 className="fw-bold">Course Management</h3>
          <button className="btn btn-success fw-bold" onClick={() => handleOpen()}>+ Add Course</button>
        </div>
      <div className="container py-5 text-white shadow-lg" style={{ minHeight: "100vh" }}>
        

      <table className={`table shadow rounded-3 table-hover table-borderless rounded shadow` }>
  <thead className={`text-secondary `}>
    <tr>
      <th scope="col">Course Icon</th>
      <th scope="col">Course Code</th>
      <th scope="col">Course Title</th>
      <th scope="col">Course Chapters</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>

  <tbody >
    {Loading ? (
      <tr>
        <td colSpan={4} className="text-center py-4">
          <Loader1 />
        </td>
      </tr>
    ) : IsRateLimited ? (
      <tr>
        <td colSpan={4}>
          <RateLimitWarning />
        </td>
      </tr>
    ) : CourseData.length > 0 ? (
      CourseData.map((course, index) => (
        <tr key={index} className="align-middle">
          <td style={{ fontSize: "1.5rem" }}> <img src={course.CourseIcon} alt="icon" width={"30px"} height={"30px"}/> </td>
          <td>{course.CourseCode}</td>
          <td>
            <strong className="text-dark">{course.CourseTitle}</strong>
            <br />
            <small className="text-muted">{course.CourseDescription}</small>
          </td>
          <td>{course.TotalChapter}</td>
          <td>
            <button
              className={`btn btn-dark btn-sm me-2  ${isDark ? "HeaderToggle" : ""}`}
              onClick={() => handleEditOpen(course)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className={`btn btn-danger btn-sm bg-danger`}
              onClick={() => CheckDeletion(course)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{height:"65vh",fontSize:"xx-large"}}>
            <span  className="text-danger fw-bold fs-2"> No Courses</span> available.
          </td>
        </tr>
      )}
    </tbody>
  </table>

      </div>

      {show && (
        <>
          <div className="modal show fade d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0 text-black">Add New Course</h4>
                  <small className="text-muted">Create New Course</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => clothPopup()}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body pt-2">
                  <div className="mb-3">
                    <label className="form-label text-black">Course CourseIcon</label>
                    <input
                      type="text"
                      name="CourseIcon"
                      className="form-control rounded-pill bg-light text-black"
                      placeholder="Enter Course CourseIcon"
                      value={form.CourseIcon}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Course Code</label>
                    <input
                      type="text"
                      name="CourseCode"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter Course Code"
                      value={form.CourseCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Course Title</label>
                    <input
                      type="text"
                      name="CourseTitle"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter Course Title"
                      value={form.CourseTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Description</label>
                    <textarea
                      name="CourseDescription"
                      className="form-control rounded-3 bg-light text-dark"
                      rows={3}
                      placeholder="Enter Course Description "
                      value={form.CourseDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-black">Total Chapters</label>
                    <input
                      type="number"
                      name="TotalChapter"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="e.g. 12"
                      value={form.TotalChapter}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                  >
                    Add Course 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>

      </>
      )}

      {editShow && (
        <>
          <div className="modal show fade d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0 text-dark">Update Exiting Course</h4>
                  <small className="text-muted">Update Course</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={clearAll}
                ></button>
              </div>

              <form >
                <div className="modal-body pt-2">
                <div className="mb-3">
                    <label className="form-label text-dark">Course CourseIcon</label>
                    <input
                      type="text"
                      name="CourseIcon"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter Course CourseIcon"
                      value={form.CourseIcon}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Course Code</label>
                    <input
                      type="text"
                      name="CourseCode"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter Course Code"
                      value={form.CourseCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Course Title</label>
                    <input
                      type="text"
                      name="CourseTitle"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="Enter Course Title"
                      value={form.CourseTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Description</label>
                    <textarea
                      name="CourseDescription"
                      className="form-control rounded-3 bg-light text-dark"
                      rows={3}
                      placeholder="Enter Course Description"
                      value={form.CourseDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Total Chapters</label>
                    <input
                      type="number"
                      name="TotalChapter"
                      className="form-control rounded-pill bg-light text-dark"
                      placeholder="e.g. 12"
                      value={form.TotalChapter}
                       onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                    onClick={EditCourse}
                  >
                    Edit Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>

      </>
      )}

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
          <strong className="me-auto">Confirm Deletion</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setPopup(false)}
          ></button>
        </div>
        <div className="toast-body">
          <p className="text-dark" style={{color:"black"}}>Do you want to delete this course?</p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-danger btn-sm bg-danger" onClick={() => id &&  DeleteCourse(id)}>
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm bg-secondary"
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

export default AddCourseData;
