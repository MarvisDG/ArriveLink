export interface City {
  id: number;
  name: string;
  state: string;
}

export interface Company {
  id: number;
  name: string;
  tagline: string | null;
  about: string | null;
  logo_url: string | null;
  founded_year: number | null;
  fleet_size: number | null;
  rep_whatsapp: string | null;
  rep_phone: string | null;
  is_verified: boolean;
  featured: boolean;
  invite_code: string | null;
  rating: number;
  review_count: number;
  response_rate: number;
}

export interface Route {
  id: number;
  company_id: number;
  departure_city_id: number;
  destination_city_id: number;
  price: number;
  price_type: "verified" | "last_seen";
  price_verified_date: string | null;
  departure_times: string[];
  terminal_location: string;
  terminal_address: string | null;
  status: string;
  is_active: boolean;
}

export interface Review {
  id: number;
  company_id: number;
  traveler_name: string;
  traveler_email: string;
  route_id: number | null;
  rating_punctuality: number;
  rating_comfort: number;
  rating_safety: number;
  rating_value: number;
  rating_professionalism: number;
  review_text: string | null;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  created_at: string;
}

export interface Operator {
  id: number;
  email: string;
  password: string;
  company_id: number;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number | null;
  guest_name: string | null;
  guest_email: string | null;
  company_id: number;
  created_at: string;
  last_message_at: string;
  unread_user: number;
  unread_company: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: "user" | "company";
  sender_name: string;
  body: string;
  created_at: string;
}

const cities: City[] = [
  { id: 1, name: "Lagos", state: "Lagos" },
  { id: 2, name: "Abuja", state: "FCT" },
  { id: 3, name: "Port Harcourt", state: "Rivers" },
  { id: 4, name: "Benin City", state: "Edo" },
  { id: 5, name: "Ibadan", state: "Oyo" },
  { id: 6, name: "Enugu", state: "Enugu" },
];

const companies: Company[] = [
  {
    id: 1,
    name: "GUO Transport",
    tagline: "Your journey, our priority",
    about: "One of Nigeria's largest interstate transport operators with terminals nationwide.",
    logo_url: null,
    founded_year: 1980,
    fleet_size: 500,
    rep_whatsapp: "+2348012345678",
    rep_phone: "+2348012345678",
    is_verified: true,
    featured: true,
    invite_code: "GUO2024",
    rating: 4.2,
    review_count: 128,
    response_rate: 0.92,
  },
  {
    id: 2,
    name: "ABC Transport",
    tagline: "Comfortable rides across Nigeria",
    about: "Premium interstate bus service connecting major cities.",
    logo_url: null,
    founded_year: 1995,
    fleet_size: 200,
    rep_whatsapp: "+2348098765432",
    rep_phone: "+2348098765432",
    is_verified: true,
    featured: true,
    invite_code: "ABC2024",
    rating: 4.5,
    review_count: 89,
    response_rate: 0.88,
  },
  {
    id: 3,
    name: "Peace Mass Transit",
    tagline: "Safe and affordable travel",
    about: "Reliable transport for everyday Nigerian travelers.",
    logo_url: null,
    founded_year: 2002,
    fleet_size: 350,
    rep_whatsapp: "+2348076543210",
    rep_phone: "+2348076543210",
    is_verified: true,
    featured: true,
    invite_code: "PMT2024",
    rating: 4.0,
    review_count: 210,
    response_rate: 0.85,
  },
];

