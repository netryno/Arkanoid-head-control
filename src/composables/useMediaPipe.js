import { ref } from 'vue'

export function useMediaPipe(videoEl, onFaceMove) {
  const ready = ref(false)
  const error = ref(null)

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const init = async () => {
    try {
      // Cargar MediaPipe desde CDN para evitar problemas de bundling
      console.log('cargando libreria ia')
      if (!window.FaceMesh) {
        await Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js')
        ])
      }

      // Verificar que las librerías se cargaron
      if (!window.FaceMesh || !window.Camera) {
        throw new Error('MediaPipe libraries failed to load from CDN')
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        selfieMode: false
      })

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const nose = results.multiFaceLandmarks[0][1]
          onFaceMove(nose.x)
        }
      })

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 600 }, 
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 30 }
        } 
      })
      
      videoEl.srcObject = stream

      const camera = new window.Camera(videoEl, {
        onFrame: async () => {
          if (videoEl.readyState === 4) {
            await faceMesh.send({ image: videoEl })
          }
        },
        width: 600,
        height: 480
      })
      
      await camera.start()
      ready.value = true

    } catch (err) {
      error.value = err.message
      console.error('MediaPipe initialization failed:', err)
    }
  }

  init()
  return { ready, error }
}