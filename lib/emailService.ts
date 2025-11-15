import emailjs from '@emailjs/browser';

interface EmailConfig {
  serviceId: string;
  templates: {
    contact: string;
    customProject: string;
  };
  publicKey: string;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  type: 'contact' | 'pain-point-discovery';
}

interface CustomProjectFormData {
  name: string;
  email: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  company?: string;
  type: 'custom-project';
}

type FormData = ContactFormData | CustomProjectFormData;

const emailConfig: EmailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templates: {
    contact: process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || '',
    customProject: process.env.NEXT_PUBLIC_EMAILJS_CUSTOM_PROJECT_TEMPLATE_ID || '',
  },
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
};

const validateEmailConfig = () => {
  const missingVars: string[] = [];

  if (!emailConfig.serviceId) missingVars.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  if (!emailConfig.templates.contact) missingVars.push('NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID');
  if (!emailConfig.templates.customProject) missingVars.push('NEXT_PUBLIC_EMAILJS_CUSTOM_PROJECT_TEMPLATE_ID');
  if (!emailConfig.publicKey) missingVars.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

  if (missingVars.length > 0) {
    throw new Error(`Missing required EmailJS environment variables: ${missingVars.join(', ')}`);
  }
};

// Initialize EmailJS service
export const initEmailService = () => {
  try {
    validateEmailConfig();
    emailjs.init(emailConfig.publicKey);
    console.log('EmailJS initialized successfully');
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    throw error;
  }
};

export const sendContactForm = async (formData: FormData): Promise<boolean> => {
  try {
    validateEmailConfig();

    // Map form data to template variables
    const templateParams = {
      // Template expects these variable names
      from_name: formData.name,
      from_email: formData.email,
      reply_to: formData.email,
      to_name: 'Axios Innovations Team',
      company: formData.company || 'Not specified',
      submitDate: new Date().toISOString(),

      // Add fields specific to contact form (includes pain-point-discovery)
      ...((formData.type === 'contact' || formData.type === 'pain-point-discovery') && {
        message: (formData as ContactFormData).message,
      }),

      // Add fields specific to custom project form
      ...(formData.type === 'custom-project' && {
        projectDetails: (formData as CustomProjectFormData).projectDetails,
        budget: (formData as CustomProjectFormData).budget,
        timeline: (formData as CustomProjectFormData).timeline,
      })
    };

    // Log what we're sending for debugging
    console.log('Sending email with template params:', templateParams);

    // Choose template based on form type
    // Both 'contact' and 'pain-point-discovery' use the contact template
    const templateId = (formData.type === 'contact' || formData.type === 'pain-point-discovery')
        ? emailConfig.templates.contact
        : emailConfig.templates.customProject;

    const response = await emailjs.send(
        emailConfig.serviceId,
        templateId,
        templateParams
    );

    if (response.status !== 200) {
      console.error('EmailJS send failed:', response);
      return false;
    }

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};

// For development/testing purposes
if (process.env.NODE_ENV !== 'production') {
  console.info('EmailJS Config Status:', {
    serviceId: !!emailConfig.serviceId,
    contactTemplate: !!emailConfig.templates.contact,
    customProjectTemplate: !!emailConfig.templates.customProject,
    publicKey: !!emailConfig.publicKey
  });
}