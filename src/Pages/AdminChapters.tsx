
import { Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import React,{useEffect, useState} from "react";
import toast from "react-hot-toast";
import api from "../lib/axios.tsx";
import axios from "axios";
import {useFullChapterStore} from "../Store/FullChapterStore.tsx"
import type {Chapter} from "../types/Course.ts";
import Loader1 from "../components/ui/Loader1.tsx";
import RateLimitWarning from "../components/ui/TimeLimit.tsx";
import { useCourseStore } from "../Store/CourseStore.tsx";

const ChapterManagement = () => {

  const { CourseData, fetchCourseData } = useCourseStore(); // Access courses and fetch function

  useEffect(() => {
    const fetch = async () => {
      await fetchCourseData(); // Fetch all courses on mount
    };
    fetch();
  }, [fetchCourseData]);

  const { chapterData, fetchAllChapters, loading, isRateLimited } = useFullChapterStore(); // Access chapters and fetch function

  useEffect(() => {
    fetchAllChapters(); // Fetch all chapters on mount
  }, []);

  // Modal and form state
  const [show, setShow] = useState(false); // Add chapter modal
  const [editShow, setEditShow] = useState(false); // Edit chapter modal
  const [id, setId] = useState<string | null>(null); // Chapter ID for edit/delete

  const handleOpen = () => setShow(true); // Open add chapter modal

  const closedPopUp = () => {
    setShow(false);
    fetchAllChapters(); // Refresh chapter list on close
  };

  // Open edit modal and populate form
  const handleEditOpen = (chapter: Chapter, idx: number) => {
    setEditShow(true);
    setForm({
      CourseCode: chapterData[idx].CourseCode, // Set course code
      ChapterDescription: chapter.ChapterDescription, // Set description
      ChapterTitle: chapter.ChapterTitle, // Set title
      ChapterNumber: Number(chapter.ChapterNumber), // Set number
    });
    setId(chapter._id); // Store chapter ID for editing
  };

  // Form state
  const [form, setForm] = useState({
    CourseCode: "",
    ChapterNumber: 0,
    ChapterTitle: "",
    ChapterDescription: "",
  });

  // Reset form and close edit modal
  const clearAll = () => {
    setEditShow(false);
    setForm({ CourseCode: "", ChapterNumber: 0, ChapterTitle: "", ChapterDescription: "" });
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new chapter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.CourseCode || !form.ChapterNumber || !form.ChapterTitle || !form.ChapterDescription) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Post new chapter to API
      await api.post("/chapter", {
        CourseCode: form.CourseCode,
        Chapters: [{
          ChapterTitle: form.ChapterTitle,
          ChapterNumber: Number(form.ChapterNumber),
          ChapterDescription: form.ChapterDescription
        }]
      });

      setForm({ CourseCode: "", ChapterNumber: 0, ChapterTitle: "", ChapterDescription: "" });
      toast.success("Chapter sent successfully!");
      console.log("Chapter sent successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error("Course chapter already exists.");
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }
      console.error("Error sending course form:", error);
      toast.error("Failed to send ChapterDescription. Please try again later.");
    }
  };

  // Edit existing chapter
  const EditCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.log("No ID provided for editing course.");
      return;
    }

    try {
      // Update chapter by ID
      await api.put(`/chapter/${id}`, {
        ChapterTitle: form.ChapterTitle,
        ChapterNumber: form.ChapterNumber,
        ChapterDescription: form.ChapterDescription
      });

      setForm({ CourseCode: "", ChapterNumber: 0, ChapterTitle: "", ChapterDescription: "" });
      setEditShow(false);
      toast.success("Chapter Updated successfully!");
      console.log("Chapter Updated successfully!");
      fetchAllChapters(); // Refresh list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Course already exists. Please use a different Course Code.");
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }
      console.error("Error sending course form:", error);
      toast.error("Failed to send ChapterDescription. Please try again later.");
    } finally {
      fetchAllChapters(); // Ensure list refresh
    }
  };

  // Popup for deletion confirmation
  const [popUp, setPopup] = useState(false);

  // Check before deletion
  const CheckDeletion = (chapter: Chapter) => {
    setId(chapter._id); // Store ID
    setPopup(true); // Show confirmation
    if (!chapter._id) {
      console.error("No ID provided for deletion.");
      return;
    }
  };

  // Delete chapter
  const DeleteCourse = async (id: String) => {
    setPopup(false); // Close popup

    if (!id) {
      console.error("No ID provided for deletion.");
      return;
    }

    try {
      await api.delete(`/chapter/${id}`); // Delete API call
      toast.success("Chapter deleted successfully!");
      fetchAllChapters(); // Refresh list
    } catch (error) {
      console.error("Error deleting course:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Course not found.");
      } else {
        toast.error("Failed to delete course. Please try again later.");
      }
    }
  };


  return (
    <>
      <Container className="mt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h2>Chapter Management</h2>
          </Col>
          <Col className="text-end">
            <Button variant="success" onClick={() => handleOpen()}>
              <FaPlus className="me-2" /> Add Chapter
            </Button>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <Card.Title>List Of All Chapter</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">chapters</Card.Subtitle>

            <Table responsive hover>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Chapter Number</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { loading ? (<Loader1/>)  : 
                isRateLimited ? (<RateLimitWarning/>) :
                  chapterData.length > 0 ? (
                  
                    chapterData.map((c,idx) =>
                      c.Chapters.map((chapter) => (
                        <tr key={idx}>
                          <td>{chapterData[idx].CourseCode}</td>
                          <td>Chapter {chapter.ChapterNumber}</td>
                          <td>{chapter.ChapterTitle}</td>
                          <td>{chapter.ChapterDescription}</td>
                          <td>
                            <FaEdit
                              className="text-primary me-3"
                              role="button"
                              onClick={() => handleEditOpen(chapter, idx)}
                            />
                            <FaTrash
                              className="text-danger"
                              role="button"
                              onClick={() => CheckDeletion(chapter)}
                            />
                          </td>
                        </tr>
                      )))
                  ) : (
                    <tr>
                    <td className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{fontSize:"xx-large"}}>
                      <span  className="text-danger fw-bold fs-2"> No Courses</span> available.
                    </td>
                  </tr>
                  )}  
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    

      {show && (
        <>
          <div className="modal show fade d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0">Add New Chapter</h4>
                  <small className="text-muted">Create New Chapter</small>
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
                    <label className="form-label">Course Code</label>
                    <select
                      name="CourseCode"
                      className="form-select rounded-pill bg-light"
                      value={form.CourseCode}
                      onChange={handleChange}
                    >
                      <option value="" >Select a course</option>
                      {CourseData.map((course, idx) => (
                        <option key={idx} value={course.CourseCode}>
                          {course.CourseCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Chapter Title</label>
                    <input
                      type="text"
                      name="ChapterTitle"
                      className="form-control rounded-pill bg-light"
                      placeholder="Enter Course Code"
                      value={form.ChapterTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Chapter Number</label>
                    <select
                      name="ChapterNumber"
                      className="form-control rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.ChapterNumber}
                    >
                      <option value="">Select Chapter</option>
                      {CourseData
                        .filter((course) => course.CourseCode === form.CourseCode)
                        .flatMap((course) => {
                          // Flatten all ChapterNumbers for this course
                          const usedChapterNumbers = chapterData
                            .filter((ch) => ch.CourseCode === form.CourseCode)
                            .flatMap((ch) => ch.Chapters.map((c) => c.ChapterNumber)); // now a flat array of numbers

                          // Generate available chapter numbers
                          return Array.from({ length: course.TotalChapter }, (_, i) => i + 1)
                            .filter((num) => !usedChapterNumbers.includes(num))
                            .map((num) => (
                              <option key={num} value={num}>
                                {`Chapter ${num}`}
                              </option>
                            ));
                        })}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Chapter Description</label>
                    <textarea
                      name="ChapterDescription"
                      className="form-control rounded-3 bg-light"
                      rows={3}
                      placeholder="Enter Course Description"
                      value={form.ChapterDescription}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                  >
                    Add Chapter 
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
                  <h4 className="fw-bold mb-0">Update Exiting Chapter</h4>
                  <small className="text-muted">update Chapter</small>
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
                      <label className="form-label">Course Code</label>
                      <input
                        type="text"
                        name="CourseCode"
                        className="form-control rounded-pill bg-light"
                        placeholder="Enter Course CourseCode"
                        value={form.CourseCode}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Chapter Title</label>
                      <input
                        type="text"
                        name="ChapterTitle"
                        className="form-control rounded-pill bg-light"
                        placeholder="Enter Course Code"
                        value={form.ChapterTitle}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">Chapter Number</label>
                    <select
                      name="ChapterNumber"
                      className="form-control rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.ChapterNumber}
                      disabled
                    >
                        {<option value={form.ChapterNumber}>
                          {`Chapter ${form.ChapterNumber}`}
                        </option>}
                    </select>
                  </div>

                    <div className="mb-3">
                      <label className="form-label">Chapter Description</label>
                      <textarea
                        name="ChapterDescription"
                        className="form-control rounded-3 bg-light"
                        rows={3}
                        placeholder="Enter Course Description"
                        value={form.ChapterDescription}
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
                    Update Chapter
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
          <p className="text-dark">Do you want to delete this chapter?</p>
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

export default ChapterManagement;
