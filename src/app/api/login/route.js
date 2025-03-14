import dbConnect from '@/app/lib/mongodb.js';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/app/lib/auth.js';
import { errorHandler } from '@/app/lib/routes';

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();
  if (!email || !password) return errorHandler('Email and password are required', 400);

  const user = await User.findOne({ email });
  if (!user) return errorHandler('Invalid credentials', 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return errorHandler('Invalid credentials', 401);

  const token = generateToken(user);

  return new Response(JSON.stringify({ success: true, token, user }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; Max-Age=2592000`,
    },
  });
}
