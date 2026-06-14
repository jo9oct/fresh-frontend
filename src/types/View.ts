
// set views data type
export interface views {
    _id: string;
    TotalView: number;
    TotalBlogView: number;
    TotalBlogReader: number;
    CorseView: {
      CourseCode: string;
      TotalCourseView: number;
      TotalQuestionView: number;
    }[];
  }