/**
 * Golden Hour Medical Synthesizer
 * Gemini Interoperability Mockup and Main Logic
 */

// DOM Elements
const els = {
  themeToggle: document.getElementById('themeToggle'),
  sceneUpload: document.getElementById('sceneVideoUpload'),
  recordsUpload: document.getElementById('recordsUpload'),
  introSection: document.getElementById('introSection'),
  processingSection: document.getElementById('processingSection'),
  reportSection: document.getElementById('reportSection'),
  mediaPreview: document.getElementById('mediaPreview'),
  overlayData: document.getElementById('overlayData'),
  announcer: document.getElementById('ariaAnnouncer'),
  
  // Report Nodes
  medicalDataGrid: document.getElementById('medicalDataGrid'),
  traumaList: document.getElementById('traumaList'),
  firstAidSteps: document.getElementById('firstAidSteps'),
  playVoiceBtn: document.getElementById('playVoiceBtn'),
  sendReportBtn: document.getElementById('sendReportBtn')
};

// Theme Toggle Logic
els.themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = newTheme;
  speak(`Switched to ${newTheme} mode.`);
});

// A11y Announcer (for screen readers)
function announce(msg) {
  els.announcer.textContent = '';
  setTimeout(() => { els.announcer.textContent = msg; }, 50);
}

// Simulated Input Handlers
els.sceneUpload.addEventListener('change', (e) => handleUpload(e, 'scene'));
els.recordsUpload.addEventListener('change', (e) => handleUpload(e, 'records'));

function handleUpload(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  // Use ObjectURL to mock the preview
  els.mediaPreview.src = URL.createObjectURL(file);
  
  // Transition UI
  els.introSection.classList.add('hidden');
  els.introSection.setAttribute('aria-hidden', 'true');
  els.processingSection.classList.remove('hidden');
  els.processingSection.setAttribute('aria-hidden', 'false');
  
  announce(`Uploaded ${type === 'scene' ? 'scene video' : 'medical record'}. Gemini Multimodal Analysis beginning now.`);

  // Simulate Gemini Processing Pipeline
  simulateGeminiProcessing(type);
}

/**
 * MOCK: Gemini Multimodal Analysis
 * This mimics streaming output from a Vertex AI or Gemini Pro Vision call.
 */
function simulateGeminiProcessing(type) {
  // Clear any old data
  els.overlayData.innerHTML = '';
  
  const mockDetections = type === 'scene' 
    ? ['Detecting limbs...', 'Analyzing bleeding extent (Heavy)', 'Checking responsiveness...', 'Synthesizing trauma vectors']
    : ['Scanning handwritten text...', 'Cross-referencing Rx databases...', 'Extracting allergies...', 'Validating structured fields'];
  
  let delay = 0;
  mockDetections.forEach((text, i) => {
    setTimeout(() => {
      const badge = document.createElement('span');
      badge.className = 'data-badge';
      badge.textContent = text;
      els.overlayData.appendChild(badge);
    }, delay += 1000);
  });

  // Final Synthesis after 4 seconds
  setTimeout(() => {
    generateStructuredReport(type);
  }, delay + 1200);
}

function generateStructuredReport(type) {
  // Hide processing, show report
  els.processingSection.classList.add('hidden');
  els.processingSection.setAttribute('aria-hidden', 'true');
  els.reportSection.classList.remove('hidden');
  els.reportSection.setAttribute('aria-hidden', 'false');
  
  const reportData = getMockData(type);
  
  // Populate Medical Data
  els.medicalDataGrid.innerHTML = reportData.medical.map(item => `
    <div class="data-item">
      <span class="data-label">${item.label}</span>
      <span class="data-val">${item.value}</span>
    </div>
  `).join('');

  // Populate Trauma Assessment
  els.traumaList.innerHTML = reportData.trauma.map(item => `
    <li>
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="flex-shrink:0; margin-top:3px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>${item}</span>
    </li>
  `).join('');

  // Populate First Aid Steps
  els.firstAidSteps.innerHTML = reportData.firstAid.map((step, i) => `
    <div class="step-item" id="step-${i}">
      <div class="step-number">${i+1}</div>
      <div class="step-content">
        <p>${step}</p>
      </div>
    </div>
  `).join('');

  announce("Analysis complete. Digtal Triage Report generated. Voice-guided first aid is available.");

  // Voice playback setup
  els.playVoiceBtn.onclick = () => playVoiceGuidance(reportData.firstAid);
  
  els.sendReportBtn.onclick = () => {
    els.sendReportBtn.textContent = 'Transmitting...';
    setTimeout(() => {
      els.sendReportBtn.textContent = 'Data Received by Hospital Network';
      els.sendReportBtn.style.background = 'hsl(var(--hsl-success))';
      announce('Triage report successfully sent to the approaching ambulance and nearest hospital.');
    }, 1500);
  };
}

