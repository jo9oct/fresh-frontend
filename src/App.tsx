
// built-in or library imports
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";

// Layout components
import {MainLayout} from "./components/ui/MainLayout.tsx";
import AdminMenuLayout from "./components/ui/AdminMenuLayout.tsx";
import SuperAdminMenuLayout from "./components/ui/SuperAdminManuLayout.tsx";

// User Pages
import Home from "./Pages/Home.tsx";
import About from "./Pages/About.tsx";
import Blog from "./Pages/Blog.tsx";
import Contact from "./Pages/Contact.tsx";
import Courses from "./Pages/Courses.tsx";
import BlogDetail from "./Pages/BlogDetail.tsx";
import ChapterView from "./Pages/ChapterView.tsx";
import Result from "./Pages/Result.tsx";
import QuizModes from "./Pages/QuizModes.tsx";
import StartQuiz from "./Pages/StartQuiz.tsx";
import NotFound from "./Pages/NotFound.tsx";

// Admin pages
import AdminBlogPost from "./Pages/AdminBlogPost.tsx";
import AdminChapters from "./Pages/AdminChapters.tsx";
import AdminQuestions from "./Pages/AdminQuestions.tsx";
import Admin from "./Pages/Admin.tsx";

// Super admin pages
import SuperAdmin from "./Pages/SuperAdmin.tsx";

// User authentication pages
import UserLogin from "./Pages/UserLogin.tsx";
import UserRegister from "./Pages/UserRegister.tsx";
import GoogleCallback from "./Pages/GoogleCallback.tsx";
import ForgotPassword from "./Pages/forgotPassword.tsx";
import ResetPassword from "./Pages/ResetPassword.tsx";
import EmailVerificationPage from "./Pages/EmailVerificationPage.tsx";

// Route protection components
import {ProtectAuthenticationAdmin} from "./components/routes/AllPrivateRoute.tsx"
import {ProtectAuthenticationSuperAdmin} from "./components/routes/AllPrivateRoute.tsx"
import {RedirectAuthentication} from "./components/routes/AllPrivateRoute.tsx"

// Global auth state
import { useAuthStore } from "./Store/authStore.ts";

function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth); // Get the function to verify user authentication
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth); // Get the loading state for auth check

  useEffect(() => {
    checkAuth(); // Run authentication check when component mounts
  }, [checkAuth]);

  if (isCheckingAuth) {
    // Show loading spinner while auth status is being verified
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner animation="border" variant="primary" /> {/* Loading spinner from react-bootstrap */}
      </div>
    );
  }


  return (

    <>

      <Routes>
        <Route>
          {/* Public or unauthenticated routes */}
          <Route path="/User/EmailVerificationPage" element={<EmailVerificationPage />} />
          <Route path="/User/Login" element={<RedirectAuthentication><UserLogin /></RedirectAuthentication>} /> {/* Redirect if already logged in */}
          <Route path="/google/callback" element={<GoogleCallback />} /> {/* OAuth callback route */}
          <Route path="/user/register" element={<RedirectAuthentication><UserRegister /></RedirectAuthentication>} /> {/* Redirect if already logged in */}
          <Route path="/blog/detail" element={<BlogDetail />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/Reset-Password/:token" element={<ResetPassword />} /> {/* Reset password with token */}
          <Route path="/user/verify-email" element={<EmailVerificationPage />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Route>

        <Route element={<MainLayout />}>
          {/* Main public layout routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/Chapter/:CourseCodes" element={<ChapterView />} /> {/* Dynamic course chapter route */}
          <Route path="/Course/StartQuiz/:CourseCodes" element={<StartQuiz />} /> {/* Quiz start route */}
          <Route path="/Course/QuizModes/:CourseCodes" element={<QuizModes />} /> {/* Quiz modes selection */}
          <Route path="/Course/Result" element={<Result />} /> {/* Quiz result page */}
        </Route>

        <Route element={<AdminMenuLayout />}>
          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectAuthenticationAdmin><Admin/></ProtectAuthenticationAdmin>} />
          <Route path="/admin/BlogPost" element={<ProtectAuthenticationAdmin><AdminBlogPost /></ProtectAuthenticationAdmin>} />
          <Route path="/admin/chapters" element={<ProtectAuthenticationAdmin><AdminChapters /></ProtectAuthenticationAdmin>} />
          <Route path="/admin/question" element={<ProtectAuthenticationAdmin><AdminQuestions /></ProtectAuthenticationAdmin>} />
        </Route>

        <Route element={<SuperAdminMenuLayout />}>
          {/* SuperAdmin protected routes */}
          <Route path="/superAdmin" element={<ProtectAuthenticationSuperAdmin><SuperAdmin /></ProtectAuthenticationSuperAdmin>} />
        </Route>
      </Routes>

    </>
  );
}

export default App;
