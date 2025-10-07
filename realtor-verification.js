/**
 * Realtor Verification Management System
 * Handles verification process, status tracking, and admin controls
 */

class RealtorVerificationManager {
    constructor() {
        this.pendingVerifications = JSON.parse(localStorage.getItem('mwg_pending_verifications') || '[]');
        this.verifiedRealtors = JSON.parse(localStorage.getItem('mwg_verified_realtors') || '[]');
        this.rejectedApplications = JSON.parse(localStorage.getItem('mwg_rejected_applications') || '[]');
    }

    // Submit verification application
    submitVerificationApplication(realtorData) {
        const application = {
            id: this.generateApplicationId(),
            ...realtorData,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewedBy: null,
            verificationNotes: null
        };

        this.pendingVerifications.push(application);
        this.savePendingVerifications();

        // Send email notification (mock)
        this.sendVerificationNotification(application, 'submitted');

        return {
            success: true,
            applicationId: application.id,
            message: 'Verification application submitted successfully'
        };
    }

    // Get verification status
    getVerificationStatus(email) {
        // Check pending
        const pending = this.pendingVerifications.find(app => app.email === email);
        if (pending) {
            return {
                status: 'pending',
                submittedAt: pending.submittedAt,
                applicationId: pending.id
            };
        }

        // Check verified
        const verified = this.verifiedRealtors.find(realtor => realtor.email === email);
        if (verified) {
            return {
                status: 'verified',
                verifiedAt: verified.reviewedAt,
                realtorId: verified.id
            };
        }

        // Check rejected
        const rejected = this.rejectedApplications.find(app => app.email === email);
        if (rejected) {
            return {
                status: 'rejected',
                rejectedAt: rejected.reviewedAt,
                reason: rejected.verificationNotes,
                canReapply: this.canReapply(rejected.reviewedAt)
            };
        }

        return { status: 'not_found' };
    }

    // Admin: Get all pending verifications
    getPendingVerifications() {
        return this.pendingVerifications.sort((a, b) => 
            new Date(a.submittedAt) - new Date(b.submittedAt)
        );
    }

    // Admin: Approve verification
    approveVerification(applicationId, adminId, notes = '') {
        const applicationIndex = this.pendingVerifications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex === -1) {
            return { success: false, message: 'Application not found' };
        }

        const application = this.pendingVerifications[applicationIndex];
        
        // Move to verified realtors
        const verifiedRealtor = {
            ...application,
            status: 'verified',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId,
            verificationNotes: notes
        };

        this.verifiedRealtors.push(verifiedRealtor);
        this.pendingVerifications.splice(applicationIndex, 1);

        this.saveVerifiedRealtors();
        this.savePendingVerifications();

        // Send approval notification
        this.sendVerificationNotification(verifiedRealtor, 'approved');

