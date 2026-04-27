const heroCanvas = document.querySelector("#heroCanvas");
const graphCanvas = document.querySelector("#graphCanvas");
const shapeSelect = document.querySelector("#shapeSelect");
const hInput = document.querySelector("#hInput");
const kInput = document.querySelector("#kInput");
const aInput = document.querySelector("#aInput");
const bInput = document.querySelector("#bInput");
const equationText = document.querySelector("#equationText");

const colors = {
  ink: "#172126",
  grid: "#d8d2c4",
  teal: "#007f7a",
  coral: "#d95f43",
  violet: "#5b5aa7",
  gold: "#c68a1d",
  green: "#437b4a",
};

function drawHero() {
  if (!heroCanvas) return;
  const ctx = heroCanvas.getContext("2d");
  const { width, height } = heroCanvas;
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "rgba(23, 33, 38, 0.14)";
  ctx.lineWidth = 1;
  for (let x = 60; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, height - 40);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 40, y);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(60, height / 2);
  ctx.lineTo(width - 70, height / 2);
  ctx.moveTo(width / 2, 52);
  ctx.lineTo(width / 2, height - 52);
  ctx.stroke();

  ctx.strokeStyle = colors.teal;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 98, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.violet;
  ctx.beginPath();
  ctx.ellipse(width / 2 + 86, height / 2 - 42, 154, 76, -0.18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.coral;
  ctx.beginPath();
  for (let x = -170; x <= 170; x += 3) {
    const y = 0.0058 * x * x - 86;
    const px = width / 2 - 178 + x;
    const py = height / 2 + 92 + y;
    if (x === -170) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.strokeStyle = colors.green;
  ctx.beginPath();
  for (let x = -220; x <= -62; x += 2) {
    const y = 56 * Math.sqrt((x * x) / 3844 - 1);
    ctx.lineTo(width / 2 + 190 + x, height / 2 + y);
  }
  for (let x = -62; x >= -220; x -= 2) {
    const y = -56 * Math.sqrt((x * x) / 3844 - 1);
    ctx.lineTo(width / 2 + 190 + x, height / 2 + y);
  }
  ctx.stroke();

  ctx.fillStyle = colors.ink;
  [
    [width / 2 - 98, height / 2],
    [width / 2 + 98, height / 2],
    [width / 2 + 36, height / 2 - 42],
    [width / 2 + 136, height / 2 - 42],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function worldToCanvas(x, y, scale, width, height) {
  return {
    x: width / 2 + x * scale,
    y: height / 2 - y * scale,
  };
}

function drawGrid(ctx, width, height, scale) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.grid;

  for (let x = -10; x <= 10; x += 1) {
    const p = worldToCanvas(x, 0, scale, width, height);
    ctx.beginPath();
    ctx.moveTo(p.x, 0);
    ctx.lineTo(p.x, height);
    ctx.stroke();
  }

  for (let y = -7; y <= 7; y += 1) {
    const p = worldToCanvas(0, y, scale, width, height);
    ctx.beginPath();
    ctx.moveTo(0, p.y);
    ctx.lineTo(width, p.y);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 2;
  const xAxis = worldToCanvas(0, 0, scale, width, height).y;
  const yAxis = worldToCanvas(0, 0, scale, width, height).x;
  ctx.beginPath();
  ctx.moveTo(0, xAxis);
  ctx.lineTo(width, xAxis);
  ctx.moveTo(yAxis, 0);
  ctx.lineTo(yAxis, height);
  ctx.stroke();
}

function drawPoint(ctx, x, y, scale, width, height, label) {
  const p = worldToCanvas(x, y, scale, width, height);
  ctx.fillStyle = colors.ink;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
  ctx.fill();
  if (label) {
    ctx.font = "700 14px Arial";
    ctx.fillText(label, p.x + 8, p.y - 8);
  }
}

function drawGraph() {
  if (!graphCanvas) return;
  const ctx = graphCanvas.getContext("2d");
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  const scale = 40;
  const shape = shapeSelect.value;
  const h = Number(hInput.value);
  const k = Number(kInput.value);
  const a = Number(aInput.value);
  const b = Number(bInput.value);

  drawGrid(ctx, width, height, scale);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape === "circle") {
    const p = worldToCanvas(h, k, scale, width, height);
    ctx.strokeStyle = colors.teal;
    ctx.beginPath();
    ctx.arc(p.x, p.y, a * scale, 0, Math.PI * 2);
    ctx.stroke();
    drawPoint(ctx, h, k, scale, width, height, "C");
    equationText.textContent = `(x - ${h})^2 + (y - ${k})^2 = ${a * a}`;
  }

  if (shape === "ellipse") {
    const p = worldToCanvas(h, k, scale, width, height);
    ctx.strokeStyle = colors.violet;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, a * scale, b * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    const c = Math.sqrt(Math.max(a * a - b * b, 0));
    drawPoint(ctx, h - c, k, scale, width, height, "F1");
    drawPoint(ctx, h + c, k, scale, width, height, "F2");
    equationText.textContent = `((x - ${h})^2 / ${a * a}) + ((y - ${k})^2 / ${b * b}) = 1`;
  }

  if (shape === "parabola") {
    ctx.strokeStyle = colors.coral;
    ctx.beginPath();
    for (let x = -8; x <= 8; x += 0.05) {
      const y = ((x - h) * (x - h)) / (4 * b) + k;
      const p = worldToCanvas(x, y, scale, width, height);
      if (x === -8) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    drawPoint(ctx, h, k, scale, width, height, "V");
    drawPoint(ctx, h, k + b, scale, width, height, "F");
    ctx.strokeStyle = colors.coral;
    ctx.setLineDash([9, 8]);
    const d1 = worldToCanvas(-10, k - b, scale, width, height);
    const d2 = worldToCanvas(10, k - b, scale, width, height);
    ctx.beginPath();
    ctx.moveTo(d1.x, d1.y);
    ctx.lineTo(d2.x, d2.y);
    ctx.stroke();
    ctx.setLineDash([]);
    equationText.textContent = `(x - ${h})^2 = ${4 * b}(y - ${k})`;
  }

  if (shape === "hyperbola") {
    ctx.strokeStyle = colors.green;
    ctx.beginPath();
    for (let x = h + a + 0.02; x <= 10; x += 0.04) {
      const y = k + b * Math.sqrt(((x - h) * (x - h)) / (a * a) - 1);
      const p = worldToCanvas(x, y, scale, width, height);
      if (x < h + a + 0.05) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    for (let x = 10; x >= h + a + 0.02; x -= 0.04) {
      const y = k - b * Math.sqrt(((x - h) * (x - h)) / (a * a) - 1);
      const p = worldToCanvas(x, y, scale, width, height);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x = h - a - 0.02; x >= -10; x -= 0.04) {
      const y = k + b * Math.sqrt(((x - h) * (x - h)) / (a * a) - 1);
      const p = worldToCanvas(x, y, scale, width, height);
      if (x > h - a - 0.05) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    for (let x = -10; x <= h - a - 0.02; x += 0.04) {
      const y = k - b * Math.sqrt(((x - h) * (x - h)) / (a * a) - 1);
      const p = worldToCanvas(x, y, scale, width, height);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(23, 33, 38, 0.48)";
    ctx.setLineDash([9, 8]);
    [-1, 1].forEach((sign) => {
      const left = worldToCanvas(-10, k + sign * (b / a) * (-10 - h), scale, width, height);
      const right = worldToCanvas(10, k + sign * (b / a) * (10 - h), scale, width, height);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    const c = Math.sqrt(a * a + b * b);
    drawPoint(ctx, h - c, k, scale, width, height, "F1");
    drawPoint(ctx, h + c, k, scale, width, height, "F2");
    equationText.textContent = `((x - ${h})^2 / ${a * a}) - ((y - ${k})^2 / ${b * b}) = 1`;
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Este navegador no tiene sintesis de voz disponible.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-CO";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

document.querySelectorAll(".speak-button").forEach((button) => {
  button.addEventListener("click", () => speak(button.dataset.speak));
});

[shapeSelect, hInput, kInput, aInput, bInput].forEach((input) => {
  input.addEventListener("input", drawGraph);
});

drawHero();
drawGraph();
