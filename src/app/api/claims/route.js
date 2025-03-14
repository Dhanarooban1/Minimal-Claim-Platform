import dbConnect from '@/app/lib/mongodb';
import Claim from '@/models/Claim';
import { errorHandler, successHandler } from '@/app/lib/routes.js';

//pa
export async function POST(req) {
  try {
    await dbConnect();

    const userId = req.headers.get('x-user-id'); 
    if (!userId) {
      return errorHandler('Unauthorized', 401);
    }

    const { name, email, claimAmount, description } = await req.json();
    
    if (!name || !email || !claimAmount || !description) {
      return errorHandler('Missing required fields', 400);
    }
    
    const newClaim = new Claim({
      patientId: userId,
      name,
      email,
      claimAmount,
      description,
      status: 'Pending',
      submissionDate: new Date(),
      approvedAmount: 0,
      insurerComments: ''
    });
    
    await newClaim.save();
    return successHandler('Claim submitted successfully', { claim: newClaim }, 201);
  } catch (error) {
    return errorHandler(error.message, 500);
  }
}


//pa
export async function GET(req) {
  try {
    await dbConnect();

    const userId = req.headers.get('x-user-id'); // Get userId from header
    if (!userId) {
      return errorHandler('Unauthorized', 401);
    }
    
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const minAmount = url.searchParams.get('minAmount');
    const maxAmount = url.searchParams.get('maxAmount');
    
    let query = { patientId: userId }; // Show only the user's claims
    
    if (status) query.status = status;

    if (startDate && endDate) {
      query.submissionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.submissionDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.submissionDate = { $lte: new Date(endDate) };
    }
    
    if (minAmount && maxAmount) {
      query.claimAmount = {
        $gte: parseFloat(minAmount),
        $lte: parseFloat(maxAmount)
      };
    } else if (minAmount) {
      query.claimAmount = { $gte: parseFloat(minAmount) };
    } else if (maxAmount) {
      query.claimAmount = { $lte: parseFloat(maxAmount) };
    }
    
    const claims = await Claim.find(query).sort({ submissionDate: -1 });
    return successHandler('Claims retrieved successfully', { claims }, 200);
  } catch (error) {
    return errorHandler(error.message, 500);
  }
}


