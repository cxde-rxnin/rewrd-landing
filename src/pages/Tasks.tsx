import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/api/useAuth";
import { useTasks } from "@/hooks/api/useTasks";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Filter, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TaskAPI } from "@/services/api";
import { Toaster, toast } from "sonner";

export default function Tasks() {
  const { user, accessToken, initialized } = useAuth();
  const { tasks, fetchTasks, createTask } = useTasks(accessToken);
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

  useEffect(() => {
    if (!initialized || !user || !accessToken) return;
    fetchTasks();
  }, [initialized, user, accessToken, fetchTasks]);

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

  const completedTasks = Array.isArray(tasks) ? tasks.filter((t: any) => t.status === "completed").length : 0;
  const pendingTasks = Array.isArray(tasks) ? tasks.filter((t: any) => t.status !== "completed").length : 0;

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
            <p className="text-muted-foreground mt-1">Manage and track your tasks</p>
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
              <div className="text-2xl font-bold">{Array.isArray(tasks) ? tasks.length : 0}</div>
              <p className="text-xs text-muted-foreground">All tasks</p>
            </CardContent>
            <img src="/campaign.png" alt="Total Tasks" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Finished tasks</p>
            </CardContent>
            <img src="/trophy.png" alt="Completed" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
            <img src="/task.png" alt="Pending" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>Complete list of {user.account_type === "participant" ? "available" : "active"} tasks</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{t.title || t.name}</p>
                          <p className="text-sm text-muted-foreground">{t.platform || t.type}</p>
                        </div>
                        <div className="text-xs">
                          {t.status === "completed" ? (
                            <span className="rounded-full bg-green-100 text-green-800 px-3 py-1">Completed</span>
                          ) : (
                            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      {user.account_type === "participant" ? (
                        <div>
                          <p className="font-semibold text-green-600">+{t.reward ?? t.amount ?? 0}</p>
                          <p className="text-xs text-muted-foreground">reward</p>
                        </div>
                      ) : user.account_type === "brand" ? (
                        <div>
                          <p className="font-semibold">{t.submissions_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">submissions</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">{t.status || "pending"}</p>
                          <p className="text-xs text-muted-foreground">status</p>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="ml-4">
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
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
