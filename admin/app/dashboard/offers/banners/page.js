"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, useToast } from "@/components/ui";
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
} from "@/lib/api/banners";
import styles from "../offers.module.css";

export default function AdminBannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Edit / Replace image state
  const [editingBanner, setEditingBanner] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  // Lightbox enlargement preview
  const [lightboxBanner, setLightboxBanner] = useState(null);

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const bannersList = await getAdminBanners();
      setBanners(bannersList || []);
    } catch (err) {
      toast(err.message || "Failed to load banners data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxBanner(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Invalid file type. Only JPEG, PNG, and WEBP images are allowed.", "danger");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Image size exceeds 5MB limit", "danger");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast("Please select a promotional banner image to upload", "danger");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      if (title.trim()) formData.append("title", title.trim());
      if (description.trim()) formData.append("description", description.trim());
      formData.append("priority", priority);
      formData.append("isActive", String(isActive));

      await createBanner(formData);
      toast("Promotional banner created successfully!", "success");
      router.push("/dashboard/offers/discounts/create");
    } catch (err) {
      toast(err.message || "Failed to upload banner", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleBannerStatus(id);
      toast("Banner status updated", "success");
      loadData();
    } catch (err) {
      toast(err.message || "Failed to update banner status", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promotional banner?")) return;
    try {
      await deleteBanner(id);
      toast("Banner deleted successfully", "success");
      loadData();
    } catch (err) {
      toast(err.message || "Failed to delete banner", "danger");
    }
  };

  const handleStartEdit = (banner) => {
    setEditingBanner(banner);
    setEditFile(null);
    setEditPreviewUrl(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (editFile) {
        formData.append("image", editFile);
      }
      formData.append("title", editingBanner.title || "");
      formData.append("description", editingBanner.description || "");
      formData.append("priority", String(editingBanner.priority || 0));
      formData.append("isActive", String(editingBanner.isActive));
      formData.append("discount", editingBanner.discount?._id || editingBanner.discount || "");
      formData.append("category", editingBanner.category?._id || editingBanner.category || "");
      formData.append("product", editingBanner.product?._id || editingBanner.product || "");
      formData.append("menuSection", editingBanner.menuSection || "all");

      await updateBanner(editingBanner._id, formData);
      toast("Banner updated successfully", "success");
      setEditingBanner(null);
      loadData();
    } catch (err) {
      toast(err.message || "Failed to update banner", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.page} space-y-6`}>
      <PageHeader
        title="Promotional Banners"
        action={
          <Link href="/dashboard/offers" className="btn btn-secondary">
            ← Back to Offers
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Upload New Banner Form */}
        <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs">
          <h2 className="font-bold text-base text-[#11261B] mb-4">Upload New Banner</h2>
          <form onSubmit={handleCreateBanner} className="space-y-4">
            {/* Image Upload Area with Aspect Ratio Container */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-stone-300 hover:border-[#1B3B2B] rounded-xl bg-stone-50/70 p-2 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group"
              >
                {previewUrl ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-stone-900/5 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      Click to change image
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="w-8 h-8 text-stone-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs font-bold text-[#1B3B2B]">
                      Click to browse image
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      JPEG, PNG or WEBP (up to 5MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Banner Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Biryani Festival 20% OFF"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Short Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief promotional copy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Display Priority
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1B3B2B]"
                />
                <span className="text-[10px] text-stone-400">Higher numbers appear first</span>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={isActive ? "active" : "inactive"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-[#1B3B2B]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-primary py-2.5 mt-2 justify-center"
            >
              {submitting ? "Uploading Banner..." : "+ Upload Promotional Banner"}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Banners Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div>
                <h2 className="font-bold text-base text-[#11261B]">All Promotional Banners</h2>
                <p className="text-xs text-stone-500">
                  {banners.length} banner{banners.length === 1 ? "" : "s"} uploaded
                </p>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-stone-400">Loading banners...</div>
            ) : banners.length === 0 ? (
              <div className="py-16 text-center text-stone-500">
                <p>No banners uploaded yet. Upload your first banner using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="border border-stone-200/80 rounded-2xl overflow-hidden bg-white hover:border-stone-300 transition-all flex flex-col shadow-2xs group"
                  >
                    {/* Consistent Rectangular Aspect Ratio Preview Container (Fixed height, object-fit contain, neutral background) */}
                    <div
                      onClick={() => setLightboxBanner(banner)}
                      className="w-full h-44 bg-[#F5F2EB] p-2 relative flex items-center justify-center cursor-zoom-in group/img overflow-hidden"
                      title="Click to view full original image in lightbox"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.image?.url}
                        alt={banner.title || "Banner image"}
                        className="w-full h-full object-contain group-hover/img:scale-102 transition-transform duration-200 select-none"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-stone-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Priority: {banner.priority || 0}
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${banner.isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-500 text-white"
                            }`}
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs opacity-0 group-hover/img:opacity-100 transition-opacity">
                        Click to Enlarge
                      </div>
                    </div>

                    {/* Content & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#11261B] line-clamp-1 mb-1">
                          {banner.title || "Untitled Banner"}
                        </h4>
                        {banner.description && (
                          <p className="text-xs text-stone-500 line-clamp-2 mb-2">
                            {banner.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 text-[11px] text-stone-500 mb-3">
                          {banner.discount && (
                            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                              Discount: {banner.discount.name}
                            </span>
                          )}
                          {banner.category && (
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                              Category: {banner.category.name}
                            </span>
                          )}
                          {banner.product && (
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                              Dish: {banner.product.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggle(banner._id)}
                          className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${banner.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                            }`}
                        >
                          {banner.isActive ? "Active" : "Activate"}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(banner)}
                            className="text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-1 border border-stone-200 rounded-lg hover:bg-stone-50"
                          >
                            Edit / Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(banner._id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 p-1"
                            title="Delete banner"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-[#11261B]">Edit Promotional Banner</h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Replace Image Preview */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Replace Image (Optional)
                </label>
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-stone-300 rounded-xl bg-[#F5F2EB] p-2 flex items-center justify-center cursor-pointer relative group overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editPreviewUrl || editingBanner.image?.url}
                    alt="Banner"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    Click to replace image file
                  </div>
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setEditFile(f);
                      setEditPreviewUrl(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBanner.title || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBanner.description || ""}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Display Priority</label>
                  <input
                    type="number"
                    value={editingBanner.priority ?? 0}
                    onChange={(e) => setEditingBanner({ ...editingBanner, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={editingBanner.isActive ? "active" : "inactive"}
                    onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.value === "active" })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-xs"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enlargement Lightbox Modal (Preserving full original aspect ratio without cropping) */}
      {lightboxBanner && (
        <div
          onClick={() => setLightboxBanner(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#1C1E1B] rounded-2xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 bg-stone-900 flex items-center justify-between border-b border-stone-800 text-white">
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {lightboxBanner.title || "Promotional Banner Preview"}
                </h3>
                {lightboxBanner.description && (
                  <p className="text-xs text-stone-400 mt-0.5">
                    {lightboxBanner.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxBanner(null)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close enlarged preview"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Body with exact rectangular container & object-fit: contain */}
            <div className="w-full h-[65vh] bg-stone-950 flex items-center justify-center p-4 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxBanner.image?.url}
                alt={lightboxBanner.title || "Promotional Banner"}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Original Aspect Ratio Preserved</span>
              <button
                type="button"
                onClick={() => setLightboxBanner(null)}
                className="text-stone-300 hover:text-white font-bold"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
