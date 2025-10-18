import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface MatchNotificationData {
  user1: {
    id: string;
    name: string;
    age?: number;
    role?: string;
    city?: string;
    state?: string;
    personalityAnswers?: any;
    relationshipAnswers?: any;
    [key: string]: any;
  };
  user2: {
    id: string;
    name: string;
    age?: number;
    role?: string;
    city?: string;
    state?: string;
    personalityAnswers?: any;
    relationshipAnswers?: any;
    [key: string]: any;
  };
  matchId: string;
}

export async function sendMatchNotification(data: MatchNotificationData) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.log('Email not configured - skipping notification');
    return;
  }

  const { user1, user2, matchId } = data;

  // Format user data for email
  const formatUserData = (user: any) => {
    return `
      <div style="background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">${user.name}${user.age ? `, ${user.age}` : ''}</h3>
        <p><strong>Role:</strong> ${user.role || 'N/A'}</p>
        <p><strong>Location:</strong> ${user.city || 'N/A'}, ${user.state || 'N/A'}</p>
        <p><strong>Height:</strong> ${user.height || 'N/A'}</p>
        <p><strong>Body Type:</strong> ${user.bodyType || 'N/A'}</p>
        <p><strong>Race:</strong> ${user.race || 'N/A'}</p>
        <p><strong>Profession:</strong> ${user.profession || 'N/A'}</p>
        <p><strong>Drinking:</strong> ${user.drinking || 'N/A'}</p>
        <p><strong>Smoking:</strong> ${user.smoking || 'N/A'}</p>
        <p><strong>Fitness Level:</strong> ${user.fitnessLevel || 'N/A'}</p>
        <p><strong>Experience Level:</strong> ${user.experienceLevel || 'N/A'}</p>
        <p><strong>Sexual Orientation:</strong> ${user.sexualOrientation || 'N/A'}</p>
        
        ${user.personalityAnswers ? `
          <h4 style="color: #333; margin-top: 20px;">Personality Assessment Results</h4>
          <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(user.personalityAnswers, null, 2)}</pre>
        ` : ''}
        
        ${user.relationshipAnswers ? `
          <h4 style="color: #333; margin-top: 20px;">Relationship Assessment Results</h4>
          <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(user.relationshipAnswers, null, 2)}</pre>
        ` : ''}
      </div>
    `;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Match Created - The Executive Society</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #be185d 0%, #831843 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">New Match Created</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">The Executive Society</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>Match ID:</strong> ${matchId}
          </p>
          
          <h2 style="color: #be185d; border-bottom: 2px solid #be185d; padding-bottom: 10px;">User 1</h2>
          ${formatUserData(user1)}
          
          <h2 style="color: #be185d; border-bottom: 2px solid #be185d; padding-bottom: 10px; margin-top: 40px;">User 2</h2>
          ${formatUserData(user2)}
          
          <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #be185d; border-radius: 4px;">
            <p style="margin: 0; color: #666;">
              This notification was sent automatically when a new match was created in The Executive Society platform.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>The Executive Society - Premium BDSM Dating Platform</p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'The Executive Society <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Match: ${user1.name} & ${user2.name}`,
      html: htmlContent,
    });

    console.log('Match notification email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send match notification email:', error);
    throw error;
  }
}
