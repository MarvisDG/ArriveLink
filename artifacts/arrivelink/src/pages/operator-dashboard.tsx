import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Bus, LogOut, Save, Plus, Trash2, Pencil, CheckCircle2,
  Loader2, Building2, Route, ToggleLeft, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("operator_token");
}

async function apiFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

interface City { id: number; name: string; state: string; }
interface OperatorRoute {
  id: number;
  departure_city: City;
  destination_city: City;
  price: number;
  departure_times: string[];
  terminal_location: string;
  terminal_address: string | null;
  status: string;
  is_active: boolean;
}
interface CompanyProfile {
  id: number;
  name: string;
  tagline: string | null;
  about: string | null;
  founded_year: number | null;
  fleet_size: number | null;
  rep_whatsapp: string | null;
  rep_phone: string | null;
  is_verified: boolean;
  rating: number;
  review_count: number;
}

const STATUS_OPTIONS = ["available", "delayed", "sold_out", "cancelled"];

function RouteFormDialog({
  open, onOpenChange, route, cities, onSave, saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  route: OperatorRoute | null;
  cities: City[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const [departureCityId, setDepartureCityId] = useState(route ? String(route.departure_city.id) : "");
  const [destinationCityId, setDestinationCityId] = useState(route ? String(route.destination_city.id) : "");
  const [price, setPrice] = useState(route ? String(route.price / 100) : "");
  const [departureTimes, setDepartureTimes] = useState(route ? route.departure_times.join(", ") : "");
  const [terminalLocation, setTerminalLocation] = useState(route?.terminal_location ?? "");
  const [terminalAddress, setTerminalAddress] = useState(route?.terminal_address ?? "");
  const [status, setStatus] = useState(route?.status ?? "available");

  useEffect(() => {
    if (open) {
      setDepartureCityId(route ? String(route.departure_city.id) : "");
      setDestinationCityId(route ? String(route.destination_city.id) : "");
      setPrice(route ? String(route.price / 100) : "");
      setDepartureTimes(route ? route.departure_times.join(", ") : "");
      setTerminalLocation(route?.terminal_location ?? "");
      setTerminalAddress(route?.terminal_address ?? "");
      setStatus(route?.status ?? "available");
    }
  }, [open, route]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const times = departureTimes.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({
      departure_city_id: departureCityId ? parseInt(departureCityId) : undefined,
      destination_city_id: destinationCityId ? parseInt(destinationCityId) : undefined,
      price: price ? Math.round(parseFloat(price) * 100) : undefined,
      departure_times: times,
      terminal_location: terminalLocation,
      terminal_address: terminalAddress || undefined,
      status,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{route ? "Edit Route" : "Add New Route"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!route && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={departureCityId} onValueChange={setDepartureCityId}>
                  <SelectTrigger><SelectValue placeholder="Departure city" /></SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Select value={destinationCityId} onValueChange={setDestinationCityId}>
                  <SelectTrigger><SelectValue placeholder="Destination city" /></SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₦)</Label>
              <Input
                type="number"
                min="0"
                step="50"
                placeholder="e.g. 9000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Departure Times</Label>
            <Input
              placeholder="e.g. 06:00, 09:00, 14:00"
              value={departureTimes}
              onChange={(e) => setDepartureTimes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated, 24h format (HH:MM)</p>
          </div>
          <div className="space-y-2">
            <Label>Terminal Name</Label>
            <Input
              placeholder="e.g. Ojota Motor Park"
              value={terminalLocation}
              onChange={(e) => setTerminalLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Terminal Address <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="e.g. 2 Ikorodu Road, Ojota, Lagos"
              value={terminalAddress}
              onChange={(e) => setTerminalAddress(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {route ? "Save Changes" : "Add Route"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function OperatorDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<OperatorRoute | null>(null);

  const { data: meData, isLoading: meLoading, isError: meError } = useQuery<{ company: CompanyProfile }>({
    queryKey: ["operator", "me"],
    queryFn: () => apiFetch("/operator/me"),
    retry: false,
  });

  useEffect(() => {
    if (meError) {
      localStorage.removeItem("operator_token");
      navigate("/operator/login");
    }
  }, [meError, navigate]);

  const { data: routes, isLoading: routesLoading } = useQuery<OperatorRoute[]>({
    queryKey: ["operator", "routes"],
    queryFn: () => apiFetch("/operator/me/routes"),
    enabled: !!meData,
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: () => apiFetch("/cities"),
  });

  const company = meData?.company;

  const [profile, setProfile] = useState<Partial<CompanyProfile>>({});
  useEffect(() => {
    if (company) {
      setProfile({
        tagline: company.tagline ?? "",
        about: company.about ?? "",
        founded_year: company.founded_year ?? undefined,
        fleet_size: company.fleet_size ?? undefined,
        rep_whatsapp: company.rep_whatsapp ?? "",
        rep_phone: company.rep_phone ?? "",
      });
    }
  }, [company]);

  const saveProfileMutation = useMutation({
    mutationFn: (data: Partial<CompanyProfile>) =>
      apiFetch("/operator/me/company", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator", "me"] });
      toast({ title: "Profile saved", description: "Your company profile has been updated." });
    },
    onError: (err: Error) =>
      toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const addRouteMutation = useMutation({
    mutationFn: (data: unknown) =>
      apiFetch("/operator/me/routes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator", "routes"] });
      setRouteDialogOpen(false);
      toast({ title: "Route added" });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to add route", description: err.message, variant: "destructive" }),
  });

  const updateRouteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiFetch(`/operator/me/routes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator", "routes"] });
      setRouteDialogOpen(false);
      setEditingRoute(null);
      toast({ title: "Route updated" });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to update route", description: err.message, variant: "destructive" }),
  });

  const deleteRouteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/operator/me/routes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator", "routes"] });
      toast({ title: "Route removed" });
    },
    onError: (err: Error) =>
      toast({ title: "Failed to remove route", description: err.message, variant: "destructive" }),
  });

  const toggleRouteMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      apiFetch(`/operator/me/routes/${id}`, { method: "PUT", body: JSON.stringify({ is_active }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operator", "routes"] }),
    onError: (err: Error) =>
      toast({ title: "Failed to update route", description: err.message, variant: "destructive" }),
  });

  function handleLogout() {
    localStorage.removeItem("operator_token");
    navigate("/operator/login");
  }

  function handleSaveRoute(data: Record<string, unknown>) {
    if (editingRoute) {
      updateRouteMutation.mutate({ id: editingRoute.id, data });
    } else {
      addRouteMutation.mutate(data);
    }
  }

  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) return null;

  const activeRoutes = routes?.filter((r) => r.is_active) ?? [];

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary text-white">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold text-primary leading-none">ArriveLink</div>
              <div className="text-xs text-muted-foreground">Operator Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold">{company.name}</div>
              {company.is_verified && (
                <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Operator
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Operator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage {company.name}'s listings on ArriveLink
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-primary">{routes?.length ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Routes</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-green-600">{activeRoutes.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Active</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold">{company.rating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Rating ({company.review_count} reviews)
            </div>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company Profile
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2">
              <Route className="h-4 w-4" />
              Routes & Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  This information is shown to travelers on your company page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => { e.preventDefault(); saveProfileMutation.mutate(profile); }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      placeholder="e.g. Safe. Comfortable. On Time."
                      value={profile.tagline ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                      maxLength={120}
                    />
                    <p className="text-xs text-muted-foreground">
                      Short one-liner shown on search results
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>About</Label>
                    <Textarea
                      placeholder="Tell travelers about your company, service quality, safety record..."
                      value={profile.about ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, about: e.target.value }))}
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Year Founded</Label>
                      <Input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder="e.g. 1994"
                        value={profile.founded_year ?? ""}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            founded_year: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fleet Size</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 120"
                        value={profile.fleet_size ?? ""}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            fleet_size: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4 bg-yellow-50/50">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Contact Details (unlocked by travelers)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Travelers pay ₦200 to see these. Keep them up to date.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>WhatsApp Number</Label>
                        <Input
                          placeholder="e.g. 2348012345678"
                          value={profile.rep_whatsapp ?? ""}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, rep_whatsapp: e.target.value }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          International format, no +
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="e.g. 08012345678"
                          value={profile.rep_phone ?? ""}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, rep_phone: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saveProfileMutation.isPending}
                      className="gap-2"
                    >
                      {saveProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Your Routes</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage prices, times and availability
                  </p>
                </div>
                <Button
                  onClick={() => { setEditingRoute(null); setRouteDialogOpen(true); }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Route
                </Button>
              </div>

              {routesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (routes?.length ?? 0) === 0 ? (
                <Card className="py-16 text-center">
                  <Route className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No routes yet. Add your first route.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {routes?.map((route) => (
                    <Card key={route.id} className={route.is_active ? "" : "opacity-60"}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {route.departure_city.name} → {route.destination_city.name}
                              </span>
                              <Badge
                                variant={route.is_active ? "default" : "secondary"}
                                className="text-xs capitalize"
                              >
                                {route.is_active ? route.status.replace("_", " ") : "inactive"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">
                                ₦{(route.price / 100).toLocaleString()}
                              </span>
                              {route.departure_times.length > 0 && (
                                <span>{route.departure_times.join(" • ")}</span>
                              )}
                              <span>{route.terminal_location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                toggleRouteMutation.mutate({
                                  id: route.id,
                                  is_active: !route.is_active,
                                })
                              }
                              title={route.is_active ? "Deactivate" : "Activate"}
                            >
                              {route.is_active ? (
                                <ToggleRight className="h-5 w-5 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingRoute(route);
                                setRouteDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => deleteRouteMutation.mutate(route.id)}
                              disabled={deleteRouteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <RouteFormDialog
        open={routeDialogOpen}
        onOpenChange={(v) => { setRouteDialogOpen(v); if (!v) setEditingRoute(null); }}
        route={editingRoute}
        cities={cities ?? []}
        onSave={handleSaveRoute}
        saving={addRouteMutation.isPending || updateRouteMutation.isPending}
      />
    </div>
  );
}
