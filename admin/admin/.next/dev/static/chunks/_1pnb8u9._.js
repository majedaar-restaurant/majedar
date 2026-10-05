(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/orders/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AcceptanceCountdown",
    ()=>AcceptanceCountdown,
    "default",
    ()=>OrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/orders.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/whatsapp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/socket.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$push$2d$notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/push-notifications.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/alert-manager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/admin-filters.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function WhatsAppIcon({ size = 14 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/orders/page.js",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/orders/page.js",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = WhatsAppIcon;
function AcceptanceCountdown({ deadline, onExpire }) {
    _s();
    const [secondsLeft, setSecondsLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AcceptanceCountdown.useState": ()=>{
            if (!deadline) return 0;
            return Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
        }
    }["AcceptanceCountdown.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AcceptanceCountdown.useEffect": ()=>{
            if (!deadline) return;
            const interval = setInterval({
                "AcceptanceCountdown.useEffect.interval": ()=>{
                    const remaining = Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
                    setSecondsLeft(remaining);
                    if (remaining <= 0) {
                        clearInterval(interval);
                        if (onExpire) onExpire();
                    }
                }
            }["AcceptanceCountdown.useEffect.interval"], 1000);
            return ({
                "AcceptanceCountdown.useEffect": ()=>clearInterval(interval)
            })["AcceptanceCountdown.useEffect"];
        }
    }["AcceptanceCountdown.useEffect"], [
        deadline,
        onExpire
    ]);
    if (secondsLeft <= 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                color: "var(--danger, #dc2626)",
                fontWeight: 700,
                fontSize: "11px"
            },
            children: "Expired"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/orders/page.js",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const secs = String(secondsLeft % 60).padStart(2, "0");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontFamily: "monospace",
            fontWeight: 700,
            color: "var(--crimson, #b91c1c)",
            fontSize: "11px"
        },
        children: [
            "⏱ ",
            mins,
            ":",
            secs
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/orders/page.js",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(AcceptanceCountdown, "owKhuggTr5eLIkwucpyH0f99VAc=");
_c1 = AcceptanceCountdown;
const STATUS_LABELS = {
    placed: "Placed",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready_for_pickup: "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
    expired: "Expired"
};
const PAYMENT_LABELS = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded"
};
function OrdersPage() {
    _s1();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [confirmingId, setConfirmingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Filters
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [paymentFilter, setPaymentFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [datePreset, setDatePreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalOrders, setTotalOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const pageSize = 50;
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "OrdersPage.useState": ()=>Date.now()
    }["OrdersPage.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersPage.useEffect": ()=>{
            const timer = setInterval({
                "OrdersPage.useEffect.timer": ()=>{
                    setNow(Date.now());
                }
            }["OrdersPage.useEffect.timer"], 1000);
            return ({
                "OrdersPage.useEffect": ()=>clearInterval(timer)
            })["OrdersPage.useEffect"];
        }
    }["OrdersPage.useEffect"], []);
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const loadOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrdersPage.useCallback[loadOrders]": async ()=>{
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: pageSize
                };
                if (search.trim()) params.search = search.trim();
                if (datePreset) params.datePreset = datePreset;
                if (dateFrom) params.dateFrom = dateFrom;
                if (dateTo) params.dateTo = dateTo;
                if (statusFilter !== "all") params.orderStatus = statusFilter;
                if (paymentFilter !== "all") params.paymentStatus = paymentFilter;
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminOrders"])(params);
                setOrders(data);
                setTotalOrders(data.total ?? data.length);
                setTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? data.length) / pageSize)));
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].syncPendingOrders(data);
            } catch (err) {
                toast(err.message || "Failed to load orders", "danger");
            } finally{
                setLoading(false);
            }
        }
    }["OrdersPage.useCallback[loadOrders]"], [
        currentPage,
        pageSize,
        search,
        datePreset,
        dateFrom,
        dateTo,
        statusFilter,
        paymentFilter,
        toast
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersPage.useEffect": ()=>{
            loadOrders();
        }
    }["OrdersPage.useEffect"], [
        loadOrders
    ]);
    // Real-time Socket.IO synchronization for incoming and updated orders
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersPage.useEffect": ()=>{
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectAdminSocket"])();
            if (!socket) return;
            socket.emit("join:admin");
            const handledEvents = new Set();
            const handleNewOrder = {
                "OrdersPage.useEffect.handleNewOrder": (payload)=>{
                    if (!payload?.orderId) return;
                    const key = `new-${payload.orderId}`;
                    if (!handledEvents.has(key)) {
                        handledEvents.add(key);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$push$2d$notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playNotificationChime"])();
                        toast(`New Order #${payload.orderNumber || ""} (₹${payload.total}) received!`, "success");
                    }
                    loadOrders();
                }
            }["OrdersPage.useEffect.handleNewOrder"];
            const handleConfirmed = {
                "OrdersPage.useEffect.handleConfirmed": (payload)=>{
                    if (!payload?.orderId) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(payload.orderId);
                    setOrders({
                        "OrdersPage.useEffect.handleConfirmed": (prev)=>prev.map({
                                "OrdersPage.useEffect.handleConfirmed": (ord)=>ord._id === payload.orderId ? {
                                        ...ord,
                                        orderStatus: "confirmed",
                                        confirmedAt: payload.confirmedAt
                                    } : ord
                            }["OrdersPage.useEffect.handleConfirmed"])
                    }["OrdersPage.useEffect.handleConfirmed"]);
                }
            }["OrdersPage.useEffect.handleConfirmed"];
            const handleStatusChanged = {
                "OrdersPage.useEffect.handleStatusChanged": (payload)=>{
                    if (!payload?.orderId) return;
                    if (payload.orderStatus !== "placed") {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(payload.orderId);
                    }
                    setOrders({
                        "OrdersPage.useEffect.handleStatusChanged": (prev)=>prev.map({
                                "OrdersPage.useEffect.handleStatusChanged": (ord)=>ord._id === payload.orderId ? {
                                        ...ord,
                                        orderStatus: payload.orderStatus
                                    } : ord
                            }["OrdersPage.useEffect.handleStatusChanged"])
                    }["OrdersPage.useEffect.handleStatusChanged"]);
                }
            }["OrdersPage.useEffect.handleStatusChanged"];
            const handleExpired = {
                "OrdersPage.useEffect.handleExpired": (payload)=>{
                    if (!payload?.orderId) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(payload.orderId);
                    setOrders({
                        "OrdersPage.useEffect.handleExpired": (prev)=>prev.map({
                                "OrdersPage.useEffect.handleExpired": (ord)=>ord._id === payload.orderId ? {
                                        ...ord,
                                        orderStatus: "expired",
                                        expiredAt: payload.expiredAt
                                    } : ord
                            }["OrdersPage.useEffect.handleExpired"])
                    }["OrdersPage.useEffect.handleExpired"]);
                }
            }["OrdersPage.useEffect.handleExpired"];
            const handleCancelled = {
                "OrdersPage.useEffect.handleCancelled": (payload)=>{
                    if (!payload?.orderId) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(payload.orderId);
                    setOrders({
                        "OrdersPage.useEffect.handleCancelled": (prev)=>prev.map({
                                "OrdersPage.useEffect.handleCancelled": (ord)=>ord._id === payload.orderId ? {
                                        ...ord,
                                        orderStatus: "cancelled",
                                        cancelledAt: payload.cancelledAt
                                    } : ord
                            }["OrdersPage.useEffect.handleCancelled"])
                    }["OrdersPage.useEffect.handleCancelled"]);
                }
            }["OrdersPage.useEffect.handleCancelled"];
            const handleReconnect = {
                "OrdersPage.useEffect.handleReconnect": ()=>{
                    socket.emit("join:admin");
                    loadOrders();
                }
            }["OrdersPage.useEffect.handleReconnect"];
            socket.on("order:new", handleNewOrder);
            socket.on("new_order", handleNewOrder);
            socket.on("order:confirmed", handleConfirmed);
            socket.on("order:status_changed", handleStatusChanged);
            socket.on("order:expired", handleExpired);
            socket.on("order:cancelled", handleCancelled);
            socket.on("connect", handleReconnect);
            return ({
                "OrdersPage.useEffect": ()=>{
                    socket.off("order:new", handleNewOrder);
                    socket.off("new_order", handleNewOrder);
                    socket.off("order:confirmed", handleConfirmed);
                    socket.off("order:status_changed", handleStatusChanged);
                    socket.off("order:expired", handleExpired);
                    socket.off("order:cancelled", handleCancelled);
                    socket.off("connect", handleReconnect);
                }
            })["OrdersPage.useEffect"];
        }
    }["OrdersPage.useEffect"], [
        loadOrders,
        toast
    ]);
    const handleQuickConfirm = async (orderId)=>{
        setConfirmingId(orderId);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(orderId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminOrderStatus"])(orderId, {
                orderStatus: "confirmed"
            });
            toast("Order confirmed successfully!", "success");
            await loadOrders();
        } catch (err) {
            toast(err.message || "Failed to confirm order", "danger");
            await loadOrders();
        } finally{
            setConfirmingId(null);
        }
    };
    const activeChips = [];
    if (search.trim()) {
        activeChips.push({
            id: "search",
            label: "Search",
            value: `"${search.trim()}"`,
            onRemove: ()=>{
                setSearch("");
                setCurrentPage(1);
            }
        });
    }
    if (datePreset === "today") {
        activeChips.push({
            id: "date",
            label: "Date",
            value: "Today",
            onRemove: ()=>{
                setDatePreset("");
                setCurrentPage(1);
            }
        });
    } else if (datePreset === "this-week") {
        activeChips.push({
            id: "date",
            label: "Date",
            value: "This Week",
            onRemove: ()=>{
                setDatePreset("");
                setCurrentPage(1);
            }
        });
    } else if (dateFrom || dateTo) {
        activeChips.push({
            id: "date",
            label: "Date",
            value: `${dateFrom || "Start"} to ${dateTo || "End"}`,
            onRemove: ()=>{
                setDatePreset("");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
            }
        });
    }
    if (statusFilter !== "all") {
        activeChips.push({
            id: "status",
            label: "Order Status",
            value: STATUS_LABELS[statusFilter] || statusFilter,
            onRemove: ()=>{
                setStatusFilter("all");
                setCurrentPage(1);
            }
        });
    }
    if (paymentFilter !== "all") {
        activeChips.push({
            id: "payment",
            label: "Payment",
            value: PAYMENT_LABELS[paymentFilter] || paymentFilter,
            onRemove: ()=>{
                setPaymentFilter("all");
                setCurrentPage(1);
            }
        });
    }
    const handleClearAllFilters = ()=>{
        setSearch("");
        setDatePreset("");
        setDateFrom("");
        setDateTo("");
        setStatusFilter("all");
        setPaymentFilter("all");
        setCurrentPage(1);
    };
    const urgentNewOrders = orders.filter((o)=>o.orderStatus === "placed" && o.acceptanceDeadline && new Date(o.acceptanceDeadline).getTime() > now);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Orders",
                description: ""
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/page.js",
                lineNumber: 341,
                columnNumber: 7
            }, this),
            urgentNewOrders.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        background: "var(--crimson, #b91c1c)",
                                        color: "#fff",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                        letterSpacing: "0.05em"
                                    },
                                    children: "NEW ORDER ALERT"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/page.js",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        fontSize: "14px",
                                        color: "#881337"
                                    },
                                    children: [
                                        urgentNewOrders.length,
                                        " order(s) awaiting acceptance!"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/orders/page.js",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/page.js",
                            lineNumber: 360,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 359,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px"
                        },
                        children: urgentNewOrders.map((ord)=>{
                            const isPastDeadline = ord.acceptanceDeadline && new Date(ord.acceptanceDeadline).getTime() <= now;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #fda4af",
                                    borderRadius: "6px",
                                    padding: "10px 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    fontSize: "13px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "Order #",
                                                    ord.orderNumber
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/page.js",
                                                lineNumber: 398,
                                                columnNumber: 21
                                            }, this),
                                            " • ₹",
                                            ord.total,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "var(--muted)",
                                                    marginTop: "2px"
                                                },
                                                children: "Waiting for confirmation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/page.js",
                                                lineNumber: 399,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 397,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AcceptanceCountdown, {
                                                deadline: ord.acceptanceDeadline,
                                                onExpire: loadOrders
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/page.js",
                                                lineNumber: 404,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "var(--muted)"
                                                },
                                                children: "remaining"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/page.js",
                                                lineNumber: 408,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 403,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleQuickConfirm(ord._id),
                                        disabled: confirmingId === ord._id || isPastDeadline,
                                        style: {
                                            background: isPastDeadline ? "#9ca3af" : "var(--forest-deep, #14532d)",
                                            color: "#ffffff",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "5px 12px",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            cursor: isPastDeadline ? "not-allowed" : "pointer"
                                        },
                                        children: confirmingId === ord._id ? "Confirming..." : "Confirm Order"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 410,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, ord._id, true, {
                                fileName: "[project]/app/dashboard/orders/page.js",
                                lineNumber: 384,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/page.js",
                lineNumber: 347,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-filter-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-item-wrapper",
                        style: {
                            flex: "1 1 240px",
                            minWidth: "200px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "filter-item-label",
                                children: "Search Orders"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/orders/page.js",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "search",
                                        placeholder: "Search by order #, name or phone...",
                                        value: search,
                                        onChange: (e)=>{
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        },
                                        style: {
                                            width: "100%",
                                            height: "32px",
                                            padding: "0 10px 0 28px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "5px",
                                            fontSize: "12px",
                                            color: "var(--ink)",
                                            outline: "none",
                                            background: "#ffffff"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: 14,
                                        height: 14,
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        style: {
                                            position: "absolute",
                                            left: "8px",
                                            color: "var(--muted)",
                                            pointerEvents: "none"
                                        },
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 471,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 459,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/page.js",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 436,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DateFilterControl"], {
                        datePreset: datePreset,
                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        onChangePreset: (preset)=>{
                            setDatePreset(preset);
                            setDateFrom("");
                            setDateTo("");
                            setCurrentPage(1);
                        },
                        onApplyCustom: (from, to)=>{
                            setDatePreset("custom");
                            setDateFrom(from);
                            setDateTo(to);
                            setCurrentPage(1);
                        },
                        onClearDate: ()=>{
                            setDatePreset("");
                            setDateFrom("");
                            setDateTo("");
                            setCurrentPage(1);
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 476,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectControl"], {
                        label: "Order Status",
                        value: statusFilter,
                        onChange: (e)=>{
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        },
                        options: [
                            {
                                value: "all",
                                label: "All Statuses"
                            },
                            {
                                value: "placed",
                                label: "Placed"
                            },
                            {
                                value: "confirmed",
                                label: "Confirmed"
                            },
                            {
                                value: "preparing",
                                label: "Preparing"
                            },
                            {
                                value: "ready_for_pickup",
                                label: "Ready for Pickup"
                            },
                            {
                                value: "out_for_delivery",
                                label: "Out for Delivery"
                            },
                            {
                                value: "completed",
                                label: "Completed"
                            },
                            {
                                value: "cancelled",
                                label: "Cancelled"
                            },
                            {
                                value: "expired",
                                label: "Expired"
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectControl"], {
                        label: "Payment",
                        value: paymentFilter,
                        onChange: (e)=>{
                            setPaymentFilter(e.target.value);
                            setCurrentPage(1);
                        },
                        options: [
                            {
                                value: "all",
                                label: "All Payments"
                            },
                            {
                                value: "paid",
                                label: "Paid"
                            },
                            {
                                value: "pending",
                                label: "Pending"
                            },
                            {
                                value: "failed",
                                label: "Failed"
                            },
                            {
                                value: "refunded",
                                label: "Refunded"
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/page.js",
                lineNumber: 435,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActiveFilterChips"], {
                chips: activeChips,
                onClearAll: handleClearAllFilters
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/page.js",
                lineNumber: 537,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "surface data-surface",
                children: [
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "40px",
                            textAlign: "center",
                            color: "var(--muted)"
                        },
                        children: "Loading orders..."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 541,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                        columns: [
                            "Customer",
                            "Phone",
                            "Items",
                            "Total",
                            "Payment",
                            "Order Status",
                            "Action"
                        ],
                        rows: orders,
                        empty: activeChips.length > 0 ? "No orders found for this date/status combination." : "No orders found.",
                        renderRow: (order)=>{
                            const customerName = order.customer?.name || `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() || "Customer";
                            const phone = order.customer?.phone || order.deliveryAddress?.phone || "—";
                            const itemsSummary = Array.isArray(order.items) ? order.items.map((it)=>`${it.name} ×${it.quantity}`).join(", ") : "—";
                            const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                            }) : "—";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: customerName
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 585,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 584,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "muted",
                                        children: phone
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 587,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "muted",
                                        style: {
                                            maxWidth: 220,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        },
                                        title: itemsSummary,
                                        children: itemsSummary
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 588,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                "₹",
                                                order.total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 596,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 595,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "2px",
                                                alignItems: "flex-start"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    children: PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 600,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    className: "muted",
                                                    style: {
                                                        fontSize: "10px",
                                                        textTransform: "uppercase",
                                                        fontWeight: 600
                                                    },
                                                    children: order.paymentMethod === "razorpay" ? "Online" : "COD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 601,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 599,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 598,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "3px",
                                                alignItems: "flex-start"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 608,
                                                    columnNumber: 23
                                                }, this),
                                                order.orderStatus === "placed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: "10px",
                                                        color: "var(--muted)"
                                                    },
                                                    children: "Waiting for confirmation"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 610,
                                                    columnNumber: 25
                                                }, this),
                                                order.orderStatus === "placed" && order.acceptanceDeadline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "3px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AcceptanceCountdown, {
                                                            deadline: order.acceptanceDeadline,
                                                            onExpire: loadOrders
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/orders/page.js",
                                                            lineNumber: 616,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "10px",
                                                                color: "var(--muted)"
                                                            },
                                                            children: "remaining"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/orders/page.js",
                                                            lineNumber: 620,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 615,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 607,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 606,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            },
                                            children: [
                                                order.orderStatus === "placed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "row-action",
                                                    onClick: ()=>handleQuickConfirm(order._id),
                                                    disabled: confirmingId === order._id || order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now,
                                                    style: {
                                                        color: order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now ? "#9ca3af" : "var(--forest-deep, #14532d)",
                                                        fontWeight: 700,
                                                        padding: "2px 6px",
                                                        background: order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now ? "#f3f4f6" : "var(--forest-soft, #f0fdf4)",
                                                        borderRadius: "4px",
                                                        border: "1px solid #bbf7d0",
                                                        cursor: order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now ? "not-allowed" : "pointer"
                                                    },
                                                    children: confirmingId === order._id ? "..." : "Confirm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 628,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    className: "row-action",
                                                    href: `/dashboard/orders/${order._id}`,
                                                    children: "View"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 646,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppShareUrl"])(order);
                                                        const opened = window.open(url, "_blank", "noopener,noreferrer");
                                                        if (!opened) window.location.assign(url);
                                                    },
                                                    title: "Share on WhatsApp",
                                                    "aria-label": "Share on WhatsApp",
                                                    style: {
                                                        background: "#f0fdf4",
                                                        border: "1px solid #bbf7d0",
                                                        borderRadius: "3px",
                                                        color: "#16a34a",
                                                        cursor: "pointer",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "4px 6px",
                                                        lineHeight: 1
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WhatsAppIcon, {
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/page.js",
                                                        lineNumber: 671,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/page.js",
                                                    lineNumber: 649,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/page.js",
                                            lineNumber: 626,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/page.js",
                                        lineNumber: 625,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, order._id, true, {
                                fileName: "[project]/app/dashboard/orders/page.js",
                                lineNumber: 583,
                                columnNumber: 17
                            }, this);
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 545,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminPagination"], {
                        page: currentPage,
                        total: totalOrders,
                        limit: pageSize,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/page.js",
                        lineNumber: 681,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/page.js",
                lineNumber: 539,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/orders/page.js",
        lineNumber: 340,
        columnNumber: 5
    }, this);
}
_s1(OrdersPage, "6BCpW96QTh3ZC2TrcIuWeZsTNug=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c2 = OrdersPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "WhatsAppIcon");
__turbopack_context__.k.register(_c1, "AcceptanceCountdown");
__turbopack_context__.k.register(_c2, "OrdersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/admin-filters.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActiveFilterChips",
    ()=>ActiveFilterChips,
    "AdminPagination",
    ()=>AdminPagination,
    "DateFilterControl",
    ()=>DateFilterControl,
    "FilterSelectControl",
    ()=>FilterSelectControl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function DateFilterControl({ datePreset, dateFrom, dateTo, onChangePreset, onApplyCustom, onClearDate }) {
    _s();
    const [popoverOpen, setPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localFrom, setLocalFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(dateFrom || "");
    const [localTo, setLocalTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(dateTo || "");
    const popoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateFilterControl.useEffect": ()=>{
            setLocalFrom(dateFrom || "");
            setLocalTo(dateTo || "");
        }
    }["DateFilterControl.useEffect"], [
        dateFrom,
        dateTo
    ]);
    // Close popover when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateFilterControl.useEffect": ()=>{
            function handleClickOutside(e) {
                if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                    setPopoverOpen(false);
                }
            }
            if (popoverOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "DateFilterControl.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["DateFilterControl.useEffect"];
        }
    }["DateFilterControl.useEffect"], [
        popoverOpen
    ]);
    const handleApply = (e)=>{
        e?.preventDefault();
        if (onApplyCustom) {
            onApplyCustom(localFrom, localTo);
        }
        setPopoverOpen(false);
    };
    const handleClear = ()=>{
        setLocalFrom("");
        setLocalTo("");
        if (onClearDate) {
            onClearDate();
        }
        setPopoverOpen(false);
    };
    const isCustomActive = datePreset === "custom" || dateFrom && dateTo;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "filter-item-wrapper",
        ref: popoverRef,
        style: {
            position: "relative"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "filter-item-label",
                children: "Date Filter"
            }, void 0, false, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "date-filter-group",
                role: "group",
                "aria-label": "Date Range Filter",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `date-preset-btn ${datePreset === "today" ? "active" : ""}`,
                        onClick: ()=>{
                            setPopoverOpen(false);
                            if (datePreset === "today") {
                                onClearDate();
                            } else {
                                onChangePreset("today");
                            }
                        },
                        children: "Today"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `date-preset-btn ${datePreset === "this-week" ? "active" : ""}`,
                        onClick: ()=>{
                            setPopoverOpen(false);
                            if (datePreset === "this-week") {
                                onClearDate();
                            } else {
                                onChangePreset("this-week");
                            }
                        },
                        children: "This Week"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `date-preset-btn ${isCustomActive ? "active" : ""}`,
                        onClick: ()=>setPopoverOpen((prev)=>!prev),
                        "aria-expanded": popoverOpen,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isCustomActive && dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "Custom Range"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: 10,
                                height: 6,
                                viewBox: "0 0 10 6",
                                fill: "currentColor",
                                style: {
                                    marginLeft: 4
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M0 0l5 5 5-5z"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/admin-filters.jsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            popoverOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "date-custom-popover",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "date-custom-head",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Select Custom Range"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "popover-close-btn",
                                onClick: ()=>setPopoverOpen(false),
                                "aria-label": "Close",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleApply,
                        className: "date-custom-body",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "date-input-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "From Date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: localFrom,
                                        onChange: (e)=>setLocalFrom(e.target.value),
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "date-input-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "To Date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: localTo,
                                        min: localFrom || undefined,
                                        onChange: (e)=>setLocalTo(e.target.value),
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "date-custom-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "button button-secondary",
                                        style: {
                                            height: 32,
                                            fontSize: 12,
                                            padding: "0 10px"
                                        },
                                        onClick: handleClear,
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "button button-primary",
                                        style: {
                                            height: 32,
                                            fontSize: 12,
                                            padding: "0 12px"
                                        },
                                        children: "Apply"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/admin-filters.jsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/admin-filters.jsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(DateFilterControl, "x4/rUma7vkNQ5dY9TetTEPrBVTc=");
_c = DateFilterControl;
function FilterSelectControl({ label, value, onChange, options = [] }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "visible-filter-select",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "filter-item-label",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "select-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: value,
                        onChange: onChange,
                        children: options.map((opt)=>{
                            const val = typeof opt === "string" ? opt : opt.value;
                            const text = typeof opt === "string" ? opt : opt.label;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: val,
                                children: text
                            }, val, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "select-chevron",
                        width: 10,
                        height: 6,
                        viewBox: "0 0 10 6",
                        fill: "currentColor",
                        "aria-hidden": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M0 0l5 5 5-5z"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/admin-filters.jsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 180,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/admin-filters.jsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_c1 = FilterSelectControl;
function ActiveFilterChips({ chips = [], onClearAll }) {
    if (!chips || chips.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "active-filters-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "active-filters-label",
                children: "Active Filters:"
            }, void 0, false, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "active-chips-list",
                children: [
                    chips.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "active-filter-chip",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "chip-key",
                                    children: [
                                        chip.label,
                                        ":"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ui/admin-filters.jsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "chip-val",
                                    children: chip.value
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/admin-filters.jsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "chip-remove-btn",
                                    onClick: chip.onRemove,
                                    title: `Remove ${chip.label} filter`,
                                    "aria-label": `Remove ${chip.label} filter`,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/admin-filters.jsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, chip.id, true, {
                            fileName: "[project]/components/ui/admin-filters.jsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "clear-all-filters-btn",
                        onClick: onClearAll,
                        title: "Clear all active filters",
                        children: "Clear All"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 213,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/admin-filters.jsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
_c2 = ActiveFilterChips;
function AdminPagination({ page = 1, total = 0, limit = 50, totalPages = 1, onPageChange }) {
    if (total <= 0) return null;
    const startIdx = (page - 1) * limit + 1;
    const endIdx = Math.min(page * limit, total);
    const pagesCount = Math.max(1, totalPages || Math.ceil(total / limit));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-pagination-bar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pagination-info",
                children: [
                    "Showing ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: [
                            startIdx,
                            "–",
                            endIdx
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 253,
                        columnNumber: 17
                    }, this),
                    " of ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: total
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 253,
                        columnNumber: 57
                    }, this),
                    " records"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pagination-buttons",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "pagination-btn",
                        onClick: ()=>onPageChange(page - 1),
                        disabled: page <= 1,
                        children: "Previous"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "pagination-page-indicator",
                        children: [
                            "Page ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: page
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 267,
                                columnNumber: 16
                            }, this),
                            " of ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: pagesCount
                            }, void 0, false, {
                                fileName: "[project]/components/ui/admin-filters.jsx",
                                lineNumber: 267,
                                columnNumber: 43
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "pagination-btn",
                        onClick: ()=>onPageChange(page + 1),
                        disabled: page >= pagesCount,
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/admin-filters.jsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/admin-filters.jsx",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/admin-filters.jsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
_c3 = AdminPagination;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "DateFilterControl");
__turbopack_context__.k.register(_c1, "FilterSelectControl");
__turbopack_context__.k.register(_c2, "ActiveFilterChips");
__turbopack_context__.k.register(_c3, "AdminPagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/whatsapp.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Majedaar Restaurant - WhatsApp Order Sharing Utilities
 * Pure helper functions for formatting order delivery notifications.
 * Clean, professional, emoji-free text with proper UTF-8 encoding.
 */ /**
 * Clean and normalize string values, discarding empty or placeholder values.
 * Returns null if the value represents an undefined, null, or N/A placeholder.
 *
 * @param {any} val
 * @returns {string|null}
 */ __turbopack_context__.s([
    "cleanString",
    ()=>cleanString,
    "formatOrderForWhatsApp",
    ()=>formatOrderForWhatsApp,
    "getWhatsAppShareUrl",
    ()=>getWhatsAppShareUrl
]);
function cleanString(val) {
    if (val === null || val === undefined) return null;
    const str = String(val).trim();
    if (!str) return null;
    const lower = str.toLowerCase();
    if (lower === "undefined" || lower === "null" || lower === "n/a" || lower === "na" || lower === "—" || lower === "-") {
        return null;
    }
    return str;
}
function formatOrderForWhatsApp(order) {
    if (!order || typeof order !== "object") {
        return "";
    }
    // 1. Order Identifier
    const rawId = cleanString(order.orderNumber) || cleanString(order._id) || cleanString(order.id) || "";
    const cleanId = rawId.replace(/^#/, "");
    const orderLine = cleanId ? `Order: #${cleanId}` : "Order";
    // 2. Customer details
    const customerName = cleanString(order.customer?.name) || cleanString([
        order.deliveryAddress?.firstName,
        order.deliveryAddress?.lastName
    ].filter(Boolean).join(" ")) || "Customer";
    const customerPhone = cleanString(order.deliveryAddress?.phone) || cleanString(order.customer?.phone) || "";
    const customerLines = [
        `Customer: ${customerName}`
    ];
    if (customerPhone) {
        customerLines.push(`Phone: ${customerPhone}`);
    }
    const customerBlock = customerLines.join("\n");
    // 3. Delivery address
    let address = cleanString(order.deliveryAddress?.address);
    if (!address && typeof order.deliveryAddress === "string") {
        address = cleanString(order.deliveryAddress);
    }
    const area = cleanString(order.deliveryAddress?.area);
    if (address && area && !address.toLowerCase().includes(area.toLowerCase())) {
        address = `${address}, ${area}`;
    } else if (!address && area) {
        address = area;
    }
    const addressLine = `Delivery Address: ${address || "Address not provided"}`;
    // 4. Optional Landmark & Delivery instructions
    const landmark = cleanString(order.deliveryAddress?.landmark);
    const instructions = cleanString(order.deliveryAddress?.deliveryInstructions);
    const instructionsOther = cleanString(order.deliveryAddress?.deliveryInstructionOther);
    let finalInstructions = null;
    if (instructions && instructions.toLowerCase() === "other") {
        finalInstructions = instructionsOther || null;
    } else if (instructions && instructionsOther) {
        finalInstructions = `${instructions} (${instructionsOther})`;
    } else if (instructions) {
        finalInstructions = instructions;
    } else if (instructionsOther) {
        finalInstructions = instructionsOther;
    }
    const deliveryLines = [
        addressLine
    ];
    if (landmark) {
        deliveryLines.push(`Landmark: ${landmark}`);
    }
    // Optional Customer Location link if valid coordinates exist
    const loc = order.deliveryAddress?.location || order.location;
    const lat = loc?.latitude ?? order.deliveryAddress?.latitude;
    const lng = loc?.longitude ?? order.deliveryAddress?.longitude;
    const isValidCoord = (n, min, max)=>typeof n === "number" && !isNaN(n) && n >= min && n <= max;
    if (isValidCoord(lat, -90, 90) && isValidCoord(lng, -180, 180)) {
        deliveryLines.push(`Customer Location:\nhttps://www.google.com/maps?q=${lat},${lng}`);
    }
    if (finalInstructions) {
        deliveryLines.push(`Delivery: ${finalInstructions}`);
    }
    const deliveryBlock = deliveryLines.join("\n");
    // 5. Backend Authoritative Total
    const totalAmount = order.total !== null && order.total !== undefined && !isNaN(Number(order.total)) ? Number(order.total).toFixed(2) : "0.00";
    const amountLine = `Amount: ₹${totalAmount}`;
    // 6. Payment Information
    let paymentMethod = "COD";
    const rawMethod = (order.paymentMethod || "").toLowerCase();
    if (rawMethod === "razorpay" || rawMethod === "online") {
        paymentMethod = "Online";
    } else if (rawMethod === "cod") {
        paymentMethod = "COD";
    } else if (rawMethod) {
        paymentMethod = rawMethod.toUpperCase();
    }
    const paymentStatusMap = {
        paid: "Paid",
        pending: "Pending",
        failed: "Failed",
        refunded: "Refunded",
        created: "Pending"
    };
    const rawStatus = (order.paymentStatus || "").toLowerCase();
    const paymentStatus = paymentStatusMap[rawStatus] || (rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : "Pending");
    const paymentLine = `Payment: ${paymentMethod} - ${paymentStatus}`;
    const financeBlock = `${amountLine}\n${paymentLine}`;
    // 7. Assemble Complete Message
    const separator = "--------------------";
    const headerBlock = `MAJEDAAR RESTAURANT\n${separator}`;
    const footerBlock = `${separator}\nPlease deliver this order to the customer.`;
    return [
        headerBlock,
        orderLine,
        customerBlock,
        deliveryBlock,
        financeBlock,
        footerBlock
    ].join("\n\n");
}
function getWhatsAppShareUrl(order) {
    const message = formatOrderForWhatsApp(order);
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1pnb8u9._.js.map