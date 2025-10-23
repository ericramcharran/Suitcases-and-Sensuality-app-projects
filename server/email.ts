import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email not configured - skipping verification email');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - The Executive Society</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #be185d 0%, #831843 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">The Executive Society</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for joining The Executive Society. Please verify your email address to continue.
          </p>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your verification code:</p>
            <p style="font-size: 32px; font-weight: bold; color: #be185d; margin: 0; letter-spacing: 8px;">${code}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </p>
          
          <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #be185d; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              For your security, never share this code with anyone.
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
      to: email,
      subject: `Your Verification Code: ${code}`,
      html: htmlContent,
    });

    console.log('Verification email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

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
          <h4 style="color: #333; margin-top: 20px;">Personality Assessment</h4>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-bottom: 10px;">
            ${user.personalityAnswers.personalityType ? `<p><strong>Personality Type:</strong> ${user.personalityAnswers.personalityType}</p>` : ''}
            ${user.personalityAnswers.scores ? `<p><strong>Scores:</strong> ${JSON.stringify(user.personalityAnswers.scores, null, 2)}</p>` : ''}
            <details>
              <summary style="cursor: pointer; font-weight: bold; margin-top: 10px;">View All Answers</summary>
              <pre style="background: #fafafa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 10px;">${JSON.stringify(user.personalityAnswers.answers || user.personalityAnswers, null, 2)}</pre>
            </details>
          </div>
        ` : ''}
        
        ${user.relationshipAnswers ? `
          <h4 style="color: #333; margin-top: 20px;">Relationship Assessment</h4>
          <div style="background: white; padding: 15px; border-radius: 4px;">
            ${user.relationshipAnswers.relationshipStyle ? `<p><strong>Relationship Style:</strong> ${user.relationshipAnswers.relationshipStyle}</p>` : ''}
            ${user.relationshipAnswers.scores ? `<p><strong>Scores:</strong> ${JSON.stringify(user.relationshipAnswers.scores, null, 2)}</p>` : ''}
            <details>
              <summary style="cursor: pointer; font-weight: bold; margin-top: 10px;">View All Answers</summary>
              <pre style="background: #fafafa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 10px;">${JSON.stringify(user.relationshipAnswers.answers || user.relationshipAnswers, null, 2)}</pre>
            </details>
          </div>
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
