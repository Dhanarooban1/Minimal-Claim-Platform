
import dbConnect from '@/app/lib/mongodb.js';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/app/lib/auth';
import { errorHandler, successHandler } from '@/app/lib/routes.js';

export async function POST(req) {
  await dbConnect();

  const { name, email, password } = await req.json();
  if (!name || !email || !password) return errorHandler('All fields are required', 400);

  const existingUser = await User.findOne({ email });
  if (existingUser) return errorHandler('User already exists', 400);

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = generateToken(newUser);
  
  return new Response(JSON.stringify({ success: true, token, user: newUser }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; Max-Age=2592000`,
    },
  });
}
