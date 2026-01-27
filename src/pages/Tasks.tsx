import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/api/useAuth";
import { useTasks } from "@/hooks/api/useTasks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Filter, Plus, Heart, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TaskAPI } from "@/services/api";
import { Toaster, toast } from "sonner";

export default function Tasks() {
  const { user, accessToken, initialized } = useAuth();
  const { tasks, fetchTasks, createTask } = useTasks(accessToken);
  const { isConnected, subscribe } = useWebSocket(accessToken);
  const [open, setOpen] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    count: "",
    reward: "",
    expires_at: "",
    url: "",
    platform: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  // Track submission states by task ID: { [taskId]: { status: 'pending'|'in_progress'|'submitted', submissionId: string } }
  const [submissionStates, setSubmissionStates] = useState<any>({});

  useEffect(() => {
    if (!initialized || !user || !accessToken) return;
    fetchTasks();
  }, [initialized, user, accessToken, fetchTasks]);

  // WebSocket subscription for real-time task updates
  useEffect(() => {
    if (!accessToken) return undefined;

    const unsubscribe = subscribe((message) => {
      console.log("WebSocket message received:", message);

      // Support both old format (type) and new format (event)
      const eventType = message.event || message.type;
      const eventData = message.data || message;

      console.log("Event type:", eventType);

      // Handle different types of task-related events
      if (eventType === "task:created" || eventType === "task_created") {
        toast.success("New task available!");
      } else if (eventType === "task:updated" || eventType === "task_updated") {
        toast.info("A task has been updated");
      } else if (eventType === "task:deleted" || eventType === "task_deleted") {
        toast.info("A task has been removed");
      } else if (eventType === "task:started" || eventType === "task_started" || eventType === "task_claimed") {
        toast.info("A task has been started by a participant");
        // Update submission state to in_progress
        if (eventData?.task_id) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[eventData.task_id] || {};
            return {
              ...prev,
              [eventData.task_id]: {
                status: 'in_progress',
                submissionId: eventData.id,
                uiState: currentState.uiState
              }
            };
          });
        }
      } else if (eventType === "task:status_changed" || eventType === "task_status_changed") {
        toast.info(`Task status changed to ${eventData.status}`);
      } else if (eventType === "submission:created" || eventType === "submission_created" || eventType === "task:submitted" || eventType === "task_submitted") {
        console.log("Submission created event received:", eventData);
        toast.info("A task submission has been received");
        // Update submission state based on event status, default to in_progress (started) if not present
        // We assume submission:created corresponds to "starting" a task if status is missing
        if (eventData?.task_id) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[eventData.task_id] || {};
            return {
              ...prev,
              [eventData.task_id]: {
                status: eventData.status || 'in_progress',
                submissionId: eventData.id,
                uiState: currentState.uiState // Preserve existing uiState
              }
            };
          });
        }
      } else if (eventType === "submission:updated" || eventType === "task:submission:updated") {
        // Handle submission status updates - update local state immediately
        if (eventData?.task_id) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[eventData.task_id] || {};
            return {
              ...prev,
              [eventData.task_id]: {
                status: eventData.status,
                submissionId: eventData.id,
                uiState: currentState.uiState
              }
            };
          });
        }

        if (eventData?.status === "approved") {
          toast.success("Your task submission has been approved!");
        } else if (eventData?.status === "rejected") {
          toast.error("Your task submission was rejected");
          console.log("Submission rejected. Task ID:", eventData?.task_id, "User ID:", eventData?.user_id, "Submission ID:", eventData?.id);

          // Fetch submission details for more information
          if (accessToken && eventData?.task_id) {
            TaskAPI.getSubmissionStatus(accessToken, eventData.task_id)
              .then(submissionDetails => {
                console.log("Rejected submission details:", submissionDetails);
                // Check if there's a rejection reason in the response
                if (submissionDetails?.rejection_reason) {
                  toast.error(`Rejection reason: ${submissionDetails.rejection_reason}`);
                }
              })
              .catch(err => {
                console.error("Failed to fetch submission details:", err);
              });
          }
        } else if (eventData?.status === "pending") {
          toast.info("Your task submission is pending review");
        } else {
          // Default notification for other status changes (e.g., started, in_progress, or missing status)
          toast.info("Task submission updated");
        }
      } else if (eventType === "submission:reviewed" || eventType === "submission_reviewed" || eventType === "submission:approved" || eventType === "submission_approved" || eventType === "submission:rejected" || eventType === "submission_rejected") {
        const status = eventType === "submission:approved" || eventType === "submission_approved" ? "approved" :
          eventType === "submission:rejected" || eventType === "submission_rejected" ? "rejected" : "reviewed";
        toast.info(`Your task submission has been ${status}`);
        // Update submission state
        if (eventData?.task_id) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[eventData.task_id] || {};
            return {
              ...prev,
              [eventData.task_id]: {
                status: status,
                submissionId: eventData.id,
                uiState: currentState.uiState
              }
            };
          });
        }
      } else if (eventType === "task:completed" || eventType === "task_completed") {
        toast.success("A task has been completed!");
      }
    });

    return unsubscribe;
  }, [accessToken, subscribe]);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      console.log("Fetched tasks:", tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (!accessToken) return;
    TaskAPI.getSocialPlatforms(accessToken).then((data) => {
      const platformsArr = Array.isArray(data) ? data : (data && Array.isArray((data as any).data) ? (data as any).data : []);
      setPlatforms(platformsArr);
      console.log("Social Platforms:", platformsArr);
    });
  }, [accessToken]);

  useEffect(() => {
    if (form.platform && accessToken) {
      const url = `/api/task/task-type/${form.platform}`;
      console.log("Fetching task types for platform:", form.platform, "with token:", accessToken, "URL:", url);
      TaskAPI.getTaskTypes(form.platform, accessToken)
        .then((data) => {
          let typesArr: any[] = [];
          if (Array.isArray(data)) {
            typesArr = data;
          } else if (data && Array.isArray((data as any).data)) {
            typesArr = (data as any).data;
          }
          setTypes(typesArr);
          console.log("Task Types for platform", form.platform, ":", typesArr);
        })
        .catch((err) => {
          console.error("Error fetching task types:", err);
        });
    } else {
      setTypes([]);
      if (!form.platform) {
        console.log("No platform selected, skipping task type fetch.");
      } else if (!accessToken) {
        console.log("No access token, skipping task type fetch.");
      }
    }
  }, [form.platform, accessToken]);

  if (!initialized || !user) return null;

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((t: any) => {
      // Role-based filtering
      if (user.account_type !== "participant") {
        // For brands and influencers, only show tasks they created
        if (t.creator_id !== user.id && t.user_id !== user.id) return false;
      }
      // Platform filtering
      if (selectedPlatform && t.task_type?.social_platform?.id !== selectedPlatform) {
        return false;
      }
      return true;
    })
    : [];

  const completedTasks = filteredTasks.filter((t: any) => t.status === "completed" || t.status === "verified").length;
  const pendingTasks = filteredTasks.filter((t: any) => t.status !== "completed" && t.status !== "verified").length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({
        title: form.title,
        description: form.description,
        count: Number(form.count),
        reward: Number(form.reward),
        expires_at: new Date(form.expires_at).toISOString(),
        url: form.url,
        task_type_id: form.type,
      });
      setOpen(false);
      setForm({ title: "", description: "", count: "", reward: "", expires_at: "", url: "", platform: "", type: "" });
      fetchTasks();
    } catch (err: any) {
      toast.error(err?.message || err?.detail || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-muted-foreground">Manage and track your tasks</p>
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                />
                <span className="text-muted-foreground">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          {(user.account_type === "brand" || user.account_type === "influencer") && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border rounded p-2"
                    required
                  />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2"
                    required
                  />
                  <div className="flex gap-4">
                    <input
                      name="count"
                      type="number"
                      min="1"
                      value={form.count}
                      onChange={handleChange}
                      placeholder="Number of participants (count)"
                      className="border rounded p-2 w-1/2"
                      required
                    />
                    <input
                      name="reward"
                      type="number"
                      min="0"
                      value={form.reward}
                      onChange={handleChange}
                      placeholder="Reward Amount"
                      className="border rounded p-2 w-1/2"
                      required
                    />
                  </div>
                  <label htmlFor="expires_at" className="text-sm font-medium">Expiration Date & Time</label>
                  <input
                    id="expires_at"
                    name="expires_at"
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={handleChange}
                    placeholder="Expires At"
                    className="border rounded p-2"
                    required
                  />
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="Task URL"
                    className="border rounded p-2"
                    required
                  />
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col">
                      <select
                        id="platform"
                        name="platform"
                        value={form.platform}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                      >
                        <option value="">Select Platform</option>
                        {(Array.isArray(platforms) ? platforms : []).map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                        disabled={!form.platform}
                      >
                        <option value="">Select Type</option>
                        {(Array.isArray(types) ? types : []).map((t: any) => (
                          <option key={t.id} value={t.id}>{t.display_name || t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Task"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(filteredTasks) ? filteredTasks.length : 0}</div>
              <p className="text-xs text-muted-foreground">All tasks</p>
            </CardContent>
            <img src="/campaign.png" alt="Total Tasks" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Finished tasks</p>
            </CardContent>
            <img src="/trophy.png" alt="Completed" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
            <img src="/task.png" alt="Pending" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>Complete list of {user.account_type === "participant" ? "available" : "active"} tasks</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedPlatform
                      ? platforms.find(p => p.id === selectedPlatform)?.name || "Filter"
                      : "Filter"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedPlatform(null)}>
                    All Platforms
                  </DropdownMenuItem>
                  {platforms.map((platform: any) => (
                    <DropdownMenuItem
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      {platform.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t: any) => {
                  const likeProps = [t.type, t.display_name, t.name, t.task_type?.name, t.task_type?.display_name];
                  const isLikeTask = likeProps
                    .map(v => typeof v === "string" ? v.trim().toLowerCase() : "")
                    .includes("like");
                  return (
                    <Card key={t.id} className="relative flex flex-col justify-between border-2 border-muted/30 shadow-sm hover:shadow-lg transition-all rounded-xl p-0 overflow-hidden">
                      <div className="flex items-center gap-3 px-5 pt-5">
                        {/* Remove background and color classes from icon container */}
                        <div>
                          {isLikeTask ? (
                            <Heart className="w-6 h-6 text-pink-500" />
                          ) : (
                            <ListChecks className="w-6 h-6 text-purple-700" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg leading-tight mb-1">{t.title || t.name}</h3>
                          <span className="text-xs text-muted-foreground">{t.platform || t.type}</span>
                        </div>
                        <TaskStatusBadge task={t} submissionState={submissionStates[t.id]} userType={user.account_type} />
                      </div>
                      <div className="px-5 py-3 flex-1">
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{t.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          {user.account_type === "participant" ? (
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-green-600 text-base">+{t.reward ?? t.amount ?? 0}</span>
                              <span className="text-xs text-muted-foreground">Reward</span>
                            </div>
                          ) : user.account_type === "brand" ? (
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-blue-600 text-base">{t.submissions_count ?? 0}</span>
                              <span className="text-xs text-muted-foreground">Submissions</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-amber-600 text-base">{t.status || "pending"}</span>
                              <span className="text-xs text-muted-foreground">Status</span>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">{t.expires_at ? `Expires: ${new Date(t.expires_at).toLocaleDateString()}` : ""}</span>
                        </div>
                      </div>
                      {user.account_type === "participant" && (
                        <TaskActionButton
                          task={t}
                          accessToken={accessToken}
                          submissionState={submissionStates[t.id]}
                          onSubmissionStateChange={(state) => setSubmissionStates((prev: any) => ({ ...prev, [t.id]: state }))}
                        />
                      )}
                      {(user.account_type === "brand" || user.account_type === "influencer") && (
                        <div className="flex gap-2 mt-2 py-4 px-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              toast("Edit task feature coming soon!");
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await TaskAPI.delete(accessToken, t.id);
                                toast.success("Task deleted");
                                fetchTasks();
                              } catch (err: any) {
                                toast.error(err?.message || "Failed to delete task");
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tasks available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function TaskActionButton({
  task,
  accessToken,
  submissionState,
  onSubmissionStateChange,
}: {
  task: any;
  accessToken: string | null;
  submissionState?: any;
  onSubmissionStateChange?: (state: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  // Determine task state
  const isCompleted = !!task.has_completed;
  const isActive = !!task.is_active;

  // Use can_start and has_submitted as fallbacks for hasStarted/isSubmitted if no submissionState
  let hasStarted = false;
  let isSubmitted = false;

  if (submissionState) {
    hasStarted = submissionState?.uiState === 'started' ||
      submissionState?.status === 'in_progress' ||
      submissionState?.status === 'pending' ||
      submissionState?.status === 'rejected' ||
      submissionState?.status === 'verifying';
    isSubmitted = submissionState?.uiState === 'submitted' ||
      (submissionState?.status === 'submitted' && submissionState?.uiState !== 'started') ||
      (submissionState?.status === 'pending' && submissionState?.uiState !== 'started');
  } else {
    // If can_start is false, treat as started (unless completed)
    hasStarted = task.can_start === false && !isCompleted;
    // If has_submitted is true, treat as submitted
    isSubmitted = !!task.has_submitted;
  }

  // Only show buttons if task is active and not completed
  if (!isActive && !isCompleted && task.status !== "verified") return null;
  if (isCompleted && task.status !== "verified") return null;

  const handleBegin = async () => {
    try {
      if (task.url) {
        window.open(task.url, "_blank");
      }
      if (accessToken) {
        const result = await TaskAPI.submit(accessToken, task.id, "start");
        const newState = { status: 'in_progress', submissionId: result?.id || result?.data?.id, uiState: 'started' };
        if (onSubmissionStateChange) {
          onSubmissionStateChange(newState);
        }
        toast.success("Task started!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to start task");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (accessToken) {
        const result = await TaskAPI.submit(accessToken, task.id, "complete");
        const newState = { status: 'submitted', submissionId: result?.id || result?.data?.id || submissionState?.submissionId, uiState: 'submitted' };
        if (onSubmissionStateChange) {
          onSubmissionStateChange(newState);
        }
        toast.success("Task submitted!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pb-5 space-y-2">
      {!hasStarted && !isSubmitted ? (
        <Button
          className="w-full bg-black text-white hover:bg-neutral-800"
          variant={undefined}
          size="sm"
          onClick={handleBegin}
        >
          Begin Task
        </Button>
      ) : hasStarted && !isSubmitted ? (
        <>
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            variant={undefined}
            size="sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Task"}
          </Button>
        </>
      ) : task.status === "verified" ? (
        <Button
          className="w-full bg-green-600 text-white hover:bg-green-700"
          variant={undefined}
          size="sm"
          disabled={true}
        >
          Verified
        </Button>
      ) : (
        <Button
          className="w-full bg-amber-600 text-white hover:bg-amber-700"
          variant={undefined}
          size="sm"
          disabled={true}
        >
          Submitted
        </Button>
      )}
    </div>
  );
}

function TaskStatusBadge({
  task,
  submissionState,
  userType
}: {
  task: any;
  submissionState?: any;
  userType: string;
}) {
  // Determine the status to display
  let status = task.status || "pending";
  let displayText = "Pending";
  let bgColor = "bg-amber-100";
  let textColor = "text-amber-700";

  // For participants, check submission status
  if (userType === "participant" && submissionState) {
    const submissionStatus = submissionState.status;
    const uiState = submissionState.uiState;

    // Check uiState first to distinguish between "started" and "submitted"
    if (uiState === "started") {
      // Task has been started but not submitted yet
      status = "in_progress";
      displayText = "In Progress";
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
    } else if (submissionStatus === "approved" || submissionStatus === "completed") {
      status = "completed";
      displayText = "Completed";
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    } else if (submissionStatus === "rejected") {
      status = "rejected";
      displayText = "Rejected";
      bgColor = "bg-red-100";
      textColor = "text-red-700";
    } else if (submissionStatus === "verifying") {
      status = "verifying";
      displayText = "Verifying";
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
    } else if (submissionStatus === "submitted" || submissionStatus === "pending" || (submissionStatus === "in_progress" && uiState !== "started")) {
      status = "submitted";
      displayText = "Submitted";
      bgColor = "bg-purple-100";
      textColor = "text-purple-700";
    } else if (submissionStatus === "in_progress") {
      // Fallback for in_progress without uiState
      status = "in_progress";
      displayText = "In Progress";
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
    } else if (submissionStatus === "verified") {
      status = "verified";
      displayText = "Verified";
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    }
  } else if (userType === "participant" && task.has_submitted) {
    // Fallback: if has_submitted is true, show as Submitted
    status = "submitted";
    displayText = "Submitted";
    bgColor = "bg-purple-100";
    textColor = "text-purple-700";
  } else {
    // For brands/influencers, use task status
    if (status === "completed" || status === "verified") {
      displayText = status === "verified" ? "Verified" : "Completed";
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    } else if (status === "active" || status === "available") {
      displayText = "Active";
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
    }
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor}`}>
      {displayText}
    </span>
  );
}
