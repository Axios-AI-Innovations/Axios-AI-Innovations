interface SubscriptionData {
    email: string;
    source?: string;
}

export const subscribeToEarlyAccess = async (data: SubscriptionData): Promise<boolean> => {
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                // Email already exists - still consider success for UX
                return true;
            }
            throw new Error(result.error || 'Failed to subscribe');
        }

        return true;
    } catch (error) {
        console.error('Subscription error:', error);
        throw new Error('Failed to subscribe to early access');
    }
};