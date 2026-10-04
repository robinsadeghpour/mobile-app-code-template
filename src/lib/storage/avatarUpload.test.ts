import { uploadAvatar } from './avatarUpload';
import { type PickedImage } from './pickImage';

const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();

jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: (bucket: string) => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl, bucket }),
    },
  },
}));

jest.mock('base64-arraybuffer', () => ({ decode: (value: string) => `decoded:${value}` }));

const IMAGE: PickedImage = { localUri: 'file:///tmp/a.jpg', mediaType: 'image/jpeg', base64: 'AAA' };
const PUBLIC_URL = 'https://project.supabase.co/storage/v1/object/public/avatars/avatars/user-1.jpg';

describe('uploadAvatar', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: PUBLIC_URL } });
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('writes one object per user, at the path the storage policy matches', async () => {
    await uploadAvatar(IMAGE, 'user-1');

    expect(mockUpload).toHaveBeenCalledWith('avatars/user-1.jpg', 'decoded:AAA', {
      contentType: 'image/jpeg',
      upsert: true,
    });
    expect(mockGetPublicUrl).toHaveBeenCalledWith('avatars/user-1.jpg');
  });

  it('returns a public URL a client cannot serve from its cache', async () => {
    const { publicUrl } = await uploadAvatar(IMAGE, 'user-1');

    expect(publicUrl).toMatch(new RegExp(`^${PUBLIC_URL}\\?t=\\d+$`));
  });

  it('throws the storage error rather than returning a URL to nothing', async () => {
    const error = new Error('quota exceeded');
    mockUpload.mockResolvedValue({ error });

    await expect(uploadAvatar(IMAGE, 'user-1')).rejects.toThrow(error);
    expect(mockGetPublicUrl).not.toHaveBeenCalled();
  });
});
