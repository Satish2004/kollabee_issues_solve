"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not_requested';

interface ProfileApprovalContextType {
    approvalStatus: ApprovalStatus;
    isSubmittingApproval: boolean;
    isLoading: boolean;
    error: string | null;
    requestApproval: (stepsToBeCompleted: number) => Promise<void>;
    refetchApprovalStatus: () => void;
}

const ProfileApprovalContext = createContext<ProfileApprovalContextType | undefined>(undefined);

// Mock API for profile approval
const mockProfileApprovalApi = {
    getApprovalStatus: async (isProfileComplete: boolean): Promise<ApprovalStatus> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different approval states based on profile completion
                if (isProfileComplete) {
                    // Once profile is complete, it goes to pending, then eventually approved
                    const storedStatus = localStorage.getItem('mockApprovalStatus');
                    if (storedStatus === 'approved') {
                        resolve('approved');
                    } else if (storedStatus === 'rejected') {
                        resolve('rejected');
                    } else {
                        resolve('pending'); // Default to pending if complete but not explicitly approved/rejected
                    }
                } else {
                    resolve('not_requested');
                }
            }, 500);
        });
    },
    submitApprovalRequest: async (stepsToBeCompleted: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (stepsToBeCompleted === 0) {
                    localStorage.setItem('mockApprovalStatus', 'pending'); // Simulate setting to pending
                    resolve();
                } else {
                    reject(new Error("Profile not complete. Please complete all steps before requesting approval."));
                }
            }, 1000);
        });
    },
};

interface ProfileApprovalProviderProps {
    children: React.ReactNode;
    isProfileInitiallyComplete: boolean; // Pass this from useProfileCompletion
}

export const ProfileApprovalProvider: React.FC<ProfileApprovalProviderProps> = ({ children }) => {
    const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('not_requested');
    const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileInitiallyComplete, setIsProfileInitiallyComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApprovalStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const status = await mockProfileApprovalApi.getApprovalStatus(isProfileInitiallyComplete);
            setApprovalStatus(status);
        } catch (err: any) {
            setError(err.message || "Failed to load approval status.");
        } finally {
            setIsLoading(false);
        }
    }, [isProfileInitiallyComplete]);

    useEffect(() => {
        fetchApprovalStatus();
    }, [fetchApprovalStatus]);

    const requestApproval = useCallback(async (stepsToBeCompleted: number) => {
        setIsSubmittingApproval(true);
        setError(null);
        try {
            await mockProfileApprovalApi.submitApprovalRequest(stepsToBeCompleted);
            setApprovalStatus('pending'); // Optimistically update status
            // Re-fetch to confirm if needed, or rely on backend webhook
            fetchApprovalStatus();
        } catch (err: any) {
            setError(err.message || "Failed to request approval.");
        } finally {
            setIsSubmittingApproval(false);
        }
    }, [fetchApprovalStatus]);

    const refetchApprovalStatus = useCallback(() => {
        fetchApprovalStatus();
    }, [fetchApprovalStatus]);

    const value = {
        approvalStatus,
        isSubmittingApproval,
        isLoading,
        error,
        requestApproval,
        refetchApprovalStatus,
    };

    return (
        <ProfileApprovalContext.Provider value={value}>
            {children}
        </ProfileApprovalContext.Provider>
    );
};

export const useProfileApprovalContext = () => {
    const context = useContext(ProfileApprovalContext);
    if (context === undefined) {
        throw new Error('useProfileApprovalContext must be used within a ProfileApprovalProvider');
    }
    return context;
};
