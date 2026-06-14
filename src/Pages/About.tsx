import React from "react";
import { useThemeStore } from "../Store/TeamToggle";

const About: React.FC = () => {

  const { isDark } = useThemeStore();

  return (
    <>
       <div className={`text-center mb-5 ${isDark ? "HeaderToggle" : ""}`}>
          <h2>About FreshmanExam.com</h2>
          <p className="lead text-muted">
            Empowering Ethiopian university students to excel in their academic
            journey.
          </p>
        </div>
      <div className={`container py-5 ${isDark ? "HeaderToggle" : ""}`}>

        <div className={`blogPost card shadow rounded-2 py-0 h-100 mb-5 ${isDark ? "HeaderToggle" : ""}`}>
          <div className="card-body">
            <h2 className="card-title text-center p-0 mb-1">Our Mission</h2>
            <p className="card-body p-0 mb-1">
              FreshmanExam.com is dedicated to supporting Ethiopian university
              freshman students in their academic success. We provide
              comprehensive chapter-based practice quizzes and study resources
              specifically designed for the Ethiopian higher education
              curriculum.
            </p>
          </div>
        </div>
        <div className={`blogPost card mb-5 shadow rounded px-2 h-100 ${isDark ? "HeaderToggle" : ""}`}>
          <h3 className="card-title p-2">What We Offer</h3>

          <div className="row px-2 mb-4">
            <div className="col-md-6">
              <h5 className="py-2">Comprehensive Coverage</h5>
              <p className="p-1 mb-3">
                All 12 freshman university courses with detailed chapter
                breakdowns and hundreds of practice questions.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="py-2">Flexible Learning</h5>
              <p className="p-1 mb-3">
                Both timed and untimed quiz modes to suit different learning
                preferences and exam preparation strategies.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="py-2">Instant Feedback</h5>
              <p className="p-1 mb-3">
                Immediate results with detailed explanations to help you
                understand concepts and learn from mistakes.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="py-2">Study Resources</h5>
              <p className="p-1 mb-3">
                Expert-written study tips, exam strategies, and motivational
                content specifically for Ethiopian students.
              </p>
            </div>
          </div>
        </div>

        <div className={`card shadow p-2 mb-5 blogPost ${isDark ? "HeaderToggle" : ""}`}>
          <h3 className="py-2">Our Courses</h3>
          <div className="row py-1">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="py-1">📚 Communicative English I & II</li>
                <li className="py-1">🤝 Moral and Citizenship Education</li>
                <li className="py-1">💼 Entrepreneurship</li>
                <li className="py-1">🧬 General Biology</li>
                <li className="py-1">📐 Mathematics for Natural Sciences</li>
                <li className="py-1">📊 Mathematics for Social Sciences</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="py-1">⚛️ General Physics</li>
                <li className="py-1">💰 Introduction to Economics</li>
                <li className="py-1">🧠 General Psychology</li>
                <li className="py-1">🗺️ Geography of Ethiopia and The Horn</li>
                <li className="py-1">
                  💻 Introduction to Emerging Technologies
                </li>
                <li className="py-1">🏃‍♀️ Physical Fitness</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`blogPost card shadow px-3 mb-5 ${isDark ? "HeaderToggle" : ""}`}>
          <h3 className="card-title py-3">Why Choose Us?</h3>
          <ul className="list-unstyled">
            <li className="py-1">
              <h5 className="py-0">Ethiopian-Focused</h5>{" "}
              <p className="px-4">
                Our content is specifically designed for the Ethiopian
                university system, ensuring relevance and alignment with local
                curriculum standards.
              </p>
            </li>
            <li className="py-1">
              <h5 className="py-0">Mobile-Friendly</h5>{" "}
              <p className="px-4">
                Study anywhere, anytime with our mobile-optimized platform that
                works perfectly on smartphones and tablets.
              </p>
            </li>
            <li className="py-1">
              <h5 className="py-0">Free Access</h5>{" "}
              <p className="px-4">
                We believe education should be accessible to all. Our platform
                provides free access to quality study materials and practice
                quizzes.
              </p>
            </li>
            <li className="py-1">
              <h5 className="py-0">Regular Updates</h5>{" "}
              <p className="px-4">
                Our content is regularly updated to reflect current curriculum
                changes and incorporate feedback from students and educators.
              </p>
            </li>
          </ul>
        </div>

        <div className={`blogPost card shadow p-3 mb-5 ${isDark ? "HeaderToggle" : ""}`}>
          <h3 className="card-title py-2">Our Team</h3>
          <p className="px-3">
            FreshmanEXAM.com is built by a team of Ethiopian educators,
            university graduates, and technology professionals who understand
            the challenges faced by freshman students. Our content is developed
            in collaboration with experienced professors and successful
            graduates from Ethiopian universities
          </p>
        </div>

        <div className={`blogPost card shadow p-3  ${isDark ? "HeaderToggle" : ""}`}>
          <h3 className="cad-title">Contact Information</h3>
          <p>
            <strong>Email:</strong> info@freshmanexam.com <br />
            <strong>Support:</strong> support@freshmanexam.com <br />
            <strong>Address:</strong> Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
