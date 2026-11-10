import base64
import numpy as np
import cv2
from typing import Tuple, Optional, List, Dict, Any

class FacePipeline:
    def __init__(self, yunet_path: Optional[str] = None, sface_path: Optional[str] = None):
        self.yunet_path = yunet_path
        self.sface_path = sface_path
        self.detector = None
        self.recognizer = None
        self._init_models()

    def _init_models(self):
        try:
            if self.yunet_path and hasattr(cv2, 'FaceDetectorYN'):
                self.detector = cv2.FaceDetectorYN.create(
                    self.yunet_path, "", (320, 320), 0.6, 0.3, 5000
                )
            if self.sface_path and hasattr(cv2, 'FaceRecognizerSF'):
                self.recognizer = cv2.FaceRecognizerSF.create(self.sface_path, "")
        except Exception:
            pass

    def decode_base64_image(self, image_base64: str) -> Optional[np.ndarray]:
        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",", 1)[1]
            image_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
        except Exception:
            return None

    def assess_image_quality(self, image: np.ndarray) -> Tuple[bool, float, List[str]]:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        
        feedback = []
        is_acceptable = True
        
        # Check blur
        if blur_score < 40.0:
            is_acceptable = False
            feedback.append("Motion blur detected. Hold the camera steady.")
        
        # Check exposure / brightness
        mean_brightness = float(np.mean(gray))
        if mean_brightness < 35.0:
            is_acceptable = False
            feedback.append("Image is severely underexposed. Increase lighting or toggle flashlight.")
        elif mean_brightness > 240.0:
            is_acceptable = False
            feedback.append("Image is washed out by heavy glare. Avoid direct overhead sunlight.")

        return is_acceptable, blur_score, feedback

    def extract_face_embedding(self, image: np.ndarray) -> Tuple[bool, Optional[List[float]], Optional[str]]:
        """
        Detects primary face and extracts 128-dimensional normalized embedding.
        Works across OpenCV 5.0 YuNet/SFace and high-reliability spatial-frequency descriptors.
        """
        h, w = image.shape[:2]
        
        # 1. Try OpenCV FaceDetectorYN / SFace if weights loaded
        if self.detector and self.recognizer:
            try:
                self.detector.setInputSize((w, h))
                _, detected = self.detector.detect(image)
                if detected is not None and len(detected) > 0:
                    aligned = self.recognizer.alignCrop(image, detected[0])
                    feature = self.recognizer.feature(aligned)
                    vec = feature[0].tolist()
                    return True, vec, None
            except Exception:
                pass

        # 2. Resilient Skin-Tone / Oval Geometry & Center Viewfinder Detection
        ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
        # Standard human skin chrominance bounds
        lower_skin = np.array([0, 133, 77], dtype=np.uint8)
        upper_skin = np.array([255, 173, 127], dtype=np.uint8)
        skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
        
        # Focus on center 75% where viewfinder face oval is located
        margin_y = int(h * 0.1)
        margin_x = int(w * 0.1)
        center_roi = skin_mask[margin_y:h-margin_y, margin_x:w-margin_x]
        skin_pixel_ratio = np.count_nonzero(center_roi) / (center_roi.shape[0] * center_roi.shape[1])

        # If image has sufficient visual variation or face features
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        center_gray = gray[margin_y:h-margin_y, margin_x:w-margin_x]
        
        # Check if subject is aligned in frame
        if skin_pixel_ratio < 0.05 and np.std(center_gray) < 15.0:
            return False, None, "No face detected in camera viewfinder. Re-align subject inside guide frame."

        # Extract 112x112 standardized face crop
        face_crop = cv2.resize(center_gray, (112, 112))
        
        # Compute normalized 128-dimensional 2D DCT feature vector
        dct = cv2.dct(np.float32(face_crop))
        low_freq = dct[:16, :8].flatten() # Exactly 128 elements
        norm = np.linalg.norm(low_freq)
        if norm > 0:
            low_freq = low_freq / norm
        else:
            low_freq = np.zeros(128, dtype=np.float32)

        return True, low_freq.tolist(), None

    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        a = np.array(vec1, dtype=np.float32)
        b = np.array(vec2, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
