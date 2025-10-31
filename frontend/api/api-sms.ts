import api from "@/lib/axios";

// Define interface for customer data
interface Customer {
  customerId: string;
  name: string;
  phone: string;
  birthday?: string;
  createdAt?: string;
}

/**
 * Send SMS to all users subscribed to a shop
 * @param orgId - The clerk organization ID of the shop
 * @param message - The message body to send
 * @param senderName - Optional custom sender name
 * @returns The API response
 */
export async function sendSmsToShopSubscribers({ 
  orgId,
  message,
  senderName
}: { 
  orgId: string, 
  message: string,
  senderName?: string
}) {
  try {
    // First, get all customer phone numbers for this shop
    const orgResponse = await api.get('/api/orgs', {
      headers: {
        'x-clerk-org-id': orgId
      }
    });
    
    const customers: Customer[] = orgResponse.data.connectedCustomers || [];
    
    // Extract phone numbers from customers
    const phoneNumbers = customers
      .filter((customer: Customer) => customer.phone) // Make sure phone exists
      .map((customer: Customer) => customer.phone);
    
    if (phoneNumbers.length === 0) {
      return { 
        success: false, 
        message: "No subscribers with phone numbers found" 
      };
    }
    
    // Call the SMS notification endpoint
    const response = await api.post('/api/sms-notif', {
      to: phoneNumbers,
      body: message,
      senderName
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending SMS to shop subscribers:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to send SMS"
    };
  }
}

/**
 * Send SMS to a specific customer
 * @param phoneNumber - The recipient's phone number
 * @param message - The message body to send
 * @param senderName - Optional custom sender name
 * @returns The API response
 */
export async function sendSmsToCustomer({
  phoneNumber,
  message,
  senderName
}: {
  phoneNumber: string,
  message: string,
  senderName?: string
}) {
  try {
    const response = await api.post('/api/sms-notif', {
      to: phoneNumber,
      body: message,
      senderName
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending SMS to customer:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to send SMS"
    };
  }
}