// TTS Setup
let currentUtterance = null;
function speak(text, onEndCallback) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;
  
  if (onEndCallback) currentUtterance.onend = onEndCallback;
  
  window.speechSynthesis.speak(currentUtterance);
}

function playVoiceGuidance(steps) {
  let stepIndex = 0;
  els.playVoiceBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
  els.playVoiceBtn.setAttribute('aria-label', 'Pause Voice Guidance');
  
  els.playVoiceBtn.onclick = () => {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.step-item').forEach(el => el.classList.remove('active'));
    // reset button
    els.playVoiceBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    els.playVoiceBtn.onclick = () => playVoiceGuidance(steps);
  };

  function playNextStep() {
    if (stepIndex >= steps.length) {
      els.playVoiceBtn.onclick(); // trigger reset
      return;
    }
    
    // Highlight step
    document.querySelectorAll('.step-item').forEach((el, i) => {
      el.classList.toggle('active', i === stepIndex);
    });
    // Scroll into view
    document.getElementById(`step-${stepIndex}`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    speak(steps[stepIndex], () => {
      stepIndex++;
      setTimeout(playNextStep, 800); // pause between steps
    });
  }
  
  speak("Starting Voice Guided First Aid Protocol. Please listen carefully.", () => {
      setTimeout(playNextStep, 500);
  });
}

function getMockData(type) {
  if (type === 'scene') {
    return {
      medical: [
        { label: 'Patient Age (Est.)', value: '25 - 35 yrs' },
        { label: 'Blood Type', value: 'Unknown - Require O-' },
        { label: 'Consciousness', value: 'Lethargic / Declining' },
        { label: 'Pulse Check', value: 'Rapid, Weak' }
      ],
      trauma: [
        'Heavy arterial bleeding noted on lower right extremity (femoral area).',
        'Shallow, irregular breathing pattern detected.',
        'Possible fracture on left wrist.'
      ],
      firstAid: [
        'Focus on the heavy bleeding on the right leg. Find a clean cloth or shirt immediately.',
        'Apply firm, direct pressure directly over the bleeding wound. Do not let go.',
        'If the bleeding does not slow after 2 minutes, you will need to apply a tourniquet high and tight above the wound.',
        'Keep talking to the person to monitor their consciousness. Tell them help is on the way.'
      ]
    };
  } else {
    // Medical Records photo
    return {
      medical: [
        { label: 'Blood Type', value: 'AB Negative' },
        { label: 'Allergies', value: 'Penicillin (Severe), Latex' },
        { label: 'Current Meds', value: 'Lisinopril 10mg, Metformin' },
        { label: 'Prior Conditions', value: 'Type 2 Diabetes, Hypertension' }
      ],
      trauma: [
        'Risk Alert: Patient on BP medication. Monitor for shock if trauma is present.',
        'Allergy Alert: Ensure EMS avoids Penicillin-class antibiotics.',
        'No active visual trauma provided. Correlating records for incoming patient ID #823-11.'
      ],
      firstAid: [
        'Records successfully verified and matched to patient identity.',
        'Ensure the person is lying down and elevate their legs if they appear pale.',
        'Do not give them anything to eat or drink.',
        'Inform arriving EMS immediately about the Penicillin allergy.'
      ]
    };
  }
}
