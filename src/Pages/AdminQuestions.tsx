import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {useQuestionStore} from "../Store/FullQuestionStore.tsx"
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios.tsx";
import Loader1 from "../components/ui/Loader1.tsx";
import RateLimitWarning from "../components/ui/TimeLimit.tsx";
import axios from "axios";
import type {question} from "../types/Question.ts"
import {useCourseStore} from "../Store/CourseStore.tsx"
import {useFullChapterStore} from "../Store/FullChapterStore.tsx"

const QuestionManagement = () => {

  const { chapterData, fetchAllChapters } = useFullChapterStore(); // Store for chapters
  const { CourseData, fetchCourseData } = useCourseStore(); // Store for courses
  const { fetchAllQuestions, questionData, Loading, IsRateLimited } = useQuestionStore(); // Store for questions
  
  // Fetch all data when component mounts
  useEffect(() => {
    const Fetch = async () => {
      await fetchAllChapters(); // Get all chapters
      await fetchAllQuestions(); // Get all questions
      await fetchCourseData(); // Get all courses
    };
    Fetch();
  }, [fetchAllQuestions]);
  
  // Modal and form state
  const [show, setShow] = useState(false); // Show "Add Question" modal
  const [editShow, setEditShow] = useState(false); // Show "Edit Question" modal
  const [id, setId] = useState<string | null>(null); // Current question ID
  const [form, setForm] = useState({
    CourseCode: "",
    CourseChapter: 0,
    question: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], // 4 options
    correctAnswer: "",
    explanation: "",
    allowedTime: 0,
    correctIndex: -1,
  });
  
  // Open add question modal
  const handleOpen = () => setShow(true);
  
  // Close modal and reset form
  const closedPopUp = () => {
    setShow(false);
    fetchAllQuestions(); // Refresh question list
    clearAll();
  };
  
  // Update option text
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...form.options];
    updatedOptions[index].text = value;
    setForm((prev) => ({ ...prev, options: updatedOptions }));
  
    // If correct answer matches changed option, update it
    if (form.correctIndex === index) {
      setForm((prev) => ({ ...prev, correctAnswer: value }));
    }
  };
  
  // Select the correct answer
  const handleCorrectSelect = (index: number) => {
    const selectedText = form.options[index].text;
    setForm((prev) => ({
      ...prev,
      correctAnswer: selectedText,
      correctIndex: index,
    }));
  };
  
  // Open edit modal and populate form
  const handleEditOpen = (question: question, idx: number) => {
    setEditShow(true);
    setForm({
      CourseCode: questionData[idx].CourseCode,
      CourseChapter: Number(questionData[idx].CourseChapter),
      question: question.question,
      options: [
        { text: question.options[0] },
        { text: question.options[1] },
        { text: question.options[2] },
        { text: question.options[3] },
      ],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      allowedTime: question.allowedTime,
      correctIndex: question.options.findIndex(option => option === question.correctAnswer),
    });
    setId(question._id);
  };
  
  // Reset form and close edit modal
  const clearAll = () => {
    setEditShow(false);
    setForm({
      CourseCode: "",
      CourseChapter: 0,
      question: "",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctAnswer: "",
      explanation: "",
      allowedTime: 0,
      correctIndex: -1,
    });
  };
  
  // Handle input change for form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Submit a new question
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation
    if (!form.CourseCode ||
        !form.CourseChapter ||
        !form.question ||
        !form.options.every(option => option.text.trim() !== "") ||
        !form.correctAnswer ||
        !form.explanation ||
        form.allowedTime <= 0
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    try {
      await api.post("/Question", {
        CourseCode: form.CourseCode,
        CourseChapter: Number(form.CourseChapter),
        Questions: [{
          question: form.question,
          options: form.options.map(opt => opt.text),
          correctAnswer: form.correctAnswer,
          explanation: form.explanation,
          allowedTime: form.allowedTime,
        }]
      });
  
      clearAll();
      toast.success("question sent successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) toast.error("All fields required.");
        else if (error.response?.status === 500) toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to send question. Please try again later.");
      }
      console.error("Error sending question form:", error);
    }
  };
  
  // Edit an existing question
  const EditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return console.log("No ID provided for editing course.");
  
    try {
      await api.put(`/Question/${id}`, {
        question: form.question,
        options: form.options.map(opt => opt.text),
        correctAnswer: form.correctAnswer,
        explanation: form.explanation,
        allowedTime: form.allowedTime,
      });
  
      clearAll();
      setEditShow(false);
      toast.success("question Updated successfully!");
      fetchAllQuestions(); // Refresh question list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) toast.error("Course already exists. Use a different code.");
        else if (error.response?.status === 500) toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to send options. Please try again later.");
      }
      console.error("Error sending Question form:", error);
    } finally {
      fetchAllQuestions();
    }
  };
  
  // Pop-up state for deletion confirmation
  const [popUp, setPopup] = useState(false);
  
  // Trigger deletion confirmation
  const CheckDeletion = (question: question) => {
    setId(question._id);
    setPopup(true);
    if (!question._id) console.error("No ID provided for deletion.");
  };
  
  // Delete a question
  const DeleteCourse = async (id: String) => {
    setPopup(false);
    if (!id) return console.error("No ID provided for deletion.");
  
    try {
      await api.delete(`/question/${id}`);
      toast.success("Question deleted successfully!");
      fetchAllQuestions(); // Refresh questions
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) toast.error("Question not found.");
      else toast.error("Failed to delete Question. Please try again later.");
      console.error("Error deleting course:", error);
    }
  };
  


  return (
    <>
      <div className="container py-4 ">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Question Management</h2>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => handleOpen()}
          >
            <FaPlus className="me-2" /> Add Question
          </button>
        </div>

        {questionData.map((data,idx) => (
          <div className="card shadow-sm p-4 mb-4 border-none" style={{border:"none"}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">{data.CourseCode}</h4>
                <small className="text-muted">
                Chapter {data.CourseChapter}
                </small>
              </div>
            </div>

            <div className="mb-5">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "50%" }}>Question</th>
                      <th style={{ width: "35%" }}>Correct Answer</th>
                      <th style={{ width: "15%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    { Loading ? (<Loader1/>) : 
                    IsRateLimited ? (<RateLimitWarning/>) :
                    data.Questions.length > 0 ? ( data.Questions.map((question, index) => (
                      <tr key={index}>
                        <td>{question.question}</td>
                        <td>{question.correctAnswer}</td>
                        <td>
                          <div className="d-flex justify-content-start gap-3">
                            <FaEdit
                              className="text-primary"
                              role="button"
                              onClick={() => handleEditOpen(question,idx)}
                            />
                            <FaTrash
                              className="text-danger"
                              role="button"
                              onClick={() => CheckDeletion(question)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{fontSize: "large"}}>
                          <span  className="text-danger fw-bold fs-2"> No Question</span> available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
        </div>))}
      </div>

      {show && (
        <>
          <div className="modal show fade d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="fw-bold mb-0">Add New Question</h4>
                  <small className="text-muted">Create New Question</small>
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
                      <option value="" >Select a course code</option>
                      {CourseData.map((course, idx) => (
                        <option key={idx} value={course.CourseCode}>
                          {course.CourseCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                      <label className="form-label">Course Chapter</label>
                      <select
                        name="CourseChapter"
                        className="form-select rounded-pill bg-light"
                        value={form.CourseChapter}
                        onChange={handleChange}
                      >
                      <option value="" >Select a Chapter</option>
                      {chapterData
                        .filter((chapters) => chapters.CourseCode === form.CourseCode)
                        .flatMap((chapters) =>
                          chapters.Chapters.map((chapter, idx) => (
                            <option key={idx} value={chapter.ChapterNumber}>
                              {`Chapter ${chapter.ChapterNumber}`}
                            </option>
                          ))
                      )}

                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                      name="question"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter question Content"
                      value={form.question}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="form-label">Options</label>
                  {form.options.map((option, index) => (
                    <div key={index} className="d-flex gap-3 align-items-center mb-2">
                      <input
                        name={`option-${index}`}
                        className="form-control rounded-3 bg-light"
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />

                      <label
                        className={`d-flex align-items-center gap-2 px-3 py-1 rounded-3 ${
                          form.correctIndex === index ? "bg-success text-white" : ""
                        }`}
                        style={{
                          border: "2px solid lightBlue",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => handleCorrectSelect(index)}
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          checked={form.correctIndex === index}
                          onChange={() => handleCorrectSelect(index)}
                          style={{ display: "none" }} // hides the circle
                        />
                        {form.correctIndex === index  ?  <>Correct</>  :  <>Mark <span>Correct</span></>}
                      </label>
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Explanation</label>
                    <textarea
                      name="explanation"
                      className="form-control rounded-3 bg-light"
                      rows={3}
                      placeholder="Enter question Description"
                      value={form.explanation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">allowedTime</label>
                    <select
                      name="allowedTime"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.allowedTime}
                    >
                      <option value="" >Enter allowed Time</option>
                        <option value={15}>
                          15 Second
                        </option>
                        <option value={30}>
                          30 Second
                        </option>
                        <option value={60}>
                          1 minute
                        </option>
                        <option value={120}>
                          2 minute
                        </option>
                        <option value={180}>
                          3 minute
                        </option>
                        <option value={240}>
                          4 minute
                        </option>
                        <option value={300}>
                          5 minute
                        </option>
                        <option value={420}>
                          7 minute
                        </option>
                        <option value={600}>
                          10 minute
                        </option>
                        <option value={900}>
                          15 minute
                        </option>
                        <option value={1200}>
                          20 minute
                        </option>
                        <option value={1800}>
                          30 minute
                        </option>
                    </select>
                  </div>

                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                  >
                    Add question 
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
                  <h4 className="fw-bold mb-0">Update Exiting Question</h4>
                  <small className="text-muted">Update Question</small>
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
                      <select
                        name="CourseCode"
                        className="form-select rounded-pill bg-light"
                        value={form.CourseCode}
                        onChange={handleChange}
                        disabled
                      >
                      <option value="" >Select a course code</option>
                      {CourseData.map((course, idx) => (
                        <option key={idx} value={course.CourseCode}>
                          {course.CourseCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                      <label className="form-label">Course Chapter</label>
                      <select
                        name="CourseChapter"
                        className="form-select rounded-pill bg-light"
                        value={form.CourseChapter}
                        onChange={handleChange}
                        disabled
                      >
                      <option value="" >Select a Chapter</option>
                      {chapterData
                        .filter((chapters) => chapters.CourseCode === form.CourseCode)
                        .flatMap((chapters) =>
                          chapters.Chapters.map((chapter, idx) => (
                            <option key={idx} value={chapter.ChapterNumber}>
                              {chapter.ChapterNumber}
                            </option>
                          ))
                      )}

                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                      name="question"
                      className="form-control rounded-3 bg-light"
                      type="text"
                      placeholder="Enter question Content"
                      value={form.question}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="form-label">Options</label>
                  {form.options.map((option, index) => (
                    <div key={index} className="d-flex gap-3 align-items-center mb-2">
                      <input
                        name={`option-${index}`}
                        className="form-control rounded-3 bg-light"
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />

                      <label
                        className={`d-flex align-items-center gap-2 px-3 py-1 rounded-3 ${
                          form.correctIndex === index ? "bg-success text-white" : ""
                        }`}
                        style={{
                          border: "2px solid lightBlue",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => handleCorrectSelect(index)}
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          checked={form.correctIndex === index}
                          onChange={() => handleCorrectSelect(index)}
                          style={{ display: "none" }} // hides the circle
                        />
                        {form.correctIndex === index  ?  <>Correct</>  :  <>Mark <span>Correct</span></>}
                      </label>
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Explanation</label>
                    <textarea
                      name="explanation"
                      className="form-control rounded-3 bg-light"
                      rows={3}
                      placeholder="Enter question Description"
                      value={form.explanation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">allowedTime</label>
                    <select
                      name="allowedTime"
                      className="form-select rounded-pill bg-light"
                      onChange={handleChange}
                      value={form.allowedTime}
                    >
                      <option value="" >Enter allowed Time</option>
                        <option value={15}>
                          15 Second
                        </option>
                        <option value={30}>
                          30 Second
                        </option>
                        <option value={60}>
                          1 minute
                        </option>
                        <option value={120}>
                          2 minute
                        </option>
                        <option value={180}>
                          3 minute
                        </option>
                        <option value={240}>
                          4 minute
                        </option>
                        <option value={300}>
                          5 minute
                        </option>
                        <option value={420}>
                          7 minute
                        </option>
                        <option value={600}>
                          10 minute
                        </option>
                        <option value={900}>
                          15 minute
                        </option>
                        <option value={1200}>
                          20 minute
                        </option>
                        <option value={1800}>
                          30 minute
                        </option>
                    </select>
                  </div>


                </div>

                <div className="modal-footer border-0">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold rounded-pill"
                    onClick={EditCourse}
                  >
                    Update Question
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
          <p className="text-dark">Do you want to delete this Question?</p>
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

export default QuestionManagement;
