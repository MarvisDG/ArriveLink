import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Company from "@/pages/company";
import OperatorLogin from "@/pages/operator-login";
import OperatorDashboard from "@/pages/operator-dashboard";
import Admin from "@/pages/admin";
import AppLogin from "@/pages/app-login";
import AppDashboard from "@/pages/app-dashboard";
import BookingRequest from "@/pages/booking-request";
import BookingAwaiting from "@/pages/booking-awaiting";
import BookingPayment from "@/pages/booking-payment";
import BookingTicket from "@/pages/booking-ticket";
import Bookings from "@/pages/bookings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/company/:id" component={Company} />
      <Route path="/app/login" component={AppLogin} />
      <Route path="/app" component={AppDashboard} />
      <Route path="/business/login" component={OperatorLogin} />
      <Route path="/business/dashboard" component={OperatorDashboard} />
      <Route path="/operator/login" component={OperatorLogin} />
      <Route path="/operator/dashboard" component={OperatorDashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/booking/request/:routeId" component={BookingRequest} />
      <Route path="/booking/awaiting/:bookingId" component={BookingAwaiting} />
      <Route path="/booking/payment/:bookingId" component={BookingPayment} />
      <Route path="/booking/ticket/:bookingId" component={BookingTicket} />
      <Route path="/bookings" component={Bookings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
