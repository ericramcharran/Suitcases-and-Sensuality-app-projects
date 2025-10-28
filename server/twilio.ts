import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not configured. SMS functionality will be disabled.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SendSMSParams {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SendSMSParams): Promise<{ success: boolean; error?: string }> {
  if (!client || !twilioPhoneNumber) {
    return {
      success: false,
      error: 'SMS service is not configured. Please add Twilio credentials.',
    };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`SMS sent successfully to ${to}. SID: ${result.sid}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    };
  }
}
