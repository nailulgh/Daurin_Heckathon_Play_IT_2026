const fs = require('fs');
const path = require('path');
const files = [
  'src/components/listing/MaterialListingForm.tsx',
  'src/components/listing/WasteListingForm.tsx',
  'src/components/negotiation/NegotiationThread.tsx'
];
files.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    content = content.replace(/@\/components\/ui\/use-toast/g, '@/hooks/use-toast');
    fs.writeFileSync(p, content, 'utf-8');
    console.log("Fixed toast import in", f);
  } else {
    console.log("File not found:", f);
  }
});
