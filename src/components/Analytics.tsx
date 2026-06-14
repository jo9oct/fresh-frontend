import React,{useEffect} from "react";
import type { ReactNode } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import { useViewStore } from "../Store/viewStore.ts";
import {useBlogStore} from "../Store/BlogStore.tsx";
import {useAuthStore} from "../Store/authStore.ts"

const AnalyticsDashboard: React.FC = () => {

  const { view, fetchView } = useViewStore(); // Fetch analytics/view data from store
  const { fetchUserLog, setVerifiedUsersCount, setTotalUsers } = useAuthStore(); // Fetch user logs & update user stats

  useEffect(() => {
    const fetchData = async () => {
      await fetchView(); // Fetch view data on component mount
    }
    fetchData();
  }, []); // Empty dependency: runs only once

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchUserLog(); // Fetch user logs on mount
    }
    fetchUserData();
  }, []); // Empty dependency: runs only once

  // Calculating totals
  const total = view?.TotalView ?? 0; // Total site views
  const totalCourseView = view?.CorseView?.reduce((sum, v) => sum + v.TotalCourseView, 0) ?? 0; // Total views per course
  const totalQuestionView = view?.CorseView?.reduce((sum, v) => sum + v.TotalQuestionView, 0) ?? 0; // Total question views
  const totalBlog = Number(view?.TotalBlogView); // Total blog views
  const blogView = totalBlog / 3; // Some derived metric (divide by 3)

  // Average engagement calculation
  let AvgEngagement = 0;
  if (totalCourseView > 0) {
    AvgEngagement = Number(((totalQuestionView * 100) / totalCourseView).toFixed(2)) || 0; // Engagement % based on questions vs course views
  }

  const { blogs, fetchBlogs } = useBlogStore(); // Blog data store

  useEffect(() => {
    fetchBlogs(); // Fetch blogs on mount
  }, [fetchBlogs]); // Only refetch if fetchBlogs reference changes

  // Blog statistics
  const publishedCounts = blogs.filter(post => post.BlogPublish === true).length ?? 0; // Count of published blogs
  const ReadTimes = blogs.reduce((sum, v) => sum + v.BlogTime, 0) ?? 0; // Total reading time across all blogs
  const blogLength = blogs.filter(post => post.BlogPublish).length ?? 0; // Number of published blogs
  const avgReadTimes = (ReadTimes / blogLength).toFixed(1); // Average read time per published blog

  // Chart datasets
  const viewsData = {
    labels: view?.CorseView?.map(post => post.CourseCode), // X-axis: Course codes
    datasets: [
      {
        label: "Views",
        data: view?.CorseView?.map(post => post.TotalCourseView), // Y-axis: Course views
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const engagementData = {
    labels: view?.CorseView?.map(post => post.CourseCode), // X-axis: Course codes
    datasets: [
      {
        label: "Engagement Rate (%)",
        data: view?.CorseView?.map(
          post => Number(((post.TotalQuestionView * 100) / (post.TotalCourseView / 3)).toFixed(2)) // Engagement rate per course
        ),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const statusData = {
    labels: ["Published", "unpublished"], // Blog status
    datasets: [
      {
        data: [
          blogs.filter(post => post.BlogPublish === true).length, // Published count
          blogs.filter(post => post.BlogPublish === false).length, // Unpublished count
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const statusDatas = {
    labels: ["Total Blog View", "Total Read"], // Blog metrics
    datasets: [
      {
        data: [
          blogView, // Derived blog view metric
          view?.TotalBlogReader, // Total blog readers
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="container py-4">
      <h1 className="text-primary mb-4">Analytics Dashboard</h1>

      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        <MetricCard title="Total Views" value={total.toLocaleString()} change="" icon="👁️" />
        <MetricCard title="Avg. Engagement" value={`${Number(AvgEngagement)}%`} change="" icon="💬" />
        <MetricCard title="Published Posts" value={publishedCounts} change="" icon="📝" />
        <MetricCard title="Avg. Read Time" value={`${avgReadTimes} min`} change="" icon="⏱️" />
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <MetricCard title="Total Logging User" value={setTotalUsers.toLocaleString()} change="" icon="👍" />
        <MetricCard title="Total Logging And Verify User" value={setVerifiedUsersCount.toLocaleString()} change="" icon="👌" />
      </div>

      <div className="row mb-4">
        <div className={`col-md-6 text-white `} >
          <ChartCard title="Views by Each Course" >
            <Bar data={viewsData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </ChartCard>
        </div>
        <div className="col-md-6 text-white">
          <ChartCard title="Engagement Rate by Course">
            
            <Line
              data={engagementData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </ChartCard>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <ChartCard  title="Post Status Distribution">
            <Pie data={statusData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </ChartCard>
        </div>
        <div className="col-md-6">
          <ChartCard title="Post Status Distribution">
            <Pie data={statusDatas} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = "primary" }) => (
  <div className="col">
    <div className={`card border-top border-${color} shadow-sm`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-muted mb-0">{title}</h6>
          <span className="fs-5">{icon}</span>
        </div>
        <h4 className={`fw-bold text-${color} my-2`}>{value}</h4>
        <small className="text-muted">{change}</small>
      </div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5 className="card-title mb-3">{title}</h5>
      <div style={{ height: "300px" }}>{children}</div>
    </div>
  </div>
);

export default AnalyticsDashboard;
