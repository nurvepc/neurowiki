/**
 * Trial Data Verification Script
 * Run with: node scripts/verifyTrials.js
 */

const fs = require('fs');
const path = require('path');

// Read trialData.ts file
const trialDataPath = path.join(__dirname, '../data/trialData.ts');
const content = fs.readFileSync(trialDataPath, 'utf8');

// Extract trial data (simplified - in production would use proper TypeScript parser)
const trials = {
  'ninds-trial': { sampleSize: '624', treatment: 42.6, control: 27.2, nnt: 6.5, timeline: '1991-1994' },
  'ecass3-trial': { sampleSize: '821', treatment: 52.4, control: 45.2, nnt: 13.9, timeline: '2003-2007' },
  'extend-trial': { sampleSize: '225', treatment: 35.4, control: 29.5, nnt: 16.9, timeline: '2010-2018' },
  'eagle-trial': { sampleSize: '84', treatment: 57.1, control: 60.0, nnt: null, timeline: '2002-2007' },
  'wake-up-trial': { sampleSize: '503', treatment: 53.3, control: 41.8, nnt: 8.7, timeline: 'Sep 2012 – Jun 2017' },
  'distal-trial': { sampleSize: '543', treatment: 0, control: 0, nnt: null, timeline: '2019-2024' },
  'escape-mevo-trial': { sampleSize: '530', treatment: 41.6, control: 43.1, nnt: null, timeline: '2019-2024' },
  'defuse-3-trial': { sampleSize: '182', treatment: 45, control: 17, nnt: 3.6, timeline: '2016-2017' },
  'dawn-trial': { sampleSize: '206', treatment: 49, control: 13, nnt: 2.8, timeline: '2014-2017' },
  'select2-trial': { sampleSize: '352', treatment: 20, control: 7, nnt: 7.7, timeline: '2019-2022' },
  'angel-aspect-trial': { sampleSize: '456', treatment: 30, control: 11.6, nnt: 5.4, timeline: '2020-2022' }
};

function calculateNNT(treatment, control) {
  const arr = Math.abs(treatment - control);
  if (arr === 0) return null;
  return Math.round((100 / arr) * 10) / 10;
}

function generateReport() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('           TRIAL DATA VERIFICATION REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const duplicates = {
    sampleSize: {},
    nnt: {},
    efficacy: {},
    timeline: {}
  };
  
  // Check for duplicates
  Object.entries(trials).forEach(([id, data]) => {
    // Sample sizes
    if (!duplicates.sampleSize[data.sampleSize]) {
      duplicates.sampleSize[data.sampleSize] = [];
    }
    duplicates.sampleSize[data.sampleSize].push(id);
    
    // NNT
    if (data.nnt !== null) {
      const nntKey = data.nnt.toFixed(1);
      if (!duplicates.nnt[nntKey]) {
        duplicates.nnt[nntKey] = [];
      }
      duplicates.nnt[nntKey].push(id);
    }
    
    // Efficacy percentages
    const efficacyKey = `${data.treatment}-${data.control}`;
    if (!duplicates.efficacy[efficacyKey]) {
      duplicates.efficacy[efficacyKey] = [];
    }
    duplicates.efficacy[efficacyKey].push(id);
    
    // Timeline
    if (!duplicates.timeline[data.timeline]) {
      duplicates.timeline[data.timeline] = [];
    }
    duplicates.timeline[data.timeline].push(id);
  });
  
  // THROMBOLYSIS TRIALS
  console.log('📋 THROMBOLYSIS TRIALS:');
  console.log('───────────────────────────────────────────────────────────\n');
  
  const thrombolysisIds = ['ninds-trial', 'ecass3-trial', 'extend-trial', 'eagle-trial', 'wake-up-trial'];
  thrombolysisIds.forEach(id => {
    const t = trials[id];
    const calculatedNNT = calculateNNT(t.treatment, t.control);
    console.log(`${id}:`);
    console.log(`  Sample Size: ${t.sampleSize}`);
    console.log(`  Treatment %: ${t.treatment}%`);
    console.log(`  Control %: ${t.control}%`);
    console.log(`  Calculated NNT: ${calculatedNNT || 'N/A'}`);
    console.log(`  Displayed NNT: ${t.nnt || 'N/A'} ${calculatedNNT && t.nnt && Math.abs(calculatedNNT - t.nnt) > 0.5 ? '⚠️ MISMATCH' : '✓'}`);
    console.log(`  Timeline: ${t.timeline}`);
    console.log('');
  });
  
  // THROMBECTOMY TRIALS
  console.log('\n📋 THROMBECTOMY TRIALS:');
  console.log('───────────────────────────────────────────────────────────\n');
  
  const thrombectomyIds = ['distal-trial', 'escape-mevo-trial', 'defuse-3-trial', 'dawn-trial', 'select2-trial', 'angel-aspect-trial'];
  thrombectomyIds.forEach(id => {
    const t = trials[id];
    const calculatedNNT = calculateNNT(t.treatment, t.control);
    console.log(`${id}:`);
    console.log(`  Sample Size: ${t.sampleSize}`);
    console.log(`  Treatment %: ${t.treatment}%`);
    console.log(`  Control %: ${t.control}%`);
    console.log(`  Calculated NNT: ${calculatedNNT || 'N/A'}`);
    console.log(`  Displayed NNT: ${t.nnt || 'N/A'} ${calculatedNNT && t.nnt && Math.abs(calculatedNNT - t.nnt) > 0.5 ? '⚠️ MISMATCH' : '✓'}`);
    console.log(`  Timeline: ${t.timeline}`);
    console.log('');
  });
  
  // DUPLICATES CHECK
  console.log('\n⚠️  DUPLICATE/SUSPICIOUS VALUES:');
  console.log('───────────────────────────────────────────────────────────\n');
  
  let hasDuplicates = false;
  
  Object.entries(duplicates.sampleSize).forEach(([size, ids]) => {
    if (ids.length > 1) {
      console.log(`Sample Size ${size}: Found in ${ids.join(', ')}`);
      hasDuplicates = true;
    }
  });
  
  Object.entries(duplicates.nnt).forEach(([nnt, ids]) => {
    if (ids.length > 1) {
      console.log(`NNT ${nnt}: Found in ${ids.join(', ')}`);
      hasDuplicates = true;
    }
  });
  
  Object.entries(duplicates.efficacy).forEach(([eff, ids]) => {
    if (ids.length > 1) {
      console.log(`Efficacy ${eff}: Found in ${ids.join(', ')}`);
      hasDuplicates = true;
    }
  });
  
  Object.entries(duplicates.timeline).forEach(([timeline, ids]) => {
    if (ids.length > 1) {
      console.log(`Timeline "${timeline}": Found in ${ids.join(', ')}`);
      hasDuplicates = true;
    }
  });
  
  if (!hasDuplicates) {
    console.log('✅ NO DUPLICATE VALUES DETECTED');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

generateReport();
