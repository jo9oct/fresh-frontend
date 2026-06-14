
import React,{useEffect} from "react";
import type { blog } from "../types/Blog";
import { Link } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle";
import api from "../lib/axios.tsx";
import type{views} from "../types/View.ts"

type BlogCardsProps = {
  data: blog;
};

const BlogPost: React.FC<BlogCardsProps> = ({data}) => {

  const { isDark } = useThemeStore(); // Get theme state (dark/light mode)

  useEffect(() => {
      const PostData = async () => {
        try {
          // Check if blog view has already been counted in this session
          if (!sessionStorage.getItem("viewBlogCounted")) {
            // Increment total blog view on the server
            await api.put<views>("/view", {
              TotalBlogView: true, // Signal that a blog view should be counted
            });
            // Mark view as counted in this session
            sessionStorage.setItem("viewBlogCounted", "true");
          }
        } catch (error) {
          console.error("❌ Error posting view:", error); // Log any errors
        }
      };
  
      PostData(); // Call the async function immediately
  
      // Cleanup function: remove the session flag when component unmounts
      return () => {
          sessionStorage.removeItem("viewBlogCounted");
      };
  
  }, []); // Empty dependency array ensures this runs only once on mount
  


    return (
        <>
    
                <div className={`blogPost card h-100 shadow border-0 ${isDark ? "HeaderToggle" : ""}`} >
                    <img src={data.BlogImg} className="card-img-top" alt="Blog Image"  height={"300px"}/>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                            <p className={`bg-c-green px-2 rounded text-white`}>{data.BlogTag}</p>
                            <div className="d-flex align-items-center gap-2">
                                <img src="/public/clock.png" alt="clock" width={20} height={20} />
                                <p className="mb-0">{data.BlogTime} min read</p>
                            </div>
                        </div>
                        <h5 className="card-title">{data.BlogTitle}</h5>
                        <p className="truncate card-text">{data.BlogDescription}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <img src="/public/group.png" alt="group" width={20} height={20} />
                                <p className="mb-0">Academic Team</p>
                            </div>
                           <Link to="/blog/detail" state={{ BlogData : data }}><a href="#" className="btn btn-primary">Read More</a></Link>
                        </div>
                    </div>
                </div>
              
        </>
    );
};


export default BlogPost;
 