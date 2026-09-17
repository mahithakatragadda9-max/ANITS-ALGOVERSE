import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import questionsData from "../data/hr_questions.json";

type Question = {
  id: number | string;
  title: string;
  topic?: string;
  difficulty?: string;
  companies?: string[];
  link?: string;
  mustSolve?: boolean;
  type?: string;
};

const MustDoPage = () => {
  const rawQuestions: Question[] = Array.isArray(questionsData)
    ? questionsData
    : questionsData.data;

  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("algoverse-pyq-solved");
    return saved ? JSON.parse(saved) : [];
  });

  const mustDoQuestions = useMemo(() => {
    return rawQuestions.filter(
      (q) =>
        q.mustSolve === true ||
        String(q.type).toLowerCase() === "must-do"
    );
  }, [rawQuestions]);

  const topics = useMemo(() => {
    const result: Record<string, Question[]> = {};

    mustDoQuestions.forEach((q) => {
      const topic = String(q.topic || "Arrays").trim();

      if (!result[topic]) {
        result[topic] = [];
      }

      result[topic].push(q);
    });

    return result;
  }, [mustDoQuestions]);

  const toggleTopic = (topic: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const updateSolved = (id: number | string, checked: boolean) => {
    const questionId = String(id);

    setSolvedIds((prev) => {
      if (checked) {
        if (prev.includes(questionId)) return prev;
        return [...prev, questionId];
      }

      return prev.filter((x) => x !== questionId);
    });

    const current = solvedIds.filter((x) => x !== questionId);

    localStorage.setItem(
      "algoverse-pyq-solved",
      JSON.stringify(
        checked
          ? [...new Set([...solvedIds, questionId])]
          : current
      )
    );
  };

  const isSolved = (id: number | string) =>
    solvedIds.includes(String(id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-5">
      <div className="max-w-[1000px] mx-auto">

        <Link
          to="/pyq"
          className="inline-block mb-5 text-blue-400 hover:underline"
        >
          ← Back to All PYQs
        </Link>

        <h1 className="text-xl font-bold text-blue-400 my-5 pb-2 border-b-2 border-slate-700">
          ⭐ Must Solve Interview Questions
        </h1>

        {Object.entries(topics).map(([topicName, topicQuestions]) => (
          <div
            key={topicName}
            className="mb-3 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleTopic(topicName)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-700/50 transition"
            >
              <div>
                <div className="font-semibold text-lg">
                  {topicName}
                </div>

                <div className="text-sm text-slate-400">
                  {topicQuestions.length} Priority Questions
                </div>
              </div>

              <span
                className={`text-slate-400 transition-transform ${
                  openTopics[topicName] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openTopics[topicName] && (
              <div className="border-t border-slate-700 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-black/30 text-slate-400">
                      <th className="p-3 text-center">Solved</th>
                      <th className="p-3 text-left">
                        Question Title
                      </th>
                      <th className="p-3 text-left">
                        Difficulty
                      </th>
                      <th className="p-3 text-left">
                        Companies
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {topicQuestions.map((q) => (
                      <tr
                        key={q.id}
                        className="border-b border-white/5"
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSolved(q.id)}
                            onChange={(e) =>
                              updateSolved(
                                q.id,
                                e.target.checked
                              )
                            }
                            className="w-[18px] h-[18px] cursor-pointer"
                          />
                        </td>

                        <td className="p-3">
                          <a
                            href={q.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-100 hover:text-blue-400 hover:underline font-medium"
                          >
                            {q.title} ↗
                          </a>
                        </td>

                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              String(q.difficulty).toLowerCase() ===
                              "easy"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : String(q.difficulty).toLowerCase() ===
                                  "medium"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {q.difficulty || "Unknown"}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {(q.companies || []).map((company) => (
                              <span
                                key={company}
                                className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {mustDoQuestions.length === 0 && (
          <div className="p-5 text-red-400 bg-red-500/10 rounded-lg">
            No Must-Do questions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MustDoPage;