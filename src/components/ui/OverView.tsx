
import React, { useEffect } from "react";
import { useCourseStore } from "../../Store/CourseStore.tsx";
import { useFullChapterStore } from "../../Store/FullChapterStore.tsx";
import {useQuestionStore} from "../../Store/FullQuestionStore.tsx"
import {useBlogStore} from "../../Store/BlogStore.tsx"

const OverView: React.FC = () => {


   // Destructure data and fetch functions from various Zustand stores
  const { CourseData, fetchCourseData } = useCourseStore();
  const { chapterData, fetchAllChapters } = useFullChapterStore();
  const { fetchAllQuestions, questionData } = useQuestionStore();
  const { fetchBlogs, blogs } = useBlogStore();

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetch = async () => {
      await fetchCourseData(); // Fetch all courses
      await fetchAllChapters(); // Fetch all chapters
      await fetchAllQuestions(); // Fetch all questions
      await fetchBlogs(); // Fetch all blogs
    };
    fetch();
  }, []);

  // Calculate total number of courses
  const totalCourses = CourseData.length;

  // Calculate total blogs fetched
  const totalBlog = blogs.length;

  // Count only published blogs
  const blogCount = blogs.reduce((sum, b) => {
    return b.BlogPublish === true ? sum + 1 : sum;
  }, 0);

  // Calculate total number of chapters across all courses
  const totalChapters = chapterData.reduce((sum, course) => {
    return sum + course.Chapters.length;
  }, 0);

  // Calculate total number of questions across all chapters
  const totalQuestions = questionData.reduce((sum, question) => {
    return sum + question.Questions.length;
  }, 0);


    return(
        <>
            <div className={`row g-4 mb-5 `}>
            <div className="col-md-3">
              <div className="p-3 rounded text-white" style={{ background: 'linear-gradient(180deg, #707CFF, #0015FF)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Total Courses</div>
                  <div style={{ fontSize: 26 }}>📚</div>
                </div>
                <div className="mt-3">
                  <h4 className="fw-bold">{totalCourses}</h4>
                  <small className="fw-bold">Active Learning Modules</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 rounded text-white" style={{ background: 'linear-gradient(180deg, #17E61E, #018906)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Total Chapters</div>
                  <div style={{ fontSize: 26 }}>📚</div>
                </div>
                <div className="mt-3">
                  <h4 className="fw-bold">{totalChapters}</h4>
                  <small className="fw-bold">Study Section Available</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 rounded text-white" style={{ background: 'linear-gradient(180deg, #E253FF, #8200BF)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Total Questions</div>
                  <div style={{ fontSize: 26 }}>📚</div>
                </div>
                <div className="mt-3">
                  <h4 className="fw-bold">{totalQuestions}</h4>
                  <small className="fw-bold">Practice Questions</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 rounded text-white" style={{ background: 'linear-gradient(180deg, #FFA353, #F86001)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Blog Posts</div>
                  <div style={{ fontSize: 26 }}>📚</div>
                </div>
                <div className="mt-3">
                  <h4 className="fw-bold">{totalBlog}</h4>
                  <small className="fw-bold">{blogCount} published</small>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default OverView;
