import "./App.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/publicPages/index/Index";
import Home from "./pages/customerPages/home/Home";
import Dashboard from "./pages/adminPages/dashboard/Dashboard";
import PublicNavbar from "./components/public_navbar/PublicNavbar";
import Footer from "./components/footer/Footer";
import Contact from "./pages/publicPages/contact/Contact.jsx";
import About from "./pages/publicPages/about/About";
import { Suspense, startTransition } from "react";
import CustomerLogin from "./pages/publicPages/customer_login_signup/Login";
import Signup from "./pages/publicPages/customer_login_signup/Signup";
import PublicRoutes from "./authentication/PublicRoutes";
import CustomerNavbar from "./components/customer_navbar/CustomerNavbar";
import Profile from "./pages/customerPages/profile/Profile";
import Personal from "./pages/customerPages/profile/Personal.jsx";
import Activities from "./pages/customerPages/profile/Activities.jsx";
import { useDispatch, useSelector } from "react-redux";
import { authenticationFailed, authenticationSuccess } from "./redux/userSlice";
import { AppRoot } from "./appComponents";
import Store from "./pages/customerPages/store/Store";
import AdminLogin from "./pages/publicPages/admin_login/AdminLogin";
import AdminSidebar from "./components/admin_sidebar/AdminSidebar";
import Inventory from "./pages/adminPages/inventory/Inventory";
import CustomerRoutes from "./authentication/CustomerRoutes";
import AdminRoutes from "./authentication/AdminRoutes";
import Loader from "./components/loader/Loader";
import Cart from "./pages/customerPages/cart/Cart";
import PaymentInfo from "./pages/customerPages/payment/PaymentInfo";
import shopingCartLogic from "./components/cartComponents/logic/shopingCartLogic";
import { setToCartReducer } from "./redux/cartSlice";
import Appointment from "./pages/customerPages/appointment/Appointment";
import AppointmentList from "./pages/adminPages/appointment/AppointmentList";
import Record from "./pages/adminPages/records/Record";
import OrderList from "./pages/adminPages/orders/OrderList";
import { memo } from "react";
import OrderDetails from "./pages/adminPages/order_detail/OrderDetails";
import Purchases from "./pages/customerPages/purchases/Purchases";
import Preparing from "./components/purchases/Preparing";
import ToReceive from "./components/purchases/ToReceive";
import PurchasedDetails from "./pages/customerPages/orderdetail/PurchasedDetails";
import { connection } from "./redux/socketSlice";
import io from "socket.io-client";
import AppointmentDetails from "./pages/adminPages/AppointmentDetail/AppointmentDetails";
import Channels from "./pages/shared/livestream_channels/Channels";
import LiveStreamRoom from "./pages/shared/livestream_room/LiveStreamRoom";
import CustomAxios from "./customer hooks/CustomAxios";
import AdminNavbar from "./components/admin_navbar/AdminNavbar";
import Sales from "./pages/adminPages/sales/Sales";
import PageNotFound from "./pages/shared/page-not-found/PageNotFound";
import FindYourAccount from "./pages/publicPages/password-reset/FindYourAccount";
import UpdatePassword from "./pages/publicPages/password-reset/UpdatePassword";
import ResetPasswordRoute from "./authentication/ResetPasswordRoute";
import TermsAndCondition from "./pages/publicPages/terms-condition/TermsAndCondition";
import ReturnPolicy from "./pages/publicPages/return-policy/ReturnPolicy";
import PrivacyPolicy from "./pages/publicPages/privacy-policy/PrivacyPolicy";
import Employees from "./pages/adminPages/employees/Employees";
import Schedule from "./components/modals/livestream_modals/Schedule";
import Schedules from "./pages/customerPages/schedules/Schedules";
import ScheduleCustomer from "./pages/customerPages/schedule/Schedule";

