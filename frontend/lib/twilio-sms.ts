export type TemplateData = {
  shopName: string;
  title?: string;
  message: string;
  expiresAt?: string;
  customerName?: string;
};

export const templates = {
  default: (data: TemplateData): string => 
    `${data.shopName} - ${data.title || 'Announcement'}: ${data.message}${data.expiresAt ? ` until ${data.expiresAt}` : 'not-set'}`,
    
  birthday: (data: TemplateData): string => 
    `${data.shopName} - Happy Birthday ${data.customerName || 'valued customer'}! ${data.message}${data.expiresAt ? ` until ${data.expiresAt}` : 'not-set'}`,
    
  promotion: (data: TemplateData): string => 
    `${data.shopName} SPECIAL OFFER: ${data.title || ''} - ${data.message}${data.expiresAt ? ` Valid until ${data.expiresAt}` : ''}`,
};

// Usage example
export const formatMessage = (templateName: keyof typeof templates, data: TemplateData): string => {
  const template = templates[templateName] || templates.default;
  return template(data);
};