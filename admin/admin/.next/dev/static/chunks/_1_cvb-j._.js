(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/orders.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/settings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/socket.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$new$2d$order$2d$alert$2d$modal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/new-order-alert-modal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/alert-manager.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const STATUS_LABELS = {
    placed: "Placed",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
    expired: "Expired"
};
const FILTER_PRESETS = [
    {
        id: "today",
        label: "Today"
    },
    {
        id: "this-week",
        label: "This Week"
    },
    {
        id: "last-week",
        label: "Last Week"
    },
    {
        id: "this-month",
        label: "This Month"
    },
    {
        id: "last-month",
        label: "Last Month"
    },
    {
        id: "this-year",
        label: "This Year"
    },
    {
        id: "custom",
        label: "Custom Range"
    }
];
function DashboardPage() {
    _s();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [liveOrders, setLiveOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopSettings, setShopSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmingId, setConfirmingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Date Filtering State (Today by default)
    const [datePreset, setDatePreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("today");
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customPopoverOpen, setCustomPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localCustomFrom, setLocalCustomFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [localCustomTo, setLocalCustomTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const customPopoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const filterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        preset: "today",
        from: "",
        to: ""
    });
    filterRef.current = {
        preset: datePreset,
        from: dateFrom,
        to: dateTo
    };
    // Over Order Modal State
    const [showOverOrderModal, setShowOverOrderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [overOrderType, setOverOrderType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("30"); // "30" or "custom"
    const [customMinutes, setCustomMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(45);
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const loadDashboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardPage.useCallback[loadDashboardData]": async (forcedPreset, forcedFrom, forcedTo)=>{
            const preset = forcedPreset !== undefined ? forcedPreset : filterRef.current.preset;
            const from = forcedFrom !== undefined ? forcedFrom : filterRef.current.from;
            const to = forcedTo !== undefined ? forcedTo : filterRef.current.to;
            const filterParams = {
                datePreset: preset,
                limit: 100
            };
            if (preset === "custom" && from && to) {
                filterParams.dateFrom = from;
                filterParams.dateTo = to;
            }
            try {
                const [ordersData, statsData, settingsData, liveOrdersData] = await Promise.allSettled([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminOrders"])(filterParams),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboardStats"])(filterParams),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminSettings"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminOrders"])({
                        limit: 100
                    })
                ]);
                if (ordersData.status === "fulfilled") {
                    setOrders(ordersData.value || []);
                }
                if (liveOrdersData.status === "fulfilled") {
                    setLiveOrders(liveOrdersData.value || []);
                }
                if (statsData.status === "fulfilled") {
                    setStats(statsData.value);
                    if (statsData.value?.shopStatus) {
                        setShopSettings(statsData.value.shopStatus);
                    }
                }
                if (settingsData.status === "fulfilled") {
                    setShopSettings(settingsData.value);
                }
            } catch (err) {
                console.error("Dashboard data load error:", err);
            } finally{
                setLoading(false);
            }
        }
    }["DashboardPage.useCallback[loadDashboardData]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            loadDashboardData();
            // Poll every 15 seconds to ensure operational sync even if tab loses websocket focus
            const interval = setInterval({
                "DashboardPage.useEffect.interval": ()=>{
                    loadDashboardData();
                }
            }["DashboardPage.useEffect.interval"], 15000);
            return ({
                "DashboardPage.useEffect": ()=>clearInterval(interval)
            })["DashboardPage.useEffect"];
        }
    }["DashboardPage.useEffect"], [
        loadDashboardData
    ]);
    // Close custom popover on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            function handleClickOutside(e) {
                if (customPopoverRef.current && !customPopoverRef.current.contains(e.target)) {
                    setCustomPopoverOpen(false);
                }
            }
            if (customPopoverOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "DashboardPage.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["DashboardPage.useEffect"];
        }
    }["DashboardPage.useEffect"], [
        customPopoverOpen
    ]);
    // Socket.IO Real-time Synchronization
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectAdminSocket"])();
            if (!socket) return;
            socket.emit("join:admin");
            const handleRealtimeUpdate = {
                "DashboardPage.useEffect.handleRealtimeUpdate": ()=>{
                    loadDashboardData();
                }
            }["DashboardPage.useEffect.handleRealtimeUpdate"];
            socket.on("order:new", handleRealtimeUpdate);
            socket.on("new_order", handleRealtimeUpdate);
            socket.on("order:confirmed", handleRealtimeUpdate);
            socket.on("order:status_changed", handleRealtimeUpdate);
            socket.on("order:expired", handleRealtimeUpdate);
            socket.on("order:cancelled", handleRealtimeUpdate);
            socket.on("shop:status_changed", {
                "DashboardPage.useEffect": (updatedStatus)=>{
                    setShopSettings(updatedStatus);
                    loadDashboardData();
                }
            }["DashboardPage.useEffect"]);
            socket.on("connect", {
                "DashboardPage.useEffect": ()=>{
                    socket.emit("join:admin");
                    loadDashboardData();
                }
            }["DashboardPage.useEffect"]);
            return ({
                "DashboardPage.useEffect": ()=>{
                    socket.off("order:new", handleRealtimeUpdate);
                    socket.off("new_order", handleRealtimeUpdate);
                    socket.off("order:confirmed", handleRealtimeUpdate);
                    socket.off("order:status_changed", handleRealtimeUpdate);
                    socket.off("order:expired", handleRealtimeUpdate);
                    socket.off("order:cancelled", handleRealtimeUpdate);
                    socket.off("shop:status_changed");
                }
            })["DashboardPage.useEffect"];
        }
    }["DashboardPage.useEffect"], [
        loadDashboardData
    ]);
    // Filter change handlers
    const handlePresetSelect = (presetId)=>{
        if (presetId === "custom") {
            setCustomPopoverOpen((prev)=>!prev);
            return;
        }
        setCustomPopoverOpen(false);
        setDatePreset(presetId);
        setDateFrom("");
        setDateTo("");
        setLoading(true);
        loadDashboardData(presetId, "", "");
    };
    const handleApplyCustomDate = (e)=>{
        e?.preventDefault();
        if (!localCustomFrom || !localCustomTo) return;
        setDatePreset("custom");
        setDateFrom(localCustomFrom);
        setDateTo(localCustomTo);
        setCustomPopoverOpen(false);
        setLoading(true);
        loadDashboardData("custom", localCustomFrom, localCustomTo);
    };
    const handleResetToToday = ()=>{
        setLocalCustomFrom("");
        setLocalCustomTo("");
        setDatePreset("today");
        setDateFrom("");
        setDateTo("");
        setCustomPopoverOpen(false);
        setLoading(true);
        loadDashboardData("today", "", "");
    };
    // Handlers for Shop Availability Toggles
    const handleToggleShop = async ()=>{
        if (!shopSettings) return;
        const nextState = !shopSettings.isOpen;
        setActionLoading(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleShopStatus"])(nextState);
            setShopSettings(updated);
            toast(nextState ? "Shop is now OPEN and accepting orders." : "Shop is now CLOSED. Customers cannot place new orders.", nextState ? "success" : "warn");
            loadDashboardData();
        } catch (err) {
            toast(err.message || "Failed to update shop status", "danger");
        } finally{
            setActionLoading(false);
        }
    };
    const handleToggleOverOrder = async ()=>{
        if (!shopSettings) return;
        const isCurrentlyActive = shopSettings.overOrder?.isActive;
        if (isCurrentlyActive) {
            // Deactivate immediately
            setActionLoading(true);
            try {
                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleOverOrder"])(false);
                setShopSettings(updated);
                toast("Over Order mode deactivated. Normal ordering restored.", "success");
                loadDashboardData();
            } catch (err) {
                toast(err.message || "Failed to deactivate over order mode", "danger");
            } finally{
                setActionLoading(false);
            }
        } else {
            // Open duration selection modal
            setShowOverOrderModal(true);
        }
    };
    const handleApplyOverOrder = async ()=>{
        const mins = overOrderType === "30" ? 30 : Math.max(1, Number(customMinutes) || 30);
        setActionLoading(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleOverOrder"])(true, mins);
            setShopSettings(updated);
            setShowOverOrderModal(false);
            toast(`Over Order mode activated for ${mins} minutes.`, "warn");
            loadDashboardData();
        } catch (err) {
            toast(err.message || "Failed to activate over order mode", "danger");
        } finally{
            setActionLoading(false);
        }
    };
    const handleConfirmOrder = async (orderId)=>{
        setConfirmingId(orderId);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(orderId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminOrderStatus"])(orderId, {
                orderStatus: "confirmed"
            });
            toast("Order confirmed successfully!", "success");
            loadDashboardData();
        } catch (err) {
            toast(err.message || "Failed to confirm order", "danger");
        } finally{
            setConfirmingId(null);
        }
    };
    // Live queues derived from liveOrders
    const activeOrders = liveOrders.filter((o)=>o.orderStatus === "placed" || o.orderStatus === "preparing" || o.orderStatus === "out_for_delivery");
    const awaitingOrders = liveOrders.filter((o)=>o.orderStatus === "placed" && o.acceptanceDeadline && new Date(o.acceptanceDeadline) > new Date());
    // Friendly filter label
    const PRESET_DISPLAY_NAMES = {
        today: "Today",
        "this-week": "This Week",
        "last-week": "Last Week",
        "this-month": "This Month",
        "last-month": "Last Month",
        "this-year": "This Year",
        custom: dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "Custom Range"
    };
    const activeFilterLabel = PRESET_DISPLAY_NAMES[datePreset] || "Today";
    // Filtered stats
    const filteredOrdersCount = stats?.ordersCount ?? orders.length;
    const filteredRevenue = stats?.revenue ?? 0;
    const statusBreakdown = stats?.statusBreakdown || {
        placed: 0,
        preparing: 0,
        completed: 0,
        cancelled: 0
    };
    const isShopOpen = shopSettings ? shopSettings.isOpen : true;
    const isOverOrderActive = shopSettings?.overOrder?.isActive;
    const todayISTStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata"
    }).format(new Date());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Dashboard",
                description: "Real-time restaurant operational control, today's performance, and kitchen fulfillment queue."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            flexWrap: "wrap"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: "inline-block",
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor: isShopOpen ? "#16a34a" : "#dc2626",
                                                    boxShadow: isShopOpen ? "0 0 0 3px rgba(22, 163, 74, 0.2)" : "0 0 0 3px rgba(220, 38, 38, 0.2)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 338,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: "14px",
                                                    color: "var(--ink)"
                                                },
                                                children: [
                                                    "Shop Status:",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: isShopOpen ? "#16a34a" : "#dc2626"
                                                        },
                                                        children: isShopOpen ? "OPEN (Accepting Orders)" : "CLOSED (Orders Blocked)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: "4px 0 0 18px",
                                            fontSize: "12px",
                                            color: "var(--muted)"
                                        },
                                        children: [
                                            shopSettings?.displayTimings ? `Standard Timings: ${shopSettings.displayTimings}` : "Operational hours controlled in Settings",
                                            shopSettings?.isManuallyClosed && " · Manually closed by admin"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 357,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            isOverOrderActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "#fef3c7",
                                    border: "1px solid #f59e0b",
                                    color: "#b45309",
                                    borderRadius: "20px",
                                    padding: "4px 12px",
                                    fontSize: "12px",
                                    fontWeight: 700
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "⏳"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Over Order Active (",
                                            shopSettings.overOrder.remainingMinutes,
                                            "m remaining)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleToggleShop,
                                disabled: actionLoading || !shopSettings,
                                style: {
                                    padding: "8px 18px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: actionLoading ? "not-allowed" : "pointer",
                                    transition: "all 0.15s ease",
                                    backgroundColor: isShopOpen ? "#dc2626" : "#16a34a",
                                    color: "#ffffff",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                                },
                                children: actionLoading ? "Updating..." : isShopOpen ? "Close Shop" : "Open Shop"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleToggleOverOrder,
                                disabled: actionLoading || !shopSettings,
                                style: {
                                    padding: "8px 18px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    border: isOverOrderActive ? "1px solid #dc2626" : "1px solid #d97706",
                                    backgroundColor: isOverOrderActive ? "#fee2e2" : "#fef3c7",
                                    color: isOverOrderActive ? "#991b1b" : "#92400e",
                                    cursor: actionLoading ? "not-allowed" : "pointer",
                                    transition: "all 0.15s ease"
                                },
                                children: isOverOrderActive ? "Deactivate Over Order" : "Over Order"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 411,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        fontSize: "13px",
                                        color: "var(--ink)"
                                    },
                                    children: "Filter Analytics & Orders:"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 450,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "#ecfdf5",
                                    color: "#065f46",
                                    border: "1px solid #a7f3d0",
                                    borderRadius: "20px",
                                    padding: "2px 10px",
                                    fontSize: "12px",
                                    fontWeight: 700
                                },
                                children: [
                                    "Viewing: ",
                                    activeFilterLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 452,
                                columnNumber: 11
                            }, this),
                            datePreset !== "today" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleResetToToday,
                                style: {
                                    background: "none",
                                    border: "none",
                                    color: "#dc2626",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    padding: "2px 4px"
                                },
                                children: "Reset to Today"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 469,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: customPopoverRef,
                        style: {
                            position: "relative",
                            display: "inline-flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            background: "#f3f4f6",
                            padding: "3px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb"
                        },
                        children: [
                            FILTER_PRESETS.map((preset)=>{
                                const isActive = datePreset === preset.id;
                                const isCustom = preset.id === "custom";
                                const customActive = isCustom && (datePreset === "custom" || dateFrom && dateTo);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handlePresetSelect(preset.id),
                                    style: {
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: isActive || customActive ? 700 : 500,
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        backgroundColor: isActive || customActive ? "var(--forest, #14532d)" : "transparent",
                                        color: isActive || customActive ? "#ffffff" : "var(--ink-mid, #4b5563)",
                                        boxShadow: isActive || customActive ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        whiteSpace: "nowrap"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: preset.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 529,
                                            columnNumber: 17
                                        }, this),
                                        isCustom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: 10,
                                            height: 6,
                                            viewBox: "0 0 10 6",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M0 0l5 5 5-5z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 532,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 531,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, preset.id, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this);
                            }),
                            customPopoverOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "date-custom-popover",
                                style: {
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    left: "auto",
                                    zIndex: 200,
                                    background: "#ffffff",
                                    border: "1px solid var(--border, #d1d5db)",
                                    borderRadius: "10px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                    padding: "16px",
                                    minWidth: "280px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "date-custom-head",
                                        style: {
                                            marginBottom: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: "13px",
                                                    color: "var(--ink)"
                                                },
                                                children: "Select Custom Dates"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 558,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "popover-close-btn",
                                                onClick: ()=>setCustomPopoverOpen(false),
                                                "aria-label": "Close",
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 559,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 557,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleApplyCustomDate,
                                        className: "date-custom-body",
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "date-input-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Start Date (From)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 571,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: localCustomFrom,
                                                        max: localCustomTo || todayISTStr,
                                                        onChange: (e)=>setLocalCustomFrom(e.target.value),
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 572,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 570,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "date-input-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "End Date (To)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 582,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: localCustomTo,
                                                        min: localCustomFrom || undefined,
                                                        max: todayISTStr,
                                                        onChange: (e)=>setLocalCustomTo(e.target.value),
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 583,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 581,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "date-custom-actions",
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    gap: "8px",
                                                    marginTop: "4px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "button button-secondary",
                                                        style: {
                                                            height: 32,
                                                            fontSize: 12,
                                                            padding: "0 10px"
                                                        },
                                                        onClick: handleResetToToday,
                                                        children: "Reset to Today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 594,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "button button-primary",
                                                        style: {
                                                            height: 32,
                                                            fontSize: 12,
                                                            padding: "0 14px",
                                                            backgroundColor: "var(--forest, #14532d)"
                                                        },
                                                        children: "Apply Filter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 602,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 593,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 569,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 541,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 489,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 433,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "summary-grid",
                style: {
                    marginBottom: "24px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    activeFilterLabel,
                                    "'s Orders"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 620,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-number",
                                children: loading ? "..." : filteredOrdersCount
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 621,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: "6px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "6px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            color: "var(--ink-mid)"
                                        },
                                        children: [
                                            "Placed: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "var(--ink)"
                                                },
                                                children: statusBreakdown.placed || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 626,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            color: "var(--muted)"
                                        },
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 628,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            color: "var(--ink-mid)"
                                        },
                                        children: [
                                            "Prep: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "var(--ink)"
                                                },
                                                children: statusBreakdown.preparing || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 630,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 629,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            color: "var(--muted)"
                                        },
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 632,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            color: "var(--ink-mid)"
                                        },
                                        children: [
                                            "Done: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: "#16a34a"
                                                },
                                                children: statusBreakdown.completed || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 634,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 633,
                                        columnNumber: 13
                                    }, this),
                                    (statusBreakdown.cancelled || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "var(--muted)"
                                                },
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 638,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    color: "#dc2626"
                                                },
                                                children: [
                                                    "Cancelled: ",
                                                    statusBreakdown.cancelled
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 639,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 637,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 624,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 619,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    activeFilterLabel,
                                    "'s Revenue"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 649,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-number",
                                style: {
                                    color: "#16a34a"
                                },
                                children: loading ? "..." : `₹${Math.round(filteredRevenue).toLocaleString("en-IN")}`
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 650,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: "6px",
                                    fontSize: "11px",
                                    color: "var(--muted)"
                                },
                                children: "From paid & completed orders"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 653,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 648,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Pending Orders"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 660,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-number",
                                style: {
                                    color: (stats?.pendingOrdersCount || 0) > 0 ? "#b45309" : "var(--ink)"
                                },
                                children: loading ? "..." : stats?.pendingOrdersCount ?? 0
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 661,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `summary-note ${(stats?.pendingOrdersCount || 0) > 0 ? "warn" : "neutral"}`,
                                children: (stats?.pendingOrdersCount || 0) > 0 ? `${stats.pendingOrdersCount} orders awaiting action` : "No orders awaiting action"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 669,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 659,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Active Orders"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 680,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-number",
                                children: loading ? "..." : activeOrders.length
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 681,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `summary-note ${activeOrders.length > 0 ? "warn" : "neutral"}`,
                                children: activeOrders.length > 0 ? `${activeOrders.length} in kitchen & fulfillment queue` : "Kitchen queue clear"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 679,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 617,
                columnNumber: 7
            }, this),
            awaitingOrders.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    marginBottom: "24px",
                    background: "#fff9f9",
                    border: "2px solid #b91c1c",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    boxShadow: "0 4px 14px rgba(185, 28, 28, 0.08)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                            borderBottom: "1px solid #fee2e2",
                            paddingBottom: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "20px"
                                        },
                                        children: "🔔"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 715,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    color: "#991b1b",
                                                    margin: 0
                                                },
                                                children: [
                                                    "New Orders Awaiting Confirmation (",
                                                    awaitingOrders.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 717,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: "2px 0 0 0",
                                                    fontSize: "12px",
                                                    color: "#7f1d1d"
                                                },
                                                children: "Confirm incoming orders before the deadline expires."
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 720,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 716,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 714,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/orders?status=placed",
                                style: {
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#991b1b",
                                    textDecoration: "underline"
                                },
                                children: "View in Orders →"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 725,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 704,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "12px"
                        },
                        children: awaitingOrders.map((ord)=>{
                            const custName = ord.customer?.name || `${ord.deliveryAddress?.firstName || ""} ${ord.deliveryAddress?.lastName || ""}`.trim() || "Customer";
                            const isConfirming = confirmingId === ord._id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #fecdd3",
                                    borderRadius: "8px",
                                    padding: "14px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        style: {
                                                            fontSize: "14px",
                                                            color: "#111827"
                                                        },
                                                        children: [
                                                            "Order #",
                                                            ord.orderNumber
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 767,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "12px",
                                                            color: "#4b5563"
                                                        },
                                                        children: [
                                                            "Customer: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: custName
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.js",
                                                                lineNumber: 771,
                                                                columnNumber: 35
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 770,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 766,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: "15px",
                                                    color: "#14532d"
                                                },
                                                children: [
                                                    "₹",
                                                    ord.total
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 774,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 765,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "#fff1f2",
                                            padding: "6px 8px",
                                            borderRadius: "4px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "#991b1b",
                                                    fontWeight: 600
                                                },
                                                children: "Waiting for confirmation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 789,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$new$2d$order$2d$alert$2d$modal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AcceptanceTimer"], {
                                                deadline: ord.acceptanceDeadline
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 792,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 779,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "4px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/dashboard/orders/${ord._id}`,
                                                style: {
                                                    flex: 1,
                                                    textAlign: "center",
                                                    background: "#f3f4f6",
                                                    color: "#1f2937",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "5px",
                                                    padding: "6px 10px",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    textDecoration: "none"
                                                },
                                                children: "VIEW ORDER"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 796,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleConfirmOrder(ord._id),
                                                disabled: isConfirming,
                                                style: {
                                                    flex: 1.2,
                                                    background: "#14532d",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    padding: "6px 10px",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    cursor: isConfirming ? "not-allowed" : "pointer",
                                                    opacity: isConfirming ? 0.7 : 1
                                                },
                                                children: isConfirming ? "Confirming..." : "CONFIRM ORDER"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 813,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 795,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, ord._id, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 753,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 738,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 694,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "surface",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "surface-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: [
                                                    activeFilterLabel,
                                                    "'s Orders"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 846,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "Customer orders placed during ",
                                                    activeFilterLabel.toLowerCase(),
                                                    " (",
                                                    orders.length,
                                                    " total)."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 847,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 845,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard/orders",
                                        children: "View all in Orders →"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 849,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 844,
                                columnNumber: 11
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "40px",
                                    textAlign: "center",
                                    color: "var(--muted)"
                                },
                                children: "Loading orders..."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 853,
                                columnNumber: 13
                            }, this) : orders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                                title: `No orders for ${activeFilterLabel.toLowerCase()}`,
                                description: `No orders were placed during this period (${activeFilterLabel}).`,
                                compact: true
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 857,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                columns: [
                                    "Order #",
                                    "Customer",
                                    "Amount",
                                    "Status",
                                    "Date / Time",
                                    ""
                                ],
                                rows: orders,
                                renderRow: (order)=>{
                                    const customerName = order.customer?.name || `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() || "Customer";
                                    const itemsCount = Array.isArray(order.items) ? `${order.items.length} item${order.items.length === 1 ? "" : "s"}` : "";
                                    const timeStr = order.createdAt ? datePreset === "today" ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : "—";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: order.orderNumber
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 893,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 892,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 896,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        className: "muted",
                                                        children: itemsCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 897,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 895,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        "₹",
                                                        order.total
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 900,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 899,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 903,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 902,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "muted",
                                                children: timeStr
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 905,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    className: "row-action",
                                                    href: `/dashboard/orders/${order._id}`,
                                                    children: "View"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.js",
                                                    lineNumber: 907,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 906,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, order._id, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 891,
                                        columnNumber: 19
                                    }, this);
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 863,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 843,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "surface",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "surface-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Live / Active Kitchen Queue"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 922,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Orders currently in preparation or out for delivery."
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 923,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 921,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard/orders",
                                        children: "Manage"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 925,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 920,
                                columnNumber: 11
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "40px",
                                    textAlign: "center",
                                    color: "var(--muted)"
                                },
                                children: "Loading queue..."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 929,
                                columnNumber: 13
                            }, this) : activeOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "32px 16px",
                                    textAlign: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "var(--muted)",
                                        fontSize: "12.5px"
                                    },
                                    children: "No active orders in kitchen queue right now."
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 934,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 933,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "booking-list",
                                children: activeOrders.slice(0, 6).map((order)=>{
                                    const custName = order.customer?.name || `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() || "Customer";
                                    const itemsList = Array.isArray(order.items) ? order.items.map((it)=>`${it.name} ×${it.quantity}`).join(", ") : "Items";
                                    const badgeBg = order.orderStatus === "placed" ? "#FEF3C7" : order.orderStatus === "preparing" ? "#E0E7FF" : "var(--forest-soft)";
                                    const badgeText = order.orderStatus === "placed" ? "#B45309" : order.orderStatus === "preparing" ? "#3730A3" : "var(--forest-deep)";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "booking-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "booking-avatar",
                                                style: {
                                                    background: badgeBg,
                                                    color: badgeText,
                                                    fontSize: "10px",
                                                    fontWeight: 800
                                                },
                                                children: order.orderStatus === "placed" ? "NEW" : order.orderStatus === "preparing" ? "PREP" : "DELIV"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 966,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    minWidth: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            custName,
                                                            " — #",
                                                            order.orderNumber
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 982,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        style: {
                                                            maxWidth: 240,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            display: "block"
                                                        },
                                                        children: itemsList
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.js",
                                                        lineNumber: 985,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 981,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.js",
                                                lineNumber: 997,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, order._id, true, {
                                        fileName: "[project]/app/dashboard/page.js",
                                        lineNumber: 965,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.js",
                                lineNumber: 939,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.js",
                        lineNumber: 919,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 841,
                columnNumber: 7
            }, this),
            showOverOrderModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "16px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#ffffff",
                        borderRadius: "14px",
                        padding: "24px",
                        maxWidth: "420px",
                        width: "100%",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: "0 0 8px 0",
                                fontSize: "17px",
                                fontWeight: 700,
                                color: "var(--ink)"
                            },
                            children: "Activate Over Order Mode"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 1030,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: "0 0 16px 0",
                                fontSize: "13px",
                                color: "var(--muted)",
                                lineHeight: 1.5
                            },
                            children: "Temporarily stops new orders from being placed when the kitchen is at peak volume. Normal ordering resumes automatically when the timer expires."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 1033,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "20px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "block",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        marginBottom: "8px",
                                        color: "var(--ink)"
                                    },
                                    children: "Select Pause Duration:"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 1039,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "10px",
                                        marginBottom: "14px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setOverOrderType("30"),
                                            style: {
                                                flex: 1,
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: overOrderType === "30" ? "2px solid #b45309" : "1px solid var(--border)",
                                                backgroundColor: overOrderType === "30" ? "#fef3c7" : "#f9fafb",
                                                color: overOrderType === "30" ? "#92400e" : "var(--ink)",
                                                fontWeight: 700,
                                                fontSize: "13px",
                                                cursor: "pointer"
                                            },
                                            children: "30 Minutes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 1044,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setOverOrderType("custom"),
                                            style: {
                                                flex: 1,
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: overOrderType === "custom" ? "2px solid #b45309" : "1px solid var(--border)",
                                                backgroundColor: overOrderType === "custom" ? "#fef3c7" : "#f9fafb",
                                                color: overOrderType === "custom" ? "#92400e" : "var(--ink)",
                                                fontWeight: 700,
                                                fontSize: "13px",
                                                cursor: "pointer"
                                            },
                                            children: "Custom Time"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 1062,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 1043,
                                    columnNumber: 15
                                }, this),
                                overOrderType === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: "block",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                marginBottom: "4px",
                                                color: "var(--muted)"
                                            },
                                            children: "Minutes to Pause:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 1083,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "5",
                                            max: "360",
                                            step: "5",
                                            value: customMinutes,
                                            onChange: (e)=>setCustomMinutes(Math.max(1, parseInt(e.target.value, 10) || 15)),
                                            style: {
                                                width: "100%",
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid var(--border)",
                                                fontSize: "14px",
                                                fontWeight: 600
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 1086,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            style: {
                                                color: "var(--muted)",
                                                fontSize: "11px",
                                                display: "block",
                                                marginTop: "4px"
                                            },
                                            children: "Suggested: 15, 45, 60, or 90 minutes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.js",
                                            lineNumber: 1102,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 1082,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 1038,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowOverOrderModal(false),
                                    disabled: actionLoading,
                                    className: "button button-quiet",
                                    style: {
                                        padding: "8px 16px",
                                        fontSize: "13px"
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 1110,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleApplyOverOrder,
                                    disabled: actionLoading,
                                    style: {
                                        padding: "8px 18px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "#d97706",
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        cursor: actionLoading ? "not-allowed" : "pointer"
                                    },
                                    children: actionLoading ? "Activating..." : "Confirm & Activate"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.js",
                                    lineNumber: 1119,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.js",
                            lineNumber: 1109,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.js",
                    lineNumber: 1020,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.js",
                lineNumber: 1008,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.js",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "PtDFDvCezRzdPGB13sYnTWmli80=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminSettings",
    ()=>getAdminSettings,
    "getDashboardStats",
    ()=>getDashboardStats,
    "toggleOverOrder",
    ()=>toggleOverOrder,
    "toggleShopStatus",
    ()=>toggleShopStatus,
    "updateAdminSettings",
    ()=>updateAdminSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.js [app-client] (ecmascript)");
;
async function getAdminSettings() {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/settings");
    return res.data;
}
async function updateAdminSettings(settings) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/settings", {
        method: "PUT",
        body: settings
    });
    return res.data;
}
async function toggleShopStatus(isOpen) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/settings/toggle-shop", {
        method: "POST",
        body: {
            isOpen: Boolean(isOpen)
        }
    });
    return res.data;
}
async function toggleOverOrder(active, durationMinutes = 30) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/settings/over-order", {
        method: "POST",
        body: {
            active: Boolean(active),
            durationMinutes: Number(durationMinutes)
        }
    });
    return res.data;
}
async function getDashboardStats(params = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)){
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
            query.set(k, String(v));
        }
    }
    const queryString = query.toString();
    const endpoint = `/admin/settings/dashboard-stats${queryString ? `?${queryString}` : ""}`;
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(endpoint);
    return res.data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1_cvb-j._.js.map