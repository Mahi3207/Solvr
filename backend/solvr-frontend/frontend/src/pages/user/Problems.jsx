import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import SearchBar from "../../components/common/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import ProblemCard from "../../components/problems/ProblemCard";
import { problemService } from "../../services/problemService";
import { topicService } from "../../services/topicService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";
import { inputStyle } from "../../components/common/inputStyle";

export default function Problems() {
  const [state, setState] = useState({ loading: true, error: "" });
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [statusByProblem, setStatusByProblem] = useState({});

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [topicId, setTopicId] = useState("ALL");
  const [platform, setPlatform] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("title-asc");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setState({ loading: true, error: "" });

      try {
        const [probs, topicList, activities] = await Promise.all([
          problemService.getAll(),
          topicService.getAll().catch(() => []),
          activityService.getMine().catch(() => []),
        ]);

        if (!mounted) return;

        setProblems(probs || []);
        setTopics(topicList || []);

        const map = {};

        (activities || []).forEach((a) => {
          map[a.problemId] = a.status;
        });

        setStatusByProblem(map);

        setState({
          loading: false,
          error: "",
        });
      } catch (err) {
        if (mounted) {
          setState({
            loading: false,
            error: toErrorMessage(err),
          });
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...problems];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();

      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Difficulty
    if (difficulty !== "ALL") {
      list = list.filter((p) => p.difficulty === difficulty);
    }

    // Topic
    if (topicId !== "ALL") {
      list = list.filter((p) => String(p.topicId) === String(topicId));
    }
    if (platform !== "ALL") {
      list = list.filter(
        (p) =>
          String(p.platform).toUpperCase() === String(platform).toUpperCase(),
      );
    }

    // Status
    if (statusFilter !== "ALL") {
      list = list.filter((p) => {
        const s = statusByProblem[p.id] || "NOT_STARTED";

        return s === statusFilter;
      });
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "difficulty":
          return diffRank(a.difficulty) - diffRank(b.difficulty);

        case "time":
          return (a.estimatedTime || 0) - (b.estimatedTime || 0);

        default:
          return 0;
      }
    });

    return list;
  }, [
    problems,
    search,
    difficulty,
    topicId,
    platform,
    statusFilter,
    sortBy,
    statusByProblem,
  ]);

  if (state.loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner label="Loading problems…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Problems"
        subtitle={`${problems.length} problems in the Solvr catalog`}
      />

      <div style={{ padding: "0 32px 40px" }}>
        {/* Search + Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search problems…"
            style={{
              flex: "1 1 240px",
            }}
          />

          <select
            style={{
              ...inputStyle,
              width: 150,
            }}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">All difficulty</option>

            <option value="EASY">Easy</option>

            <option value="MEDIUM">Medium</option>

            <option value="HARD">Hard</option>
          </select>

          <select
            style={{
              ...inputStyle,
              width: 170,
            }}
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            <option value="ALL">All topics</option>

            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            style={{
              ...inputStyle,
              width: 170,
            }}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="ALL">All platforms</option>

            <option value="LEETCODE">LeetCode</option>

            <option value="HACKERRANK">HackerRank</option>

            <option value="GEEKSFORGEEKS">GeeksForGeeks</option>

            <option value="CODECHEF">CodeChef</option>

            <option value="CODEFORCES">Codeforces</option>
            <option value="OTHER">others</option>
          </select>
          <select
            style={{
              ...inputStyle,
              width: 160,
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All statuses</option>

            <option value="NOT_STARTED">Not started</option>

            <option value="IN_PROGRESS">In progress</option>

            <option value="SOLVED">Solved</option>

            <option value="MASTERED">Mastered</option>
          </select>

          <select
            style={{
              ...inputStyle,
              width: 160,
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title-asc">Title A–Z</option>

            <option value="title-desc">Title Z–A</option>

            <option value="difficulty">Difficulty</option>

            <option value="time">Est. time</option>
          </select>
        </div>

        {/* Problems */}
        {state.error ? (
          <ErrorState message={state.error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🧩"
            title="No problems found"
            subtitle="Try adjusting your search or filters."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                status={statusByProblem[p.id]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function diffRank(d) {
  return (
    {
      EASY: 0,
      MEDIUM: 1,
      HARD: 2,
    }[d] ?? 3
  );
}
