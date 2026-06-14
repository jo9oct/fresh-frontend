
import React from "react"

export const QuizTimeCount: React.FC = () => {
    return (
      <>
          <div className="d-flex justify-content-center align-items-center gap-3">
             <img src="/public/clock.png" alt="icon" width={"25px"} height={"25px"} />
             <p className="fw-bold fs-4 " style={{color:"#179227" , marginTop:"15px"}}>2:20</p>
          </div>
      </>
    )
}

export default QuizTimeCount;