export default function decorate(block) {
  // block = .wheel-spin
 
  const container = block.closest('.wheel-spin-container');
 
  // Read config from table (AEM converts doc → HTML table)
  const rows = [...block.querySelectorAll(':scope > div')];
  const config = {};
 
  rows.forEach((row) => {
    const cols = row.querySelectorAll('div');
    const key = cols[0]?.textContent.trim();
    const value = cols[1]?.textContent.trim();
    if (key) config[key] = value;
  });
 
  // Extract segments
  const segments = Object.keys(config)
    .filter((k) => k.startsWith('segment-'))
    .map((k) => config[k]);
 
  const buttonText = config['button-text'] || 'Spin';
  const resultPrefix = config['result-prefix'] || 'You won';
  const storageType = config['storage-type'] || 'localStorage';
  const disableDuringSpin = config['disable-during-spin'] === 'true';
 
  // Clear existing content
  block.innerHTML = '';

  const pointer = document.createElement('div');
  wheel.className = 'pointer';
 
  // Create UI inside wrapper
  const wheel = document.createElement('div');
  wheel.className = 'wheel';
 
  const button = document.createElement('button');
  button.className = 'spin-btn';
  button.textContent = buttonText;
 
  const result = document.createElement('div');
  result.className = 'result';
 
  // Create slices
  segments.forEach((seg, i) => {
    const slice = document.createElement('div');
    slice.className = 'slice';
    slice.textContent = seg;
 
    const angle = (360 / segments.length) * i;
    slice.style.transform = `rotate(${angle}deg) skewY(${90 - (360 / segments.length)}deg)`;
 
    wheel.appendChild(slice);
  });
 
  // Append inside wrapper
  block.append(pointer, wheel, button, result);
 
  let spinning = false;
 
  let currentRotation = 0;
   
  button.addEventListener('click', () => {
    if (spinning) return;
   
    spinning = true;
   
    if (disableDuringSpin) {
      button.disabled = true;
    }
   
    const randomIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
   
    // Reset rotation to normalized value
    currentRotation = currentRotation % 360;
   
    // Force instant reset (no animation)
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${currentRotation}deg)`;
   
    // Force reflow (important trick)
    wheel.offsetHeight;
   
    // Now apply new spin
    const extraSpins = 5 * 360;
    const targetRotation =
      extraSpins + (360 - randomIndex * segmentAngle - segmentAngle / 2);
   
    currentRotation += targetRotation;
   
    wheel.style.transition = 'transform 3s ease-out';
    wheel.style.transform = `rotate(${currentRotation}deg)`;
   
    setTimeout(() => {
      const selected = segments[randomIndex];
   
      result.textContent = `${resultPrefix}: ${selected}`;
   
      // Store result
      if (storageType === 'localStorage') {
        localStorage.setItem('wheel-result', selected);
      } else {
        sessionStorage.setItem('wheel-result', selected);
      }
   
      spinning = false;
      button.disabled = false;
    }, 3000);
  });
}
