(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/orders/[id]/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/orders.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$riders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/riders.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$payments$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/payments.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/whatsapp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/socket.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/alert-manager.js [app-client] (ecmascript)");
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
const VALID_NEXT_STATUSES = {
    placed: [
        {
            value: "confirmed",
            label: "Confirmed — Accept order"
        },
        {
            value: "cancelled",
            label: "Cancelled — Reject/Void order"
        }
    ],
    confirmed: [
        {
            value: "preparing",
            label: "Preparing — In kitchen"
        },
        {
            value: "cancelled",
            label: "Cancelled — Void order"
        }
    ],
    preparing: [
        {
            value: "ready_for_pickup",
            label: "Ready for Pickup — Food packed"
        },
        {
            value: "cancelled",
            label: "Cancelled — Void order"
        }
    ],
    ready_for_pickup: [
        {
            value: "out_for_delivery",
            label: "Out for Delivery — Handed to rider"
        },
        {
            value: "cancelled",
            label: "Cancelled — Void order"
        }
    ],
    out_for_delivery: [
        {
            value: "completed",
            label: "Completed — Delivered to customer"
        }
    ],
    completed: [],
    cancelled: [],
    expired: []
};
const PAYMENT_LABELS = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded"
};
const PAYMENT_TONES = {
    paid: "paid",
    failed: "cancelled",
    refunded: "refunded",
    pending: "pending",
    created: "neutral"
};
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
                fontWeight: 700
            },
            children: "Expired"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/orders/[id]/page.js",
            lineNumber: 84,
            columnNumber: 12
        }, this);
    }
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const secs = String(secondsLeft % 60).padStart(2, "0");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontFamily: "monospace",
            fontWeight: 700,
            color: "var(--crimson, #b91c1c)"
        },
        children: [
            "⏱ ",
            mins,
            ":",
            secs
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/orders/[id]/page.js",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(AcceptanceCountdown, "owKhuggTr5eLIkwucpyH0f99VAc=");
_c = AcceptanceCountdown;
function WhatsAppIcon({ size = 17 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/orders/[id]/page.js",
            lineNumber: 106,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/orders/[id]/page.js",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c1 = WhatsAppIcon;
function PrintIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: 15,
        height: 15,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 14h12v8H6z"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/orders/[id]/page.js",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_c2 = PrintIcon;
function OrderDetailPage({ params: paramsPromise }) {
    _s1();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(paramsPromise);
    const id = params?.id;
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentAttempts, setPaymentAttempts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Status update modal
    const [showStatusModal, setShowStatusModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newOrderStatus, setNewOrderStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("placed");
    const [newPaymentStatus, setNewPaymentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [updating, setUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExpired, setIsExpired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Rider modal
    const [showRiderModal, setShowRiderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeRiders, setActiveRiders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedRiderId, setSelectedRiderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loadingRiders, setLoadingRiders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assigningRider, setAssigningRider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleShareOnWhatsApp = ()=>{
        try {
            if (!order) {
                toast("Order data is not loaded yet", "danger");
                return;
            }
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppShareUrl"])(order);
            const opened = window.open(url, "_blank", "noopener,noreferrer");
            if (!opened) {
                window.location.assign(url);
            }
        } catch  {
            toast("Failed to open WhatsApp. Please try again.", "danger");
        }
    };
    const fetchOrderData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrderDetailPage.useCallback[fetchOrderData]": async ()=>{
            try {
                const [orderData, attemptsData] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminOrderById"])(id),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$payments$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrderPaymentAttempts"])(id).catch({
                        "OrderDetailPage.useCallback[fetchOrderData]": ()=>[]
                    }["OrderDetailPage.useCallback[fetchOrderData]"])
                ]);
                setOrder(orderData);
                setPaymentAttempts(Array.isArray(attemptsData) ? attemptsData : []);
                if (orderData) {
                    setNewOrderStatus(orderData.orderStatus || "placed");
                    setNewPaymentStatus(orderData.paymentStatus || "pending");
                    setIsExpired(orderData.acceptanceDeadline ? new Date(orderData.acceptanceDeadline).getTime() <= Date.now() : false);
                }
            } catch (err) {
                toast(err?.message || "Failed to load order details", "danger");
            } finally{
                setLoading(false);
            }
        }
    }["OrderDetailPage.useCallback[fetchOrderData]"], [
        id,
        toast
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderDetailPage.useEffect": ()=>{
            if (id) {
                fetchOrderData();
            }
        }
    }["OrderDetailPage.useEffect"], [
        id,
        fetchOrderData
    ]);
    // Real-time synchronization for this order
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderDetailPage.useEffect": ()=>{
            if (!id) return;
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectAdminSocket"])();
            if (!socket) return;
            socket.emit("join:order", {
                orderId: id
            });
            const handleConfirmed = {
                "OrderDetailPage.useEffect.handleConfirmed": (payload)=>{
                    if (payload?.orderId !== id) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
                    setOrder({
                        "OrderDetailPage.useEffect.handleConfirmed": (prev)=>prev ? {
                                ...prev,
                                orderStatus: "confirmed",
                                confirmedAt: payload.confirmedAt
                            } : prev
                    }["OrderDetailPage.useEffect.handleConfirmed"]);
                    setNewOrderStatus("confirmed");
                }
            }["OrderDetailPage.useEffect.handleConfirmed"];
            const handleStatusChanged = {
                "OrderDetailPage.useEffect.handleStatusChanged": (payload)=>{
                    if (payload?.orderId !== id) return;
                    if (payload.orderStatus !== "placed") {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
                    }
                    setOrder({
                        "OrderDetailPage.useEffect.handleStatusChanged": (prev)=>prev ? {
                                ...prev,
                                orderStatus: payload.orderStatus
                            } : prev
                    }["OrderDetailPage.useEffect.handleStatusChanged"]);
                    setNewOrderStatus(payload.orderStatus);
                }
            }["OrderDetailPage.useEffect.handleStatusChanged"];
            const handleRiderAssigned = {
                "OrderDetailPage.useEffect.handleRiderAssigned": (payload)=>{
                    if (payload?.orderId !== id) return;
                    fetchOrderData();
                }
            }["OrderDetailPage.useEffect.handleRiderAssigned"];
            const handleExpired = {
                "OrderDetailPage.useEffect.handleExpired": (payload)=>{
                    if (payload?.orderId !== id) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
                    setOrder({
                        "OrderDetailPage.useEffect.handleExpired": (prev)=>prev ? {
                                ...prev,
                                orderStatus: "expired",
                                expiredAt: payload.expiredAt
                            } : prev
                    }["OrderDetailPage.useEffect.handleExpired"]);
                    setNewOrderStatus("expired");
                }
            }["OrderDetailPage.useEffect.handleExpired"];
            const handleCancelled = {
                "OrderDetailPage.useEffect.handleCancelled": (payload)=>{
                    if (payload?.orderId !== id) return;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
                    setOrder({
                        "OrderDetailPage.useEffect.handleCancelled": (prev)=>prev ? {
                                ...prev,
                                orderStatus: "cancelled",
                                cancelledAt: payload.cancelledAt
                            } : prev
                    }["OrderDetailPage.useEffect.handleCancelled"]);
                    setNewOrderStatus("cancelled");
                }
            }["OrderDetailPage.useEffect.handleCancelled"];
            const handleReconnect = {
                "OrderDetailPage.useEffect.handleReconnect": ()=>{
                    socket.emit("join:order", {
                        orderId: id
                    });
                    fetchOrderData();
                }
            }["OrderDetailPage.useEffect.handleReconnect"];
            socket.on("order:confirmed", handleConfirmed);
            socket.on("order:status_changed", handleStatusChanged);
            socket.on("rider:assigned", handleRiderAssigned);
            socket.on("order:expired", handleExpired);
            socket.on("order:cancelled", handleCancelled);
            socket.on("connect", handleReconnect);
            return ({
                "OrderDetailPage.useEffect": ()=>{
                    socket.off("order:confirmed", handleConfirmed);
                    socket.off("order:status_changed", handleStatusChanged);
                    socket.off("rider:assigned", handleRiderAssigned);
                    socket.off("order:expired", handleExpired);
                    socket.off("order:cancelled", handleCancelled);
                    socket.off("connect", handleReconnect);
                    socket.emit("leave:order", {
                        orderId: id
                    });
                }
            })["OrderDetailPage.useEffect"];
        }
    }["OrderDetailPage.useEffect"], [
        id,
        fetchOrderData
    ]);
    const handleQuickConfirm = async ()=>{
        setUpdating(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminOrderStatus"])(id, {
                orderStatus: "confirmed"
            });
            setOrder(updated);
            toast("Order confirmed successfully within acceptance window!", "success");
        } catch (err) {
            toast(err?.message || "Failed to confirm order", "danger");
            await fetchOrderData();
        } finally{
            setUpdating(false);
        }
    };
    const handleCancelOrder = async ()=>{
        if (!window.confirm(`Are you sure you want to cancel Order #${order.orderNumber}?`)) return;
        setUpdating(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$alert$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertManager"].removePendingOrder(id);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminOrderStatus"])(id, {
                orderStatus: "cancelled"
            });
            setOrder(updated);
            toast("Order cancelled successfully", "neutral");
        } catch (err) {
            toast(err?.message || "Failed to cancel order", "danger");
        } finally{
            setUpdating(false);
        }
    };
    const openRiderModal = async ()=>{
        setShowRiderModal(true);
        setLoadingRiders(true);
        try {
            const riders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$riders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminRiders"])({
                isActive: true
            });
            setActiveRiders(riders);
            if (order.rider?._id) {
                setSelectedRiderId(order.rider._id);
            } else if (riders.length > 0) {
                setSelectedRiderId(riders[0]._id);
            }
        } catch (err) {
            toast(err?.message || "Failed to load active riders", "danger");
        } finally{
            setLoadingRiders(false);
        }
    };
    const handleAssignRiderSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedRiderId) {
            toast("Please select an active rider", "danger");
            return;
        }
        setAssigningRider(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignAdminOrderRider"])(id, selectedRiderId);
            setOrder(updated);
            toast("Delivery rider assigned successfully", "success");
            setShowRiderModal(false);
        } catch (err) {
            toast(err?.message || "Failed to assign rider", "danger");
        } finally{
            setAssigningRider(false);
        }
    };
    const handleUpdateStatus = async ()=>{
        setUpdating(true);
        try {
            const payload = {
                orderStatus: newOrderStatus
            };
            // Only allow sending paymentStatus for COD orders (online payments are webhook-driven)
            if (order.paymentMethod === "cod") {
                payload.paymentStatus = newPaymentStatus;
            }
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$orders$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminOrderStatus"])(id, payload);
            setOrder(updated);
            toast("Order status updated successfully", "success");
            setShowStatusModal(false);
        } catch (err) {
            toast(err?.message || "Failed to update order status", "danger");
        } finally{
            setUpdating(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: "60px",
                textAlign: "center",
                color: "var(--muted)"
            },
            children: "Loading order details and payment history..."
        }, void 0, false, {
            fileName: "[project]/app/dashboard/orders/[id]/page.js",
            lineNumber: 346,
            columnNumber: 7
        }, this);
    }
    if (!order) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: "60px",
                textAlign: "center"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "Order Not Found"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                    lineNumber: 355,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "muted",
                    style: {
                        marginTop: 8
                    },
                    children: "The requested order ID does not exist or has been removed."
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                    lineNumber: 356,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/orders",
                    className: "button button-secondary",
                    style: {
                        marginTop: 16
                    },
                    children: "Back to Orders"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                    lineNumber: 359,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/orders/[id]/page.js",
            lineNumber: 354,
            columnNumber: 7
        }, this);
    }
    const customerName = order.customer?.name || `${order.deliveryAddress?.firstName || ""} ${order.deliveryAddress?.lastName || ""}`.trim() || "Customer";
    const customerPhone = order.customer?.phone || order.deliveryAddress?.phone || "—";
    const customerEmail = order.customer?.email || order.deliveryAddress?.email || "—";
    const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }) : "—";
    const isTerminalState = order.orderStatus === "completed" || order.orderStatus === "cancelled" || order.orderStatus === "expired";
    const isOnlinePayment = order.paymentMethod === "razorpay";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: `Order ${order.orderNumber}`,
                title: "Order Details",
                description: `Placed on ${formattedDate}`,
                action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            type: "button",
                            onClick: handleShareOnWhatsApp,
                            title: "Share on WhatsApp",
                            "aria-label": "Share on WhatsApp",
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 11px",
                                color: "#16a34a",
                                borderColor: "#bbf7d0",
                                background: "#f0fdf4"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WhatsAppIcon, {
                                size: 17
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 412,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            type: "button",
                            onClick: ()=>window.print(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintIcon, {}, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this),
                                " Print Order"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 414,
                            columnNumber: 13
                        }, this),
                        !isTerminalState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            onClick: ()=>setShowStatusModal(true),
                            children: "Update Status"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 418,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                    lineNumber: 395,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 390,
                columnNumber: 7
            }, this),
            order.orderStatus === "placed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    borderRadius: "8px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "14px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "4px"
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
                                        children: "NEW ORDER"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 443,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            fontSize: "15px",
                                            color: "#881337"
                                        },
                                        children: [
                                            "Order #",
                                            order.orderNumber
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 442,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "muted",
                                style: {
                                    margin: 0,
                                    fontSize: "13px"
                                },
                                children: "Waiting for confirmation"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 460,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 441,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AcceptanceCountdown, {
                                        deadline: order.acceptanceDeadline,
                                        onExpire: ()=>{
                                            setIsExpired(true);
                                            fetchOrderData();
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 467,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "12px",
                                            color: "var(--muted)"
                                        },
                                        children: "remaining"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 474,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 466,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                onClick: handleQuickConfirm,
                                disabled: updating || isExpired || order.orderStatus === "expired",
                                style: {
                                    background: isExpired || order.orderStatus === "expired" ? "#9ca3af" : "var(--forest-deep, #14532d)",
                                    cursor: isExpired || order.orderStatus === "expired" ? "not-allowed" : "pointer"
                                },
                                children: updating ? "Confirming..." : "Confirm Order"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "secondary",
                                onClick: handleCancelOrder,
                                disabled: updating,
                                style: {
                                    color: "var(--crimson, #b91c1c)",
                                    borderColor: "#fecdd3",
                                    background: "#ffffff"
                                },
                                children: "Cancel Order"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 465,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 427,
                columnNumber: 9
            }, this),
            order.orderStatus === "expired" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: "20px",
                    color: "#991b1b",
                    fontSize: "13px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "⚠️ Order Expired:"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 520,
                        columnNumber: 11
                    }, this),
                    " This order was not confirmed within the 3-minute acceptance window and has automatically expired (",
                    order.expiryReason || "admin_acceptance_timeout",
                    ")."
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 509,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "detail-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface detail-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "detail-card-head",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 531,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "muted",
                                                        children: customerPhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 532,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 530,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                        children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 535,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                        tone: PAYMENT_TONES[order.paymentStatus] || "neutral",
                                                        children: PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 536,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 534,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 529,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "detail-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-label",
                                                        children: "Order Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 544,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-value",
                                                        style: {
                                                            textTransform: "capitalize"
                                                        },
                                                        children: order.orderType?.replace("_", " ") || "Delivery"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 545,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 543,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-label",
                                                        children: "Payment Method"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 550,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-value",
                                                        style: {
                                                            textTransform: "uppercase",
                                                            fontWeight: 700
                                                        },
                                                        children: isOnlinePayment ? "Online (Razorpay)" : "Cash on Delivery (COD)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 551,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 549,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-label",
                                                        children: "Payment Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 556,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-value",
                                                        style: {
                                                            fontWeight: 600
                                                        },
                                                        children: PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 557,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 555,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-label",
                                                        children: "Order Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 562,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "detail-value",
                                                        children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 563,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 561,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 542,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 528,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface detail-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "detail-section-title",
                                                style: {
                                                    margin: 0
                                                },
                                                children: "Payment & Transaction History"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 573,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                tone: PAYMENT_TONES[order.paymentStatus] || "neutral",
                                                children: PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 576,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 572,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "10px 12px",
                                            background: "var(--bg-subtle, #faf8f5)",
                                            borderRadius: "8px",
                                            border: "1px solid var(--line-soft)",
                                            marginBottom: "14px",
                                            fontSize: "12px"
                                        },
                                        children: isOnlinePayment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Online Secured Payment (Razorpay):"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 584,
                                                    columnNumber: 19
                                                }, this),
                                                " Status is authoritatively validated by Razorpay cryptographic HMAC signatures & webhooks. Manual status manipulation is disabled for financial integrity."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                            lineNumber: 583,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Cash on Delivery (COD):"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 588,
                                                    columnNumber: 19
                                                }, this),
                                                " Payment collected in cash or UPI QR at the customer's doorstep upon food delivery."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                            lineNumber: 587,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this),
                                    isOnlinePayment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    color: "var(--muted)",
                                                    textTransform: "uppercase",
                                                    display: "block",
                                                    marginBottom: "8px"
                                                },
                                                children: [
                                                    "Payment Attempts (",
                                                    paymentAttempts.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 596,
                                                columnNumber: 17
                                            }, this),
                                            paymentAttempts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "muted",
                                                style: {
                                                    fontSize: "12px",
                                                    fontStyle: "italic",
                                                    margin: 0
                                                },
                                                children: "No payment attempt recorded yet (customer has not initiated checkout)."
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 601,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "order-items",
                                                style: {
                                                    gap: "8px"
                                                },
                                                children: paymentAttempts.map((attempt, index)=>{
                                                    const amountRupees = attempt.amount ? (attempt.amount / 100).toFixed(2) : "0.00";
                                                    const attemptDate = attempt.createdAt ? new Date(attempt.createdAt).toLocaleString("en-IN") : "—";
                                                    const isAttemptPaid = attempt.status === "paid";
                                                    const isAttemptFailed = attempt.status === "failed";
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "10px 12px",
                                                            borderRadius: "8px",
                                                            border: `1px solid ${isAttemptPaid ? "var(--forest-mid, #16a34a)" : isAttemptFailed ? "var(--danger-border, #fecaca)" : "var(--line-soft)"}`,
                                                            background: isAttemptPaid ? "#f0fdf4" : isAttemptFailed ? "#fef2f2" : "#ffffff",
                                                            fontSize: "12px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "flex-start",
                                                                    marginBottom: "4px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                style: {
                                                                                    fontSize: "12.5px"
                                                                                },
                                                                                children: [
                                                                                    "Attempt ",
                                                                                    index + 1
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 625,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    marginLeft: "8px",
                                                                                    fontSize: "11px",
                                                                                    color: "var(--muted)"
                                                                                },
                                                                                children: attemptDate
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 626,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 624,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                                        tone: PAYMENT_TONES[attempt.status] || "neutral",
                                                                        children: attempt.status?.toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 630,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 623,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(2, 1fr)",
                                                                    gap: "6px",
                                                                    fontSize: "11.5px",
                                                                    marginTop: "6px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "muted",
                                                                                children: "Amount: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 637,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: [
                                                                                    "₹",
                                                                                    amountRupees
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 638,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 636,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "muted",
                                                                                children: "Method: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 641,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                style: {
                                                                                    textTransform: "uppercase"
                                                                                },
                                                                                children: attempt.method || "ONLINE"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 642,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 640,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "muted",
                                                                                children: "Rzp Order ID: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 645,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                                children: attempt.razorpayOrderId || "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 646,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 644,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "muted",
                                                                                children: "Rzp Payment ID: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 649,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                                children: attempt.razorpayPaymentId || "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 650,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 648,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 635,
                                                                columnNumber: 27
                                                            }, this),
                                                            attempt.failureReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: "6px",
                                                                    color: "var(--danger, #dc2626)",
                                                                    fontSize: "11px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Failure Reason: "
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 656,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " ",
                                                                    attempt.failureReason
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 655,
                                                                columnNumber: 29
                                                            }, this),
                                                            attempt.refundId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: "6px",
                                                                    color: "#6d28d9",
                                                                    fontSize: "11px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Refund: "
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 662,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " ",
                                                                    attempt.refundId,
                                                                    " (₹",
                                                                    attempt.refundAmount ? (attempt.refundAmount / 100).toFixed(2) : "0.00",
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 661,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, attempt._id || index, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 613,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 605,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 595,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 571,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface detail-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "detail-section-title",
                                        children: "Ordered Items"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 676,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "order-items",
                                        children: order.items?.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "order-item-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "order-item-name",
                                                                children: item.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 681,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "order-item-variant",
                                                                style: {
                                                                    color: "var(--muted)",
                                                                    fontSize: "11px"
                                                                },
                                                                children: [
                                                                    "Unit price: ₹",
                                                                    item.price
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 682,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 680,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "order-item-qty",
                                                        children: [
                                                            "×",
                                                            item.quantity
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 686,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "order-item-total",
                                                        children: [
                                                            "₹",
                                                            item.subtotal
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 687,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 679,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 677,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: "14px",
                                            paddingTop: "14px",
                                            borderTop: "1px solid var(--line-soft)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "totals-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Items Subtotal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 695,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "₹",
                                                            Number(order.subtotal || 0).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 696,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 694,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "totals-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "GST (5% on items)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 699,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "₹",
                                                            Number(order.gst || 0).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 700,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 698,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "totals-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Delivery Fee"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 703,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "₹",
                                                            Number(order.deliveryFee || 0).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 704,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 702,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "totals-row grand",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Authoritative Total"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 707,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "₹",
                                                            Number(order.total || 0).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 708,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 706,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 693,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 675,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 526,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface delivery-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Customer & Delivery Details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 718,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "delivery-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "delivery-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Customer Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 721,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 722,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 720,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "delivery-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Contact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 725,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: customerPhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 726,
                                                        columnNumber: 17
                                                    }, this),
                                                    customerEmail && customerEmail !== "—" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "muted",
                                                        style: {
                                                            fontSize: "11.5px"
                                                        },
                                                        children: customerEmail
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 728,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 724,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "delivery-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Delivery Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 732,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: order.deliveryAddress?.address || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 733,
                                                        columnNumber: 17
                                                    }, this),
                                                    order.deliveryAddress?.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "muted",
                                                        style: {
                                                            fontSize: "11.5px"
                                                        },
                                                        children: [
                                                            "Landmark: ",
                                                            order.deliveryAddress.landmark
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 735,
                                                        columnNumber: 19
                                                    }, this),
                                                    order.deliveryAddress?.area && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: "11.5px",
                                                            fontWeight: 600,
                                                            color: "var(--forest-mid)"
                                                        },
                                                        children: [
                                                            "Selected Area: ",
                                                            order.deliveryAddress.area
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 740,
                                                        columnNumber: 19
                                                    }, this),
                                                    (()=>{
                                                        const loc = order.deliveryAddress?.location;
                                                        const lat = loc?.latitude ?? order.deliveryAddress?.latitude;
                                                        const lng = loc?.longitude ?? order.deliveryAddress?.longitude;
                                                        const hasValidCoords = typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                                                        if (hasValidCoords) {
                                                            const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                                                            const sourceText = loc?.source === "google_places" ? "Google Places Selection" : loc?.source === "current_location" ? "Device Geolocation / Current Location" : "Verified Location";
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: "12px",
                                                                    padding: "10px 12px",
                                                                    background: "var(--forest-soft, #f0fdf4)",
                                                                    borderRadius: "8px",
                                                                    border: "1px solid #86efac",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "8px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: "11px",
                                                                                    fontWeight: 700,
                                                                                    color: "#166534",
                                                                                    textTransform: "uppercase",
                                                                                    letterSpacing: "0.5px"
                                                                                },
                                                                                children: [
                                                                                    "📍 Customer Location (",
                                                                                    sourceText,
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 783,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: "11px",
                                                                                    fontFamily: "monospace",
                                                                                    color: "#166534",
                                                                                    fontWeight: 600
                                                                                },
                                                                                children: [
                                                                                    lat.toFixed(6),
                                                                                    ", ",
                                                                                    lng.toFixed(6)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 794,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 782,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    loc?.formattedAddress && loc.formattedAddress !== order.deliveryAddress?.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: "11px",
                                                                            color: "#14532d",
                                                                            margin: 0
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontWeight: 600
                                                                                },
                                                                                children: "Google Formatted:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                                lineNumber: 807,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            " ",
                                                                            loc.formattedAddress
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 806,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                            href: mapUrl,
                                                                            target: "_blank",
                                                                            rel: "noopener noreferrer",
                                                                            style: {
                                                                                display: "inline-flex",
                                                                                alignItems: "center",
                                                                                gap: "6px",
                                                                                fontSize: "12px",
                                                                                fontWeight: 700,
                                                                                color: "#ffffff",
                                                                                background: "#16a34a",
                                                                                padding: "6px 12px",
                                                                                borderRadius: "6px",
                                                                                textDecoration: "none",
                                                                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                                                            },
                                                                            children: "🗺️ Open in Google Maps ↗"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                            lineNumber: 811,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                        lineNumber: 810,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                lineNumber: 770,
                                                                columnNumber: 23
                                                            }, this);
                                                        }
                                                        // Missing coordinates - display clear text and search option
                                                        const addressText = order.deliveryAddress?.address;
                                                        const searchUrl = addressText ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addressText}${order.deliveryAddress?.area ? `, ${order.deliveryAddress.area}` : ""}`)}` : null;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginTop: "10px",
                                                                padding: "8px 12px",
                                                                background: "var(--bg-subtle, #faf8f5)",
                                                                borderRadius: "8px",
                                                                border: "1px dashed var(--line-soft, #e7e5e4)",
                                                                fontSize: "11.5px"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "var(--muted, #78716c)",
                                                                        display: "block"
                                                                    },
                                                                    children: "ℹ️ Precise coordinates not available (Manual address entry)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                    lineNumber: 855,
                                                                    columnNumber: 23
                                                                }, this),
                                                                searchUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: searchUrl,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    style: {
                                                                        display: "inline-block",
                                                                        marginTop: "4px",
                                                                        fontSize: "11px",
                                                                        color: "var(--crimson, #b91c1c)",
                                                                        textDecoration: "underline",
                                                                        fontWeight: 500
                                                                    },
                                                                    children: "Search text address on Google Maps ↗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                                    lineNumber: 859,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                            lineNumber: 845,
                                                            columnNumber: 21
                                                        }, this);
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 731,
                                                columnNumber: 15
                                            }, this),
                                            order.deliveryAddress?.deliveryInstructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "delivery-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Delivery Instructions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 881,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: order.deliveryAddress.deliveryInstructions
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 882,
                                                        columnNumber: 19
                                                    }, this),
                                                    order.deliveryAddress.deliveryInstructionOther && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "muted",
                                                        style: {
                                                            fontSize: "11.5px"
                                                        },
                                                        children: [
                                                            "Note: ",
                                                            order.deliveryAddress.deliveryInstructionOther
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 884,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 880,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 719,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 717,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface detail-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "detail-section-title",
                                                style: {
                                                    margin: 0
                                                },
                                                children: "🚴 Assigned Rider"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 896,
                                                columnNumber: 15
                                            }, this),
                                            !isTerminalState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "row-action",
                                                onClick: openRiderModal,
                                                style: {
                                                    fontWeight: 600,
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                },
                                                children: order.rider ? "Change Rider" : "Assign Rider"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 900,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 895,
                                        columnNumber: 13
                                    }, this),
                                    order.rider ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "12px",
                                            background: "var(--bg-subtle, #faf8f5)",
                                            borderRadius: "8px",
                                            border: "1px solid var(--line-soft)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        style: {
                                                            fontSize: "14px"
                                                        },
                                                        children: order.rider.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 921,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "11px",
                                                            padding: "2px 6px",
                                                            borderRadius: "4px",
                                                            background: "var(--forest-soft, #f0fdf4)",
                                                            color: "var(--forest-deep, #14532d)",
                                                            fontWeight: 600
                                                        },
                                                        children: "Assigned"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 922,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 920,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: "6px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: `tel:${order.rider.phone}`,
                                                    style: {
                                                        color: "var(--crimson)",
                                                        textDecoration: "none",
                                                        fontSize: "13px",
                                                        fontWeight: 500
                                                    },
                                                    children: [
                                                        "+91 ",
                                                        order.rider.phone
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 936,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 935,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 912,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "10px 0",
                                            color: "var(--muted)",
                                            fontSize: "13px",
                                            fontStyle: "italic"
                                        },
                                        children: "No delivery rider assigned yet."
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 950,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 894,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "surface detail-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "detail-section-title",
                                        children: "Order Timeline"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 958,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "timeline",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "timeline-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Order placed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 961,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: formattedDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 962,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 960,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "timeline-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "Payment: ",
                                                            PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 965,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: isOnlinePayment ? "Razorpay online verification" : "Cash on Delivery"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 966,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 964,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "timeline-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            "Current Status: ",
                                                            STATUS_LABELS[order.orderStatus] || order.orderStatus
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 969,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: "Authoritative state in restaurant system"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                        lineNumber: 970,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 968,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 959,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "detail-actions",
                                        style: {
                                            marginTop: 18,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "secondary",
                                                type: "button",
                                                onClick: handleShareOnWhatsApp,
                                                title: "Share on WhatsApp",
                                                "aria-label": "Share on WhatsApp",
                                                style: {
                                                    width: "100%",
                                                    justifyContent: "center",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    color: "#16a34a",
                                                    borderColor: "#bbf7d0",
                                                    background: "#f0fdf4",
                                                    padding: "8px 12px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WhatsAppIcon, {
                                                    size: 17
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 992,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 975,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard/orders",
                                                className: "button button-secondary",
                                                style: {
                                                    width: "100%",
                                                    justifyContent: "center"
                                                },
                                                children: "Back to Orders"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 994,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 974,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 957,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 715,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            showStatusModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Modal"], {
                title: `Update Order ${order.orderNumber}`,
                onClose: ()=>!updating && setShowStatusModal(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--muted)",
                            fontSize: "12px",
                            marginBottom: "18px"
                        },
                        children: "Authoritative state transitions governed by restaurant workflow rules."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 1012,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Order Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1019,
                                        columnNumber: 15
                                    }, this),
                                    isTerminalState ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "8px 12px",
                                            background: "var(--bg-subtle)",
                                            borderRadius: "6px",
                                            fontSize: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: STATUS_LABELS[order.orderStatus] || order.orderStatus
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1022,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "muted",
                                                style: {
                                                    margin: "4px 0 0 0",
                                                    fontSize: "11px"
                                                },
                                                children: [
                                                    "This order is in a terminal state (",
                                                    STATUS_LABELS[order.orderStatus],
                                                    ") and cannot be transitioned further."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1023,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1021,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: newOrderStatus,
                                        onChange: (e)=>setNewOrderStatus(e.target.value),
                                        disabled: updating,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: order.orderStatus,
                                                children: [
                                                    STATUS_LABELS[order.orderStatus],
                                                    " (Current)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1033,
                                                columnNumber: 19
                                            }, this),
                                            VALID_NEXT_STATUSES[order.orderStatus]?.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: opt.value,
                                                    children: opt.label
                                                }, opt.value, false, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 1037,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1028,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 1018,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Payment Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1047,
                                        columnNumber: 15
                                    }, this),
                                    isOnlinePayment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "8px 12px",
                                            background: "var(--bg-subtle)",
                                            borderRadius: "6px",
                                            fontSize: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    tone: PAYMENT_TONES[order.paymentStatus] || "neutral",
                                                    children: PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                    lineNumber: 1051,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1050,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "muted",
                                                style: {
                                                    margin: "4px 0 0 0",
                                                    fontSize: "11px"
                                                },
                                                children: "Online payment status is cryptographically synchronized with Razorpay webhooks and cannot be manually modified by admin."
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1055,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1049,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: newPaymentStatus,
                                        onChange: (e)=>setNewPaymentStatus(e.target.value),
                                        disabled: updating,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "pending",
                                                children: "Pending — Not yet collected"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1065,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "paid",
                                                children: "Paid — Cash collected at doorstep"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1066,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "failed",
                                                children: "Failed — Delivery rejected / uncollected"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                                lineNumber: 1067,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1060,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 1046,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-footer",
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "secondary",
                                        onClick: ()=>setShowStatusModal(false),
                                        disabled: updating,
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1073,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleUpdateStatus,
                                        disabled: updating || isTerminalState,
                                        children: updating ? "Updating..." : "Save Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                        lineNumber: 1080,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                lineNumber: 1072,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/orders/[id]/page.js",
                        lineNumber: 1016,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 1008,
                columnNumber: 9
            }, this),
            showRiderModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Modal"], {
                title: order.rider ? "Change Delivery Rider" : "Assign Delivery Rider",
                onClose: ()=>!assigningRider && setShowRiderModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleAssignRiderSubmit,
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: "var(--muted)",
                                fontSize: "13px",
                                margin: 0
                            },
                            children: [
                                "Select an active delivery rider to fulfill Order #",
                                order.orderNumber,
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 1098,
                            columnNumber: 13
                        }, this),
                        loadingRiders ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "20px",
                                textAlign: "center",
                                color: "var(--muted)"
                            },
                            children: "Loading available riders..."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 1103,
                            columnNumber: 15
                        }, this) : activeRiders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "16px",
                                background: "#fef2f2",
                                borderRadius: "6px",
                                color: "#991b1b",
                                fontSize: "13px"
                            },
                            children: [
                                "No active riders found. Please add or activate a rider in the",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/riders",
                                    style: {
                                        textDecoration: "underline",
                                        fontWeight: 600
                                    },
                                    children: "Riders section"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 1109,
                                    columnNumber: 17
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 1107,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "block",
                                        marginBottom: "6px",
                                        fontWeight: 500,
                                        fontSize: "14px"
                                    },
                                    children: "Available Active Riders"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 1115,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "input",
                                    value: selectedRiderId,
                                    onChange: (e)=>setSelectedRiderId(e.target.value),
                                    disabled: assigningRider,
                                    required: true,
                                    style: {
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid var(--line-soft)"
                                    },
                                    children: activeRiders.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: r._id,
                                            children: [
                                                r.name,
                                                " (+91 ",
                                                r.phone,
                                                ")"
                                            ]
                                        }, r._id, true, {
                                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                            lineNumber: 1127,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 1118,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 1114,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                                marginTop: "12px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "secondary",
                                    onClick: ()=>setShowRiderModal(false),
                                    disabled: assigningRider,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 1136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    disabled: assigningRider || activeRiders.length === 0,
                                    children: assigningRider ? "Assigning..." : "Confirm Assignment"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                                    lineNumber: 1144,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/orders/[id]/page.js",
                            lineNumber: 1135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/orders/[id]/page.js",
                    lineNumber: 1097,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/orders/[id]/page.js",
                lineNumber: 1093,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/orders/[id]/page.js",
        lineNumber: 389,
        columnNumber: 5
    }, this);
}
_s1(OrderDetailPage, "nfajp9xGP5MKWTO3+/qYkFvsaYw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c3 = OrderDetailPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "AcceptanceCountdown");
__turbopack_context__.k.register(_c1, "WhatsAppIcon");
__turbopack_context__.k.register(_c2, "PrintIcon");
__turbopack_context__.k.register(_c3, "OrderDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/payments.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminPayments",
    ()=>getAdminPayments,
    "getOrderPaymentAttempts",
    ()=>getOrderPaymentAttempts,
    "initiateRefund",
    ()=>initiateRefund
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.js [app-client] (ecmascript)");
;
async function getAdminPayments(params = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)){
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
            query.set(k, String(v));
        }
    }
    const queryString = query.toString();
    const endpoint = `/admin/payments${queryString ? `?${queryString}` : ""}`;
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(endpoint);
    return res?.data || {
        records: [],
        attempts: [],
        total: 0,
        page: 1,
        limit: 50,
        summary: {
            totalPaid: 0,
            cashTotal: 0,
            onlineTotal: 0,
            count: 0
        }
    };
}
async function getOrderPaymentAttempts(orderId) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/payments/order/${orderId}`);
    return res?.data?.attempts || [];
}
async function initiateRefund(attemptId, amountInPaise) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/payments/${attemptId}/refund`, {
        method: "POST",
        body: {
            amountInPaise
        }
    });
    return res?.data?.attempt;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/riders.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminRider",
    ()=>createAdminRider,
    "deleteAdminRider",
    ()=>deleteAdminRider,
    "getAdminRiderById",
    ()=>getAdminRiderById,
    "getAdminRiders",
    ()=>getAdminRiders,
    "updateAdminRider",
    ()=>updateAdminRider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.js [app-client] (ecmascript)");
;
async function getAdminRiders(params = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)){
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
            query.set(k, String(v));
        }
    }
    const queryString = query.toString();
    const endpoint = `/admin/riders${queryString ? `?${queryString}` : ""}`;
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(endpoint);
    return res?.data?.riders || [];
}
async function getAdminRiderById(id) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/riders/${id}`);
    return res?.data?.rider;
}
async function createAdminRider(data) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/riders", {
        method: "POST",
        body: data
    });
    return res?.data?.rider;
}
async function updateAdminRider(id, updates) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/riders/${id}`, {
        method: "PATCH",
        body: updates
    });
    return res?.data?.rider;
}
async function deleteAdminRider(id) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/riders/${id}`, {
        method: "DELETE"
    });
    return res?.data;
}
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

//# sourceMappingURL=_07jc0hb._.js.map