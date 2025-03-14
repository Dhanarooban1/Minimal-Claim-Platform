
import dbConnect from '@/app/lib/mongodb';
import Claim from '@/models/Claim';
import { errorHandler, successHandler } from '@/app/lib/routes.js';

export async function GET(req) {
    try {
      await dbConnect();
  
      const claims = await Claim.find({}).sort({ submissionDate: -1 });
      return successHandler('All claims retrieved successfully', { claims }, 200);
    } catch (error) {
      return errorHandler(error.message, 500);
    }}