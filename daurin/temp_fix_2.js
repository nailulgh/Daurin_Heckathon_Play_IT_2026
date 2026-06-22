const fs = require('fs');
const path = require('path');

const files_to_clean = [
  'src/lib/ai/wasteClassifier.ts',
  'src/lib/co2.ts',
  'src/lib/geo/haversine.ts',
  'src/lib/geo/routeOptimizer.ts'
];

// Relaxed pattern for CRLF and any text after >>>>>>>
const pattern = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>> [^\r\n]+/g;

files_to_clean.forEach(filepath => {
  const absolutePath = path.join(__dirname, filepath);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    // Replace with group 2 (the code from the feature branch)
    const newContent = content.replace(pattern, (match, g1, g2) => g2);
    fs.writeFileSync(absolutePath, newContent, 'utf-8');
    console.log("Cleaned:", filepath);
  } else {
    console.log("Not found:", filepath);
  }
});
