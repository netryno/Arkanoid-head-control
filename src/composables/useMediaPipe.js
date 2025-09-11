import { ref, onUnmounted } from 'vue'
import { Camera } from '@mediapipe/camera_utils'
import { FaceMesh } from '@mediapipe/face_mesh'

export function useMediaPipe(videoEl, onFaceMove) {
  const ready = ref(false)

  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
  })

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  })

  faceMesh.onResults((results) => {
    if (results.multiFaceLandmarks.length) {
      const nose = results.multiFaceLandmarks[0][1]
      onFaceMove(nose.x)
    }
  })

  // ------  conecta cámara al video  ------
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoEl.srcObject = stream
      const camera = new Camera(videoEl, {
        onFrame: async () => await faceMesh.send({ image: videoEl }),
        width: 640,
        height: 480
      })
      return camera.start()
    })
    .then(() => (ready.value = true))
    .catch((e) => console.error('Failed to acquire camera feed:', e))

  onUnmounted(() => {
    const stream = videoEl.srcObject
    if (stream) stream.getTracks().forEach(t => t.stop())
  })

  return { ready }
}