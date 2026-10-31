import { Banner } from '../../models/Banner.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../uploads/image.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

/**
 * Public: Get all active promotional banners.
 */
export const getActiveBanners = async () => {
    return await Banner.find({ isActive: true })
        .populate('discount', 'name discountType discountValue method couponCode applicability')
        .populate('category', 'name')
        .populate('product', 'name price image isVeg')
        .sort({ priority: -1, createdAt: -1 });
};

/**
 * Admin: Get all banners with populated references.
 */
export const getAdminBanners = async () => {
    return await Banner.find()
        .populate('discount', 'name discountType discountValue method couponCode')
        .populate('category', 'name')
        .populate('product', 'name price image')
        .sort({ priority: -1, createdAt: -1 });
};

/**
 * Admin: Get single banner by ID.
 */
export const getBannerById = async (id) => {
    const banner = await Banner.findById(id)
        .populate('discount')
        .populate('category')
        .populate('product');
    if (!banner) {
        throw new NotFoundError('Banner not found');
    }
    return banner;
};

/**
 * Admin: Create a new promotional banner.
 */
export const createBanner = async (bannerData, imageBuffer) => {
    if (!imageBuffer) {
        throw new BadRequestError('Promotional banner image is required');
    }

    // Upload to Cloudinary under majedar/banners folder
    const uploadResult = await uploadImageBuffer(imageBuffer, 'majedar/banners');

    const banner = new Banner({
        title: bannerData.title ? bannerData.title.trim() : null,
        description: bannerData.description ? bannerData.description.trim() : null,
        image: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
        },
        isActive: bannerData.isActive !== undefined ? Boolean(bannerData.isActive) : true,
        priority: Number(bannerData.priority) || 0,
        discount: bannerData.discount || null,
        category: bannerData.category || null,
        product: bannerData.product || null,
        menuSection: bannerData.menuSection || 'all',
    });

    await banner.save();
    return banner;
};

/**
 * Admin: Update promotional banner.
 */
export const updateBanner = async (id, bannerData, imageBuffer = null) => {
    const banner = await Banner.findById(id);
    if (!banner) {
        throw new NotFoundError('Banner not found');
    }

    if (imageBuffer) {
        // Upload new image
        const uploadResult = await uploadImageBuffer(imageBuffer, 'majedar/banners');

        // Delete previous Cloudinary image
        if (banner.image?.publicId) {
            await deleteCloudinaryImage(banner.image.publicId);
        }

        banner.image = {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
        };
    }

    if (bannerData.title !== undefined) banner.title = bannerData.title ? bannerData.title.trim() : null;
    if (bannerData.description !== undefined) banner.description = bannerData.description ? bannerData.description.trim() : null;
    if (bannerData.isActive !== undefined) banner.isActive = Boolean(bannerData.isActive);
    if (bannerData.priority !== undefined) banner.priority = Number(bannerData.priority) || 0;
    if (bannerData.discount !== undefined) banner.discount = bannerData.discount || null;
    if (bannerData.category !== undefined) banner.category = bannerData.category || null;
    if (bannerData.product !== undefined) banner.product = bannerData.product || null;
    if (bannerData.menuSection !== undefined) banner.menuSection = bannerData.menuSection || 'all';

    await banner.save();
    return banner;
};

/**
 * Admin: Toggle banner active state.
 */
export const toggleBannerStatus = async (id) => {
    const banner = await Banner.findById(id);
    if (!banner) {
        throw new NotFoundError('Banner not found');
    }
    banner.isActive = !banner.isActive;
    await banner.save();
    return banner;
};

/**
 * Admin: Delete promotional banner and remove asset from Cloudinary.
 */
export const deleteBanner = async (id) => {
    const banner = await Banner.findById(id);
    if (!banner) {
        throw new NotFoundError('Banner not found');
    }

    if (banner.image?.publicId) {
        await deleteCloudinaryImage(banner.image.publicId);
    }

    await Banner.findByIdAndDelete(id);
    return banner;
};

