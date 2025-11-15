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
 * @returns The API response
 */
export async function sendSmsToShopSubscribers({ 
  orgId,
  message
}: { 
  orgId: string, 
  message: string
}) {
  try {
    // First, get all customer phone numbers and shop details for this shop
    const orgResponse = await api.get('/api/orgs', {
      headers: {
        'x-clerk-org-id': orgId
      }
    });
    
    const customers: Customer[] = orgResponse.data.connectedCustomers || [];
    const shopCode = orgResponse.data.shop?.code;
    
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

    if (!shopCode) {
      return {
        success: false,
        message: "Shop code not found. Please set up a shop code first."
      };
    }
    
    // Call the SMS notification endpoint with shopCode as senderName
    const response = await api.post('/api/sms-notif', {
      to: phoneNumbers,
      body: message,
      senderName: shopCode // Always use shopCode as senderName
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