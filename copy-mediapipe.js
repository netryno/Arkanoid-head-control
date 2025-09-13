import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Rutas
const mediapipeSource = path.join(__dirname, 'node_modules/@mediapipe/face_mesh')
const distAssetsPath = path.join(__dirname, 'dist/assets')

// Archivos necesarios de MediaPipe
const filesToCopy = [
  'face_mesh_solution_simd_wasm_bin.js',
  'face_mesh_solution_simd_wasm_bin.wasm',
  'face_mesh_solution_packed_assets.data'
]

// Crear directorio si no existe
if (!fs.existsSync(distAssetsPath)) {
  fs.mkdirSync(distAssetsPath, { recursive: true })
}

// Copiar archivos
filesToCopy.forEach(file => {
  const srcPath = path.join(mediapipeSource, file)
  const destPath = path.join(distAssetsPath, file)
  
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`✅ Copiado: ${file}`)
    } else {
      console.log(`⚠️  No encontrado: ${file}`)
    }
  } catch (error) {
    console.error(`❌ Error copiando ${file}:`, error.message)
  }
})

console.log('🎉 Archivos MediaPipe copiados a dist/assets/')