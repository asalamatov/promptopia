import Prompt from "@models/prompt"
import { connectToDB } from "@utils/database";


export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    console.log('Connected to MongoDB');
    const prompts = await Prompt.find({ creator: params.id }).populate('creator');
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log('Error getting prompt: ', error.message);
    return new Response(JSON.stringify("Failed to fetch prompts"), { status: 500 });
  }
}