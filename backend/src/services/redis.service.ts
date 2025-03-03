import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const storeOTP = async (email: string, otp: string) => {
  await redis.set(
    `otp:${email}`, 
    otp,
    'EX',  // Set expiry
    600    // 10 minutes
  );
};

export const verifyOTP = async (email: string, otp: string) => {
  const storedOTP = await redis.get(`otp:${email}`);
  return storedOTP === otp;
}; 