const routes: Route[] = [
  {
    id: 1,
    company_id: 1,
    departure_city_id: 1,
    destination_city_id: 2,
    price: 1500000,
    price_type: "verified",
    price_verified_date: "2026-06-20",
    departure_times: ["06:00", "09:00", "14:00"],
    terminal_location: "Jibowu Terminal",
    terminal_address: "Jibowu St, Yaba, Lagos",
    status: "available",
    is_active: true,
  },
  {
    id: 2,
    company_id: 2,
    departure_city_id: 1,
    destination_city_id: 2,
    price: 1800000,
    price_type: "verified",
    price_verified_date: "2026-06-18",
    departure_times: ["07:00", "12:00"],
    terminal_location: "Amuwo Odofin Terminal",
    terminal_address: "Mile 2, Lagos",
    status: "available",
    is_active: true,
  },
  {
    id: 3,
    company_id: 1,
    departure_city_id: 1,
    destination_city_id: 5,
    price: 450000,
    price_type: "verified",
    price_verified_date: "2026-06-15",
    departure_times: ["06:30", "10:00", "16:00"],
    terminal_location: "Jibowu Terminal",
    terminal_address: "Jibowu St, Yaba, Lagos",
    status: "available",
    is_active: true,
  },
  {
    id: 4,
    company_id: 3,
    departure_city_id: 2,
    destination_city_id: 6,
    price: 1200000,
    price_type: "last_seen",
    price_verified_date: "2026-06-10",
    departure_times: ["08:00", "15:00"],
    terminal_location: "Utako Terminal",
    terminal_address: "Utako, Abuja",
    status: "available",
    is_active: true,
  },
  {
    id: 5,
    company_id: 2,
    departure_city_id: 1,
    destination_city_id: 3,
    price: 900000,
    price_type: "last_seen",
    price_verified_date: "2026-06-05",
    departure_times: ["05:30", "11:00"],
    terminal_location: "Amuwo Odofin Terminal",
    terminal_address: null,
    status: "delayed",
    is_active: true,
  },
];

const reviews: Review[] = [
  {
    id: 1,
    company_id: 1,
    traveler_name: "Ada O.",
    traveler_email: "ada@example.com",
    route_id: 1,
    rating_punctuality: 4,
    rating_comfort: 4,
    rating_safety: 5,
    rating_value: 4,
    rating_professionalism: 4,
    review_text: "Smooth trip to Abuja. Bus was clean and left on time.",
    created_at: "2025-12-01T10:00:00Z",
  },
];

const users: User[] = [
  {
    id: 1,
    name: "Ada Okafor",
    email: "ada@example.com",
    phone: "+2348012345678",
    password: "password123",
    created_at: "2026-01-10T08:00:00Z",
  },
];

const operators: Operator[] = [
  {
    id: 1,
    email: "operator@guo.com",
    password: "password123",
    company_id: 1,
    created_at: "2025-01-15T08:00:00Z",
  },
];

const conversations: Conversation[] = [
  {
    id: 1,
    user_id: 1,
    guest_name: null,
    guest_email: null,
    company_id: 1,
    created_at: "2026-06-18T10:00:00Z",
    last_message_at: "2026-06-18T10:05:00Z",
    unread_user: 1,
    unread_company: 0,
  },
];

const messages: Message[] = [
  {
    id: 1,
    conversation_id: 1,
    sender_type: "user",
    sender_name: "Ada Okafor",
    body: "Hello, do you have seats available for Lagos to Abuja on June 25?",
    created_at: "2026-06-18T10:00:00Z",
  },
  {
    id: 2,
    conversation_id: 1,
    sender_type: "company",
    sender_name: "GUO Transport",
    body: "Yes, we have seats available. Please arrive at Jibowu terminal 30 minutes before departure.",
    created_at: "2026-06-18T10:05:00Z",
  },
];

let nextRouteId = 6;
let nextReviewId = 2;
let nextUserId = 2;
let nextOperatorId = 2;
let nextConversationId = 2;
let nextMessageId = 3;

export function getCities() {
  return cities;
}

export function getCity(id: number) {
  return cities.find((c) => c.id === id);
}

export function getCompanies() {
  return companies;
}

export function getCompanyList() {
  return companies.map((c) => ({ id: c.id, name: c.name }));
}

export function getFeaturedCompanies() {
  return companies
    .filter((c) => c.featured)
    .map((c) => ({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      is_verified: c.is_verified,
      rating: c.rating,
      review_count: c.review_count,
    }));
}

export function getCompany(id: number) {
  const company = companies.find((c) => c.id === id);
  if (!company) return null;

  const companyRoutes = routes
    .filter((r) => r.company_id === id && r.is_active)
    .map((r) => ({
      id: r.id,
      price: r.price,
      price_type: r.price_type,
      price_verified_date: r.price_verified_date,
      departure_times: r.departure_times,
      terminal_location: r.terminal_location,
      terminal_address: r.terminal_address,
      status: r.status,
      departure_city: getCity(r.departure_city_id)!,
      destination_city: getCity(r.destination_city_id)!,
    }));

  const { invite_code: _, ...rest } = company;
  return { ...rest, routes: companyRoutes };
}

