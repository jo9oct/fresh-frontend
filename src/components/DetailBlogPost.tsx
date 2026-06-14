

import React,{useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {formatDate} from "../lib/utils.ts";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import type{ views } from "../types/View.ts";
import api from "../lib/axios.tsx";

const DetailBlogPost: React.FC = () => {

  const { isDark } = useThemeStore(); // Access theme state (dark/light mode)
  const location = useLocation(); // React Router hook to get current location object
  const blogData = location.state?.BlogData; // Get blog data passed via navigation state
  const navigation = useNavigate(); // React Router hook to programmatically navigate
  
  // Effect to increment blog reader count only once per session
  useEffect(() => {
      const PostData = async () => {
          try {
              // Only post view if not already counted in this session
              if (!sessionStorage.getItem("viewDetailBlogCounted")) {
                  await api.put<views>("/view", {
                      TotalBlogReader: true, // Increment total blog reader count
                  });
                  sessionStorage.setItem("viewDetailBlogCounted", "true"); // Mark as counted
              }
          } catch (error) {
              console.error("❌ Error posting view:", error); // Log any API errors
          }
      };
  
      PostData(); // Call the async function once on mount
  
      return () => {
          // Cleanup: remove the session flag when component unmounts
          sessionStorage.removeItem("viewDetailBlogCounted");
      };
  }, []); // Empty dependency array ensures this runs only once
  
  // Function to get the first letter of BlogAuthor in uppercase
  const letter = () => {
      for (let i in blogData.BlogAuthor) {
          return blogData.BlogAuthor[i].toUpperCase(); // Return first character in uppercase
      }
  };
  
    return (
        <> 
                <div className={`container ${isDark ? "HeaderToggle" : ""}`}>
                    <button className={`back d-flex justify-content-center align-items-center gap-2 border-0 px-4 py-2 mt-5 rounded text-white  ${isDark ? "HeaderToggle" : ""}`} style={{marginLeft:"10rem" ,backgroundColor:"#041826b9"}} onClick={() => navigation("/blog")}><i className="fa-solid fa-left-long"></i> Back</button>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-column py-5">
                    <div className="col-5 justify-content-center">
                        <div className={`${isDark ? "HeaderToggle" : ""}`}>
                            <p className={`shadow text-center py-2 w-100 ${isDark ? "HeaderToggle" : ""}`}>Study Tip 👇</p>
                        </div>
                        <h1 className="my-5">{blogData.BlogTitle}</h1>
                        <div className="d-flex align-items-center gap-4 mb-3  border-bottom border-top p-2">
                            <div className="d-flex justify-content-center align-items-center rounded-circle fs-2" style={{backgroundColor:"tomato" , width:"50px" , height:"50px"}}>{letter()}</div>
                            <div className="d-flex align-items-center gap-5">
                                <p>{ blogData.BlogAuthor}</p>
                                <p className="text-black-50">• {blogData.BlogTime} min read</p>
                                <p className="text-black-50">• {formatDate((blogData?.createdAt))}</p>
                            </div>
                        </div>
                        <div className="my-4">
                            <img src={blogData.BlogImg} alt="Blog Image" width={"640px"}/>
                        </div>
                        <p>{blogData.BlogDescription}</p>
                        <h3>{blogData.BlogSlug}</h3>
                        <p>{blogData.BlogContent}</p>
                        <p className="fw-semibold" style={{fontSize:"large"}}>Related tip : <a href={blogData.BlogTag}>{blogData.BlogTag}</a></p>
                    </div>
                </div>

        </>
    );
};


export default DetailBlogPost;
 