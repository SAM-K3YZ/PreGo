import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ensurePermission } from '@/services/permissions';
import type { PickedFile } from '@/types';

const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.8,
  exif: false, // don't read photo metadata (it can include location)
};

const toPickedFile = (result: ImagePicker.ImagePickerResult): PickedFile | null => {
  const asset = result.canceled ? undefined : result.assets[0];
  return asset ? { uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg', name: asset.fileName ?? undefined } : null;
};

export async function takePhoto(): Promise<PickedFile | null> {
  if (!(await ensurePermission('camera'))) return null;
  return toPickedFile(await ImagePicker.launchCameraAsync(IMAGE_OPTIONS));
}

// Uses the system photo picker, which needs no library permission: the user
// only shares the photo they choose.
export async function choosePhoto(): Promise<PickedFile | null> {
  return toPickedFile(await ImagePicker.launchImageLibraryAsync(IMAGE_OPTIONS));
}

// System file picker; no permission needed.
export async function choosePdf(): Promise<PickedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  });
  const asset = result.canceled ? undefined : result.assets[0];
  return asset ? { uri: asset.uri, mimeType: 'application/pdf', name: asset.name } : null;
}
