import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Customer } from '../../src/models/Customer.js';
import {
    updateGoogleCustomerPhone,
    generateSignupToken,
    verifySignupToken,
} from '../../src/services/customer-auth/google-auth.service.js';

describe('Google OAuth Customer Authentication Suite', () => {
    describe('Customer Schema - Google OAuth Support', () => {
        test('Customer schema supports Google customer without password and phone', () => {
            const customer = new Customer({
                name: 'Google User',
                email: 'googleuser@example.com',
                googleId: 'google-sub-1234567890',
                authProvider: 'google',
                emailVerified: true,
                profilePicture: 'https://lh3.googleusercontent.com/a/photo.jpg',
            });

            const validationError = customer.validateSync();
            assert.equal(validationError, undefined, 'Customer validation should pass for Google user without phone or password');
            assert.equal(customer.authProvider, 'google');
            assert.equal(customer.emailVerified, true);
            assert.equal(customer.googleId, 'google-sub-1234567890');
            assert.equal(customer.phone, null);
            assert.equal(customer.passwordHash, null);
        });

        test('Customer schema still supports traditional email/password user', () => {
            const customer = new Customer({
                name: 'Standard User',
                email: 'standard@example.com',
                phone: '+91 9876543210',
                passwordHash: '$2a$12$abcdefghijklmnopqrstuv',
                emailVerified: false,
                authProvider: 'local',
            });

            const validationError = customer.validateSync();
            assert.equal(validationError, undefined, 'Customer validation should pass for traditional local user');
            assert.equal(customer.authProvider, 'local');
            assert.equal(customer.googleId, null);
            assert.equal(customer.phone, '+91 9876543210');
        });

        test('toJSON removes passwordHash and __v but preserves googleId and profilePicture', () => {
            const customer = new Customer({
                name: 'Google User',
                email: 'googleuser@example.com',
                googleId: 'google-sub-999',
                authProvider: 'google',
                profilePicture: 'https://example.com/pic.jpg',
                passwordHash: 'secret-hash',
            });

            const json = customer.toJSON();
            assert.equal(json.passwordHash, undefined);
            assert.equal(json.__v, undefined);
            assert.equal(json.googleId, 'google-sub-999');
            assert.equal(json.authProvider, 'google');
            assert.equal(json.profilePicture, 'https://example.com/pic.jpg');
        });
    });

    describe('Signup Token Utilities', () => {
        test('generateSignupToken creates a verifiable short-lived token', () => {
            const token = generateSignupToken({
                sub: 'google-uid-12345',
                email: 'test@example.com',
                name: 'Test Person',
                picture: 'https://example.com/pic.jpg',
            });

            assert.ok(token);
            const decoded = verifySignupToken(token);
            assert.equal(decoded.googleId, 'google-uid-12345');
            assert.equal(decoded.email, 'test@example.com');
            assert.equal(decoded.name, 'Test Person');
            assert.equal(decoded.type, 'google_signup');
        });

        test('verifySignupToken rejects invalid tokens', () => {
            assert.throws(() => {
                verifySignupToken('invalid-token');
            }, /Signup session expired or invalid/);
        });
    });

    describe('Google Customer Phone Validation Service', () => {
        test('updateGoogleCustomerPhone rejects invalid phone numbers', async () => {
            // Test short phone
            await assert.rejects(
                async () => {
                    await updateGoogleCustomerPhone('dummy-id', '123');
                },
                (err) => {
                    assert.equal(err.statusCode, 400);
                    assert.equal(err.message, 'Please enter a valid 10-digit Indian mobile number.');
                    return true;
                }
            );

            // Test non-numeric phone
            await assert.rejects(
                async () => {
                    await updateGoogleCustomerPhone('dummy-id', 'abcdefghij');
                },
                (err) => {
                    assert.equal(err.statusCode, 400);
                    assert.equal(err.message, 'Please enter a valid 10-digit Indian mobile number.');
                    return true;
                }
            );

            // Test empty phone
            await assert.rejects(
                async () => {
                    await updateGoogleCustomerPhone('dummy-id', '   ');
                },
                (err) => {
                    assert.equal(err.statusCode, 400);
                    assert.equal(err.message, 'Please enter a valid 10-digit Indian mobile number.');
                    return true;
                }
            );
        });
    });
});
