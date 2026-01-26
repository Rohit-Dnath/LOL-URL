import { useState, useEffect } from "react";
import { UrlState } from "@/context";
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  deleteNotification 
} from "@/db/apiNotifications";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  UserPlus, 
  UserMinus, 
  ShieldAlert,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const notificationIcons = {
  workspace_invite: UserPlus,
  member_joined: UserPlus,
  member_removed: UserMinus,
  role_changed: ShieldAlert,
  workspace_deleted: Trash2,
};

export function NotificationDropdown() {
  const { user, fetchNotifications } = UrlState();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await getNotifications(user.id);
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.workspace_id) {
      navigate(`/workspace/${notification.data.workspace_id}`);
    }
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        {notifications.some(n => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs rounded-lg hover:bg-muted/50"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <BeatLoader size={8} color="hsl(var(--primary))" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll see updates about workspaces and invites here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/30 transition-all cursor-pointer group relative ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      !notification.read ? "bg-primary/10" : "bg-muted/50"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        !notification.read ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        !notification.read ? "font-medium" : "text-muted-foreground"
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-primary/10"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
