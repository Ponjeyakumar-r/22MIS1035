import { useEffect, useState } from "react";
import { Log } from "./utils/logger";
import { TOKEN } from "./config";
import type { Notification } from "./types";

// Priority mapping
const typePriority: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [readIds, setReadIds] = useState<string[]>([]);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      Log("frontend", "info", "api", "Fetching notifications");

      const queryType =
        selectedType === "All" ? "" : `&notification_type=${selectedType}`;

      const res = await fetch(
        `http://4.224.186.213/evaluation-service/notifications?limit=${itemsPerPage}&page=${currentPage}${queryType}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      const data = await res.json();
      let list: Notification[] = data.notifications || [];

      // Sorting: priority → timestamp
      list.sort((a, b) => {
        const pDiff = typePriority[b.Type] - typePriority[a.Type];
        if (pDiff !== 0) return pDiff;

        return (
          new Date(b.Timestamp).getTime() -
          new Date(a.Timestamp).getTime()
        );
      });

      setNotifications(list);

      Log("frontend", "info", "api", "Notifications fetched successfully");
    } catch (error) {
      Log("frontend", "error", "api", "Failed to fetch notifications");
    }
  };

  // Load on mount + whenever filters change
  useEffect(() => {
    loadNotifications();
  }, [selectedType, itemsPerPage, currentPage]);

  // Mark as read
  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
      Log("frontend", "info", "state", `Marked ${id} as read`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Notification App</h1>

      {/* Controls */}
      <div style={{ marginBottom: "20px" }}>
        {/* Filter */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
            Log("frontend", "info", "component", "Filter changed");
          }}
        >
          <option value="All">All</option>
          <option value="Event">Event</option>
          <option value="Result">Result</option>
          <option value="Placement">Placement</option>
        </select>

        {/* Limit */}
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
            Log("frontend", "info", "component", "Items per page changed");
          }}
          style={{ marginLeft: "10px" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        {/* Refresh */}
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            Log("frontend", "info", "component", "Refresh clicked");
            loadNotifications();
          }}
        >
          Refresh
        </button>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((item) => (
            <li
              key={item.ID}
              onClick={() => markAsRead(item.ID)}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                opacity: readIds.includes(item.ID) ? 0.5 : 1
              }}
            >
              <b>{item.Type}</b> - {item.Message}
              <br />
              <small>{item.Timestamp}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={notifications.length < itemsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;