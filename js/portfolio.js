const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(canvas.width, canvas.height);
const pixels = imageData.data; 

function putPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return; 
  const index = (y * canvas.width + x) * 4; 
  pixels[index] = r;
  pixels[index + 1] = g;
  pixels[index + 2] = b;
  pixels[index + 3] = a;
}
function drawLine(x1, y1, x2, y2, r, g, b, a = 255) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  if(dx > dy) {
    const m = (y2 - y1) / (x2 - x1);
    const c = y1 - m * x1;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      const y = Math.round(m * x + c);
      putPixel(x, y, r, g, b, a);
    }
  } else {
    const m = (x2 - x1) / (y2 - y1);
    const c = x1 - m * y1;
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      const x = Math.round(m * y + c);
      putPixel(x, y, r, g, b, a);
    }
  }
}

function drawRect(x1, y1, x2, y2, r, g, b, a = 255){
    drawLine(x1, y1, x2, y1, r, g, b, a); // Top
    drawLine(x2, y1, x2, y2, r, g, b, a); // Right
    drawLine(x2, y2, x1, y2, r, g, b, a); // Bottom
    drawLine(x1, y2, x1, y1, r, g, b, a); // Left
}


function drawRectFilled(x1, y1, x2, y2, r, g, b, a = 255){
    for(let y = y1; y <= y2; y++){
        for(let x = x1; x <= x2; x++){
            putPixel(x, y, r, g, b, a);
        }
    }
}

function drawRectGradient(x1, y1, x2, y2, r1, g1, b1, r2, g2, b2, a = 255){
    for(let y = y1; y <= y2; y++){
        let t = (y - y1) / (y2 - y1);
        let cr = Math.round(r1 * (1 - t) + r2 * t);
        let cg = Math.round(g1 * (1 - t) + g2 * t);
        let cb = Math.round(b1 * (1 - t) + b2 * t);
        for(let x = x1; x <= x2; x++){
            putPixel(x, y, cr, cg, cb, a);
        }
    }
}

function drawEllipse(cx, cy, rx, ry, r, g, b, a = 255) {
    for (let y = -ry; y <= ry; y++) {
        for (let x = -rx; x <= rx; x++) {
            if ((x * x) / (rx * rx) + (y * y) / (ry * ry) < 1) {
                putPixel(cx + x, cy + y, r, g, b, a);
            }
        }
    }
}

const spaceInvaderSprite = [
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
];

const smileySprite = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0]
];

// 24-bit Sprite ***
const smileSprite24Bit32x32 = [
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xFFDF48, 0xFFDF48, 0xFFDF48, 0xFFDF48, 0xFFDF48, 0xFFDF48, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xFFDE47, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xFFDD45, 0xC76A08, 0xC76A08, null, null, null, null, null, null],
  [null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xFFDC44, 0xC76A08, 0xC76A08, null, null, null, null, null],
  [null, null, null, null, 0xC76A08, 0xC76A08, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xFFDA43, 0xC76A08, 0xC76A08, null, null, null, null],
  [null, null, null, null, 0xC76A08, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xFFD942, 0xC76A08, null, null, null, null],
  [null, null, null, 0xC76A08, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xFFD841, 0xC76A08, null, null, null],
  [null, null, 0xC76A08, 0xC76A08, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xFFD640, 0xC76A08, 0xC76A08, null, null],
  [null, null, 0xC76A08, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0x3B2507, 0xFFFFFF, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0x3B2507, 0xFFFFFF, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xFFD53E, 0xC76A08, null, null],
  [null, null, 0xC76A08, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xFFD43D, 0xC76A08, null, null],
  [null, 0xC76A08, 0xC76A08, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xFFD33C, 0xC76A08, 0xC76A08, null],
  [null, 0xC76A08, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0x3B2507, 0x3B2507, 0x3B2507, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xFFD13B, 0xC76A08, null],
  [null, 0xC76A08, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xFFD03A, 0xC76A08, null],
  [null, 0xC76A08, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xFFCF39, 0xC76A08, null],
  [null, 0xC76A08, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xF58B73, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xF58B73, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xFFCD37, 0xC76A08, null],
  [null, 0xC76A08, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFCC36, 0xFFCC36, 0xFFCC36, 0xC76A08, null],
  [null, 0xC76A08, 0xFFCB35, 0xFFCB35, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xFFCB35, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFCB35, 0xFFCB35, 0xC76A08, null],
  [null, 0xC76A08, 0xC76A08, 0xFFC934, 0xFFC934, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xFFC934, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xF58B73, 0xFFC934, 0xFFC934, 0xC76A08, 0xC76A08, null],
  [null, null, 0xC76A08, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xF58B73, 0xFFC833, 0x7A2E0B, 0x7A2E0B, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0x7A2E0B, 0x7A2E0B, 0xFFC833, 0xF58B73, 0xFFC833, 0xFFC833, 0xFFC833, 0xFFC833, 0xC76A08, null, null],
  [null, null, 0xC76A08, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xFFC732, 0xC76A08, null, null],
  [null, null, 0xC76A08, 0xC76A08, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0xFFC630, 0xC76A08, 0xC76A08, null, null],
  [null, null, null, 0xC76A08, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xFFC42F, 0xC76A08, null, null, null],
  [null, null, null, null, 0xC76A08, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0x7A2E0B, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xFFC32E, 0xC76A08, null, null, null, null],
  [null, null, null, null, 0xC76A08, 0xC76A08, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xFFC22D, 0xC76A08, 0xC76A08, null, null, null, null],
  [null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xFFC02C, 0xC76A08, 0xC76A08, null, null, null, null, null],
  [null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xFFBF2B, 0xC76A08, 0xC76A08, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xFFBE29, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xFFBD28, 0xFFBD28, 0xFFBD28, 0xFFBD28, 0xFFBD28, 0xFFBD28, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, 0xC76A08, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
];

