
import React from "react";

const Answer: React.FC = () => {


    return (
        <>
            
            <div className="rounded-4 mb-4" style={{border:"5px solid #0c8a0ce0" , padding:"15px 40px"}}>
                <p className="text-black-50">Question 1</p>
                <p>Which of the following is a correct sentence?</p>
                <div className="d-flex gap-3 rounded-2 d-flex align-items-center mb-3" style={{border:"1px solid #124164" , paddingLeft:"30px" , backgroundColor:"#59f86e59"}}>
                    <i>icon</i>
                    <p>I am go to school</p>
                </div>
                <p><span className="fw-bold">Explanation:</span>  Simple present tense uses the base form of the verb with "I".</p>
            </div>
            
            <div className="rounded-4 mb-4" style={{border:"5px solid #ce0e0ecd" , padding:"15px 40px"}}>
                <p className="text-black-50">Question 1</p>
                <p>Which of the following is a correct sentence?</p>
                <div className="d-flex gap-3 rounded-2 d-flex align-items-center mb-3" style={{border:"1px solid #124164" , paddingLeft:"30px" , backgroundColor:"#d3707059"}}>
                    <i>icon</i>
                    <p>I am go to school</p>
                </div>
                <p><span className="fw-bold">Explanation:</span>  Simple present tense uses the base form of the verb with "I".</p>
            </div>

        </>
    );
};


export default Answer;