"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Modal, PageHeader, Table, EmptyState, useToast, Toggle } from "@/components/ui";
import {
  getAdminRiders,
  createAdminRider,
  updateAdminRider,
  deleteAdminRider,
} from "@/lib/api/riders";

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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

  const openAdd = () => {
    setEditTarget(null);
    setName("");
    setPhone("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (rider) => {
    setEditTarget(rider);
    setName(rider.name || "");
    setPhone(rider.phone || "");
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

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      phone: cleanPhone,
      isActive,
    };

    try {
      if (editTarget) {
        await updateAdminRider(editTarget._id, payload);
        toast("Rider updated successfully", "success");
      } else {
        await createAdminRider(payload);
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
      `Are you sure you want to delete rider "${rider.name}"? Note: Deletion is blocked if the rider has delivered previous orders; deactivate them instead.`
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

  return (
    <>
      <PageHeader
        title="Riders"
        description="Manage delivery riders, monitor active status, and maintain personnel available for order assignment."
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
              "Phone Number",
              "Status",
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
                  <a
                    href={`tel:${rider.phone}`}
                    style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}
                  >
                    📞 +91 {rider.phone}
                  </a>
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
                      background: rider.isActive ? "var(--forest-soft)" : "var(--parchment-2)",
                      color: rider.isActive ? "var(--forest-deep)" : "var(--muted)",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: rider.isActive ? "var(--forest-deep)" : "var(--muted)",
                      }}
                    />
                    {rider.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="muted">
                  {rider.createdAt ? new Date(rider.createdAt).toLocaleDateString() : "—"}
                </td>
                <td>
                  <button
                    type="button"
                    className="row-action"
                    onClick={() => openEdit(rider)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="row-action"
                    style={{ marginLeft: 14 }}
                    onClick={() => toggleActiveStatus(rider)}
                  >
                    {rider.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className="row-action danger"
                    style={{ marginLeft: 14 }}
                    onClick={() => handleDelete(rider)}
                  >
                    Delete
                  </button>
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
