import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image, paymentIntentId, type = 'final-design' } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'No payment intent ID provided' }, { status: 400 });
    }

    // Detect content type from data URL
    let contentType = 'image/png';
    let extension = 'png';

    if (image.startsWith('data:image/svg+xml')) {
      contentType = 'image/svg+xml';
      extension = 'svg';
    } else if (image.startsWith('data:image/jpeg') || image.startsWith('data:image/jpg')) {
      contentType = 'image/jpeg';
      extension = 'jpg';
    } else if (image.startsWith('data:image/gif')) {
      contentType = 'image/gif';
      extension = 'gif';
    } else if (image.startsWith('data:image/webp')) {
      contentType = 'image/webp';
      extension = 'webp';
    }

    // Remove the data URL prefix to get raw base64
    const base64Data = image.replace(/^data:image\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Use payment intent ID as folder name, type as filename
    const filename = `card-designs/${paymentIntentId}/${type}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
      token: process.env.BLOB_NEW_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
