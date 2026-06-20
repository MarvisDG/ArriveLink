import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  MessageSquare,
  User,
  LogOut,
  ArrowRight,
  Bus,
  Loader2,
  Send,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";

interface ConversationSummary {
  id: number;
  company_id: number;
  company_name: string | null;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
}

interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_type: "user" | "company";
  sender_name: string;
  body: string;
  created_at: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

function getToken() {
  return localStorage.getItem("user_token") ?? "";
}

function getUserName() {
  return localStorage.getItem("user_name") ?? "Traveler";
}

async function apiFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
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

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function AppDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/app/login");
      return;
    }
    apiFetch("/users/me")
      .then(setProfile)
      .catch(() => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_name");
        navigate("/app/login");
      });
    loadConversations();
  }, []);

  function loadConversations() {
    setLoadingConvs(true);
    apiFetch("/messages/conversations")
      .then((data) => setConversations(data))
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }

  function openConversation(id: number) {
    setActiveConvId(id);
    setLoadingMsgs(true);
    apiFetch(`/messages/conversations/${id}`)
      .then((data) => {
        setMessages(data.messages ?? []);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c))
        );
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }

  async function handleReply() {
    if (!reply.trim() || !activeConvId) return;
    setSending(true);
    try {
      const msg = await apiFetch(`/messages/conversations/${activeConvId}/send`, {
        method: "POST",
        body: JSON.stringify({ body: reply.trim() }),
      });
      setMessages((prev) => [...prev, msg]);
      setReply("");
      loadConversations();
    } catch (err) {
      toast({ title: "Failed to send", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    navigate("/");
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome, {profile?.name ?? getUserName()}
            </h1>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="mb-6">
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {conversations.some((c) => c.unread_count > 0) && (
                <Badge className="h-4 px-1.5 text-xs bg-primary text-primary-foreground ml-1">
                  {conversations.reduce((s, c) => s + c.unread_count, 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            {activeConvId ? (
              <div className="flex flex-col border rounded-2xl overflow-hidden bg-card" style={{ height: "540px" }}>
                <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveConvId(null)}
                    className="-ml-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bus className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">
                    {activeConv?.company_name ?? "Company"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                            msg.sender_type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p>{msg.body}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_type === "user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t p-3 flex gap-2">
                  <Textarea
                    className="resize-none min-h-[40px] max-h-[100px]"
                    placeholder="Type a message..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleReply}
                    disabled={sending || !reply.trim()}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {loadingConvs ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : conversations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center py-12 text-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold">No messages yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Search for a route and click "Message Company" to start a
                        conversation with a transport operator.
                      </p>
                      <Button asChild>
                        <Link href="/">
                          Search Routes
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="divide-y border rounded-2xl overflow-hidden bg-card">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors text-left"
                        onClick={() => openConversation(conv.id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bus className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm truncate">
                              {conv.company_name ?? "Company"}
                            </span>
                            <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(conv.last_message_at)}
                            </span>
                          </div>
                          {conv.last_message && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {conv.last_message}
                            </p>
                          )}
                        </div>
                        {conv.unread_count > 0 && (
                          <Badge className="h-5 w-5 rounded-full flex items-center justify-center text-xs p-0 flex-shrink-0">
                            {conv.unread_count}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            {profile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Full Name
                      </label>
                      <p className="font-medium mt-0.5">{profile.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Email
                      </label>
                      <p className="font-medium mt-0.5">{profile.email}</p>
                    </div>
                    {profile.phone && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="font-medium mt-0.5">{profile.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Member since
                      </label>
                      <p className="font-medium mt-0.5">
                        {new Date(profile.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
