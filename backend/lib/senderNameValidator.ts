export interface SenderNameValidationResult {
  isValid: boolean;
  formattedName?: string;
  error?: string;
}

export function validateSenderName(senderName: string): SenderNameValidationResult {
  if (!senderName) {
    return { isValid: false, error: "Sender name is required" };
  }

  // Format the sender name
  const formattedName = senderName
    .replace(/[^A-Za-z0-9\s+\-_&.]/g, '')
    .trim()
    .slice(0, 11);
  
  // Check if it contains at least one letter
  if (!formattedName.match(/[A-Za-z]/)) {
    return { 
      isValid: false, 
      error: "Sender name must contain at least one letter" 
    };
  }

  // Validate overall format
  if (!formattedName.match(/^[A-Za-z0-9\s+\-_&.]{1,11}$/)) {
    return { 
      isValid: false, 
      error: "Sender name must be 1-11 characters and can only contain letters, numbers, spaces, and the special characters: + - _ & ." 
    };
  }

  return {
    isValid: true,
    formattedName
  };
}