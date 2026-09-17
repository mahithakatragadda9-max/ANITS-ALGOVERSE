import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import questionsData from "../data/hr_questions.json";

type Question = {
  id: number | string;
  title: string;
  topic?: string;
  difficulty?: string;
  companies?: string[];
  patterns?: string[];
  platform?: string;
  link?: string;
  repeated?: number;
  repeatLevel?: number;
  mustSolve?: boolean;
  type?: string;
};

type QuestionWithSolved = Question & {
  solved: boolean;
};

const PYQPage = () => {
  const rawQuestions: Question[] = Array.isArray(questionsData)
    ? questionsData
    : questionsData.data;

  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("algoverse-pyq-solved");
    return saved ? JSON.parse(saved) : [];
  });

  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [openPatterns, setOpenPatterns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(
      "algoverse-pyq-solved",
      JSON.stringify(solvedIds)
    );
  }, [solvedIds]);

  const questions: QuestionWithSolved[] = useMemo(() => {
    return rawQuestions.map((q) => ({
      ...q,
      solved: solvedIds.includes(String(q.id)),
    }));
  }, [rawQuestions, solvedIds]);

  // -----------------------------
  // Group questions by topic
  // -----------------------------
  const topics = useMemo(() => {
    const result: Record<
      string,
      { questions: QuestionWithSolved[]; companies: string[] }
    > = {};

    questions.forEach((q) => {
      const topic = String(q.topic || "Arrays").trim();

      if (!result[topic]) {
        result[topic] = {
          questions: [],
          companies: [],
        };
      }

      result[topic].questions.push(q);

      (q.companies || []).forEach((company) => {
        if (
          !result[topic].companies.includes(company) &&
          result[topic].companies.length < 3
        ) {
          result[topic].companies.push(company);
        }
      });
    });

    return result;
  }, [questions]);

  // -----------------------------
  // Group questions by pattern
  // -----------------------------
  const patterns = useMemo(() => {
    const result: Record<string, QuestionWithSolved[]> = {};

    questions.forEach((q) =>  {
      if (q.patterns && q.patterns.length > 0) {
        q.patterns.forEach((pattern) => {
          const name = String(pattern).trim();

          if (!result[name]) {
            result[name] = [];
          }

          result[name].push(q);
        });
      } else {
        if (!result["General Patterns"]) {
          result["General Patterns"] = [];
        }

        result["General Patterns"].push(q);
      }
    });

    return result;
  }, [questions]);

  // -----------------------------
  // Toggle accordion
  // -----------------------------
  const toggleTopic = (name: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const togglePattern = (name: string) => {
    setOpenPatterns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // -----------------------------
  // Checkbox handling
  // -----------------------------
  const updateSolved = (id: number | string, checked: boolean) => {
    const questionId = String(id);

    setSolvedIds((prev) => {
      if (checked) {
        if (prev.includes(questionId)) {
          return prev;
        }

        return [...prev, questionId];
      }

      return prev.filter((x) => x !== questionId);
    });
  };

  const isSolved = (id: number | string) => {
    return solvedIds.includes(String(id));
  };

  const totalSolved = solvedIds.length;

  // -----------------------------
  // Topic progress
  // -----------------------------
  const getTopicSolved = (topicQuestions: Question[]) => {
    return topicQuestions.filter((q) => isSolved(q.id)).length;
  };

  const getPatternSolved = (patternQuestions: Question[]) => {
    const uniqueIds = new Set(patternQuestions.map((q) => String(q.id)));

    return [...uniqueIds].filter((id) => solvedIds.includes(id)).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-5">
      <div className="max-w-[1000px] mx-auto pb-20">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="flex justify-between items-center bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">

          <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
            <span>🔥</span>
            <span>
              Daily Streak: <strong>0</strong> Days
            </span>
          </div>

          <div className="text-base text-slate-400">
            Total Solved:{" "}
            <span className="text-emerald-400 font-bold">
              {totalSolved}
            </span>{" "}
            /{" "}
            <span className="text-slate-300">
              {questions.length}
            </span>
          </div>

        </div>

        {/* ========================= */}
        {/* TOPIC WISE */}
        {/* ========================= */}

        <h2 className="text-xl font-bold text-blue-400 mt-8 mb-4 pb-2 border-b-2 border-slate-700">
          Topic Wise Progress
        </h2>

        {Object.keys(topics).length > 0 ? (
          Object.entries(topics).map(([topicName, topicData]) => {

            const solved = getTopicSolved(topicData.questions);

            return (
              <div
                key={topicName}
                className="mb-3 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
              >

                {/* Topic Header */}
                <button
                  type="button"
                  onClick={() => toggleTopic(topicName)}
                  className="w-full flex justify-between items-center p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition"
                >

                  <div className="flex flex-col gap-1">

                    <div className="text-lg font-semibold text-slate-100">
                      {topicName}
                    </div>

                    <div className="text-sm text-slate-400">
                      {solved}/{topicData.questions.length} Solved
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="flex gap-1">
                      {topicData.companies.map((company) => (
                        <span
                          key={company}
                          className="bg-blue-500/15 text-blue-400 text-xs px-2 py-1 rounded font-semibold"
                        >
                          {company}
                        </span>
                      ))}
                    </div>

                    <span
                      className={`text-slate-400 transition-transform ${
                        openTopics[topicName]
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▼
                    </span>

                  </div>

                </button>

                {/* Topic Content */}
                {openTopics[topicName] && (
                  <div className="border-t border-slate-700 overflow-x-auto">

                    <table className="w-full border-collapse text-left text-sm">

                      <thead>
                        <tr className="bg-black/30 text-slate-400">

                          <th className="p-3 text-center">
                            Solved
                          </th>

                          <th className="p-3">
                            Question Title
                          </th>

                          <th className="p-3">
                            Difficulty
                          </th>

                          <th className="p-3">
                            Companies
                          </th>

                          <th className="p-3">
                            Repeated
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {topicData.questions.map((q) => (

                          <tr
                            key={q.id}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
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
                                className="w-[18px] h-[18px] cursor-pointer accent-emerald-500"
                              />

                            </td>

                            <td className="p-3">

                              <a
                                href={q.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-100 font-medium hover:text-blue-400 hover:underline"
                              >
                                {q.title}

                                <span className="ml-1 text-xs opacity-50">
                                  ↗
                                </span>
                              </a>

                            </td>

                            <td className="p-3">

                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  String(q.difficulty).toLowerCase() ===
                                  "easy"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : String(
                                        q.difficulty
                                      ).toLowerCase() === "medium"
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-red-500/15 text-red-400"
                                }`}
                              >
                                {q.difficulty || "Unknown"}
                              </span>

                            </td>

                            <td className="p-3">

                              <div className="flex flex-wrap gap-1">

                                {(q.companies || []).map(
                                  (company) => (
                                    <span
                                      key={company}
                                      className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded"
                                    >
                                      {company}
                                    </span>
                                  )
                                )}

                              </div>

                            </td>

                            <td className="p-3">

                              <span className="text-amber-400 font-semibold">
                                ×{q.repeated || 1}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="p-5 bg-red-500/10 border border-dashed border-red-500 rounded-lg text-red-400">
            No question data found.
          </div>
        )}

        {/* ========================= */}
        {/* PATTERN WISE */}
        {/* ========================= */}

        <h2 className="text-xl font-bold text-blue-400 mt-12 mb-4 pb-2 border-b-2 border-slate-700">
          Pattern Wise Progress
        </h2>

        {Object.entries(patterns).map(
          ([patternName, patternQuestions]) => {

            const solved = getPatternSolved(patternQuestions);

            return (
              <div
                key={patternName}
                className="mb-3 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
              >

                <button
                  type="button"
                  onClick={() => togglePattern(patternName)}
                  className="w-full flex justify-between items-center p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition"
                >

                  <div className="flex flex-col gap-1">

                    <div className="text-lg font-semibold text-slate-100">
                      {patternName}
                    </div>

                    <div className="text-sm text-slate-400">
                      {solved}/{new Set(
                        patternQuestions.map((q) =>
                          String(q.id)
                        )
                      ).size}{" "}
                      Solved
                    </div>

                  </div>

                  <span
                    className={`text-slate-400 transition-transform ${
                      openPatterns[patternName]
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>

                </button>

                {openPatterns[patternName] && (
                  <div className="border-t border-slate-700 overflow-x-auto">

                    <table className="w-full border-collapse text-left text-sm">

                      <thead>
                        <tr className="bg-black/30 text-slate-400">

                          <th className="p-3 text-center">
                            Solved
                          </th>

                          <th className="p-3">
                            Question Title
                          </th>

                          <th className="p-3">
                            Difficulty
                          </th>

                          <th className="p-3">
                            Companies
                          </th>

                          <th className="p-3">
                            Repeated
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {patternQuestions.map((q) => (

                          <tr
                            key={`${patternName}-${q.id}`}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
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
                                className="w-[18px] h-[18px] cursor-pointer accent-emerald-500"
                              />

                            </td>

                            <td className="p-3">

                              <a
                                href={q.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-100 font-medium hover:text-blue-400 hover:underline"
                              >
                                {q.title}

                                <span className="ml-1 text-xs opacity-50">
                                  ↗
                                </span>
                              </a>

                            </td>

                            <td className="p-3">

                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  String(q.difficulty).toLowerCase() ===
                                  "easy"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : String(
                                        q.difficulty
                                      ).toLowerCase() === "medium"
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-red-500/15 text-red-400"
                                }`}
                              >
                                {q.difficulty || "Unknown"}
                              </span>

                            </td>

                            <td className="p-3">

                              <div className="flex flex-wrap gap-1">

                                {(q.companies || []).map(
                                  (company) => (
                                    <span
                                      key={company}
                                      className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded"
                                    >
                                      {company}
                                    </span>
                                  )
                                )}

                              </div>

                            </td>

                            <td className="p-3">

                              <span className="text-amber-400 font-semibold">
                                ×{q.repeated || 1}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>
            );
          }
        )}

        {/* ========================= */}
        {/* FOOTER LINKS */}
        {/* ========================= */}

        <div className="flex justify-between items-center mt-10 pt-5 border-t border-slate-700">

       <Link
  to="/pyq/must-do"
  className="text-slate-400 hover:text-blue-400 transition"
>
  Check Must Do Questions
</Link>

<Link
  to="/pyq/most-repeated"
  className="text-slate-400 hover:text-orange-400 transition"
>
   Check Most Repeated Questions
</Link>

        </div>

      </div>
    </div>
  );
};

export default PYQPage;