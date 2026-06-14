
import React, { useEffect } from "react";
import { useCourseStore } from "../Store/CourseStore.tsx";
import { useFullChapterStore } from "../Store/FullChapterStore.tsx";
import {useQuestionStore} from "../Store/FullQuestionStore.tsx"
import {useBlogStore} from "../Store/BlogStore.tsx"
import {
  FaBook, 
  FaQuestionCircle,
  FaLayerGroup,
  FaBlog, 
} from "react-icons/fa";


const StatCard: React.FC = () => {

  const { CourseData, fetchCourseData } = useCourseStore(); // Access courses array and function to fetch courses
  const { chapterData, fetchAllChapters } = useFullChapterStore(); // Access chapters array and function to fetch all chapters
  const { fetchAllQuestions, questionData } = useQuestionStore(); // Access questions array and function to fetch all questions
  const { fetchBlogs, blogs } = useBlogStore(); // Access blogs array and function to fetch all blogs

  useEffect(() => {
    const fetch = async () => {
      await fetchCourseData(); // Fetch all courses from API/store
      await fetchAllChapters(); // Fetch all chapters from API/store
      await fetchAllQuestions(); // Fetch all questions from API/store
      await fetchBlogs(); // Fetch all blogs from API/store
    };
    fetch(); // Trigger fetch on component mount
  }, []); // Empty dependency array ensures this effect runs only once
  

  
  const totalCourses = CourseData.length;

  const totalBlog = blogs.length

  // const blogCount = blogs.reduce((sum, b) => {
  //   return b.BlogPublish === true ? sum + 1 : sum;
  // }, 0);
  
  const totalChapters = chapterData.reduce((sum, course) => {
    return sum + course.Chapters.length;
  }, 0);
  
  const totalQuestions = questionData.reduce((sum, question) => {
    return sum + question.Questions.length;
  }, 0);

  const stats = [
    {
      title: "Total Courses",
      icon: <FaBook />,
      value: totalCourses,
      badge: "Active Learning Modules",
      className: "courses",
    },
    {
      title: "Chapters",
      icon: <FaLayerGroup />,
      value: totalChapters,
      badge: "Organized Content",
      className: "chapters",
    },
    {
      title: "Questions",
      icon: <FaQuestionCircle />,
      value: totalQuestions,
      badge: "Practice Sets",
      className: "questions",
    },
    {
      title: "Blog Posts",
      icon: <FaBlog />,
      value: totalBlog,
      badge: "Learning Resources",
      className: "blogs",
    },
  ];

  return (
    <div className="stats-container">
      <style>{`
        .stats-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
      }


        .stat-card {
          background:   linear-gradient(140deg, #1900ffff, #000000ff);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          max-width: 303px;
          max-height: 160px;
          flex: 1;
        }

        .stat-card.courses {
          min-width: 220px;
          background: linear-gradient(140deg, #00af09ff, #000000ff);
        }

        .stat-card.chapters {
          min-width: 220px;
          background: linear-gradient(140deg, #9d05b1ff, #000000ff);
        }

        .stat-card.questions {
          min-width: 220px;
          background: linear-gradient(140deg, #f00606ff, #000000ff);
        }

        .stat-card.blogs {
          min-width: 220px;
          background: linear-gradient(140deg, #0629f0ff, #000000ff);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.5px;
          margin-bottom: 35px;
        }

        .stat-icon {
          border-radius: 50%;
          display: flex;
          margin-right: 15px;
          margin-top: -23px;
          justify-content: right;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0px;
        }

        .stat-badge {
          display: inline-block;
          color: #ffffffff;
          padding: 0px 0px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 0px;

        }

        @media (max-width: 768px) {
          .stats-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {stats.map((item, index) => (
        <div className={`stat-card ${item.className}`} key={index}>
          <div className="stat-title">
            {item.title}
            <span className="stat-icon">{item.icon}</span>
          </div>
          <div className="stat-value">{item.value}</div>
          <span className="stat-badge">{item.badge}</span>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
