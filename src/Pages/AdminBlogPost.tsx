import React, { useEffect,useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaBook } from "react-icons/fa";
import { useBlogStore } from "../Store/BlogStore";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import type{ blog } from "../types/Blog";
import {formatDate} from "../lib/utils";
import Loader1 from "../components/ui/Loader1";
import RateLimitWarning from "../components/ui/TimeLimit";

const BlogManagement: React.FC = () => {
 
  const { blogs, fetchBlogs, loading, isRateLimited } = useBlogStore(); // Access blogs array, fetch function, loading and rate-limit state

  useEffect(() => {
    const fetchBlog = async () => {
      await fetchBlogs(); // Fetch blogs on component mount
    };
    fetchBlog();
  }, [fetchBlogs]);
  
  const [isPublished, setIsPublished] = useState(false); // Blog publish toggle
  const [show, setShow] = useState(false); // Modal state for adding blog
  const [editShow, setEditShow] = useState(false); // Modal state for editing blog
  const [id, setId] = useState<string | null>(null); // Store blog ID for edit/delete
  const [form, setForm] = useState({
    BlogTitle: "",
    BlogAuthor: "",
    BlogSlug: "",
    BlogContent: "",
    BlogDescription: "",
    BlogTag: "",
    BlogPublish: false,
    BlogImg: "",
    BlogTime: 0,
  });
  
  // Open modal for adding blog
  const handleOpen = () => setShow(true);
  
  // Close modal and reset form
  const closedPopUp = () => {
    setShow(false);
    fetchBlogs(); // Refresh blogs list
    clearAll(); // Reset form
  };
  
  // Open modal for editing blog and populate form
  const handleEditOpen = (blog: blog) => {
    setEditShow(true);
    setForm({
      BlogTitle: blog.BlogTitle,
      BlogAuthor: blog.BlogAuthor,
      BlogSlug: blog.BlogSlug,
      BlogContent: blog.BlogContent,
      BlogDescription: blog.BlogDescription,
      BlogTag: blog.BlogTag,
      BlogPublish: blog.BlogPublish,
      BlogImg: blog.BlogImg,
      BlogTime: blog.BlogTime,
    });
    setId(blog._id); // Set ID for update
    blog.BlogPublish ? setIsPublished(true) : setIsPublished(false); // Sync publish toggle
  };
  
  // Reset form to initial state
  const clearAll = () => {
    setEditShow(false);
    setForm({
      BlogTitle: "",
      BlogAuthor: "",
      BlogSlug: "",
      BlogContent: "",
      BlogDescription: "",
      BlogTag: "",
      BlogPublish: false,
      BlogImg: "",
      BlogTime: 0,
    });
    setIsPublished(false);
  };
  
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
      BlogPublish: isPublished, // Always sync publish toggle
    });
  };
  
  // Submit new blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation
    if (
      !form.BlogTitle ||
      !form.BlogAuthor ||
      !form.BlogSlug ||
      !form.BlogContent ||
      !form.BlogDescription ||
      !form.BlogTag ||
      !form.BlogImg ||
      form.BlogTime <= 0
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    form.BlogPublish = isPublished;
  
    try {
      await api.post("/blog", { ...form }); // Send blog to API
      setForm({ // Reset form
        BlogTitle: "",
        BlogAuthor: "",
        BlogSlug: "",
        BlogContent: "",
        BlogDescription: "",
        BlogTag: "",
        BlogPublish: false,
        BlogImg: "",
        BlogTime: 0,
      });
      toast.success("Blog sent successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }
      console.error("Error sending blog form:", error);
      toast.error("Failed to send blog. Please try again later.");
    }
  };
  
  // Edit existing blog
  const EditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!id) {
      console.log("No ID provided for editing Blog.");
      return;
    }
    form.BlogPublish = isPublished;
  
    try {
      await api.put(`/blog/${id}`, { ...form }); // Update blog API
      setForm({ // Reset form
        BlogTitle: "",
        BlogAuthor: "",
        BlogSlug: "",
        BlogContent: "",
        BlogDescription: "",
        BlogTag: "",
        BlogPublish: false,
        BlogImg: "",
        BlogTime: 0,
      });
      setEditShow(false);
      toast.success("Blog updated successfully!");
      fetchBlogs(); // Refresh list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }
      console.error("Error updating blog form:", error);
      toast.error("Failed to update blog. Please try again later.");
    } finally {
      fetchBlogs();
    }
  };
  
  // Popup state for deletion
  const [popUp, setPopup] = useState(false);
  
  // Check before deletion
  const CheckDeletion = (blog: blog) => {
    setId(blog._id); // Store blog ID
    setPopup(true); // Show confirmation popup
    if (!blog._id) {
      console.error("No ID provided for deletion.");
      return;
    }
  };
  
  // Delete blog
  const DeleteCourse = async (id: String) => {
    setPopup(false); // Close popup
  
    if (!id) {
      console.error("No ID provided for deletion.");
      return;
    }
    try {
      await api.delete(`/blog/${id}`); // Call API delete
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // Refresh list
    } catch (error) {
      console.error("Error deleting blog:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Blog not found.");
      } else {
        toast.error("Failed to delete blog. Please try again later.");
      }
    }
  };
  


  return (
    <>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="d-flex align-items-center gap-2">
            <FaBook /> Blog Management
          </h3>
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={() => handleOpen()}
          >
            <FaPlus /> Add Blog
          </button>
        </div>
        <p className="text-muted">
          List of All Blog Posts
        </p>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th className="border-0">Title</th>
                <th className="border-0">Author</th>
                <th className="border-0">Status</th>
                <th className="border-0">Published</th>
                <th className="border-0">Tags</th>
                <th className="border-0">Read Time</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (<Loader1/>) : 
              isRateLimited ? (<RateLimitWarning/>) :
              blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr >
                  <td className="border-0">{blog.BlogTitle}</td>
                  <td className="border-0">{blog.BlogAuthor}</td>
                  <td className="border-0">{blog.BlogPublish ? "Published" : " UnPublished"}</td>
                  <td className="border-0">{formatDate(blog.createdAt)}</td>
                  <td className="border-0">{blog.BlogTag}</td>
                  <td className="border-0">{blog.BlogTime}</td>
                  <td className="border-0 d-flex gap-2">
                    <button 
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleEditOpen(blog)}
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                      onClick={() => CheckDeletion(blog)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <p className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{fontSize:"xx-large"}}>
                    <span  className="text-danger fw-bold fs-2"> No Courses</span> available.
                  </p>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    
      {show && (
        <>
          <div className="modal show fade d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0">Add New Blog</h4>
                  <small className="text-muted">Create New Blog</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => closedPopUp()}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body pt-2">

                  <div className="mb-3">
                    <label className="form-label">blog Title</label>
                    <input
                      type="text"
                      name="BlogTitle"
                      className="form-control rounded-pill bg-light"
                      placeholder="Enter Blog Title"
                      value={form.BlogTitle}
                      onChange={handleChange}
                    />
                  </div>
           
                  <div className="mb-3">
                    <label className="form-label">blog Author</label>
                    <input
                      type="text"
                      name="BlogAuthor"
                      className="form-control rounded-pill bg-light"
                      placeholder="Enter Blog Author"
                      value={form.BlogAuthor}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Slug</label>
                    <input
                      name="BlogSlug"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog Slug"
                      value={form.BlogSlug}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Description</label>
                    <input
                      name="BlogDescription"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog Description"
                      value={form.BlogDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Content</label>
                    <textarea
                      name="BlogContent"
                      className="form-control rounded-3 bg-light"
                      rows={3}
                      placeholder="Enter Blog Content"
                      value={form.BlogContent}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Tag</label>
                    <select
                      name="BlogTag"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.BlogTag}
                    >
                      <option value="" >Enter Blog Tag</option>
                      <option value={"Study Tips"}>Study Tips</option>
                      <option value={"Learning Strategies"}>Learning Strategies</option>
                      <option value={"Exam Preparation"}>Exam Preparation</option>
                      <option value={"Time Management"}>Time Management</option>
                      <option value={"Note Taking"}>Note Taking</option>
                      <option value={"Student Life"}>Student Life</option>
                      <option value={"Academic Success"}>Academic Success</option>
                      <option value={"Motivation"}>Motivation</option>
                      <option value={"Online Learning"}>Online Learning</option>
                      <option value={"E-Learning"}>E-Learning</option>
                      <option value={"Productivity"}>Productivity</option>
                      <option value={"Mind Mapping"}>Mind Mapping</option>
                      <option value={"Focus & Concentration"}>Focus & Concentration</option>
                      <option value={"Revision Techniques"}>Revision Techniques</option>
                      <option value={"Educational Tools"}>Educational Tools</option>
                      <option value={"Learning Apps"}>Learning Apps</option>
                      <option value={"Homework Help"}>Homework Help</option>
                      <option value={"Memory Techniques"}>Memory Techniques</option>
                      <option value={"Goal Setting"}>Goal Setting</option>
                      <option value={"Study Hacks"}>Study Hacks</option>
                      <option value={"Math Tips"}>Math Tips</option>
                      <option value={"Science Study"}>Science Study</option>
                      <option value={"History Hacks"}>History Hacks</option>
                      <option value={"Language Learning"}>Language Learning</option>
                      <option value={"Coding for Beginners"}>Coding for Beginners</option>
                      <option value={"English Grammar"}>English Grammar</option>
                      <option value={"Writing Skills"}>Writing Skills</option>
                      <option value={"STEM Education"}>STEM Education</option>
                      <option value={"Programming Tips"}>Programming Tips</option>
                      <option value={"AI in Education"}>AI in Education</option>
                      <option value={"Critical Thinking"}>Critical Thinking</option>
                      <option value={"Problem Solving"}>Problem Solving</option>
                      <option value={"Self-Discipline"}>Self-Discipline</option>
                      <option value={"Public Speaking"}>Public Speaking</option>
                      <option value={"Reading Skills"}>Reading Skills</option>
                      <option value={"Speed Reading"}>Speed Reading</option>
                      <option value={"Communication Skills"}>Communication Skills</option>
                      <option value={"Self-Learning"}>Self-Learning</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Img</label>
                    <input
                      name="BlogImg"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog image URL"
                      value={form.BlogImg}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Blog Time</label>
                    <select
                      name="BlogTime"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.BlogTime}
                    >
                      <option value="" >Enter A Blog Time</option>
                        <option value={1}>
                          1 minute
                        </option>
                        <option value={2}>
                          2 minute
                        </option>
                        <option value={4}>
                          4 minute
                        </option>
                        <option value={6}>
                          7 minute
                        </option>
                        <option value={8}>
                          8 minute
                        </option>
                        <option value={10}>
                          10 minute
                        </option>
                        <option value={20}>
                          20 minute
                        </option>
                        <option value={30}>
                          30 minute
                        </option>
                        <option value={40}>
                          40 minute
                        </option>
                        <option value={50}>
                          50 minute
                        </option>
                        <option value={1}>
                          1 hour
                        </option>
                        <option value={2}>
                          2 hour
                        </option>
                    </select>
                  </div>

                  <div className="mb-3 d-flex gap-4 justify-content center align-items-center" >
                    <label className="form-label">blog Publish  </label>
                    <div className={`fs-2 publishToggle `}  onClick={() => isPublished ? setIsPublished(false) : setIsPublished(true)} 
                      style={{cursor:"pointer" , color: isPublished ? "green" : "tomato"}}>
                      {isPublished ? <i className="fa-solid fa-toggle-on"></i> : <i className="fa-solid fa-toggle-off"></i>}</div>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                  >
                    Add blog 
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
                  <h4 className="fw-bold mb-0">Update Exiting Blog</h4>
                  <small className="text-muted">Update Blog</small>
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
                    <label className="form-label">blog Title</label>
                    <input
                      type="text"
                      name="BlogTitle"
                      className="form-control rounded-pill bg-light"
                      placeholder="Enter Blog Title"
                      value={form.BlogTitle}
                      onChange={handleChange}
                    />
                  </div>
           
                  <div className="mb-3">
                    <label className="form-label">blog Author</label>
                    <input
                      type="text"
                      name="BlogAuthor"
                      className="form-control rounded-pill bg-light"
                      placeholder="Enter Blog Author"
                      value={form.BlogAuthor}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Slug</label>
                    <input
                      name="BlogSlug"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog Slug"
                      value={form.BlogSlug}
                      onChange={handleChange}
                    />
                  </div>

                 
                  <div className="mb-3">
                    <label className="form-label">blog Description</label>
                    <input
                      name="BlogDescription"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog Description"
                      value={form.BlogDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Content</label>
                    <textarea
                      name="BlogContent"
                      className="form-control rounded-3 bg-light"
                      rows={3}
                      placeholder="Enter Blog Content"
                      value={form.BlogContent}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Tag</label>
                    <select
                      name="BlogTag"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.BlogTag}
                    >
                      <option value="" >Enter Blog Tag</option>
                      <option value={"Study Tips"}>Study Tips</option>
                      <option value={"Learning Strategies"}>Learning Strategies</option>
                      <option value={"Exam Preparation"}>Exam Preparation</option>
                      <option value={"Time Management"}>Time Management</option>
                      <option value={"Note Taking"}>Note Taking</option>
                      <option value={"Student Life"}>Student Life</option>
                      <option value={"Academic Success"}>Academic Success</option>
                      <option value={"Motivation"}>Motivation</option>
                      <option value={"Online Learning"}>Online Learning</option>
                      <option value={"E-Learning"}>E-Learning</option>
                      <option value={"Productivity"}>Productivity</option>
                      <option value={"Mind Mapping"}>Mind Mapping</option>
                      <option value={"Focus & Concentration"}>Focus & Concentration</option>
                      <option value={"Revision Techniques"}>Revision Techniques</option>
                      <option value={"Educational Tools"}>Educational Tools</option>
                      <option value={"Learning Apps"}>Learning Apps</option>
                      <option value={"Homework Help"}>Homework Help</option>
                      <option value={"Memory Techniques"}>Memory Techniques</option>
                      <option value={"Goal Setting"}>Goal Setting</option>
                      <option value={"Study Hacks"}>Study Hacks</option>
                      <option value={"Math Tips"}>Math Tips</option>
                      <option value={"Science Study"}>Science Study</option>
                      <option value={"History Hacks"}>History Hacks</option>
                      <option value={"Language Learning"}>Language Learning</option>
                      <option value={"Coding for Beginners"}>Coding for Beginners</option>
                      <option value={"English Grammar"}>English Grammar</option>
                      <option value={"Writing Skills"}>Writing Skills</option>
                      <option value={"STEM Education"}>STEM Education</option>
                      <option value={"Programming Tips"}>Programming Tips</option>
                      <option value={"AI in Education"}>AI in Education</option>
                      <option value={"Critical Thinking"}>Critical Thinking</option>
                      <option value={"Problem Solving"}>Problem Solving</option>
                      <option value={"Self-Discipline"}>Self-Discipline</option>
                      <option value={"Public Speaking"}>Public Speaking</option>
                      <option value={"Reading Skills"}>Reading Skills</option>
                      <option value={"Speed Reading"}>Speed Reading</option>
                      <option value={"Communication Skills"}>Communication Skills</option>
                      <option value={"Self-Learning"}>Self-Learning</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">blog Img</label>
                    <input
                      name="BlogImg"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter Blog image URL"
                      value={form.BlogImg}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Blog Time</label>
                    <select
                      name="BlogTime"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.BlogTime}
                    >
                      <option value="" >Enter A Blog Time</option>
                        <option value={1}>
                          1 minute
                        </option>
                        <option value={2}>
                          2 minute
                        </option>
                        <option value={4}>
                          4 minute
                        </option>
                        <option value={6}>
                          7 minute
                        </option>
                        <option value={8}>
                          8 minute
                        </option>
                        <option value={10}>
                          10 minute
                        </option>
                        <option value={20}>
                          20 minute
                        </option>
                        <option value={30}>
                          30 minute
                        </option>
                        <option value={40}>
                          40 minute
                        </option>
                        <option value={50}>
                          50 minute
                        </option>
                        <option value={1}>
                          1 hour
                        </option>
                        <option value={2}>
                          2 hour
                        </option>
                    </select>
                  </div>

                  <div className="mb-3 d-flex gap-4 justify-content center align-items-center" >
                    <label className="form-label">blog Publish  </label>
                    <div className={`fs-2 publishToggle `}  onClick={() => isPublished ? setIsPublished(false) : setIsPublished(true)} 
                      style={{cursor:"pointer" , color: isPublished ? "green" : "tomato"}}>
                      {isPublished ? <i className="fa-solid fa-toggle-on"></i> : <i className="fa-solid fa-toggle-off"></i>}</div>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                    onClick={EditCourse}
                  >
                    Update Blog
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
          <p className="text-dark">Do you want to delete this blog?</p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-danger btn-sm" onClick={() => id &&  DeleteCourse(id)}>
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm"
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

export default BlogManagement;
