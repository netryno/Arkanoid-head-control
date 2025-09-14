import { ref } from 'vue'

export async function useMediaPipe(videoEl, onFaceMove) {
  const ready = ref(false)
  const error = ref(null)

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error(`Script load failed: ${src}`))
      document.head.appendChild(script)
    })
  }

  // ⬅️ SIEMPRE devolvemos una Promesa que **rechaza** si algo falla
  try {
    // 1. Cargar librerías CDN
    if (!window.FaceMesh || !window.Camera) {
      await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js')
      ])
    }

    // 2. Verificar que existan
    if (!window.FaceMesh || !window.Camera) {
      throw new Error('MediaPipe libraries not found after loading CDN')
    }

    // 3. Crear FaceMesh
    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    })

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      selfieMode: false
    })

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks?.length) {
        //const nose = results.multiFaceLandmarks[0][1]
        //onFaceMove(nose.x)
        const nose = results.multiFaceLandmarks[0][1]
        const landmarks = results.multiFaceLandmarks[0]   // <-- todos los puntos
        onFaceMove(nose.x, landmarks)   

      }
    })

    // 4. Pedir cámara
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 600 }, height: { ideal: 480 }, frameRate: { ideal: 24, max: 30 } }
    })
    videoEl.srcObject = stream

    // 5. Arrancar cámara
    const camera = new window.Camera(videoEl, {
      onFrame: async () => {
        if (videoEl.readyState === 4) await faceMesh.send({ image: videoEl })
      },
      width: 600,
      height: 480
    })
    await camera.start()

    ready.value = true
    return { ready, error } // ✅ éxito
  } catch (err) {
    error.value = err.message || 'Camera / MediaPipe error'
    console.error('MediaPipe init failed:', err)
    throw Object.assign(new Error('Camera error'), { name: err.name || 'UnknownError' }) // ⬅️ rechazamos
  }
}