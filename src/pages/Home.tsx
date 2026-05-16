import { useState, useEffect } from "react";
import { Log } from "../utils/logger";
type Notification = {
  id: number;
  text: string;
};
export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    Log("frontend", "info", "page", "Home page loaded");
    if (notifications.length === 0) {
      Log("frontend", "warn", "state", "No notifications available");
    }
  }, []);
  const addNotification = () => {
    try {
      Log("frontend", "info", "component", "Add Notification button clicked");
      const newNotif: Notification = {
        id: Date.now(),
        text: "New Notification"
      };

      setNotifications((prev) => [...prev, newNotif]);
      Log("frontend", "info", "state", "Notification added successfully");
      Log(
        "frontend",
        "debug",
        "state",
        `Total notifications: ${notifications.length + 1}`
      );
    } catch (err) {
      Log("frontend", "error", "component", "Failed to add notification");
    }
  };

  return (
    <div>
      <h1>Notification App</h1>

      <button onClick={addNotification}>
        Add Notification
      </button>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>{n.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}