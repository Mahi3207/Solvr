import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import StatusBadge from "../../components/ui/StatusBadge";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";

export default function Favourites() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({
    loading: true,
    error: "",
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await activityService.getFavourites();

        if (!mounted) return;

        setItems(data || []);
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

  if (state.loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner label="Loading your favourites…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Favourites"
        subtitle="Problems you've marked as favourites."
      />

      <div style={{ padding: "0 32px 40px" }}>
        {state.error ? (
          <ErrorState message={state.error} />
        ) : items.length === 0 ? (
          <EmptyState icon="❤️" title="No favourite problems" />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {items.map((item) => (
              <Link key={item.id} to={`/app/problems/${item.problemId}`}>
                <Card
                  hoverable
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {item.problemTitle}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        marginTop: 4,
                      }}
                    >
                      Attempts: {item.attemptCount ?? 0}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {item.status && <StatusBadge status={item.status} />}

                    <Badge color="var(--violet)" bg="var(--violet-light)">
                      ❤️ Favourite
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
