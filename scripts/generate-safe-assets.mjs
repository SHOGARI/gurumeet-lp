import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const screensDir = path.join(root, "public", "screens");
const mockDir = path.join(root, "public", "mock");

await mkdir(screensDir, { recursive: true });
await mkdir(mockDir, { recursive: true });

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function svg(width, height, body, extra = "") {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="warm" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff8f2"/>
      <stop offset="100%" stop-color="#f7ebe4"/>
    </linearGradient>
    <linearGradient id="card" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ff735e"/>
      <stop offset="100%" stop-color="#161616"/>
    </linearGradient>
    <linearGradient id="green" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e2efe4"/>
      <stop offset="100%" stop-color="#7ea88b"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#d95a45" flood-opacity=".18"/>
    </filter>
    ${extra}
  </defs>
  <rect width="${width}" height="${height}" fill="#fff8f3"/>
  ${body}
</svg>`);
}

function text(x, y, value, size = 36, weight = 700, fill = "#171717", anchor = "start") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, 'Hiragino Sans', 'Yu Gothic', sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(value)}</text>`;
}

function back(x = 36, y = 66) {
  return `<path d="M${x + 30} ${y - 22} L${x} ${y + 8} L${x + 30} ${y + 38}" fill="none" stroke="#171717" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function statusBar() {
  return `${text(48, 38, "9:41", 20, 700)}
  <rect x="650" y="22" width="54" height="20" rx="7" fill="none" stroke="#171717" stroke-width="3"/>
  <rect x="707" y="28" width="5" height="8" rx="2" fill="#171717"/>
  <rect x="656" y="27" width="40" height="10" rx="4" fill="#171717"/>`;
}

function sampleBadge(x, y, label = "SAMPLE") {
  return `<g>
    <rect x="${x}" y="${y}" width="154" height="48" rx="24" fill="#fff" stroke="#f1cfc8" stroke-width="2"/>
    ${text(x + 77, y + 32, label, 18, 800, "#f25440", "middle")}
  </g>`;
}

function dishArt(x, y, w, h, tone = "red") {
  const fill = tone === "green" ? "url(#green)" : "url(#card)";
  return `<g clip-path="url(#clip-${x}-${y})">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="42" fill="${fill}"/>
    <circle cx="${x + w * 0.26}" cy="${y + h * 0.34}" r="${w * 0.18}" fill="#fff8f3" opacity=".92"/>
    <circle cx="${x + w * 0.29}" cy="${y + h * 0.34}" r="${w * 0.11}" fill="${tone === "green" ? "#5e8f6b" : "#ffb25f"}" opacity=".95"/>
    <circle cx="${x + w * 0.68}" cy="${y + h * 0.46}" r="${w * 0.25}" fill="#fff" opacity=".15"/>
    <path d="M${x + 56} ${y + h - 138} C${x + 176} ${y + h - 218}, ${x + w - 166} ${y + h - 210}, ${x + w - 52} ${y + h - 126}" fill="none" stroke="#fff" stroke-width="14" opacity=".34" stroke-linecap="round"/>
    <path d="M${x + 88} ${y + 96} C${x + 220} ${y + 42}, ${x + w - 184} ${y + 40}, ${x + w - 66} ${y + 112}" fill="none" stroke="#fff" stroke-width="8" opacity=".38" stroke-linecap="round"/>
  </g>
  <clipPath id="clip-${x}-${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="42"/></clipPath>`;
}

function bottomNav(active = 0) {
  const items = ["Home", "Swipe", "Result"];
  return `<g>
    <rect x="70" y="1514" width="640" height="88" rx="44" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
    ${items
      .map((item, i) => {
        const cx = 160 + i * 230;
        return `<circle cx="${cx}" cy="1548" r="13" fill="${i === active ? "#f25440" : "#d9c8c2"}"/>
          ${text(cx, 1584, item, 18, 700, i === active ? "#f25440" : "#a99b96", "middle")}`;
      })
      .join("")}
  </g>`;
}

const candidates = [
  ["Luna Cafe", "Cafe・徒歩5分", "¥1,000-2,000", "red", "★4.8・128 reviews", "Demo Ave 1-2", "11:00-21:00"],
  ["Grill House", "Grill・徒歩8分", "¥2,000-3,500", "green", "★4.6・96 reviews", "Sample St 3-4", "17:00-23:00"],
  ["Sushi Atelier", "Sushi・徒歩6分", "¥3,000-5,000", "red", "★4.7・74 reviews", "Mock Rd 5-6", "18:00-22:30"],
];

