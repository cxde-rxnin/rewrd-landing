import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/api/useAuth";

export function WebSocketStatus() {
  const { accessToken } = useAuth();
  const { isConnected } = useWebSocket(accessToken);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`h-2 w-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-muted-foreground">
        {isConnected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}