export function getCompanyReviews(companyId: number) {
  return reviews
    .filter((r) => r.company_id === companyId)
    .map((r) => {
      const overall_rating =
        (r.rating_punctuality +
          r.rating_comfort +
          r.rating_safety +
          r.rating_value +
          r.rating_professionalism) /
        5;
      return {
        id: r.id,
        traveler_name: r.traveler_name,
        overall_rating,
        review_text: r.review_text,
        created_at: r.created_at,
        rating_punctuality: r.rating_punctuality,
        rating_comfort: r.rating_comfort,
        rating_safety: r.rating_safety,
        rating_value: r.rating_value,
        rating_professionalism: r.rating_professionalism,
      };
    });
}

export function submitReview(data: {
  traveler_name: string;
  traveler_email: string;
  company_id: number;
  route_id?: number;
  rating_punctuality: number;
  rating_comfort: number;
  rating_safety: number;
  rating_value: number;
  rating_professionalism: number;
  review_text?: string;
}) {
  const review: Review = {
    id: nextReviewId++,
    company_id: data.company_id,
    traveler_name: data.traveler_name,
    traveler_email: data.traveler_email,
    route_id: data.route_id ?? null,
    rating_punctuality: data.rating_punctuality,
    rating_comfort: data.rating_comfort,
    rating_safety: data.rating_safety,
    rating_value: data.rating_value,
    rating_professionalism: data.rating_professionalism,
    review_text: data.review_text ?? null,
    created_at: new Date().toISOString(),
  };
  reviews.push(review);

  const company = companies.find((c) => c.id === data.company_id);
  if (company) {
    const companyReviews = reviews.filter((r) => r.company_id === data.company_id);
    company.review_count = companyReviews.length;
    company.rating =
      companyReviews.reduce((sum, r) => {
        return (
          sum +
          (r.rating_punctuality +
            r.rating_comfort +
            r.rating_safety +
            r.rating_value +
            r.rating_professionalism) /
            5
        );
      }, 0) / companyReviews.length;
  }

  return review;
}

export function searchRoutes(fromCityId: number, toCityId: number) {
  return routes
    .filter(
      (r) =>
        r.is_active &&
        r.departure_city_id === fromCityId &&
        r.destination_city_id === toCityId
    )
    .map((r) => {
      const company = companies.find((c) => c.id === r.company_id)!;
      return {
        id: r.id,
        price: r.price,
        price_type: r.price_type,
        price_verified_date: r.price_verified_date,
        departure_times: r.departure_times,
        terminal_location: r.terminal_location,
        terminal_address: r.terminal_address,
        status: r.status,
        company: {
          id: company.id,
          name: company.name,
          tagline: company.tagline,
          logo_url: company.logo_url,
          is_verified: company.is_verified,
          rating: company.rating,
          review_count: company.review_count,
        },
      };
    });
}

export function getPopularRoutes() {
  const pairs = new Map<string, { from: number; to: number; routes: Route[] }>();

  for (const route of routes.filter((r) => r.is_active)) {
    const key = `${route.departure_city_id}-${route.destination_city_id}`;
    const existing = pairs.get(key);
    if (existing) {
      existing.routes.push(route);
    } else {
      pairs.set(key, {
        from: route.departure_city_id,
        to: route.destination_city_id,
        routes: [route],
      });
    }
  }

  return Array.from(pairs.values()).map((pair) => ({
    departure_city: getCity(pair.from)!,
    destination_city: getCity(pair.to)!,
    company_count: new Set(pair.routes.map((r) => r.company_id)).size,
    min_price: Math.min(...pair.routes.map((r) => r.price)),
  }));
}

export function getPlatformStats() {
  return {
    company_count: companies.length,
    city_count: cities.length,
    route_count: routes.filter((r) => r.is_active).length,
    user_count: users.length,
  };
}

