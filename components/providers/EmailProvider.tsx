'use client';

import { PropsWithChildren, useEffect } from 'react';
import { initEmailService } from '@/lib/emailService';

const EmailProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    try {
      initEmailService();
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }, []);

  return <>{children}</>;
};

export default EmailProvider;

