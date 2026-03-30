export default function decorate(block) {
  // Read config from table
  const rows = [...block.children];
  const config = {};
 
  rows.forEach((row) => {
    const key = row.children[0]?.textContent.trim();
    const value = row.children[1]?.textContent.trim();
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
 
  // Clear block
  block.innerHTML = '';
 
  // Create UI
  const wheel = document.createElement('div');
  wheel.className = 'wheel';
 
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.className = 'spin-btn';
 
  const result = document.createElement('div');
  result.className = 'result';
 
  // Create segments visually
  segments.forEach((seg, i) => {
    const slice = document.createElement('div');
    slice.className = 'slice';
    slice.textContent = seg;
    slice.style.transform = `rotate(${(360 / segments.length) * i}deg)`;
    wheel.appendChild(slice);
  });
 
  block.append(wheel, button, result);
 
  let spinning = false;
 
  button.addEventListener('click', () => {
    if (spinning) return;
 
    spinning = true;
 
    if (disableDuringSpin) {
      button.disabled = true;
    }
 
    const randomIndex = Math.floor(Math.random() * segments.length);
 
    const rotationPerSegment = 360 / segments.length;
    const finalRotation =
      360 * 5 + (360 - randomIndex * rotationPerSegment); // 5 spins + stop
 
    wheel.style.transition = 'transform 3s ease-out';
    wheel.style.transform = `rotate(${finalRotation}deg)`;
 
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