function drawSprite(sprite, x, y, r, g, b, a = 255) {
    for (let j = 0; j < sprite.length; j++) {
        for (let i = 0; i < sprite[j].length; i++) {
            if (sprite[j][i] === 1) {
                putPixel(x + i, y + j, r, g, b, a);
            }
        }
    }
}

function drawSprite24BitRotationScale(sprite, targetX, targetY, deg, scaleX, scaleY) {
  const sh = sprite.length;
  const sw = sprite[0].length;
  const rad = deg * Math.PI / 180;

  for (let j = 0; j < sh; j++) {
    for (let i = 0; i < sw; i++) {
      const color = sprite[j][i];
      if (color !== null) {
        const sprR = (color >> 16) & 255;
        const sprG = (color >> 8) & 255;
        const sprB = color & 255;

        const cX = i - sw / 2;
        const cY = j - sh / 2;
        
        const x_rotated = cX * Math.cos(rad) - cY * Math.sin(rad);
        const y_rotated = cX * Math.sin(rad) + cY * Math.cos(rad);

        const finalX = Math.round(targetX + x_rotated * scaleX);
        const finalY = Math.round(targetY + y_rotated * scaleY);

        const rX = Math.max(1, Math.round(scaleX / 2));
        const rY = Math.max(1, Math.round(scaleY / 2));
        drawEllipse(finalX, finalY, rX, rY, sprR, sprG, sprB, 255);
      }
    }
  }
}

let spriteX = 100; 
let spriteY = 100;
let scale = 1.0;
let degree = 0;

// Interaction: Translate (W, A, S, D), Rotate (Left/Right), Scale (Up/Down)
window.addEventListener('keydown',(event)=>{

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
        event.preventDefault();
    }
    
    // Rotate
    if (event.code === 'ArrowLeft') { degree -= 5; }
    else if (event.code === 'ArrowRight') { degree += 5; }
    
    // Scale
    else if (event.code === 'ArrowUp') { scale += 0.1; }
    else if (event.code === 'ArrowDown') { scale = Math.max(0.2, scale - 0.1); }
    
    // Translate
    else if (event.code === 'KeyW') { spriteY -= 4; }
    else if (event.code === 'KeyS') { spriteY += 4; }
    else if (event.code === 'KeyA') { spriteX -= 4; }
    else if (event.code === 'KeyD') { spriteX += 4; }
});

// Interaction: Follow Mouse
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Map display coordinates to internal canvas resolution (200x200)
    spriteX = Math.round(x * (canvas.width / rect.width));
    spriteY = Math.round(y * (canvas.height / rect.height));
});

function animate(){
  
  drawRectFilled(0, 0, canvas.width - 1, canvas.height - 1, 255, 255, 255);
  
  
  drawSprite24BitRotationScale(smileSprite24Bit32x32, spriteX, spriteY, degree, scale, scale);
  
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(animate);
}

animate();

