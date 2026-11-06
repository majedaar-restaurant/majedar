import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

const riderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Rider name is required'],
            trim: true,
            minlength: [2, 'Rider name must be at least 2 characters long'],
            maxlength: [100, 'Rider name cannot exceed 100 characters'],
            index: true,
        },
        phone: {
            type: String,
            required: [true, 'Rider phone number is required'],
            trim: true,
            validate: {
                validator: (v) => phoneRegex.test(v.replace(/\s+/g, '')),
                message: 'Invalid Indian phone number format (10 digits starting with 6-9)',
            },
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            sparse: true,
            unique: true,
            index: true,
        },
        passwordHash: {
            type: String,
            select: false,
        },
        googleId: {
            type: String,
            default: null,
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        availability: {
            type: String,
            enum: ['available', 'busy', 'unavailable'],
            default: 'available',
            index: true,
        },
        emailChange: {
            email: { type: String, lowercase: true, trim: true, default: null },
            codeHash: { type: String, select: false, default: null },
            expiresAt: { type: Date, default: null },
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.passwordHash;
                delete ret.googleId;
                delete ret.emailChange;
                delete ret.tokenVersion;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.passwordHash;
                delete ret.googleId;
                delete ret.emailChange;
                delete ret.tokenVersion;
                delete ret.__v;
                return ret;
            },
        },
    }
);
riderSchema.index({ googleId: 1 }, { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } });

riderSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.passwordHash) {
        throw new Error('Password hash not selected in query');
    }
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Format phone consistently before save
riderSchema.pre('save', function (next) {
    if (this.isModified('phone') && this.phone) {
        const clean = this.phone.replace(/\D/g, '');
        if (clean.length === 10) {
            this.phone = clean;
        } else if (clean.length > 10 && clean.startsWith('91')) {
            this.phone = clean.slice(-10);
        } else if (clean.length > 10 && clean.startsWith('0')) {
            this.phone = clean.slice(-10);
        }
    }
    next();
});

export const Rider = mongoose.model('Rider', riderSchema);
