import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/logger';
import { type PickedImage } from '@/lib/storage/pickImage';
import { AVATAR_BUCKET, AVATAR_PREFIX_IN_BUCKET } from '@/lib/storage/avatarConstants';

export type { PickedImage };

export type UploadedAvatar = {
  publicUrl: string;
};

// The path never changes, so the returned URL carries a cache-buster or every client renders the file it cached.
export async function uploadAvatar(image: PickedImage, userId: string): Promise<UploadedAvatar> {
  // Must match the avatars storage policy, `avatars/{auth.uid()}.<ext>`; pickImage always re-encodes as JPEG.
  const path = `${AVATAR_PREFIX_IN_BUCKET}/${userId}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, decode(image.base64), { contentType: image.mediaType, upsert: true });
  if (uploadError) {
    logError('uploadAvatar: upload failed', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return { publicUrl: `${data.publicUrl}?t=${Date.now()}` };
}