function App() {
  const [loading, setLoading] = useState(false);
  const [navbarType, setNavbarType] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { cart: cartProduct } = useSelector((state) => state);

  const [cartRefresher, setCartRefresh] = useState(false);
  useEffect(() => {
    try {
      const userInfo = Cookies.get("userToken");
      if (!userInfo) {
        return setNavbarType("public");
      }

      const { userType } = JSON.parse(userInfo);

      setNavbarType(userType);
    } catch (error) {
      console.error(error.message);
    }
  }, [pathname]);

  useEffect(() => {
    const auth = {
      userinfo: Cookies.get("userToken"),
      isAuth: false,
    };

    dispatch(connection(io("https://topnotchbackend.herokuapp.com", { auth })));
  }, []);

  useEffect(() => {
    startTransition(() => {
      (async function () {
        try {
          console.log("welcome to my app!");
          setLoading(true);
          const data = await CustomAxios({ METHOD: "GET", uri: `/api/auth` });
          const { success, msg } = data;

          if (!success && msg?.includes("session expired")) {
            Cookies.remove("userToken");
          }

          if (success) {
            const { currentUser } = data;
            dispatch(authenticationSuccess({ currentUser, isAuth: true }));

            const auth = {
              userinfo: Cookies.get("userToken"),
              isAuth: true,
            };

            dispatch(
              connection(io("https://topnotchbackend.herokuapp.com", { auth }))
            );
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    });
  }, []);

  const { fetcher } = shopingCartLogic();

  useEffect(() => {
    const refresh = cartProduct.every(
      (cart) =>
        (cart?.product_stocks != null) | (cart.product_stocks != undefined)
    );
    
    if(!refresh) setCartRefresh(prev => !prev);
    
  }, [cartProduct]);
  useEffect(() => {
    (async () => {
      if (pathname?.includes("customer")) {
        const cart = await fetcher();
        console.log(cart);
        dispatch(setToCartReducer(cart));
      }
    })();
  }, [pathname, cartRefresher]);

  if (loading) return <Loader bg="rgba(139, 133, 98, 0.526)" />;
  const excludeRoutes = [
    "/public/find-your-account",
    "/public/update-password",
    "/terms-condition",
    "/return-policy",
    "/privacy-policy",
  ];

  const footerExcludeRoutes = [
    "/admin/login",
    "/customer/login",
    "/customer/signup",
    "/public/liveStreamChannels",
    "/customer/liveStreamChannels",
    "/admin/liveStreamChannels",
    "/customer/cart",
    "/admin/inventory",
    "/public/find-your-account",
    "/public/update-password",
    "/terms-condition",
    "/return-policy",
    "/privacy-policy",
  ];

  return (
    <AppRoot>
      {navbarType === "public" &&
        !pathname?.includes("room=") &&
        !excludeRoutes.includes(pathname) && <PublicNavbar />}

      {navbarType === "customer" &&
        !pathname?.includes("liveStreamChannels/room") &&
        !pathname?.includes("payment") &&
        !excludeRoutes.includes(pathname) && <CustomerNavbar />}

      {navbarType === "admin" &&
        !pathname?.includes("room=") &&
        !excludeRoutes.includes(pathname) && <AdminNavbar />}

      <Routes>
        {/* public routes */}
        <Route path="/" element={<PublicRoutes Component={<Index />} />} />

        <Route
          path="/contact"
          element={<PublicRoutes Component={<Contact />} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/terms-condition" element={<TermsAndCondition />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route
          path="/customer/signup"
          element={<PublicRoutes Component={<Signup />} />}
        />
        <Route
          path="/customer/login"
          element={<PublicRoutes Component={<CustomerLogin />} />}
        />

        <Route
          path="/admin/login"
          element={<PublicRoutes Component={<AdminLogin />} />}
        />

        <Route
          path="/public/liveStreamChannels"
          element={<PublicRoutes Component={<Channels />} />}
        />

        <Route
          path="/public/liveStreamChannels/room=:link"
          element={<PublicRoutes Component={<LiveStreamRoom />} />}
        />

        <Route
          path="/public/find-your-account"
          element={<PublicRoutes Component={<FindYourAccount />} />}
        />
        <Route
          path="/public/update-password"
          element={<ResetPasswordRoute Component={<UpdatePassword />} />}
        />

        {/* customer routes */}
        <Route
          path="/customer"
          element={<CustomerRoutes Component={<Home />} />}
        />

        <Route
          path="/customer/profile"
          element={<CustomerRoutes Component={<Profile />} />}
        >
          <Route index element={<CustomerRoutes Component={<Personal />} />} />
          <Route
            path="personal"
            element={<CustomerRoutes Component={<Personal />} />}
          />
          <Route
            path="activities"
            element={<CustomerRoutes Component={<Activities />} />}
          />
        </Route>

        <Route
          path="/customer/store"
          element={<CustomerRoutes Component={<Store />} />}
        />
        <Route
          path="/customer/cart"
          element={<CustomerRoutes Component={<Cart />} />}
        />

        <Route
          path="/customer/payment"
          element={<CustomerRoutes Component={<PaymentInfo />} />}
        />

        <Route
          path="/customer/appointment"
          element={<CustomerRoutes Component={<Appointment />} />}
        />

        <Route
          path="/customer/schedules"
          element={<CustomerRoutes Component={<Schedules />} />}
        />

        <Route
          path="/customer/schedules/:id"
          element={<CustomerRoutes Component={<ScheduleCustomer />} />}
        />

        <Route
          path="/customer/purchases"
          element={<CustomerRoutes Component={<Purchases />} />}
        >
          {/* purchases children */}
          <Route index element={<Preparing />} />

          <Route path="preparing" element={<Preparing />} />
          <Route path="to-receive" element={<ToReceive />} />
        </Route>

        <Route
          path="/customer/purchases/:reference"
          element={<CustomerRoutes Component={<PurchasedDetails />} />}
        />

        <Route
          path="/customer/liveStreamChannels"
          element={<CustomerRoutes Component={<Channels />} />}
        />

        <Route
          path="/customer/liveStreamChannels/room=:link"
          element={<CustomerRoutes Component={<LiveStreamRoom />} />}
        />

        {/* admin routes */}
        <Route
          path="/admin"
          element={<AdminRoutes Component={<Dashboard />} />}
        />
        <Route
          path="/admin/inventory"
          element={<AdminRoutes Component={<Inventory />} />}
        />

        <Route
          path="/admin/appointments/"
          element={<AdminRoutes Component={<Record />} />}
        >
          <Route index element={<AppointmentList />} />
          <Route path="appointments" element={<AppointmentList />} />
        </Route>

        <Route
          path="/admin/sales"
          element={<AdminRoutes Component={<Sales />} />}
        />

        <Route
          path="/admin/orders"
          element={<AdminRoutes Component={<OrderList />} />}
        />

        <Route
          path="/admin/orders/:reference"
          element={<AdminRoutes Component={<OrderDetails />} />}
        />

        <Route
          path="/admin/record/appointments/:id"
          element={<AdminRoutes Component={<AppointmentDetails />} />}
        />

        <Route
          path="/admin/liveStreamChannels"
          element={<AdminRoutes Component={<Channels />} />}
        />

        <Route
          path="/admin/liveStreamChannels/room=:link"
          element={<AdminRoutes Component={<LiveStreamRoom />} />}
        />

        <Route
          path="/admin/employees/"
          element={<AdminRoutes Component={<Employees />} />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!footerExcludeRoutes.includes(pathname) &&
        !pathname.includes("/liveStreamChannels/room=") &&
        !pathname.includes("/admin/record/appointments/") &&
        !pathname.includes("/customer/payment") &&
        !pathname.includes('/customer/schedule')
        && <Footer />}
    </AppRoot>
  );
}

export default memo(App);
