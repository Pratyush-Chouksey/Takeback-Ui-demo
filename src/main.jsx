import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Generate 100x100 transparent noise PNG tile
const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
const ctx = canvas.getContext('2d');
if (ctx) {
  const imgData = ctx.createImageData(100, 100);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    imgData.data[i] = val;     // R
    imgData.data[i + 1] = val; // G
    imgData.data[i + 2] = val; // B
    imgData.data[i + 3] = 255; // A (Opacity handled by CSS layer to allow custom tuning)
  }
  ctx.putImageData(imgData, 0, 0);
  const noiseUrl = canvas.toDataURL('image/png');
  document.documentElement.style.setProperty('--noise-url', `url(${noiseUrl})`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
