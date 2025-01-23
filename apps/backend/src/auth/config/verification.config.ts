import { registerAs } from '@nestjs/config';

export default registerAs('verification-jwt', () => ({
  secret: process.env.VERIFICATION_JWT_SECRET_KEY,
  expiresIn: process.env.VERIFICATION_JWT_EXPIRE_TIME,
}));
