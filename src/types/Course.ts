
// set course data type
export type course = {
    CourseIcon: string;
    CourseCode:string;
    CourseTitle: string;
    CourseDescription: string;
    TotalChapter:number;
    _id:string;
};

export type Chapter = {
    ChapterCode:string,
    ChapterNumber: number;
    ChapterTitle: string;
    ChapterDescription: string;
    _id: string;
}

// set Chapter data type
export type Course = {
    CourseCode: string;
    Chapters: Chapter[];
}

