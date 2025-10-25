export type PermissionType = 'camera' | 'notifications' | 'location' | 'gallery';

export interface PermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export class PermissionsManager {
  private static instance: PermissionsManager;

  private constructor() {}

  static getInstance(): PermissionsManager {
    if (!PermissionsManager.instance) {
      PermissionsManager.instance = new PermissionsManager();
    }
    return PermissionsManager.instance;
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        return false;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: { ideal: 'environment' }
          }
        });
      } catch (error) {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
      }
      
      this.stopCameraStream(stream);
      
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.error('Notifications not supported');
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          resolve(true);
        },
        (error) => {
          console.error('Location permission denied:', error);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  requestGalleryAccess(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.capture = 'environment';
    return input;
  }

  async getCameraStream(facingMode: 'user' | 'environment' = 'user'): Promise<MediaStream | null> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        return null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      } catch (error) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      }

      return stream;
    } catch (error) {
      console.error('Failed to get camera stream:', error);
      return null;
    }
  }

  async getCurrentLocation(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          console.error('Failed to get location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  async checkCameraPermission(): Promise<PermissionStatus> {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        return {
          granted: result.state === 'granted',
          denied: result.state === 'denied',
          prompt: result.state === 'prompt'
        };
      }
      
      return { granted: false, denied: false, prompt: true };
    } catch (error) {
      return { granted: false, denied: false, prompt: true };
    }
  }

  async checkNotificationPermission(): Promise<PermissionStatus> {
    if (!('Notification' in window)) {
      return { granted: false, denied: true, prompt: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      prompt: permission === 'default'
    };
  }

  async checkLocationPermission(): Promise<PermissionStatus> {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return {
          granted: result.state === 'granted',
          denied: result.state === 'denied',
          prompt: result.state === 'prompt'
        };
      }
      
      return { granted: false, denied: false, prompt: true };
    } catch (error) {
      return { granted: false, denied: false, prompt: true };
    }
  }

  async requestAllPermissions(): Promise<{
    camera: boolean;
    notifications: boolean;
    location: boolean;
  }> {
    const [camera, notifications, location] = await Promise.all([
      this.requestCameraPermission(),
      this.requestNotificationPermission(),
      this.requestLocationPermission()
    ]);

    return { camera, notifications, location };
  }

  checkGallerySupport(): PermissionStatus {
    const isSupported = 'FileReader' in window && 'File' in window;
    return {
      granted: isSupported,
      denied: !isSupported,
      prompt: false
    };
  }

  async checkAllPermissions(): Promise<{
    camera: PermissionStatus;
    notifications: PermissionStatus;
    location: PermissionStatus;
    gallery: PermissionStatus;
  }> {
    const [camera, notifications, location] = await Promise.all([
      this.checkCameraPermission(),
      this.checkNotificationPermission(),
      this.checkLocationPermission()
    ]);

    const gallery = this.checkGallerySupport();

    return { camera, notifications, location, gallery };
  }

  stopCameraStream(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  async takePicture(facingMode: 'user' | 'environment' = 'environment'): Promise<Blob | null> {
    let stream: MediaStream | null = null;
    let video: HTMLVideoElement | null = null;
    
    try {
      stream = await this.getCameraStream(facingMode);
      if (!stream) {
        return null;
      }

      video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      try {
        await video.play();
      } catch (playError) {
        console.warn('Autoplay blocked, attempting manual play:', playError);
      }

      await new Promise((resolve) => {
        video!.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.cleanup(stream, video);
        return null;
      }

      ctx.drawImage(video, 0, 0);

      this.cleanup(stream, video);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (error) {
      console.error('Failed to take picture:', error);
      if (stream) this.cleanup(stream, video);
      return null;
    }
  }

  private cleanup(stream: MediaStream, video: HTMLVideoElement | null) {
    this.stopCameraStream(stream);
    if (video) {
      video.srcObject = null;
      video.remove();
    }
  }

  async selectFromGallery(options?: {
    accept?: string;
    multiple?: boolean;
  }): Promise<File[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options?.accept || 'image/*,video/*';
      input.multiple = options?.multiple ?? true;

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files || []);
        resolve(files);
      };

      input.oncancel = () => {
        resolve([]);
      };

      input.click();
    });
  }
}

export const permissionsManager = PermissionsManager.getInstance();

export async function requestCameraAccess(): Promise<boolean> {
  return permissionsManager.requestCameraPermission();
}

export async function requestLocationAccess(): Promise<boolean> {
  return permissionsManager.requestLocationPermission();
}

export async function requestNotificationAccess(): Promise<boolean> {
  return permissionsManager.requestNotificationPermission();
}

export async function getCurrentUserLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const position = await permissionsManager.getCurrentLocation();
  if (!position) {
    return null;
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
}

export async function capturePhoto(facingMode: 'user' | 'environment' = 'environment'): Promise<Blob | null> {
  return permissionsManager.takePicture(facingMode);
}

export async function selectPhotosFromGallery(multiple: boolean = true): Promise<File[]> {
  return permissionsManager.selectFromGallery({
    accept: 'image/*',
    multiple
  });
}
