import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export async function generateToken(user) {
  return await new SignJWT({ id: user._id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret);
}

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Compare passwords
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Verify JWT token
export async function verifyAuth(token) {
  try {
    const { payload } = await jwtVerify(token.value, secret);
    return payload;
  } catch (err) {
    console.log('JWT verification failed:', err);
    return null;
  }
}
