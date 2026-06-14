
// set question data type
export type question={
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
    allowedTime: number;
    courseId: string;
    createdAt: Date;
    id:number;
}

export type allQuestions = {
    Questions: question[];
    CourseCode: string;
    CourseChapter: string;
    _id: string;
}

export type TestResult = {
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
}