function candidateCard(x, y, item, compact = false) {
  const [name, genre, price, tone, rating, address, hours] = item;
  const h = compact ? 214 : 456;
  return `<g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="640" height="${h}" rx="44" fill="#fff"/>
    ${dishArt(x + 18, y + 18, compact ? 184 : 604, compact ? 178 : 244, tone)}
    ${text(compact ? x + 232 : x + 48, compact ? y + 72 : y + 320, name, compact ? 30 : 42, 800, "#171717")}
    ${text(compact ? x + 232 : x + 48, compact ? y + 116 : y + 366, genre, compact ? 21 : 24, 700, "#6a5d59")}
    ${text(compact ? x + 232 : x + 48, compact ? y + 156 : y + 402, `${price}・${rating}`, compact ? 21 : 22, 800, "#f25440")}
    ${compact ? "" : text(x + 48, y + 434, `${address}・${hours}`, 20, 760, "#6a5d59")}
    <rect x="${x + 456}" y="${y + 42}" width="120" height="42" rx="21" fill="#fff6f2" stroke="#f3d3cc" stroke-width="2"/>
    ${text(x + 516, y + 70, "DEMO", 18, 800, "#f25440", "middle")}
  </g>`;
}

const screenDefs = [
  {
    file: "01_home_mobile_390.png",
    title: "何食べる？",
    subtitle: "みんなで決めるルームを作成",
    body: `${sampleBadge(548, 76)}
      <rect x="52" y="390" width="676" height="230" rx="42" fill="#171717"/>
      ${text(92, 464, "今日のメンバー", 30, 800, "#fff")}
      ${text(92, 514, "4人で候補をスワイプ", 23, 700, "#ffffff99")}
      <g>${["Y", "K", "M", "A"].map((n, i) => `<circle cx="${122 + i * 54}" cy="570" r="27" fill="${i % 2 ? "#ff735e" : "#fff"}"/><text x="${122 + i * 54}" y="579" text-anchor="middle" font-family="Arial" font-size="22" font-weight="800" fill="${i % 2 ? "#fff" : "#171717"}">${n}</text>`).join("")}</g>
      <rect x="52" y="690" width="676" height="112" rx="28" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 760, "エリア: Demo Area", 28, 760)}
      <rect x="52" y="832" width="676" height="112" rx="28" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 902, "予算: ¥1,000-4,000", 28, 760)}
      <rect x="52" y="1030" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1090, "ルームを作る", 29, 800, "#fff", "middle")}
      ${bottomNav(0)}`,
  },
  {
    file: "02_create_mobile_390.png",
    title: "条件を選ぶ",
    subtitle: "候補はサンプル店舗で表示",
    body: `${sampleBadge(548, 76)}
      <rect x="52" y="330" width="676" height="138" rx="34" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 386, "現在地から", 24, 800, "#6a5d59")}
      ${text(92, 432, "徒歩10分以内", 34, 850)}
      <rect x="52" y="510" width="676" height="138" rx="34" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 566, "ジャンル", 24, 800, "#6a5d59")}
      ${text(92, 612, "気分でミックス", 34, 850)}
      <rect x="52" y="690" width="676" height="310" rx="42" fill="#171717"/>
      ${text(92, 760, "候補プレビュー", 29, 800, "#fff")}
      ${candidateCard(92, 804, candidates[1], true)}
      <rect x="52" y="1070" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1130, "招待リンクを作成", 29, 800, "#fff", "middle")}
      ${bottomNav(0)}`,
  },
  {
    file: "03_invite_mobile_390.png",
    title: "招待する",
    subtitle: "URLを送るだけ",
    body: `${sampleBadge(548, 76)}
      <rect x="70" y="354" width="640" height="640" rx="54" fill="#171717"/>
      <rect x="150" y="452" width="480" height="480" rx="38" fill="#fff"/>
      ${Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, c) => (r + c) % 3 === 0 ? `<rect x="${188 + c * 58}" y="${490 + r * 58}" width="36" height="36" rx="7" fill="#171717"/>` : "").join("")).join("")}
      ${text(390, 1076, "ROOM-248", 42, 850, "#171717", "middle")}
      ${text(390, 1124, "サンプルルーム", 24, 760, "#756965", "middle")}
      <rect x="86" y="1230" width="292" height="82" rx="41" fill="#f25440"/>
      ${text(232, 1284, "リンクをコピー", 25, 800, "#fff", "middle")}
      <rect x="402" y="1230" width="292" height="82" rx="41" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(548, 1284, "共有する", 25, 800, "#171717", "middle")}
      ${bottomNav(0)}`,
  },
  {
    file: "04_waiting_mobile_390.png",
    title: "待機中",
    subtitle: "全員がそろったら開始",
    body: `${sampleBadge(548, 76)}
      <rect x="52" y="322" width="676" height="344" rx="48" fill="#171717"/>
      ${text(92, 394, "参加メンバー", 29, 800, "#fff")}
      ${["Yuka", "Ken", "Mio", "Aki"].map((n, i) => `<rect x="92" y="${430 + i * 54}" width="400" height="38" rx="19" fill="#ffffff14"/><circle cx="112" cy="${449 + i * 54}" r="14" fill="#ff735e"/><text x="140" y="${457 + i * 54}" font-family="Arial" font-size="22" font-weight="800" fill="#fff">${n}</text>`).join("")}
      <rect x="52" y="746" width="676" height="220" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 812, "候補カード", 28, 800)}
      ${text(92, 866, "12枚を自動で準備しました", 25, 760, "#6a5d59")}
      <rect x="92" y="900" width="536" height="16" rx="8" fill="#fae0d8"/>
      <rect x="92" y="900" width="402" height="16" rx="8" fill="#f25440"/>
      <rect x="52" y="1050" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1110, "スワイプ開始", 29, 800, "#fff", "middle")}
      ${bottomNav(1)}`,
  },
  {
    file: "05_swipe_mobile_390.png",
    title: "食べたい？",
    subtitle: "架空サンプル候補をスワイプ",
    body: `${sampleBadge(548, 76, "架空候補")}
      <rect x="52" y="284" width="676" height="16" rx="8" fill="#fae0d8"/>
      <rect x="52" y="284" width="286" height="16" rx="8" fill="#f25440"/>
      ${candidateCard(52, 370, candidates[0], false)}
      <circle cx="166" cy="902" r="64" fill="#ffd9d4"/>
      ${text(166, 923, "×", 58, 500, "#9e1010", "middle")}
      <circle cx="614" cy="902" r="64" fill="#f25440"/>
      ${text(614, 923, "♥", 52, 800, "#fff", "middle")}
      <rect x="52" y="1124" width="676" height="84" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(390, 1178, "↶  Undo", 26, 800, "#aaa09c", "middle")}
      ${bottomNav(1)}`,
  },
  {
    file: "06_voting_complete_mobile_390.png",
    title: "投票完了",
    subtitle: "全員分を集計しています",
    body: `${sampleBadge(548, 76)}
      <circle cx="390" cy="446" r="150" fill="#f25440"/>
      ${text(390, 476, "✓", 150, 800, "#fff", "middle")}
      ${text(390, 700, "4 / 4 voted", 40, 850, "#171717", "middle")}
      ${text(390, 750, "好みが集まりました", 26, 760, "#6a5d59", "middle")}
      <rect x="86" y="858" width="608" height="28" rx="14" fill="#fae0d8"/>
      <rect x="86" y="858" width="608" height="28" rx="14" fill="#f25440"/>
      <rect x="52" y="994" width="676" height="220" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 1064, "もうすぐ結果を表示", 32, 850)}
      ${text(92, 1116, "ダミー候補の中から一致度を計算中", 24, 760, "#6a5d59")}
      ${bottomNav(2)}`,
  },
  {
    file: "07_result_mobile_390.png",
    title: "今日の一軒",
    subtitle: "みんなの好みが重なりました",
    body: `${sampleBadge(548, 76, "DEMO")}
      ${candidateCard(52, 332, candidates[0], false)}
      <rect x="52" y="890" width="676" height="400" rx="44" fill="#171717"/>
      ${text(92, 960, "MATCHED", 22, 850, "#ff735e")}
      ${text(92, 1020, "Luna Cafe", 44, 900, "#fff")}
      ${text(92, 1072, "一致度 92% ・ ★4.8 ・ 128 reviews", 24, 760, "#ffffffa8")}
      ${text(92, 1118, "Demo Ave 1-2 ・ 11:00-21:00", 21, 760, "#ffffff92")}
      ${[["Grill House", "78%"], ["Sushi Atelier", "65%"]].map((r, i) => `<rect x="92" y="${1160 + i * 56}" width="536" height="40" rx="20" fill="#ffffff14"/><text x="116" y="${1187 + i * 56}" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#fff">${r[0]}</text><text x="600" y="${1187 + i * 56}" text-anchor="end" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#ffb7aa">${r[1]}</text>`).join("")}
      ${bottomNav(2)}`,
  },
];

for (const def of screenDefs) {
  const body = `${statusBar()}${back()}${text(128, 88, "GuruMeet", 30, 800)}${text(52, 208, def.title, 62, 900)}${text(52, 266, def.subtitle, 28, 800, "#f25440")}${def.body}`;
  await sharp(svg(780, 1688, body)).png().toFile(path.join(screensDir, def.file));
}

const mockImages = [
  ["hero.png", "#fff3ec", "#f25440"],
  ["ramen.png", "#fff6dc", "#f0a733"],
  ["yakiniku.png", "#fff0ee", "#df3f2a"],
  ["table.png", "#f1f7ef", "#57966f"],
  ["restaurant.png", "#f5f0ff", "#6252d9"],
];

for (const [file, bg, accent] of mockImages) {
  await sharp(
    svg(
      1600,
      1100,
      `<rect width="1600" height="1100" fill="${bg}"/>
      <circle cx="1210" cy="260" r="260" fill="${accent}" opacity=".12"/>
      <circle cx="390" cy="760" r="360" fill="${accent}" opacity=".14"/>
      <rect x="180" y="180" width="1240" height="740" rx="92" fill="#fff" filter="url(#shadow)"/>
      ${dishArt(260, 260, 540, 560, file.includes("restaurant") || file.includes("table") ? "green" : "red")}
      <rect x="890" y="318" width="330" height="48" rx="24" fill="${accent}" opacity=".18"/>
      <rect x="890" y="410" width="440" height="30" rx="15" fill="#171717" opacity=".16"/>
      <rect x="890" y="470" width="360" height="30" rx="15" fill="#171717" opacity=".1"/>
      <rect x="890" y="610" width="250" height="82" rx="41" fill="${accent}"/>
      ${text(1015, 663, "SAMPLE", 30, 900, "#fff", "middle")}`,
    ),
  )
    .png()
    .toFile(path.join(mockDir, file));
}

await sharp(
  svg(
    1200,
    630,
    `<rect width="1200" height="630" fill="#fff8f3"/>
    <circle cx="1040" cy="90" r="220" fill="#ff5a41" opacity=".09"/>
    <rect x="748" y="62" width="286" height="506" rx="52" fill="#111" filter="url(#shadow)"/>
    <rect x="770" y="94" width="242" height="450" rx="36" fill="#fff8f3"/>
    ${dishArt(798, 154, 186, 180, "red")}
    <rect x="798" y="372" width="186" height="30" rx="15" fill="#171717"/>
    <rect x="798" y="420" width="146" height="20" rx="10" fill="#f25440" opacity=".75"/>
    <circle cx="838" cy="496" r="34" fill="#ffd9d4"/>
    ${text(838, 508, "×", 32, 700, "#9e1010", "middle")}
    <circle cx="946" cy="496" r="34" fill="#f25440"/>
    ${text(946, 508, "♥", 28, 800, "#fff", "middle")}
    ${text(148, 178, "GuruMeet", 54, 900)}
    ${text(148, 296, "「何食べる？」を、", 58, 900)}
    ${text(148, 384, "10秒で終わらせる。", 58, 900)}
    <rect x="148" y="450" width="242" height="54" rx="27" fill="#f25440"/>
    ${text(269, 486, "架空サンプル画面", 24, 850, "#fff", "middle")}`,
  ),
)
  .png()
  .toFile(path.join(root, "public", "og.png"));

console.log("Generated safe GuruMeet assets.");
