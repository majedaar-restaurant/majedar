"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Modal, PageHeader, Table, EmptyState, useToast, Toggle } from "@/components/ui";
import {
  getAdminRiders,
  createAdminRider,
  updateAdminRider,
  deleteAdminRider,
  resetAdminRiderPassword,
} from "@/lib/api/riders";
import { connectAdminSocket } from "@/lib/socket";

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const toast = useToast();

  const loadRiders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminRiders();
      setRiders(data);
    } catch (err) {
      toast(err.message || "Failed to load riders", "danger");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRiders();
  }, [loadRiders]);

  useEffect(() => {
    const socket = connectAdminSocket();
    if (!socket) return undefined;
    const reload = () => loadRiders();
    socket.on("rider:availability_changed", reload);
    socket.on("rider:deleted", reload);
    return () => {
      socket.off("rider:availability_changed", reload);
      socket.off("rider:deleted", reload);
    };
  }, [loadRiders]);

  const openAdd = () => {
    setEditTarget(null);
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (rider) => {
    setEditTarget(rider);
    setName(rider.name || "");
    setPhone(rider.phone || "");
    setEmail(rider.email || "");
    setPassword("");
    setIsActive(Boolean(rider.isActive));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("Rider name is required", "danger");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      toast("Please enter a valid 10-digit phone number", "danger");
      return;
    }

    if (!editTarget && (!email.trim() || password.length < 8)) {
      toast("Email and a password of at least 8 characters are required to create a rider login.", "danger");
      return;
    }
    const payload = {
      name: name.trim(),
      phone: cleanPhone,
      isActive,
    };
    if (email.trim()) payload.email = email.trim().toLowerCase();

    setSubmitting(true);
    try {
      if (editTarget) {
        await updateAdminRider(editTarget._id, payload);
        toast("Rider updated successfully", "success");
      } else {
        await createAdminRider({ ...payload, password });
        toast("Rider added successfully", "success");
      }
      setModalOpen(false);
      await loadRiders();
    } catch (err) {
      toast(err.message || "Failed to save rider", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rider) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete rider "${rider.name}"?`
    );
    if (!confirmed) return;

    try {
      const res = await deleteAdminRider(rider._id);
      toast(res?.message || `Rider "${rider.name}" deleted`, "success");
      await loadRiders();
    } catch (err) {
      toast(err.message || "Failed to delete rider", "danger");
    }
  };

  const toggleActiveStatus = async (rider) => {
    try {
      const updated = await updateAdminRider(rider._id, { isActive: !rider.isActive });
      setRiders((prev) =>
        prev.map((r) => (r._id === rider._id ? { ...r, isActive: updated.isActive } : r))
      );
      toast(`Rider ${updated.isActive ? "activated" : "deactivated"}`, "success");
    } catch (err) {
      toast(err.message || "Failed to update rider status", "danger");
    }
  };

  const handleResetPassword = async (rider) => {
    const newPassword = window.prompt(`Enter a new password for ${rider.name} (at least 8 characters):`);
    if (newPassword === null) return;
    if (newPassword.length < 8) {
      toast("Password must contain at least 8 characters.", "danger");
      return;
    }
    try {
      await resetAdminRiderPassword(rider._id, newPassword);
      toast("Rider password reset. Existing sessions have been signed out.", "success");
    } catch (err) {
      toast(err.message || "Failed to reset rider password", "danger");
    }
  };

  return (
    <>
      <PageHeader
        title="Riders"
        action={<Button onClick={openAdd}>+ Add Rider</Button>}
      />

      <section className="surface data-surface">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Loading riders...
          </div>
        ) : riders.length === 0 ? (
          <EmptyState
            title="No riders registered"
            description="Add your first delivery rider to begin assigning orders for delivery."
          />
        ) : (
          <Table
            columns={[
              "Rider Name",
              "Email",
              "Phone Number",
              "Availability",
              "Account",
              "Active Orders",
              "Added Date",
              "Actions",
            ]}
            rows={riders}
            renderRow={(rider) => (
              <tr key={rider._id}>
                <td>
                  <strong>{rider.name}</strong>
                </td>
                <td>
                  {rider.email || <span className="muted">Login not configured</span>}
                </td>
                <td>
                  <a
                    href={`tel:${rider.phone}`}
                    style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}
                  >
                    +91 {rider.phone}
                  </a>
                </td>

                <td>
                  <span className="status-badge" style={{
                    background: rider.availability === "available" ? "var(--forest-soft)" : rider.availability === "busy" ? "#fff7ed" : "var(--parchment-2)",
                    color: rider.availability === "available" ? "var(--forest-deep)" : rider.availability === "busy" ? "#9a3412" : "var(--muted)",
                  }}>
                    {rider.availability || "available"}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: rider.isActive
                        ? "var(--forest-soft)"
                        : "var(--parchment-2)",
                      color: rider.isActive
                        ? "var(--forest-deep)"
                        : "var(--muted)",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: rider.isActive
                          ? "var(--forest-deep)"
                          : "var(--muted)",
                      }}
                    />
                    {rider.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{rider.activeAssignments || 0}</td>

                <td className="muted">
                  {rider.createdAt
                    ? new Date(rider.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link href={`/dashboard/riders/${rider._id}`} className="row-action">History</Link>
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEdit(rider)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        background: "var(--forest-soft)",
                        color: "var(--forest-deep)",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    {rider.email && (
                      <button type="button" className="row-action" onClick={() => handleResetPassword(rider)}>
                        Reset password
                      </button>
                    )}

                    {/* Activate / Deactivate Button */}
                    <button
                      type="button"
                      onClick={() => toggleActiveStatus(rider)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "5px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        color: rider.isActive
                          ? "var(--muted)"
                          : "var(--forest-deep)",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          backgroundColor: "var(--forest-deep)",
                        }}
                      />
                      {rider.isActive ? "Deactivate" : "Activate"}
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(rider)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        background: "#FCE8E6",
                        color: "#B42318",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>

              </tr>
            )}
          />
        )}
      </section>

      {modalOpen && (
        <Modal
          title={editTarget ? "Edit Rider" : "Add Delivery Rider"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>
                Rider Full Name *
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>
                Rider Email *
              </label>
              <input
                type="email"
                className="input"
                placeholder="rider@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!editTarget && (
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>
                  Initial Password *
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>
                Phone Number (10 digits) *
              </label>
              <input
                type="tel"
                className="input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                Indian mobile number format without country code.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Active for Deliveries</span>
              <Toggle
                on={isActive}
                onToggle={() => setIsActive(!isActive)}
                label="Active for deliveries"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editTarget ? "Update Rider" : "Save Rider"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
