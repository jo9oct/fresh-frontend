import React, {  useState } from "react";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import api from "../lib/axios.tsx";
import toast from "react-hot-toast";
import axios from "axios";

const Contact: React.FC = () => {

  const { isDark } = useThemeStore(); // Theme mode (dark/light)

  const [form, setForm] = useState({
    name: "",     // User's name
    email: "",    // User's email
    subject: "",  // Subject of the message
    message: "",  // Message content
  });
  
  // Update form state on input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // dynamically update field by name
  };
  
  // Handle contact form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
  
    // Validate that all fields are filled
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    try {
      // Send form data to backend API
      await api.post("/email", {
        name: form.name,
        subject: form.subject,
        email: form.email,
        message: form.message,
      });
  
      // Clear form after successful submission
      setForm({ name: "", email: "", subject: "", message: "" });
  
      toast.success("Email sent successfully!");
    } catch (error) {
      // Handle server errors
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }
      console.error("Error sending contact form:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };
  
  return (
    <>
      {/* Ad Banner at the top */}
      <div className="container mb-4"></div>
      <main className={`container py-5 ${isDark ? "HeaderToggle" : ""}`}>
        <div className="row justify-content-center">
          {/* Left side: Get in Touch Form */}
          <div className={`blogPost col-12 col-lg-6 mb-4 mb-lg-0 card shadow  ${isDark ? "HeaderToggle" : ""}`}>
            <div className="" text-align>
              <h3 className="mb-3 card-title">Send a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="fw-bold mb-3">Full Name</label>
                  <input
                    type="text"
                    className="form-control text-dark"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="fw-bold mb-3">Email</label>
                  <input
                    type="email"
                    className="form-control text-dark"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="fw-bold mb-3">Subject</label>
                  <input
                    type="text"
                    className="form-control text-dark"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="fw-bold mb-3">Message</label>
                  <textarea
                    className="form-control text-dark"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100" style={{ backgroundColor: "#179227" , border: "none" }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
          {/* Right side: Get in Touch and FAQ Cards */}
          <div className="col-12 col-lg-6" >
            <div className="row gy-4" >
              {/* Get in Touch Card (duplicate for right side as requested) */}
              <div className={`col-12`}>
                <div className={` blogPost card shadow rounded-3 p-4 h-100  ${isDark ? "HeaderToggle" : ""}`}>
                  <h4 className="mb-3">Get in Touch</h4>
                  <h5>Email Support</h5>
                  <p>
                    Have questions or need support? Fill out the form or email
                    us at{" "}
                    <a href="mailto:support@freashmanexam.com" style={{color:"rgb(50, 50, 226)"}}>support@freashmanexam.com</a>
                    .
                  </p>
                  <h5>Academic Content</h5>
                  <p>
                    Questions about courses and quizzes <br />
                    <a href="mailto:academic@freshmanexam.com" style={{color:"rgb(50, 50, 226)"}}>
                      academic@freshmanexam.com
                    </a>
                  </p>
                  <h5>Technical Issues</h5>
                  <p>
                    For website problems and bug reports, please email us at{" "}
                    <a href="mailto:tech@freshmanexam.com" style={{color:"rgb(50, 50, 226)"}}>
                      tech@freshmanexam.com
                    </a>
                  </p>
                  <h5>Partnerships</h5>
                  <p>
                    Collaboration and business inquiries can be directed to{" "}
                    <a href="mailto:partnerships@freshmanexam.com" style={{color:"rgb(50, 50, 226)"}}>
                      partnerships@freshmanexam.com
                    </a>
                  </p>
                </div>
              </div>
              {/* FAQ Card */}
              <div className={`col-12`}>
                <div className={`blogPost card shadow rounded-3 p-4 h-100 ${isDark ? "HeaderToggle" : ""}`}>
                  <h4 className="mb-3">Frequently Asked Questions</h4>
                  <div>
                    <strong>Q: How do I contact support?</strong>
                    <p>A: Use the form or email us directly.</p>
                    <strong>Q: When will I get a response?</strong>
                    <p>A: We aim to respond within 24 hours.</p>
                    <strong>Q: Can I request new features?</strong>
                    <p>
                      A: Yes! Let us know your suggestions in the message box.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
