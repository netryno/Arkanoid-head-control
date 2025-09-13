import { ref } from 'vue'
import { Camera } from '@mediapipe/camera_utils'
import { FaceMesh } from '@mediapipe/face_mesh'

export function useMediaPipe(videoEl, onFaceMove) {
  const ready = ref(false)

  const init = async () => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        new URL(`../../node_modules/@mediapipe/face_mesh/${file}`, import.meta.url).href
    })

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      // Configuraciones adicionales para optimizar
      selfieMode: false,
      enableFaceGeometry: false
    })

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks.length) {
        const nose = results.multiFaceLandmarks[0][1]
        onFaceMove(nose.x)
      }
    })

    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoEl.srcObject = stream

    const camera = new Camera(videoEl, {
      onFrame: async () => {
        try {
          await faceMesh.send({ image: videoEl })
        } catch (error) {
          // Manejar errores silenciosamente si no son críticos
          if (!error.message.includes('WebGL')) {
            console.error('MediaPipe error:', error)
          }
        }
      },
      width: 600,
      height: 480
    })


    await camera.start()
    ready.value = true
  }

  init().catch((e) => console.error('Failed to start camera / FaceMesh:', e))
  return { ready }
}