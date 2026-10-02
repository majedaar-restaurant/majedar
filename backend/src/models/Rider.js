import mongoose from 'mongoose';

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
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

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
