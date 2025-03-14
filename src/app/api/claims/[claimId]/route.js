import dbConnect from '@/app/lib/mongodb';
import Claim from '@/models/Claim';
import { errorHandler, successHandler } from '@/app/lib/routes.js';

//pa


export async function PATCH(req) {
    try {
      await dbConnect();
  
      const url = new URL(req.url);
      const claimId = url.pathname.split('/').pop();
      console.log(url,claimId)
      const { status, approvedAmount, comments } = await req.json();
  
      const updatedClaim = await Claim.findByIdAndUpdate(claimId, {
        status,
        approvedAmount,
        comments
      }, { new: true });
  
      if (!updatedClaim) {
        return errorHandler('Claim not found', 404);
      }
  
      return successHandler('Claim updated successfully', { updatedClaim }, 200);
    } catch (error) {
      return errorHandler(error.message, 500);
    }
  }
  