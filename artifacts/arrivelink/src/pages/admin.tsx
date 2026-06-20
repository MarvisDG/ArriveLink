import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Unlock,
  Building2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Star,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "/api";

function getSecret() {
  return sessionStorage.getItem("admin_secret") ?? "";
}

function adminFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": getSecret(),
      ...(opts.headers ?? {}),
    },
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ?? "Request failed");
    return data;
  });
}

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const [secretInput, setSecretInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin_secret", secretInput);
    setAuthed(true);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_secret");
    setAuthed(false);
    setSecretInput("");
    qc.clear();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">Admin Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="Enter admin secret"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} toast={toast} />;
}

function AdminDashboard({
  onLogout,
  toast,
}: {
  onLogout: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const qc = useQueryClient();

  const { data: stats, isError: statsError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminFetch("/admin/stats"),
    retry: false,
  });

  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-sm text-center p-6">
          <p className="text-destructive font-semibold mb-2">
            Authentication Failed
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Wrong admin secret or admin not configured.
          </p>
          <Button onClick={onLogout} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-green-400" />
          <span className="font-bold text-lg">ArriveLink Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-slate-700"
            onClick={() => qc.invalidateQueries()}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-slate-700"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Unlock className="h-5 w-5 text-blue-500" />}
            label="Total Unlocks"
            value={stats?.total_unlocks ?? "—"}
          />
          <StatCard
            icon={<BarChart3 className="h-5 w-5 text-green-500" />}
            label="Revenue"
            value={stats ? formatNaira(stats.total_revenue_kobo) : "—"}
          />
          <StatCard
            icon={<Building2 className="h-5 w-5 text-purple-500" />}
            label="Companies"
            value={stats?.total_companies ?? "—"}
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-orange-500" />}
            label="Operators"
            value={stats?.total_operators ?? "—"}
          />
        </div>

        <Tabs defaultValue="unlocks">
          <TabsList>
            <TabsTrigger value="unlocks">Unlocks</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="operators">Operators</TabsTrigger>
          </TabsList>

          <TabsContent value="unlocks">
            <UnlocksTab toast={toast} />
          </TabsContent>
          <TabsContent value="companies">
            <CompaniesTab toast={toast} />
          </TabsContent>
          <TabsContent value="operators">
            <OperatorsTab toast={toast} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-bold text-lg">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function UnlocksTab({
  toast: _toast,
}: {
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["admin-unlocks"],
    queryFn: () => adminFetch("/admin/unlocks"),
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground p-4">Loading…</p>;
  if (!data?.length)
    return <p className="text-sm text-muted-foreground p-4">No unlocks yet.</p>;

  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Traveler</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Reference</th>
              <th className="text-left p-3 font-medium">Revealed</th>
              <th className="text-left p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-3">
                  <p className="font-medium">{u.traveler_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.traveler_email}
                  </p>
                </td>
                <td className="p-3">{u.company_name ?? "—"}</td>
                <td className="p-3 text-green-700 font-medium">
                  {formatNaira(u.amount_paid)}
                </td>
                <td className="p-3 font-mono text-xs">
                  {u.paystack_reference}
                </td>
                <td className="p-3">
                  {u.contact_revealed ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">
                  {formatDate(u.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function CompaniesTab({
  toast,
}: {
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["admin-companies"],
    queryFn: () => adminFetch("/admin/companies"),
  });

  const updateCode = useMutation({
    mutationFn: ({ id, code }: { id: number; code: string }) =>
      adminFetch(`/admin/companies/${id}/invite-code`, {
        method: "PUT",
        body: JSON.stringify({ invite_code: code }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
      setEditingId(null);
      toast({ title: "Invite code updated" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleVerify = useMutation({
    mutationFn: ({
      id,
      is_verified,
      featured,
    }: {
      id: number;
      is_verified?: boolean;
      featured?: boolean;
    }) =>
      adminFetch(`/admin/companies/${id}/verify`, {
        method: "PUT",
        body: JSON.stringify({ is_verified, featured }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-companies"] }),
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground p-4">Loading…</p>;

  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Invite Code</th>
              <th className="text-left p-3 font-medium">Rating</th>
              <th className="text-left p-3 font-medium">Verified</th>
              <th className="text-left p-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">
                  {editingId === c.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-7 text-xs w-40"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() =>
                          updateCode.mutate({ id: c.id, code: editCode })
                        }
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">
                        {c.invite_code ?? "—"}
                      </code>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditCode(c.invite_code ?? "");
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    {c.rating?.toFixed(1)} ({c.review_count})
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      toggleVerify.mutate({
                        id: c.id,
                        is_verified: !c.is_verified,
                      })
                    }
                  >
                    <Badge
                      variant={c.is_verified ? "default" : "secondary"}
                      className={
                        c.is_verified
                          ? "bg-green-100 text-green-800 border-green-200 cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      {c.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      toggleVerify.mutate({
                        id: c.id,
                        featured: !c.featured,
                      })
                    }
                  >
                    <Badge
                      variant={c.featured ? "default" : "secondary"}
                      className={
                        c.featured
                          ? "bg-blue-100 text-blue-800 border-blue-200 cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      {c.featured ? "Featured" : "Not featured"}
                    </Badge>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function OperatorsTab({
  toast,
}: {
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["admin-operators"],
    queryFn: () => adminFetch("/admin/operators"),
  });

  const deleteOp = useMutation({
    mutationFn: (id: number) =>
      adminFetch(`/admin/operators/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-operators"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Operator removed" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground p-4">Loading…</p>;
  if (!data?.length)
    return (
      <p className="text-sm text-muted-foreground p-4">No operators yet.</p>
    );

  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Joined</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((op) => (
              <tr
                key={op.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-3 font-medium">{op.email}</td>
                <td className="p-3">{op.company_name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">
                  {formatDate(op.created_at)}
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm(`Remove operator ${op.email}?`))
                        deleteOp.mutate(op.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
