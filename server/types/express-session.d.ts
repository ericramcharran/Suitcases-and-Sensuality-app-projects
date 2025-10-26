import 'express-session';

declare module 'express-session' {
  interface SessionData {
    sparkitCoupleId?: string;
    sparkitPartnerRole?: 'partner1' | 'partner2';
  }
}
