

import React, { useEffect, useState } from "react";
import { generateRanges } from "../utils/utils"; // твоя функция генерации диапазонов
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";
import { getSavedAnswer, clearAllAnswers } from "../utils/storage";
import "../styles/menuPage.css";

function MenuPage({ allTasks, onSelectRange }) {
  const [ranges, setRanges] = useState([]);
  const [progressByRange, setProgressByRange] = useState({});
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Генерируем диапазоны страниц
  useEffect(() => {
    if (!allTasks.length) return;
    const generated = generateRanges(allTasks, 5); // 🎯 количество заданий на странице
    setRanges(generated);

    // Считаем общее количество вопросов
    const allQs = allTasks.reduce((sum, task) => sum + task.questions.length, 0);
    setTotalQuestions(allQs);
  }, [allTasks]);

  // Подсчёт прогресса по вопросам
  const calculateProgress = () => {
    if (!ranges.length) return;

    const progress = {};
    let answeredCount = 0;

    ranges.forEach((range) => {
      let answeredInRange = 0;
      let totalInRange = 0;

      range.taskIds.forEach((taskId) => {
        const task = allTasks.find((t) => t.id === taskId);
        if (!task) return;

        totalInRange += task.questions.length;

        const answeredQuestions = task.questions.filter((q) => {
          const ans = getSavedAnswer(`${task.id}-${q.id}`);
          return ans && ans.trim() !== "";
        }).length;

        answeredInRange += answeredQuestions;
      });

      const percent = totalInRange > 0 ? (answeredInRange / totalInRange) * 100 : 0;

      progress[range.index] = {
        answered: answeredInRange,
        total: totalInRange,
        percent,
      };

      answeredCount += answeredInRange;
    });

    setProgressByRange(progress);
    setTotalAnswered(answeredCount);
  };

  // Вызываем при загрузке и после изменений
  useEffect(() => {
    calculateProgress();
  }, [ranges, allTasks]);

  if (!ranges.length) return <div>Загрузка меню...</div>;

  return (
    <div className="menu-container">
      <BackButton />

      <h1 className="menu-title">Принц полукровка</h1>

      <ProgressBar correct={totalAnswered} total={totalQuestions} />

      <p className="menu-progress-text">
        Отвечено на {totalAnswered} из {totalQuestions} вопросов
      </p>

      <div className="range-buttons-wrapper">
        {ranges.map((range) => {
          const progress = progressByRange[range.index];
          const from = range.taskIds[0];
          const to = range.taskIds[range.taskIds.length - 1];
          const label = `${range.index + 1}`;

          let buttonClass = "range-button";
          if (progress) {
            if (progress.percent === 100) buttonClass += " completed"; // зелёная
            else if (progress.percent > 0) buttonClass += " partial"; // жёлтая
          }

          return (
            <button
              key={range.index}
              onClick={() => onSelectRange([from, to])}
              className={buttonClass}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        className="reset-button"
        onClick={() => {
          clearAllAnswers();
          calculateProgress(); // обновляем прогресс без перезагрузки
        }}
      >
        Сбросить все ответы
      </button>
    </div>
  );
}

export default MenuPage;
