import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/api/useAuth";
import { useTasks } from "@/hooks/api/useTasks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Filter, Plus, Heart, Pencil, Trash2, Clock, CheckCircle, XCircle, Loader2, ShieldCheck, Hourglass } from "lucide-react";
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

  // Poll for task updates when there are tasks in "verifying" status
  // Only polls when the tab is visible to save resources
  // COMMENTED OUT: Relying on WebSocket for real-time updates instead
  // useEffect(() => {
  //   // Check if any tasks are in verifying status
  //   const hasVerifyingTasks = Object.values(submissionStates).some(
  //     (state: any) => state?.status === 'verifying'
  //   ) || (Array.isArray(tasks) && tasks.some(
  //     (t: any) => t.my_submission?.status === 'verifying'
  //   ));

  //   if (!hasVerifyingTasks || !accessToken) return;

  //   let pollInterval: ReturnType<typeof setInterval> | null = null;

  //   const startPolling = () => {
  //     // Only poll if tab is visible
  //     if (document.visibilityState === 'visible') {
  //       pollInterval = setInterval(() => {
  //         console.log("Polling for task updates (verifying tasks detected)...");
  //         fetchTasks();
  //       }, 15000); // Poll every 15 seconds (less aggressive)
  //     }
  //   };

  //   const stopPolling = () => {
  //     if (pollInterval) {
  //       clearInterval(pollInterval);
  //       pollInterval = null;
  //     }
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       // Fetch immediately when tab becomes visible, then start polling
  //       fetchTasks();
  //       startPolling();
  //     } else {
  //       stopPolling();
  //     }
  //   };

  //   // Start polling if tab is visible
  //   startPolling();
    
  //   // Listen for tab visibility changes
  //   document.addEventListener('visibilitychange', handleVisibilityChange);

  //   return () => {
  //     stopPolling();
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, [submissionStates, tasks, accessToken, fetchTasks]);

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

      // Check for verify/verified events first (highest priority)
      if (eventType === "verify" || eventType === "verified") {
        console.log("Verify event received:", { eventType, eventData });
        const taskId = eventData?.task_id || eventData?.taskId;
        
        if (taskId) {
          toast.success("Your task submission has been verified!");
          setSubmissionStates((prev: any) => ({
            ...prev,
            [taskId]: {
              status: 'verified',
              submissionId: eventData.id || eventData.submission_id,
              uiState: 'submitted'
            }
          }));
          fetchTasks();
        }
        return; // Exit early, we've handled this event
      }

      // Handle different types of task-related events
      if (eventType === "task:created" || eventType === "task_created") {
        toast.success("New task available!");
      } else if (eventType === "task:updated" || eventType === "task_updated") {
        toast.info("A task has been updated");
      } else if (eventType === "task:deleted" || eventType === "task_deleted") {
        toast.info("A task has been removed");
      } else if (eventType === "task:started" || eventType === "task_started" || eventType === "task_claimed") {
        toast.info("A task has been started by a participant");
        // Update submission state to pending (started but not submitted)
        if (eventData?.task_id) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[eventData.task_id] || {};
            return {
              ...prev,
              [eventData.task_id]: {
                status: 'pending',
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
      } else if (eventType === "submission:updated" || eventType === "task:submission:updated" || eventType === "submission:verified" || eventType === "submission_verified" || eventType === "verify" || eventType === "submission:verify") {
        // Handle submission status updates - update local state immediately
        const taskId = eventData?.task_id || eventData?.taskId;
        const submissionStatus = eventData?.status || (eventType.includes("verified") || eventType === "verify" ? "verified" : null);
        
        console.log("Submission update received:", { eventType, taskId, submissionStatus, eventData });
        
        if (taskId) {
          setSubmissionStates((prev: any) => {
            const currentState = prev[taskId] || {};
            return {
              ...prev,
              [taskId]: {
                status: submissionStatus,
                submissionId: eventData.id || eventData.submission_id,
                uiState: currentState.uiState
              }
            };
          });
        }

        if (submissionStatus === "approved") {
          toast.success("Your task submission has been approved!");
          // Refresh tasks to get updated data
          fetchTasks();
        } else if (submissionStatus === "verified") {
          toast.success("Your task submission has been verified!");
          // Update submission state to verified
          if (taskId) {
            setSubmissionStates((prev: any) => ({
              ...prev,
              [taskId]: {
                status: 'verified',
                submissionId: eventData.id || eventData.submission_id,
                uiState: 'submitted'
              }
            }));
          }
          // Refresh tasks to get updated data from server
          fetchTasks();
        } else if (submissionStatus === "rejected") {
          toast.error("Your task submission was rejected");
          console.log("Submission rejected. Task ID:", taskId, "User ID:", eventData?.user_id, "Submission ID:", eventData?.id);

          // Update submission state to rejected
          if (taskId) {
            setSubmissionStates((prev: any) => ({
              ...prev,
              [taskId]: {
                status: 'rejected',
                submissionId: eventData.id || eventData.submission_id,
                uiState: 'submitted'
              }
            }));
          }

          // Fetch submission details for more information
          if (accessToken && taskId) {
            TaskAPI.getSubmissionStatus(accessToken, taskId)
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
          // Refresh tasks
          fetchTasks();
        } else if (submissionStatus === "pending") {
          toast.info("Your task submission is pending review");
        } else {
          // Default notification for other status changes (e.g., started, in_progress, or missing status)
          toast.info("Task submission updated");
        }
      } else if (eventType === "submission:reviewed" || eventType === "submission_reviewed" || eventType === "submission:approved" || eventType === "submission_approved" || eventType === "submission:rejected" || eventType === "submission_rejected" || eventType === "submission:verified" || eventType === "submission_verified" || eventType === "verify") {
        const status = eventType.includes("approved") ? "approved" :
          eventType.includes("rejected") ? "rejected" : 
          (eventType.includes("verified") || eventType === "verify") ? "verified" : "reviewed";
        toast.info(`Your task submission has been ${status}`);
        // Update submission state
        const taskId = eventData?.task_id || eventData?.taskId;
        if (taskId) {
          setSubmissionStates((prev: any) => ({
            ...prev,
            [taskId]: {
              status: status,
              submissionId: eventData.id || eventData.submission_id,
              uiState: 'submitted'
            }
          }));
        }
        // Refresh tasks to get updated data
        fetchTasks();
      } else if (eventType === "task:completed" || eventType === "task_completed") {
        toast.success("A task has been completed!");
      }
    });

    return unsubscribe;
  }, [accessToken, subscribe, fetchTasks]);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      console.log("Fetched tasks:", tasks);
      // Log my_submission data for debugging and sync submissionStates
      tasks.forEach((task: any) => {
        if (task.my_submission) {
          console.log(`Task ${task.id} my_submission:`, task.my_submission);
          
          // Sync submissionStates with server data if the server has a newer/different status
          const currentState = submissionStates[task.id];
          const serverStatus = task.my_submission.status;
          
          // Update local state if server has verified/rejected/approved status
          // and our local state doesn't match (to ensure real-time updates work)
          if (serverStatus && ['verified', 'rejected', 'approved', 'completed'].includes(serverStatus)) {
            if (!currentState || currentState.status !== serverStatus) {
              console.log(`Syncing task ${task.id} status from server: ${serverStatus}`);
              setSubmissionStates((prev: any) => ({
                ...prev,
                [task.id]: {
                  status: serverStatus,
                  submissionId: task.my_submission.id,
                  uiState: 'submitted'
                }
              }));
            }
          }
        }
      });
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

  const completedTasks = filteredTasks.filter((t: any) => t.status === "completed").length;
  const pendingTasks = filteredTasks.filter((t: any) => t.status !== "completed").length;

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
                              <span className="font-semibold text-green-600 text-base">${Number(t.reward ?? t.amount ?? 0).toLocaleString()}</span>
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
                          <div className="flex flex-col items-end w-24">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(((t.completed_count ?? 0) / (t.count || 1)) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">{t.completed_count ?? 0}/{t.count ?? 0}</span>
                          </div>
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

  // Determine task state based on my_submission object
  const isCompleted = !!task.has_completed;
  const isActive = !!task.is_active;

  // Use my_submission object to determine task state
  // When my_submission is null, user hasn't started the task (show "Begin Task")
  // When my_submission.status exists, use it to determine button state
  const mySubmission = task.my_submission;
  let hasStarted = false;
  let isSubmitted = false;

  // Debug logging
  console.log(`Task ${task.id} - mySubmission:`, mySubmission, 'submissionState:', submissionState);

  if (submissionState) {
    // Use local submission state if available (for real-time updates)
    // Note: rejected tasks should show disabled button
    if (submissionState?.status === 'rejected') {
      hasStarted = true;
      isSubmitted = true;
    } else if (submissionState?.status === 'verifying' || submissionState?.status === 'verified') {
      // Task is being verified or already verified - user cannot submit again
      hasStarted = true;
      isSubmitted = true;
    } else {
      // Task started (pending/in_progress) - user can submit
      hasStarted = submissionState?.uiState === 'started' ||
        submissionState?.status === 'in_progress' ||
        submissionState?.status === 'pending';
      isSubmitted = submissionState?.uiState === 'submitted' ||
        (submissionState?.status === 'submitted' && submissionState?.uiState !== 'started');
    }
  } else if (mySubmission) {
    // If my_submission exists, check its status
    // 'pending' = task started but not submitted yet (user can submit)
    // 'verifying' = task has been submitted and is awaiting admin verification (user cannot submit)
    // 'verified' = task has been verified (user cannot submit)
    // 'approved' or 'completed' = task is complete
    // 'rejected' = task was rejected, show disabled button
    const status = mySubmission.status;
    if (status === 'verifying' || status === 'verified') {
      // Task is being verified or already verified by admin - user cannot submit again
      hasStarted = true;
      isSubmitted = true;
    } else if (status === 'pending' || status === 'in_progress' || !status) {
      // Task started but not yet submitted - user can submit
      hasStarted = true;
      isSubmitted = false;
    } else if (status === 'rejected') {
      // Rejected tasks show disabled button
      hasStarted = true;
      isSubmitted = true;
    } else if (status === 'approved' || status === 'completed') {
      // Task is complete, don't show button
      return null;
    }
  }
  // If my_submission is null, hasStarted and isSubmitted remain false (show "Begin Task")

  // Only show buttons if task is active and not completed
  if (!isActive || isCompleted) return null;

  const handleBegin = async () => {
    try {
      if (task.url) {
        window.open(task.url, "_blank");
      }
      if (accessToken) {
        const result = await TaskAPI.submit(accessToken, task.id, "start");
        // Backend returns status as "pending" when task is started
        const newState = { status: 'pending', submissionId: result?.id || result?.data?.id, uiState: 'started' };
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
        // Update submission status to "verifying" when user submits the task
        const newState = { status: 'verifying', submissionId: result?.id || result?.data?.id || submissionState?.submissionId, uiState: 'submitted' };
        if (onSubmissionStateChange) {
          onSubmissionStateChange(newState);
        }
        toast.success("Task submitted for verification!");
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
      ) : (
        <Button
          className={`w-full ${
            (submissionState?.status === 'verified' || mySubmission?.status === 'verified')
              ? 'bg-green-600 text-white hover:bg-green-700'
              : (submissionState?.status === 'rejected' || mySubmission?.status === 'rejected')
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
          variant={undefined}
          size="sm"
          disabled={true}
        >
          {(submissionState?.status === 'verified' || mySubmission?.status === 'verified')
            ? 'Verified'
            : (submissionState?.status === 'rejected' || mySubmission?.status === 'rejected')
            ? 'Rejected'
            : 'Verifying...'}
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
  let bgColor = "bg-amber-100";
  let iconColor = "text-amber-600";
  let Icon = Clock;

  // For participants, check submission status using my_submission object
  if (userType === "participant") {
    // Check submissionState first for real-time updates
    if (submissionState) {
      const submissionStatus = submissionState.status;
      const uiState = submissionState.uiState;

      // Check uiState first to distinguish between "started" and "submitted"
      if (uiState === "started") {
        // Task has been started but not submitted yet
        status = "in_progress";
        Icon = Hourglass;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-600";
      } else if (submissionStatus === "approved" || submissionStatus === "completed") {
        status = "completed";
        Icon = CheckCircle;
        bgColor = "bg-green-100";
        iconColor = "text-green-600";
      } else if (submissionStatus === "rejected") {
        status = "rejected";
        Icon = XCircle;
        bgColor = "bg-red-100";
        iconColor = "text-red-600";
      } else if (submissionStatus === "verifying") {
        status = "verifying";
        Icon = Loader2;
        bgColor = "bg-blue-100";
        iconColor = "text-blue-600";
      } else if (submissionStatus === "verified") {
        status = "verified";
        Icon = ShieldCheck;
        bgColor = "bg-green-100";
        iconColor = "text-green-600";
      } else if (submissionStatus === "pending") {
        status = "in_progress";
        Icon = Hourglass;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-600";
      } else if (submissionStatus === "submitted" || (submissionStatus === "in_progress" && uiState !== "started")) {
        status = "submitted";
        Icon = Clock;
        bgColor = "bg-purple-100";
        iconColor = "text-purple-600";
      } else if (submissionStatus === "in_progress") {
        // Fallback for in_progress without uiState
        status = "in_progress";
        Icon = Hourglass;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-600";
      }
    } else if (task.my_submission) {
      // Use my_submission object from task model
      const mySubmissionStatus = task.my_submission.status;
      
      if (mySubmissionStatus === "approved" || mySubmissionStatus === "completed") {
        status = "completed";
        Icon = CheckCircle;
        bgColor = "bg-green-100";
        iconColor = "text-green-600";
      } else if (mySubmissionStatus === "rejected") {
        status = "rejected";
        Icon = XCircle;
        bgColor = "bg-red-100";
        iconColor = "text-red-600";
      } else if (mySubmissionStatus === "verifying") {
        status = "verifying";
        Icon = Loader2;
        bgColor = "bg-blue-100";
        iconColor = "text-blue-600";
      } else if (mySubmissionStatus === "verified") {
        status = "verified";
        Icon = ShieldCheck;
        bgColor = "bg-green-100";
        iconColor = "text-green-600";
      } else if (mySubmissionStatus === "pending") {
        // Task started, pending submission or review - show "In Progress"
        status = "in_progress";
        Icon = Hourglass;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-600";
      } else if (mySubmissionStatus === "in_progress" || !mySubmissionStatus) {
        // Task started but not submitted - show "In Progress"
        status = "in_progress";
        Icon = Hourglass;
        bgColor = "bg-yellow-100";
        iconColor = "text-yellow-600";
      } else if (mySubmissionStatus === "submitted") {
        // Fallback for "submitted" status if used
        status = "submitted";
        Icon = Clock;
        bgColor = "bg-purple-100";
        iconColor = "text-purple-600";
      }
    }
    // If my_submission is null, show default "Pending" status (Clock icon)
  } else {
    // For brands/influencers, use task status
    if (status === "completed") {
      Icon = CheckCircle;
      bgColor = "bg-green-100";
      iconColor = "text-green-600";
    } else if (status === "active" || status === "available") {
      Icon = Clock;
      bgColor = "bg-blue-100";
      iconColor = "text-blue-600";
    }
  }

  return (
    <span className={`rounded-full p-2 ${bgColor}`} title={status}>
      <Icon className={`w-4 h-4 ${iconColor} ${status === "verifying" ? "animate-spin" : ""}`} />
    </span>
  );
}