export function userRegister(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  if (users.some((u) => u.email === data.email)) {
    throw new Error("Email already registered");
  }
  const user: User = {
    id: nextUserId++,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    password: data.password,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  return { token: `usr-${user.id}-${Date.now()}`, user_id: user.id, name: user.name };
}

export function userLogin(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  return { token: `usr-${user.id}-${Date.now()}`, user_id: user.id, name: user.name };
}

export function getUserFromToken(token: string | null) {
  if (!token?.startsWith("usr-")) return null;
  const id = parseInt(token.split("-")[1] ?? "0", 10);
  return users.find((u) => u.id === id) ?? null;
}

export function getUserProfile(userId: number) {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  const { password: _, ...profile } = user;
  return profile;
}

export function getUserConversations(userId: number) {
  return conversations
    .filter((c) => c.user_id === userId)
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
    .map((c) => {
      const company = companies.find((co) => co.id === c.company_id);
      const lastMsg = messages
        .filter((m) => m.conversation_id === c.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      return {
        id: c.id,
        company_id: c.company_id,
        company_name: company?.name ?? null,
        last_message: lastMsg?.body ?? null,
        last_message_at: c.last_message_at,
        unread_count: c.unread_user,
      };
    });
}

export function getCompanyConversations(companyId: number) {
  return conversations
    .filter((c) => c.company_id === companyId)
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
    .map((c) => {
      const lastMsg = messages
        .filter((m) => m.conversation_id === c.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      const displayName = c.guest_name ?? (users.find((u) => u.id === c.user_id)?.name ?? "Traveler");
      return {
        id: c.id,
        user_name: displayName,
        guest_email: c.guest_email,
        last_message: lastMsg?.body ?? null,
        last_message_at: c.last_message_at,
        unread_count: c.unread_company,
      };
    });
}

export function getOrCreateConversation(data: {
  user_id?: number;
  guest_name?: string;
  guest_email?: string;
  company_id: number;
}) {
  if (data.user_id) {
    const existing = conversations.find(
      (c) => c.user_id === data.user_id && c.company_id === data.company_id
    );
    if (existing) return existing;
  }

  const conv: Conversation = {
    id: nextConversationId++,
    user_id: data.user_id ?? null,
    guest_name: data.guest_name ?? null,
    guest_email: data.guest_email ?? null,
    company_id: data.company_id,
    created_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    unread_user: 0,
    unread_company: 0,
  };
  conversations.push(conv);
  return conv;
}

export function getConversationMessages(conversationId: number) {
  return messages
    .filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function sendMessage(data: {
  conversation_id: number;
  sender_type: "user" | "company";
  sender_name: string;
  body: string;
}) {
  const conv = conversations.find((c) => c.id === data.conversation_id);
  if (!conv) throw new Error("Conversation not found");

  const msg: Message = {
    id: nextMessageId++,
    conversation_id: data.conversation_id,
    sender_type: data.sender_type,
    sender_name: data.sender_name,
    body: data.body,
    created_at: new Date().toISOString(),
  };
  messages.push(msg);

  conv.last_message_at = msg.created_at;
  if (data.sender_type === "user") {
    conv.unread_company += 1;
  } else {
    conv.unread_user += 1;
  }

  return msg;
}

export function markConversationRead(conversationId: number, as_role: "user" | "company") {
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) throw new Error("Conversation not found");
  if (as_role === "user") conv.unread_user = 0;
  else conv.unread_company = 0;
  return { ok: true };
}

export function startConversation(data: {
  user_id?: number;
  guest_name?: string;
  guest_email?: string;
  company_id: number;
  initial_message: string;
}) {
  const conv = getOrCreateConversation({
    user_id: data.user_id,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    company_id: data.company_id,
  });

  const user = data.user_id ? users.find((u) => u.id === data.user_id) : null;
  const senderName = user?.name ?? data.guest_name ?? "Traveler";

  const msg = sendMessage({
    conversation_id: conv.id,
    sender_type: "user",
    sender_name: senderName,
    body: data.initial_message,
  });

  const company = companies.find((c) => c.id === data.company_id);
  return {
    conversation_id: conv.id,
    company_name: company?.name ?? null,
    message: msg,
  };
}

export function operatorLogin(email: string, password: string) {
  const operator = operators.find((o) => o.email === email && o.password === password);
  if (!operator) throw new Error("Invalid email or password");
  return { token: `op-${operator.id}-${Date.now()}`, operator_id: operator.id };
}

export function operatorSignup(data: {
  email: string;
  password: string;
  company_id: number;
}) {
  const company = companies.find((c) => c.id === data.company_id);
  if (!company) throw new Error("Company not found");
  if (operators.some((o) => o.email === data.email)) throw new Error("Email already registered");

  const operator: Operator = {
    id: nextOperatorId++,
    email: data.email,
    password: data.password,
    company_id: data.company_id,
    created_at: new Date().toISOString(),
  };
  operators.push(operator);
  return { token: `op-${operator.id}-${Date.now()}`, operator_id: operator.id };
}

export function getOperatorFromToken(token: string | null) {
  if (!token?.startsWith("op-")) return null;
  const id = parseInt(token.split("-")[1] ?? "0", 10);
  return operators.find((o) => o.id === id) ?? null;
}

export function getOperatorProfile(operatorId: number) {
  const operator = operators.find((o) => o.id === operatorId);
  if (!operator) return null;
  const company = companies.find((c) => c.id === operator.company_id);
  if (!company) return null;
  const { invite_code: _, ...profile } = company;
  return { company: profile };
}

export function getOperatorRoutes(companyId: number) {
  return routes
    .filter((r) => r.company_id === companyId)
    .map((r) => ({
      ...r,
      departure_city: getCity(r.departure_city_id)!,
      destination_city: getCity(r.destination_city_id)!,
    }));
}

export function updateOperatorCompany(companyId: number, data: Partial<Company>) {
  const company = companies.find((c) => c.id === companyId);
  if (!company) throw new Error("Company not found");
  Object.assign(company, data);
  const { invite_code: _, ...profile } = company;
  return profile;
}

export function addOperatorRoute(companyId: number, data: Partial<Route> & { departure_city_id?: number; destination_city_id?: number }) {
  const route: Route = {
    id: nextRouteId++,
    company_id: companyId,
    departure_city_id: data.departure_city_id!,
    destination_city_id: data.destination_city_id!,
    price: data.price ?? 0,
    price_type: data.price_type ?? "last_seen",
    price_verified_date: data.price_verified_date ?? null,
    departure_times: data.departure_times ?? [],
    terminal_location: data.terminal_location ?? "",
    terminal_address: data.terminal_address ?? null,
    status: data.status ?? "available",
    is_active: true,
  };
  routes.push(route);
  return route;
}

export function updateOperatorRoute(routeId: number, companyId: number, data: Partial<Route>) {
  const route = routes.find((r) => r.id === routeId && r.company_id === companyId);
  if (!route) throw new Error("Route not found");
  Object.assign(route, data);
  return route;
}

export function deleteOperatorRoute(routeId: number, companyId: number) {
  const index = routes.findIndex((r) => r.id === routeId && r.company_id === companyId);
  if (index === -1) throw new Error("Route not found");
  routes.splice(index, 1);
}

export function checkAdminSecret(secret: string) {
  const expected = process.env.ADMIN_SECRET ?? "arrivelink-admin";
  return secret === expected;
}

export function getAdminStats() {
  return {
    total_users: users.length,
    total_companies: companies.length,
    total_operators: operators.length,
    total_messages: messages.length,
  };
}

export function getAdminUsers() {
  return users.map((u) => {
    const { password: _, ...safe } = u;
    const convCount = conversations.filter((c) => c.user_id === u.id).length;
    return { ...safe, conversation_count: convCount };
  });
}

export function deleteUser(id: number) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("User not found");
  users.splice(index, 1);
}

export function getAdminCompanies() {
  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    invite_code: c.invite_code,
    rating: c.rating,
    review_count: c.review_count,
    is_verified: c.is_verified,
    featured: c.featured,
  }));
}

export function updateCompanyInviteCode(id: number, invite_code: string) {
  const company = companies.find((c) => c.id === id);
  if (!company) throw new Error("Company not found");
  company.invite_code = invite_code;
  return company;
}

export function updateCompanyFlags(id: number, flags: { is_verified?: boolean; featured?: boolean }) {
  const company = companies.find((c) => c.id === id);
  if (!company) throw new Error("Company not found");
  if (flags.is_verified !== undefined) company.is_verified = flags.is_verified;
  if (flags.featured !== undefined) company.featured = flags.featured;
  return company;
}

export function getAdminOperators() {
  return operators.map((o) => {
    const company = companies.find((c) => c.id === o.company_id);
    return {
      id: o.id,
      email: o.email,
      company_name: company?.name ?? null,
      created_at: o.created_at,
    };
  });
}

export function deleteOperator(id: number) {
  const index = operators.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Operator not found");
  operators.splice(index, 1);
}