        return {
            success: true,
            message: 'Realtor verification approved successfully'
        };
    }

    // Admin: Reject verification
    rejectVerification(applicationId, adminId, reason) {
        const applicationIndex = this.pendingVerifications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex === -1) {
            return { success: false, message: 'Application not found' };
        }

        const application = this.pendingVerifications[applicationIndex];
        
        // Move to rejected applications
        const rejectedApplication = {
            ...application,
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId,
            verificationNotes: reason
        };

        this.rejectedApplications.push(rejectedApplication);
        this.pendingVerifications.splice(applicationIndex, 1);

        this.saveRejectedApplications();
        this.savePendingVerifications();

        // Send rejection notification
        this.sendVerificationNotification(rejectedApplication, 'rejected');

        return {
            success: true,
            message: 'Application rejected successfully'
        };
    }

    // Check if rejected applicant can reapply (after 30 days)
    canReapply(rejectedDate) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(rejectedDate) < thirtyDaysAgo;
    }

    // Generate unique application ID
    generateApplicationId() {
        return 'APP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Send notifications (mock implementation)
    sendVerificationNotification(application, type) {
        const notifications = {
            submitted: {
                subject: 'Verification Application Received - MWG Hostels',
                message: `Dear ${application.firstName} ${application.lastName},\n\nThank you for submitting your realtor verification application for ${application.businessName}.\n\nApplication ID: ${application.id}\nSubmitted: ${new Date(application.submittedAt).toLocaleDateString()}\n\nOur team will review your application within 24-48 hours. You will receive an email notification once the review is complete.\n\nBest regards,\nMWG Hostels Verification Team`
            },
            approved: {
                subject: 'Realtor Account Approved - Welcome to MWG Hostels!',
                message: `Congratulations ${application.firstName} ${application.lastName}!\n\nYour realtor account for ${application.businessName} has been approved.\n\nYou can now:\n- Login to your realtor dashboard\n- List your properties\n- Connect with students\n- Manage bookings\n\nLogin at: https://mwghostels.com/realtor-login\n\nWelcome to the MWG Hostels family!\n\nBest regards,\nMWG Hostels Team`
            },
            rejected: {
                subject: 'Realtor Application Update - MWG Hostels',
                message: `Dear ${application.firstName} ${application.lastName},\n\nThank you for your interest in joining MWG Hostels as a realtor.\n\nAfter careful review, we regret to inform you that your application for ${application.businessName} could not be approved at this time.\n\nReason: ${application.verificationNotes}\n\nYou may reapply after 30 days with updated documentation.\n\nIf you have questions, please contact our support team.\n\nBest regards,\nMWG Hostels Verification Team`
            }
        };

        const notification = notifications[type];
        if (notification) {
            console.log('Email Notification:', {
                to: application.email,
                subject: notification.subject,
                message: notification.message
            });
            
            // Store notification for reference
            this.saveNotificationLog(application.email, notification, type);
        }
    }

    // Save notification log
    saveNotificationLog(email, notification, type) {
        const logs = JSON.parse(localStorage.getItem('mwg_notification_logs') || '[]');
        logs.push({
            email,
            type,
            subject: notification.subject,
            sentAt: new Date().toISOString()
        });
        localStorage.setItem('mwg_notification_logs', JSON.stringify(logs));
    }

    // Storage methods
    savePendingVerifications() {
        localStorage.setItem('mwg_pending_verifications', JSON.stringify(this.pendingVerifications));
    }

    saveVerifiedRealtors() {
        localStorage.setItem('mwg_verified_realtors', JSON.stringify(this.verifiedRealtors));
    }

    saveRejectedApplications() {
        localStorage.setItem('mwg_rejected_applications', JSON.stringify(this.rejectedApplications));
    }

    // Get statistics for admin dashboard
    getVerificationStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        const recentPending = this.pendingVerifications.filter(app => 
            new Date(app.submittedAt) >= last30Days
        );

        const recentApproved = this.verifiedRealtors.filter(realtor => 
            realtor.reviewedAt && new Date(realtor.reviewedAt) >= last30Days
        );

        const recentRejected = this.rejectedApplications.filter(app => 
            new Date(app.reviewedAt) >= last30Days
        );

        return {
            total: {
                pending: this.pendingVerifications.length,
                verified: this.verifiedRealtors.length,
                rejected: this.rejectedApplications.length
            },
            last30Days: {
                submitted: recentPending.length,
                approved: recentApproved.length,
                rejected: recentRejected.length
            },
            averageProcessingTime: this.calculateAverageProcessingTime()
        };
    }

    // Calculate average processing time
    calculateAverageProcessingTime() {
        const processed = [...this.verifiedRealtors, ...this.rejectedApplications]
            .filter(app => app.submittedAt && app.reviewedAt);

        if (processed.length === 0) return 0;

        const totalTime = processed.reduce((sum, app) => {
            const submitted = new Date(app.submittedAt);
            const reviewed = new Date(app.reviewedAt);
            return sum + (reviewed - submitted);
        }, 0);

        return Math.round(totalTime / processed.length / (1000 * 60 * 60)); // in hours
    }

    // Check if realtor is verified
    isRealtorVerified(email) {
        return this.verifiedRealtors.some(realtor => realtor.email === email);
    }

    // Get verified realtor data
    getVerifiedRealtor(email) {
        return this.verifiedRealtors.find(realtor => realtor.email === email);
    }
}

// Initialize verification manager
let verificationManager;
document.addEventListener('DOMContentLoaded', () => {
    verificationManager = new RealtorVerificationManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealtorVerificationManager;
}