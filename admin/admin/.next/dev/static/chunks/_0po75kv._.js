(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/messages/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessagesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$messages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/messages.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/admin-filters.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function MessagesPage() {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [typeFilter, setTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [datePreset, setDatePreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalMessages, setTotalMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const pageSize = 20;
    const [activeMessage, setActiveMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [updating, setUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MessagesPage.useCallback[loadMessages]": async ()=>{
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
                if (statusFilter !== "all") params.status = statusFilter;
                if (typeFilter !== "all") params.type = typeFilter;
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$messages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminMessages"])(params);
                const list = Array.isArray(data) ? data : data?.messages || [];
                setMessages(list);
                setTotalMessages(data.total ?? list.length);
                setTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? list.length) / pageSize)));
            } catch (err) {
                toast(err.message || "Failed to load customer messages", "danger");
            } finally{
                setLoading(false);
            }
        }
    }["MessagesPage.useCallback[loadMessages]"], [
        currentPage,
        pageSize,
        search,
        datePreset,
        dateFrom,
        dateTo,
        statusFilter,
        typeFilter,
        toast
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesPage.useEffect": ()=>{
            loadMessages();
        }
    }["MessagesPage.useEffect"], [
        loadMessages
    ]);
    const handleStatusChange = async (messageId, newStatus)=>{
        setUpdating(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$messages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAdminMessageStatus"])(messageId, newStatus);
            toast(`Message marked as ${newStatus}`, "success");
            setMessages((prev)=>prev.map((m)=>m._id === messageId ? {
                        ...m,
                        status: newStatus
                    } : m));
            if (activeMessage && activeMessage._id === messageId) {
                setActiveMessage((prev)=>({
                        ...prev,
                        status: newStatus
                    }));
            }
        } catch (err) {
            toast(err.message || "Failed to update message status", "danger");
        } finally{
            setUpdating(false);
        }
    };
    const TYPE_LABELS = {
        complaint: "Complaint",
        suggestion: "Suggestion",
        query: "Query & Help",
        order_issue: "Order Issue"
    };
    const STATUS_LABEL_MAP = {
        new: "New",
        read: "Read",
        resolved: "Resolved"
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
            label: "Status",
            value: STATUS_LABEL_MAP[statusFilter] || statusFilter,
            onRemove: ()=>{
                setStatusFilter("all");
                setCurrentPage(1);
            }
        });
    }
    if (typeFilter !== "all") {
        activeChips.push({
            id: "type",
            label: "Type",
            value: TYPE_LABELS[typeFilter] || typeFilter,
            onRemove: ()=>{
                setTypeFilter("all");
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
        setTypeFilter("all");
        setCurrentPage(1);
    };
    const typeBadgeColors = {
        complaint: {
            bg: "#FEE2E2",
            text: "#991B1B",
            label: "Complaint"
        },
        suggestion: {
            bg: "#FEF3C7",
            text: "#92400E",
            label: "Suggestion"
        },
        query: {
            bg: "#E0E7FF",
            text: "#3730A3",
            label: "Query"
        },
        order_issue: {
            bg: "#FEF2F2",
            text: "#B91C1C",
            label: "Order Issue"
        }
    };
    const statusBadgeTones = {
        new: "attention",
        read: "neutral",
        resolved: "completed"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Customer Messages",
                description: "Customer complaints, suggestions, and support queries.",
                action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "secondary",
                    onClick: loadMessages,
                    disabled: loading,
                    children: "Refresh"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/messages/page.js",
                    lineNumber: 191,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/messages/page.js",
                lineNumber: 187,
                columnNumber: 7
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
                                children: "Search Messages"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/messages/page.js",
                                lineNumber: 200,
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
                                        placeholder: "Search messages by name, contact, text...",
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
                                        fileName: "[project]/app/dashboard/messages/page.js",
                                        lineNumber: 202,
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
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/messages/page.js",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/messages/page.js",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 199,
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
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectControl"], {
                        label: "Message Type",
                        value: typeFilter,
                        onChange: (e)=>{
                            setTypeFilter(e.target.value);
                            setCurrentPage(1);
                        },
                        options: [
                            {
                                value: "all",
                                label: "All Types"
                            },
                            {
                                value: "complaint",
                                label: "Complaint"
                            },
                            {
                                value: "suggestion",
                                label: "Suggestion"
                            },
                            {
                                value: "query",
                                label: "Query & Help"
                            },
                            {
                                value: "order_issue",
                                label: "Order Issue"
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectControl"], {
                        label: "Message Status",
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
                                value: "new",
                                label: "New"
                            },
                            {
                                value: "read",
                                label: "Read"
                            },
                            {
                                value: "resolved",
                                label: "Resolved"
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/messages/page.js",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActiveFilterChips"], {
                chips: activeChips,
                onClearAll: handleClearAllFilters
            }, void 0, false, {
                fileName: "[project]/app/dashboard/messages/page.js",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "surface table-surface",
                children: [
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "40px",
                            textAlign: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: "Loading messages..."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "table-wrap",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Customer / Contact"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 308,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Type"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 309,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Message Preview"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 310,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 311,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 312,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Action"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 313,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/messages/page.js",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: messages.length ? messages.map((item)=>{
                                        const badge = typeBadgeColors[item.type] || typeBadgeColors.query;
                                        const dateFormatted = new Date(item.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        });
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                cursor: "pointer"
                                            },
                                            onClick: ()=>setActiveMessage(item),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: item.customer?.name || item.name || "Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                                lineNumber: 332,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "muted",
                                                                style: {
                                                                    fontSize: "12px"
                                                                },
                                                                children: item.customer?.email || item.email || item.customer?.phone || item.phone || "No direct contact"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                                lineNumber: 333,
                                                                columnNumber: 29
                                                            }, this),
                                                            item.orderNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 3
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "11px",
                                                                        color: "var(--accent)",
                                                                        fontWeight: 600
                                                                    },
                                                                    children: [
                                                                        "Order #",
                                                                        item.orderNumber
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                                    lineNumber: 338,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                                lineNumber: 337,
                                                                columnNumber: 31
                                                            }, this),
                                                            item.customer && !item.orderNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "11px",
                                                                    color: "var(--forest)",
                                                                    fontWeight: 600
                                                                },
                                                                children: "Registered Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                                lineNumber: 344,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 331,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 330,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: "inline-block",
                                                            padding: "2px 8px",
                                                            borderRadius: "4px",
                                                            fontSize: "11px",
                                                            fontWeight: 700,
                                                            background: badge.bg,
                                                            color: badge.text,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px"
                                                        },
                                                        children: badge.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 351,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 350,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            maxWidth: 320,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            fontSize: "13px"
                                                        },
                                                        children: item.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 368,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 367,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "muted",
                                                        style: {
                                                            fontSize: "12px"
                                                        },
                                                        children: dateFormatted
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 381,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 380,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                        tone: statusBadgeTones[item.status] || "neutral",
                                                        children: item.status.toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 386,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 385,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "button button-secondary button-small",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            setActiveMessage(item);
                                                        },
                                                        children: "View"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/messages/page.js",
                                                        lineNumber: 391,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/messages/page.js",
                                                    lineNumber: 390,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, item._id, true, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 329,
                                            columnNumber: 23
                                        }, this);
                                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 6,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                                                title: activeChips.length > 0 ? "No messages found for this date/status combination" : "No messages found",
                                                description: activeChips.length > 0 ? "Try adjusting your date range, type, or status filters." : "Customer inquiries and complaints will appear here.",
                                                compact: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/messages/page.js",
                                                lineNumber: 408,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 407,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/messages/page.js",
                                        lineNumber: 406,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 316,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$admin$2d$filters$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminPagination"], {
                        page: currentPage,
                        total: totalMessages,
                        limit: pageSize,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/messages/page.js",
                        lineNumber: 429,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/messages/page.js",
                lineNumber: 298,
                columnNumber: 7
            }, this),
            activeMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Modal"], {
                title: `Message from ${activeMessage.name}`,
                onClose: ()=>setActiveMessage(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-stack",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "1px solid var(--border)",
                                paddingBottom: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: "inline-block",
                                                padding: "3px 10px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                background: (typeBadgeColors[activeMessage.type] || typeBadgeColors.query).bg,
                                                color: (typeBadgeColors[activeMessage.type] || typeBadgeColors.query).text,
                                                textTransform: "uppercase",
                                                marginRight: 8
                                            },
                                            children: (typeBadgeColors[activeMessage.type] || typeBadgeColors.query).label
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 447,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                            tone: statusBadgeTones[activeMessage.status] || "neutral",
                                            children: activeMessage.status.toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 462,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "muted",
                                    style: {
                                        fontSize: "12px"
                                    },
                                    children: new Date(activeMessage.createdAt).toLocaleString("en-IN")
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 466,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                                padding: "8px 0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            className: "muted",
                                            style: {
                                                display: "block",
                                                textTransform: "uppercase",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            },
                                            children: "Contact Email"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 473,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: activeMessage.customer?.email || activeMessage.email || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 476,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 472,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            className: "muted",
                                            style: {
                                                display: "block",
                                                textTransform: "uppercase",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            },
                                            children: "Contact Phone"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: activeMessage.customer?.phone || activeMessage.phone || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 482,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 478,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 471,
                            columnNumber: 13
                        }, this),
                        (activeMessage.orderNumber || activeMessage.issueType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                                padding: "10px 12px",
                                background: "var(--canvas)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                marginBottom: 8
                            },
                            children: [
                                activeMessage.orderNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            className: "muted",
                                            style: {
                                                display: "block",
                                                textTransform: "uppercase",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            },
                                            children: "Linked Order"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 501,
                                            columnNumber: 21
                                        }, this),
                                        activeMessage.order ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/dashboard/orders/${activeMessage.order}`,
                                            style: {
                                                color: "var(--accent)",
                                                fontWeight: 700,
                                                fontSize: "13px",
                                                textDecoration: "underline"
                                            },
                                            children: [
                                                "#",
                                                activeMessage.orderNumber,
                                                " (View Order)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 505,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                "#",
                                                activeMessage.orderNumber
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 512,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 500,
                                    columnNumber: 19
                                }, this),
                                activeMessage.issueType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            className: "muted",
                                            style: {
                                                display: "block",
                                                textTransform: "uppercase",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            },
                                            children: "Issue Category"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 518,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                textTransform: "capitalize",
                                                fontSize: "13px"
                                            },
                                            children: activeMessage.issueType.replace(/_/g, " ")
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/messages/page.js",
                                            lineNumber: 521,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 517,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 487,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    className: "muted",
                                    style: {
                                        display: "block",
                                        textTransform: "uppercase",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        marginBottom: 6
                                    },
                                    children: "Message Content"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 530,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "var(--canvas)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        padding: "14px 16px",
                                        fontSize: "14px",
                                        lineHeight: "1.6",
                                        whiteSpace: "pre-wrap",
                                        color: "var(--foreground)"
                                    },
                                    children: activeMessage.message
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 533,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 529,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: 8,
                                justifyContent: "flex-end",
                                marginTop: 20,
                                paddingTop: 14,
                                borderTop: "1px solid var(--border)"
                            },
                            children: [
                                activeMessage.status === "new" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "button button-secondary",
                                    disabled: updating,
                                    onClick: ()=>handleStatusChange(activeMessage._id, "read"),
                                    children: "Mark as Read"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 551,
                                    columnNumber: 17
                                }, this),
                                activeMessage.status !== "resolved" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "button button-primary",
                                    disabled: updating,
                                    onClick: ()=>handleStatusChange(activeMessage._id, "resolved"),
                                    children: "Mark as Resolved"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 561,
                                    columnNumber: 17
                                }, this),
                                activeMessage.status === "resolved" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "button button-secondary",
                                    disabled: updating,
                                    onClick: ()=>handleStatusChange(activeMessage._id, "read"),
                                    children: "Re-open (Mark as Read)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 571,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "button button-secondary",
                                    onClick: ()=>setActiveMessage(null),
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/messages/page.js",
                                    lineNumber: 580,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/messages/page.js",
                            lineNumber: 549,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/messages/page.js",
                    lineNumber: 444,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/messages/page.js",
                lineNumber: 440,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/messages/page.js",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_s(MessagesPage, "C33ipB8eFHEC/tG46XBzLfAfv9w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = MessagesPage;
var _c;
__turbopack_context__.k.register(_c, "MessagesPage");
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
"[project]/lib/api/messages.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminMessageById",
    ()=>getAdminMessageById,
    "getAdminMessages",
    ()=>getAdminMessages,
    "getAdminUnreadMessageCount",
    ()=>getAdminUnreadMessageCount,
    "updateAdminMessageStatus",
    ()=>updateAdminMessageStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.js [app-client] (ecmascript)");
;
async function getAdminMessages(params = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)){
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
            query.set(k, String(v));
        }
    }
    const qs = query.toString();
    const endpoint = `/admin/messages${qs ? `?${qs}` : ""}`;
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(endpoint);
    const data = res?.data;
    if (!data) return [];
    const messagesList = Array.isArray(data) ? data : data.messages || [];
    messagesList.total = data.total ?? messagesList.length;
    messagesList.page = data.page ?? 1;
    messagesList.limit = data.limit ?? messagesList.length;
    messagesList.totalPages = data.totalPages ?? 1;
    messagesList.messages = messagesList;
    return messagesList;
}
async function getAdminMessageById(id) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/messages/${id}`);
    return res?.data;
}
async function updateAdminMessageStatus(id, status) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])(`/admin/messages/${id}/status`, {
        method: "PATCH",
        body: {
            status
        }
    });
    return res?.data;
}
async function getAdminUnreadMessageCount() {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/admin/messages/unread-count");
    return res?.data?.count || 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0po75kv._.js.map