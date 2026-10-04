import { pickImage } from './pickImage';

type PermissionResponse = { granted: boolean };
type PickerAsset = { uri: string; width: number; height: number; base64?: string };
type PickerResult = { canceled: boolean; assets: PickerAsset[] };
type PickerOptions = {
  quality: number;
  mediaTypes?: string[];
  allowsEditing?: boolean;
  aspect?: [number, number];
};
type ResizeOptions = { width?: number; height?: number };
type SaveOptions = { compress: number; format: string; base64: boolean };
type SavedImage = { uri: string; base64: string | null };
type ManipulationContext = {
  resize: jest.Mock<ManipulationContext, [ResizeOptions]>;
  renderAsync: jest.Mock<Promise<{ saveAsync: jest.Mock<Promise<SavedImage>, [SaveOptions]> }>, []>;
};

type PickerModule = {
  requestCameraPermissionsAsync: jest.Mock<Promise<PermissionResponse>, []>;
  requestMediaLibraryPermissionsAsync: jest.Mock<Promise<PermissionResponse>, []>;
  launchCameraAsync: jest.Mock<Promise<PickerResult>, [PickerOptions]>;
  launchImageLibraryAsync: jest.Mock<Promise<PickerResult>, [PickerOptions]>;
};

type ManipulatorModule = {
  ImageManipulator: { manipulate: jest.Mock<ManipulationContext, [string]> };
  SaveFormat: { JPEG: string };
};

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-image-manipulator', () => ({
  ImageManipulator: { manipulate: jest.fn() },
  SaveFormat: { JPEG: 'jpeg' },
}));

const picker = jest.requireMock<PickerModule>('expo-image-picker');
const manipulator = jest.requireMock<ManipulatorModule>('expo-image-manipulator');

const resize = jest.fn<ManipulationContext, [ResizeOptions]>();
const renderAsync = jest.fn<Promise<{ saveAsync: typeof saveAsync }>, []>();
const saveAsync = jest.fn<Promise<SavedImage>, [SaveOptions]>();

const ORIGINAL_URI = 'file:///tmp/IMG_0001.HEIC';
const ORIGINAL_BASE64 = 'original-base64';
const RESIZED_URI = 'file:///tmp/resized.jpg';
const RESIZED_BASE64 = 'resized-base64';

function pickedAsset(width: number, height: number): PickerResult {
  return {
    canceled: false,
    assets: [{ uri: ORIGINAL_URI, width, height, base64: ORIGINAL_BASE64 }],
  };
}

describe('pickImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const context: ManipulationContext = { resize, renderAsync };
    manipulator.ImageManipulator.manipulate.mockReturnValue(context);
    resize.mockReturnValue(context);
    renderAsync.mockResolvedValue({ saveAsync });
    saveAsync.mockResolvedValue({ uri: RESIZED_URI, base64: RESIZED_BASE64 });

    picker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });
    picker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    picker.launchCameraAsync.mockResolvedValue(pickedAsset(4000, 3000));
    picker.launchImageLibraryAsync.mockResolvedValue(pickedAsset(4000, 3000));
  });

  it('caps a landscape asset by width, leaving height free', async () => {
    picker.launchImageLibraryAsync.mockResolvedValue(pickedAsset(4000, 3000));

    await pickImage('library', { maxLongEdge: 1024 });

    expect(resize).toHaveBeenCalledWith({ width: 1024, height: undefined });
  });

  it('caps a portrait asset by height, leaving width free', async () => {
    picker.launchImageLibraryAsync.mockResolvedValue(pickedAsset(3000, 4000));

    await pickImage('library', { maxLongEdge: 1024 });

    expect(resize).toHaveBeenCalledWith({ width: undefined, height: 1024 });
  });

  it('leaves a landscape asset already under the cap at its own width', async () => {
    picker.launchImageLibraryAsync.mockResolvedValue(pickedAsset(800, 600));

    await pickImage('library', { maxLongEdge: 1024 });

    expect(resize).toHaveBeenCalledWith({ width: 800, height: undefined });
  });

  it('leaves a portrait asset already under the cap at its own height', async () => {
    picker.launchImageLibraryAsync.mockResolvedValue(pickedAsset(600, 800));

    await pickImage('library', { maxLongEdge: 1024 });

    expect(resize).toHaveBeenCalledWith({ width: undefined, height: 800 });
  });

  it('opens the crop UI locked to 1:1 when square is requested', async () => {
    await pickImage('library', { maxLongEdge: 512, square: true });

    expect(picker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
  });

  it('leaves the crop UI out when square is omitted', async () => {
    await pickImage('library', { maxLongEdge: 512 });

    expect(picker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ['images'],
      quality: 1,
    });
  });

  it('returns null without opening the picker when permission is denied', async () => {
    picker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

    await expect(pickImage('library', { maxLongEdge: 1024 })).resolves.toBeNull();

    expect(picker.launchImageLibraryAsync).not.toHaveBeenCalled();
  });

  it('returns null when the pick is cancelled', async () => {
    picker.launchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });

    await expect(pickImage('library', { maxLongEdge: 1024 })).resolves.toBeNull();

    expect(manipulator.ImageManipulator.manipulate).not.toHaveBeenCalled();
  });

  it('describes the manipulated JPEG, not the asset the picker returned', async () => {
    const picked = await pickImage('library', { maxLongEdge: 1024 });

    expect(picked).toEqual({
      localUri: RESIZED_URI,
      mediaType: 'image/jpeg',
      base64: RESIZED_BASE64,
    });
    expect(manipulator.ImageManipulator.manipulate).toHaveBeenCalledWith(ORIGINAL_URI);
    expect(saveAsync).toHaveBeenCalledWith({
      compress: 0.7,
      format: manipulator.SaveFormat.JPEG,
      base64: true,
    });
  });

  it('asks for the camera permission and launches the camera for the camera source', async () => {
    await pickImage('camera', { maxLongEdge: 1024 });

    expect(picker.requestCameraPermissionsAsync).toHaveBeenCalled();
    expect(picker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
    expect(picker.launchCameraAsync).toHaveBeenCalledWith({ quality: 1 });
    expect(picker.launchImageLibraryAsync).not.toHaveBeenCalled();
  });
});
