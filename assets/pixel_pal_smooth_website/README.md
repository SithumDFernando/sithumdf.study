
Pixel Pal — Smooth Interactive Mascot
====================================

This version improves smoothness by:
- normalizing every sprite onto the same 512x512 canvas
- anchoring all poses to the same baseline so the mascot does not jump in size or position
- using short frame sequences for hover, click, double-click, and rapid-click reactions

Files:
- index.html
- mascot.css
- mascot.js
- assets/*.png

Interactions:
- Hover: wave loop
- Single click: jump
- Double click: surprise
- 3+ quick clicks: cheer
- Buttons: manual testing

To embed in your own site:
1. Copy assets/, mascot.css, mascot.js.
2. Copy the .pixel-mascot block from index.html.
3. Call initPixelMascot(yourElement) if needed.
