

// import React, { useState, useEffect } from "react";
// import { getSavedAnswer, saveAnswerText, saveCorrectAnswer } from "../utils/storage";
// import "../styles/taskTextWithQuestions.css";

// function TaskTextWithQuestions({ task, onUpdateProgress, resetSignal }) {
//   const [answers, setAnswers] = useState([]);
//   const [statusByQuestion, setStatusByQuestion] = useState([]); // подсветка
//   const [saved, setSaved] = useState(false);

//   // 🟩 при загрузке страницы — подгружаем сохранённые ответы и сразу ставим подсветку
//   useEffect(() => {
//     const savedAnswers = task.questions.map(
//       (q) => getSavedAnswer(`${task.id}-${q.id}`) || ""
//     );
//     setAnswers(savedAnswers);

//     const initialStatus = savedAnswers.map((ans) =>
//       ans.trim() !== "" ? "correct" : "empty"
//     );

//     if (resetSignal) {
//       // плавный сброс подсветки
//       setStatusByQuestion(new Array(task.questions.length).fill("reset"));
//       setTimeout(() => setStatusByQuestion(initialStatus), 50);
//     } else {
//       setStatusByQuestion(initialStatus);
//     }
//   }, [task, resetSignal]);

//   const handleChange = (index, value) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = value;
//     setAnswers(newAnswers);
//     setSaved(false);
//   };

//   // 🟩 Сохраняем все ответы
//   const handleSaveAll = () => {
//     const newStatus = [];
//     let allAnswered = true;

//     answers.forEach((answer, i) => {
//       const questionId = `${task.id}-${task.questions[i].id}`;
//       const trimmed = answer.trim();

//       saveAnswerText(questionId, trimmed);

//       if (trimmed !== "") {
//         saveCorrectAnswer(questionId);
//         newStatus[i] = "correct";
//       } else {
//         newStatus[i] = "empty";
//         allAnswered = false;
//       }
//     });

//     if (allAnswered) {
//       saveCorrectAnswer(task.id);
//     }

//     setStatusByQuestion(newStatus);
//     setSaved(true);

//     if (onUpdateProgress) onUpdateProgress();
//   };

//   // 🟩 Сохраняем один вопрос
//   const handleSaveSingle = (index) => {
//     const newStatus = [...statusByQuestion];
//     const questionId = `${task.id}-${task.questions[index].id}`;
//     const trimmed = answers[index].trim();

//     saveAnswerText(questionId, trimmed);

//     if (trimmed !== "") {
//       saveCorrectAnswer(questionId);
//       newStatus[index] = "correct";
//     } else {
//       newStatus[index] = "empty";
//     }

//     setStatusByQuestion(newStatus);
//     setSaved(true);

//     if (onUpdateProgress) onUpdateProgress();
//   };

//   return (
//     <div>
//       <h1 className="task-heading">Страница {task.id}</h1>

//       <div className="task-container">
//         <div className="text-block">
//           <p>{task.textBlock}</p>
//         </div>

//         <div className="questions-block">
//           {task.questions.map((q, index) => (
//             <div
//               key={q.id}
//               className={`question-item ${
//                 statusByQuestion[index] === "correct"
//                   ? "question-correct"
//                   : statusByQuestion[index] === "empty"
//                   ? "question-empty"
//                   : statusByQuestion[index] === "reset"
//                   ? "question-reset"
//                   : ""
//               }`}
//             >
//               <div className="question-header">
                
//                 <strong>{q.id}.</strong>
//                 <p>{q.text}.</p>
                
//                 {/* <audio controls src={process.env.PUBLIC_URL + q.audio} /> */}
//                 <button
//                   className="save-single-button"
//                   onClick={() => handleSaveSingle(index)}
//                   title="Сохранить ответ"
//                 >
//                   ✓
//                 </button>
//               </div>

//               <input
//                 type="text"
//                 value={answers[index] || ""}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 placeholder="Ответ"
//                 className="answer-input"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskTextWithQuestions;


import React, { useState, useEffect } from "react";
import { getSavedAnswer, saveAnswerText, saveCorrectAnswer } from "../utils/storage";
import "../styles/taskTextWithQuestions.css";

function TaskTextWithQuestions({ task, onUpdateProgress, resetSignal }) {
  const [answers, setAnswers] = useState([]);
  const [statusByQuestion, setStatusByQuestion] = useState([]);

  // При загрузке подгружаем ответы
  useEffect(() => {
    const savedAnswers = task.questions.map(
      (q) => getSavedAnswer(`${task.id}-${q.id}`) || ""
    );
    setAnswers(savedAnswers);

    const initialStatus = savedAnswers.map((ans) =>
      ans.trim() !== "" ? "correct" : "empty"
    );

    if (resetSignal) {
      setStatusByQuestion(new Array(task.questions.length).fill("reset"));
      setTimeout(() => setStatusByQuestion(initialStatus), 50);
    } else {
      setStatusByQuestion(initialStatus);
    }
  }, [task, resetSignal]);

  // Изменение одного ответа
  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Сохранение одного ответа
  const handleSaveSingle = (index) => {
    const newStatus = [...statusByQuestion];
    const qId = `${task.id}-${task.questions[index].id}`;
    const trimmed = answers[index].trim();

    saveAnswerText(qId, trimmed);

    if (trimmed !== "") {
      saveCorrectAnswer(qId);
      newStatus[index] = "correct";
    } else {
      newStatus[index] = "empty";
    }

    setStatusByQuestion(newStatus);
    if (onUpdateProgress) onUpdateProgress();
  };

  return (
    <div>
      <h1 className="task-heading">Страница {task.id}</h1>

      <div className="task-container">
        <div className="text-block">
          <p>{task.textBlock}</p>
        </div>

        <div className="questions-block">
          {task.questions.map((q, index) => (
            <div
              key={q.id}
              className={`question-item ${
                statusByQuestion[index] === "correct"
                  ? "question-correct"
                  : statusByQuestion[index] === "empty"
                  ? "question-empty"
                  : statusByQuestion[index] === "reset"
                  ? "question-reset"
                  : ""
              }`}
            >
              <div className="question-header">
                <strong>{q.id}.</strong>
                <p>{q.text}.</p>
                {/* {q.audio && (
                  <audio controls 
                  src={process.env.PUBLIC_URL + q.audio}/>
                  )} */}

                <button
                  className="save-single-button"
                  onClick={() => handleSaveSingle(index)}
                  title="Сохранить ответ"
                >
                  ✓
                </button>
              </div>

              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Ответ"
                className="answer-input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskTextWithQuestions;
