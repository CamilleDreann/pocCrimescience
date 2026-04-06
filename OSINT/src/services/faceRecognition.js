import * as faceapi from "face-api.js";

const MODEL_URL = "/models";
const REFERENCE_URL = "/references/target.png";
const MATCH_THRESHOLD = 0.6;

let modelsLoaded = false;
let refDescriptor = null;
let loadingPromise = null;

export async function initFaceRecognition() {
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    try {
      if (!modelsLoaded) {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        modelsLoaded = true;
      }
      if (!refDescriptor) {
        const img = await faceapi.fetchImage(REFERENCE_URL);
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (!detection)
          throw new Error("Aucun visage détecté dans l'image de référence");
        refDescriptor = detection.descriptor;
      }
    } catch (err) {
      loadingPromise = null;
      throw err;
    }
  })();
  return loadingPromise;
}

export async function checkFaceInImage(imageSource) {
  if (!refDescriptor) throw new Error("Face recognition non initialisée");

  const img = await faceapi.fetchImage(imageSource);
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) return { found: false, reason: "no_face" };

  const matcher = new faceapi.FaceMatcher(
    [new faceapi.LabeledFaceDescriptors("target", [refDescriptor])],
    MATCH_THRESHOLD,
  );

  for (const det of detections) {
    const match = matcher.findBestMatch(det.descriptor);
    if (match.label === "target") {
      return { found: true, distance: match.distance };
    }
  }

  return { found: false, reason: "no_match" };
}

export async function checkGraphForTarget(nodes) {
  const imageValues = nodes
    .filter((n) => n.type === "custom")
    .flatMap((n) =>
      (n.data?.contents || []).filter((c) => c.type === "image" && c.value),
    )
    .map((c) => c.value);

  if (imageValues.length === 0) return { found: false, reason: "no_images" };

  for (const dataUrl of imageValues) {
    const result = await checkFaceInImage(dataUrl);
    if (result.found) return result;
  }

  return { found: false, reason: "no_match" };
}
