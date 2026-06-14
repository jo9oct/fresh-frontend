
import React, { useEffect } from "react";
import Loader1 from "../components/ui/Loader1"
import RateLimitWarning from "../components/ui/TimeLimit.tsx";
import type { blog } from "../types/Blog";
import BlogPost from "../components/BlogPost.tsx";
import { Link } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import { useTermStore } from "../Store/SearchStore.tsx";
import { useBlogStore } from "../Store/BlogStore.tsx";


const Blogs: React.FC = () => {

   let count = 0; // Counter for unpublished blogs
   const { blogs, loading, isRateLimited, fetchBlogs } = useBlogStore(); // Blog store
   
   // Count unpublished blogs until the first published one
   for (let b of blogs) {
     if (b.BlogPublish === true) {
       break; // Stop counting when the first published blog is found
     } else {
       count++; // Increment count for each unpublished blog
     }
   }
   
   // Fetch blogs when component mounts or fetchBlogs reference changes
   useEffect(() => {
     fetchBlogs();
   }, [fetchBlogs]);
   
   // Get the current search/filter term from the store
   const term = useTermStore(state => state.term);
   
   // Filter blogs based on the search term (case-insensitive)
   // If term is empty or null, all blogs are included
   const filteredData = blogs.filter((data) =>
     !term || data.BlogTitle.toLowerCase().includes(term.toLowerCase())
   );
   
   const { isDark } = useThemeStore(); // Theme mode (dark/light)
   


      return (
         <>

            <div className="container text-center my-5">
               <h3 className="mb-4">Study Tips and Educational Blog</h3>
               <i className="col-5">Expert advice, study strategies, and motivation for Ethiopian freshman students
                  learn from academic experts and successful students</i>
            </div>

            <div className="container py-3">
               
               <div className="card mb-5 shadow border-0">
                  <div className="row g-0 flex-column flex-md-row">
                     <div className="col-md-4" style={{ height: "300px" }}>
                           <img
                              src={blogs[count]?.BlogImg}
                              className="img-fluid rounded-start w-100 h-100"
                              alt="..."
                              style={{ objectFit: 'cover' }}
                           />
                     </div>
                     <div className={`blogPost col-md-8 ${isDark ? "HeaderToggle" : ""} `}>
                           <div className={`card-body`}>
                              <div className="tip d-flex flex-wrap align-items-center justify-content-between mb-3">
                                 <div
                                       className={`d-flex gap-2 align-items-center btn btn-sm ${isDark ? "HeaderToggle" : ""}`}
                                       style={{ backgroundColor: "#D6F5DC", color: "#179227" }}
                                 >  
                                       <p className="mb-0">Study Tip</p>
                                 </div>
                                 <div className="d-flex gap-2 align-items-center">
                                       <img src="/public/group.png" alt="group" width={20} height={20} />
                                       <p className="mb-0">Academic Team</p>
                                 </div>
                                 <div className="d-flex gap-2 align-items-center">
                                       <img src="/public/clock.png" alt="clock" width={20} height={20} />
                                       <p className="mb-0">{blogs[count]?.BlogTime} min read</p>
                                 </div>
                              </div>
                              <h5 className="card-title">{blogs[count]?.BlogTitle}</h5>
                              <p className="card-text">
                               {blogs[0]?.BlogDescription}
                              </p>
                              <Link  to="/blog/detail" state={{ BlogData : blogs[count] }}> <a href="#" className="btn btn-primary">Read Full Article</a> </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="d-flex justify-content-center container mb-4">
                     {loading ? (
                        <Loader1 />
                     ) : isRateLimited ? (
                        <RateLimitWarning />
                     ) : blogs.length > 0 ? (
                              <div className="row justify-content-start">
                                 {filteredData.slice(count + 1).map((data: blog) => (
                                    data.BlogPublish === true && (
                                       <div key={data._id} className={`col-12 col-md-5 col-lg-4 mb-4 ${isDark ? "HeaderToggle" : ""}`}>
                                       <BlogPost data={data} />
                                       </div>
                                 )))}
                              </div>
                     ) : (
                        <p className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{height:"65vh",fontSize:"xx-large"}}><span className="text-danger fw-bold fs-2">No Available Blog </span> Post available.</p>
                     )}
               </div>

         </>
      ); 

};


export default Blogs;