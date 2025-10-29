// app/api/generate-caption/route.ts

import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Inisialisasi Hugging Face Inference Client
// Kunci diambil otomatis dari HUGGINGFACE_API_TOKEN di .env.local
const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
if (!HF_ACCESS_TOKEN) {
  throw new Error('HUGGINGFACE_API_TOKEN is not set');
}
const hf = new HfInference(HF_ACCESS_TOKEN);

// Model Image Captioning yang populer
const MODEL_ID = 'Salesforce/blip-image-captioning-base'; 

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // 1. Ambil data gambar (sebagai ArrayBuffer)
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // 2. Panggil model Image-to-Text (Captioning)
    const result = await hf.imageToText({
        data: imageBuffer,
        model: MODEL_ID,
    });
    
    // Hasil captioning biasanya dalam format array: [{ generated_text: "..." }]
    const caption = result.generated_text;

    return NextResponse.json({ 
        caption: caption,
        model_used: MODEL_ID 
    });

  } catch (error) {
    console.error('Error generating caption:', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}

