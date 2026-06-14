

import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../Store/TeamToggle";

const HomeUi: React.FC = () => {


    const { isDark } = useThemeStore();
    const navigation=useNavigate()

    return (
        <>

            <div className={`homeMaster d-flex flex-column align-items-center justify-content-center text-center py-4 mb-5 ${isDark ? "HeaderToggle" : ""} `}>
                <h2>Master Your <span>Freashman Exam</span></h2>
                <p className="col-12 col-sm-8 col-md-6 my-3">
                    Practice and prepare for the Ethiopian University Freshman Entrance Exam with our comprehensive collection of chapter-based multiple-choice quizzes and study materials.
                </p>

                <div className="row w-100 justify-content-center gap-3 my-3 px-3">
                    <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                    <button className="w-100 border-0 px-4 py-2 rounded-2 text-white" style={{ backgroundColor: "#179227" }} onClick={() => navigation("/courses")}>
                        Start practicing now
                    </button>
                    </div>
                    <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                    <button className="btn-tip w-100 border-0 px-4 py-2 rounded-2 " onClick={() => navigation("/blog")}>
                        Study tips & guide
                    </button>
                    </div>
                </div>
            </div>


            <div className={`d-flex flex-column align-items-center text-center mb-4 `}>
                <h4 className="mb-3">Why use Freshman Exam?</h4>
                <p className="col-12 col-sm-8 col-md-6">
                    We provide the most comprehensive and effective exam preparation platform, specifically designed for Ethiopian university freshmen.
                </p>
            </div>

            <div className={` container my-5 `}>
                <div className="row g-4 justify-content-center">
                    {[
                    {
                        icon: "/growth.png",
                        title: "Comprehensive Courses",
                        desc: "All 12 freshman university courses with detailed chapter breakdowns."
                    },
                    {
                        icon: "/3d-alarm.png",
                        title: "Timed Practice",
                        desc: "Practice with both timed and untimed quizzes."
                    },
                    {
                        icon: "/search.png",
                        title: "Smart Search",
                        desc: "Quickly find specific topics and questions."
                    },
                    {
                        icon: "/youth.png",
                        title: "Progress Tracking",
                        desc: "Monitor your performance and improvement over time."
                    }
                    ].map((item, idx) => (
                    <div
                        className={` col-12 col-sm-6 col-lg-3 d-flex ${isDark ? "HeaderToggle" : "" }`}
                        key={idx}
                    >
                        <div
                        className={`staticCard flex-fill text-center p-4 rounded-4 shadow-sm border h-100 d-flex flex-column align-items-center justify-content-start gap-3 bg-white card-hover ${isDark ? "HeaderToggle" : "" }`}
                        style={{ transition: "all 0.3s ease-in-out" }}
                        >
                        <img
                            src={item.icon}
                            alt={item.title}
                            width="40"
                            height="40"
                            className="mb-2"
                        />
                        <h5 className="fw-semibold">{item.title}</h5>
                        <p className="muted small mb-0">{item.desc}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="d-flex flex-column align-items-center text-center">
                <h3 className="my-3">Available Courses</h3>
                <p className="col-12 col-sm-8 col-md-6 mx-2">
                    Practice with quizzes from all 12 freshman university courses. Each course includes multiple chapters with detailed explanations.
                </p>
            </div>

        </>
    );
};


export default HomeUi;

