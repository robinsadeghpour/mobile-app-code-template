import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const JPEG_QUALITY = 0.7;

export type PickedImage = {
  localUri: string;
  mediaType: string;
  base64: string;
};

export type PickImageOptions = {
  maxLongEdge: number;
  square?: boolean;
};

export async function pickImage(source: 'library' | 'camera', options: PickImageOptions): Promise<PickedImage | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const crop = options.square ? { allowsEditing: true, aspect: [1, 1] as [number, number] } : {};
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 1, ...crop })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1, ...crop });
  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const isLandscape = asset.width >= asset.height;
  const longEdge = Math.min(Math.max(asset.width, asset.height), options.maxLongEdge);
  const rendered = await ImageManipulator.manipulate(asset.uri)
    .resize({
      width: isLandscape ? longEdge : undefined,
      height: isLandscape ? undefined : longEdge,
    })
    .renderAsync();
  const manipulated = await rendered.saveAsync({
    compress: JPEG_QUALITY,
    format: SaveFormat.JPEG,
    base64: true,
  });
  if (!manipulated.base64) throw new Error('Image manipulation did not return base64 data');

  return { localUri: manipulated.uri, mediaType: 'image/jpeg', base64: manipulated.base64 };
}
