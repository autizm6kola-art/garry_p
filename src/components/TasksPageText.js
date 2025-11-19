// import React, { useEffect, useState } from "react";
// import BackButton from "./BackButton";
// import TaskTextWithQuestions from "./TaskTextWithQuestions";
// import { clearAnswersByIds } from "../utils/storage";
// import "../styles/tasksPage.css";

// function TasksPageText({ tasks, goBack }) {
//   const [resetSignal, setResetSignal] = useState(0);

//   if (!tasks || tasks.length === 0) {
//     return <div>Нет заданий</div>;
//   }

//   // Берём первое (или единственное) задание из списка
//   const currentTask = tasks[0];

//   const resetCurrentRange = () => {
//     // Очищаем все ответы для этого задания (все 10 вопросов)
//     const questionIds = currentTask.questions.map(
//       (q) => `${currentTask.id}-${q.id}`
//     );
//     clearAnswersByIds(questionIds);
//     setResetSignal((prev) => prev + 1);
//   };

//   return (
//     <div >
//         <div className="backButton">
//             <BackButton />

//             <button onClick={goBack} className="back-link task-back-button">
//         ← Назад к выбору
//             </button>
//         </div>
//     <div >
//       <h1 className="task-heading">Страница</h1>
//       <hr />

//       <TaskTextWithQuestions key={resetSignal} task={currentTask} />
//     </div>
//       <div className="reset-button-contaner">
//         <button onClick={resetCurrentRange} className="reset-button">
//           Сбросить ответы
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TasksPageText;

import React, { useState, useEffect } from "react";
import { saveAnswerText, getSavedAnswer } from "../utils/storage";


const TasksPageText = ({ task, resetSignal }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // при сбросе компонента под новый диапазон загружаем ответы
    const savedAnswers = task.questions.map((q) => {
      const key = `${task.id}-${q.id}`;
      return getSavedAnswer(key) || "";
    });
    setAnswers(savedAnswers);
  }, [task, resetSignal]);

  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSaveAll = () => {
    answers.forEach((answer, i) => {
      const key = `${task.id}-${task.questions[i].id}`;
      saveAnswerText(key, answer.trim());
    });
    alert("Ответы сохранены!");
  };

  return (
    <div className="task-container">
      <h3>{task.title}</h3>
      {task.questions.map((q, i) => (
        <div key={q.id} className="question-block">
          <p>{q.text}</p>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSaveAll}>Сохранить ответы</button>
    </div>
  );
};

export default TasksPageText;
