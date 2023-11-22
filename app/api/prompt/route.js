import Prompt from "@models/prompt"
import { connectToDB } from "@utils/database";


export const GET = async (req) => {
  try {
    await connectToDB();
    console.log('Connected to MongoDB');
    const prompts = await Prompt.find({}).populate('creator');
    // console.log(prompts);
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log('Error getting prompt: ', error.message);
    return new Response(JSON.stringify("Failed to fetch prompts"), {status: 500});
  }
}