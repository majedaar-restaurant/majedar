import { Rider } from '../../models/Rider.js';
import { Order } from '../../models/Order.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export const getAllRiders = async ({ isActive, search } = {}) => {
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive;
    }
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: searchRegex }, { phone: searchRegex }];
    }
    return Rider.find(filter).sort({ createdAt: -1 });
};

export const getRiderById = async (id) => {
    const rider = await Rider.findById(id);
    if (!rider) {
        throw new NotFoundError('Rider not found');
    }
    return rider;
};

export const createRider = async (data) => {
    let cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length > 10 && (cleanPhone.startsWith('91') || cleanPhone.startsWith('0'))) {
        cleanPhone = cleanPhone.slice(-10);
    }

    const rider = new Rider({
        name: data.name.trim(),
        phone: cleanPhone,
        isActive: data.isActive !== undefined ? data.isActive : true,
    });

    await rider.save();
    return rider;
};

export const updateRider = async (id, updates) => {
    const rider = await Rider.findById(id);
    if (!rider) {
        throw new NotFoundError('Rider not found');
    }

    if (updates.name !== undefined) rider.name = updates.name.trim();
    if (updates.phone !== undefined) {
        let cleanPhone = updates.phone.replace(/\D/g, '');
        if (cleanPhone.length > 10 && (cleanPhone.startsWith('91') || cleanPhone.startsWith('0'))) {
            cleanPhone = cleanPhone.slice(-10);
        }
        rider.phone = cleanPhone;
    }
    if (updates.isActive !== undefined) rider.isActive = updates.isActive;

    await rider.save();
    return rider;
};

export const deleteRider = async (id) => {
    const rider = await Rider.findById(id);
    if (!rider) {
        throw new NotFoundError('Rider not found');
    }

    const associatedOrders = await Order.countDocuments({ rider: id });
    if (associatedOrders > 0) {
        throw new BadRequestError(
            `Cannot delete rider associated with ${associatedOrders} historical order(s). Please deactivate the rider instead.`
        );
    }

    await Rider.findByIdAndDelete(id);
    return { id, name: rider.name };
};

export const getRiders = getAllRiders;
