import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const screensDir = path.join(root, "public", "screens");
const restaurantDir = path.join(root, "public", "assets", "restaurants");

await mkdir(screensDir, { recursive: true });

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
    <linearGradient id="screenWarm" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff9f4"/>
      <stop offset="100%" stop-color="#fbefe9"/>
    </linearGradient>
    <linearGradient id="cafe" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffc6a9"/>
      <stop offset="50%" stop-color="#e5654d"/>
      <stop offset="100%" stop-color="#4c2721"/>
    </linearGradient>
    <linearGradient id="grill" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffd596"/>
      <stop offset="56%" stop-color="#b85939"/>
      <stop offset="100%" stop-color="#22120f"/>
    </linearGradient>
    <linearGradient id="sushi" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e9f7f1"/>
      <stop offset="52%" stop-color="#64aa92"/>
      <stop offset="100%" stop-color="#183931"/>
    </linearGradient>
    <linearGradient id="pasta" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff1b8"/>
      <stop offset="55%" stop-color="#e6aa30"/>
      <stop offset="100%" stop-color="#573915"/>
    </linearGradient>
    <linearGradient id="yaki" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffd4cd"/>
      <stop offset="52%" stop-color="#f15a43"/>
      <stop offset="100%" stop-color="#2b1715"/>
    </linearGradient>
    <linearGradient id="bistro" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e8e0ff"/>
      <stop offset="55%" stop-color="#7967d8"/>
      <stop offset="100%" stop-color="#241f4d"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#d95a45" flood-opacity=".18"/>
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#0b0b0b" flood-opacity=".12"/>
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

function demoBadge(x, y, label = "DEMO") {
  return `<g>
    <rect x="${x}" y="${y}" width="154" height="48" rx="24" fill="#fff" stroke="#f1cfc8" stroke-width="2"/>
    ${text(x + 77, y + 32, label, 18, 800, "#f25440", "middle")}
  </g>`;
}

const shops = [
  {
    name: "炭火酒場 灯",
    category: "居酒屋",
    price: "3,000〜4,000円",
    distance: "徒歩4分",
    rating: "4.6",
    reviews: "84件",
    address: "架空町1-2-3",
    hours: "17:00〜23:30",
    match: "92%",
    votes: 4,
    theme: "cafe",
    image: "restaurant_izakaya.webp",
    note: "炭火料理を囲むモダン酒場",
  },
  {
    name: "Trattoria Lino",
    category: "イタリアン",
    price: "2,000〜3,000円",
    distance: "徒歩6分",
    rating: "4.5",
    reviews: "112件",
    address: "サンプル通り2-4",
    hours: "11:30〜22:00",
    match: "78%",
    votes: 3,
    theme: "grill",
    image: "restaurant_italian.webp",
    note: "光が入るカジュアルトラットリア",
  },
  {
    name: "SEOUL TABLE",
    category: "韓国料理",
    price: "2,000〜3,000円",
    distance: "徒歩3分",
    rating: "4.7",
    reviews: "96件",
    address: "デモ横丁3-1",
    hours: "17:00〜23:00",
    match: "89%",
    votes: 4,
    theme: "sushi",
    image: "restaurant_korean.webp",
    note: "ネオンで楽しむ韓国テーブル",
  },
  {
    name: "旬菜ダイニング 凪",
    category: "和食",
    price: "3,000〜4,000円",
    distance: "徒歩5分",
    rating: "4.6",
    reviews: "73件",
    address: "架空町4-5-6",
    hours: "11:30〜22:30",
    match: "65%",
    votes: 2,
    theme: "pasta",
    image: "restaurant_japanese.webp",
    note: "旬の定食を味わう静かな和食店",
  },
  {
    name: "麺処 青葉路",
    category: "ラーメン",
    price: "1,000〜1,500円",
    distance: "徒歩4分",
    rating: "4.4",
    reviews: "138件",
    address: "デモ坂5-2",
    hours: "11:00〜22:00",
    match: "72%",
    votes: 3,
    theme: "yaki",
    image: "restaurant_ramen.webp",
    note: "カウンターで味わう醤油らーめん",
  },
  {
    name: "Cafe Rill",
    category: "カフェ",
    price: "1,000〜2,000円",
    distance: "徒歩7分",
    rating: "4.5",
    reviews: "68件",
    address: "サンプル通り6-3",
    hours: "09:00〜20:00",
    match: "63%",
    votes: 3,
    theme: "bistro",
    image: "restaurant_cafe.webp",
    note: "光と緑のカジュアルカフェ",
  },
  {
    name: "炭火焼肉 宵",
    category: "焼肉",
    price: "3,000〜4,000円",
    distance: "徒歩8分",
    rating: "4.6",
    reviews: "121件",
    address: "架空町7-8-1",
    hours: "17:00〜23:30",
    match: "70%",
    votes: 2,
    theme: "cafe",
    image: "restaurant_yakiniku.webp",
    note: "気軽に囲める炭火焼肉",
  },
  {
    name: "青藍飯店",
    category: "中華料理",
    price: "1,500〜2,500円",
    distance: "徒歩5分",
    rating: "4.3",
    reviews: "89件",
    address: "デモ横丁8-2",
    hours: "11:00〜22:00",
    match: "68%",
    votes: 3,
    theme: "pasta",
    image: "restaurant_chinese.webp",
    note: "みんなで囲むカジュアル中華",
  },
  {
    name: "鮨まどか",
    category: "寿司",
    price: "2,500〜4,000円",
    distance: "徒歩6分",
    rating: "4.7",
    reviews: "76件",
    address: "架空町9-3",
    hours: "17:00〜22:30",
    match: "66%",
    votes: 2,
    theme: "sushi",
    image: "restaurant_sushi.webp",
    note: "気軽に楽しむカウンター寿司",
  },
  {
    name: "BAR CANTO",
    category: "バル",
    price: "2,000〜3,000円",
    distance: "徒歩7分",
    rating: "4.4",
    reviews: "61件",
    address: "サンプル通り10-1",
    hours: "17:00〜24:00",
    match: "64%",
    votes: 2,
    theme: "bistro",
    image: "restaurant_bar.webp",
    note: "小皿料理と楽しむカジュアルバル",
  },
];

for (const shop of shops) {
  const source = await readFile(path.join(restaurantDir, shop.image));
  shop.imageUri = `data:image/png;base64,${(
    await sharp(source).png().toBuffer()
  ).toString("base64")}`;
}

function ambience(x, y, w, h, shop, rounded = 42) {
  const id = `clip-${x}-${y}-${shop.theme}`;
  if (shop.imageUri) {
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rounded}"/></clipPath>
      <image x="${x}" y="${y}" width="${w}" height="${h}" href="${shop.imageUri}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
  }
  const centerX = x + w * 0.52;
  const centerY = y + h * 0.52;
  const plate = `<ellipse cx="${centerX}" cy="${centerY}" rx="${w * 0.27}" ry="${h * 0.22}" fill="#fff8f3" opacity=".92"/>
    <ellipse cx="${centerX}" cy="${centerY}" rx="${w * 0.2}" ry="${h * 0.15}" fill="#ffffff" opacity=".34"/>`;

  const cafe = `${plate}
    <circle cx="${centerX - w * 0.05}" cy="${centerY - h * 0.02}" r="${Math.min(w, h) * 0.085}" fill="#f6b35d"/>
    <circle cx="${centerX + w * 0.07}" cy="${centerY + h * 0.04}" r="${Math.min(w, h) * 0.07}" fill="#7b432e"/>
    <path d="M${x + w * 0.22} ${y + h * 0.75} C${x + w * 0.35} ${y + h * 0.62}, ${x + w * 0.52} ${y + h * 0.64}, ${x + w * 0.73} ${y + h * 0.48}" stroke="#fff" stroke-width="${Math.max(7, w * 0.018)}" fill="none" opacity=".42" stroke-linecap="round"/>`;

  const grill = `${plate}
    <rect x="${centerX - w * 0.13}" y="${centerY - h * 0.1}" width="${w * 0.26}" height="${h * 0.12}" rx="20" fill="#7f2f25" transform="rotate(-12 ${centerX} ${centerY})"/>
    <rect x="${centerX - w * 0.1}" y="${centerY + h * 0.03}" width="${w * 0.24}" height="${h * 0.1}" rx="18" fill="#c87437" transform="rotate(10 ${centerX} ${centerY})"/>
    <path d="M${x + w * 0.18} ${y + h * 0.24} H${x + w * 0.78} M${x + w * 0.22} ${y + h * 0.32} H${x + w * 0.82}" stroke="#fff" stroke-width="${Math.max(6, w * 0.014)}" opacity=".32" stroke-linecap="round"/>`;

  const sushi = `${plate}
    ${[0, 1, 2].map((i) => `<g transform="translate(${centerX - w * 0.16 + i * w * 0.16} ${centerY - h * 0.03}) rotate(${i % 2 ? 8 : -8})">
      <rect x="-48" y="-24" width="96" height="48" rx="19" fill="#fff"/>
      <rect x="-42" y="-30" width="84" height="34" rx="16" fill="${i === 1 ? "#f7a867" : "#e95a54"}"/>
      <rect x="-20" y="-24" width="40" height="14" rx="7" fill="#ffffff" opacity=".45"/>
    </g>`).join("")}
    <circle cx="${x + w * 0.74}" cy="${y + h * 0.68}" r="${Math.min(w, h) * 0.04}" fill="#77a46e"/>`;

  const pasta = `${plate}
    <path d="M${centerX - w * 0.16} ${centerY} C${centerX - w * 0.04} ${centerY - h * 0.12}, ${centerX + w * 0.08} ${centerY + h * 0.12}, ${centerX + w * 0.2} ${centerY - h * 0.02}" stroke="#f2bd45" stroke-width="${Math.max(11, w * 0.03)}" fill="none" stroke-linecap="round"/>
    <path d="M${centerX - w * 0.18} ${centerY + h * 0.08} C${centerX} ${centerY - h * 0.1}, ${centerX + w * 0.1} ${centerY + h * 0.2}, ${centerX + w * 0.23} ${centerY}" stroke="#ffe083" stroke-width="${Math.max(7, w * 0.018)}" fill="none" stroke-linecap="round"/>
    <circle cx="${centerX + w * 0.16}" cy="${centerY - h * 0.06}" r="${Math.min(w, h) * 0.035}" fill="#df4a36"/>`;

  const bistro = `${plate}
    <circle cx="${centerX - w * 0.08}" cy="${centerY}" r="${Math.min(w, h) * 0.075}" fill="#d9f0d7"/>
    <circle cx="${centerX + w * 0.05}" cy="${centerY - h * 0.04}" r="${Math.min(w, h) * 0.07}" fill="#f0d66c"/>
    <circle cx="${centerX + w * 0.13}" cy="${centerY + h * 0.07}" r="${Math.min(w, h) * 0.055}" fill="#e987ae"/>
    <path d="M${x + w * 0.2} ${y + h * 0.25} C${x + w * 0.35} ${y + h * 0.1}, ${x + w * 0.48} ${y + h * 0.36}, ${x + w * 0.76} ${y + h * 0.2}" stroke="#fff" stroke-width="${Math.max(7, w * 0.016)}" fill="none" opacity=".33" stroke-linecap="round"/>`;

  const yaki = `${plate}
    <rect x="${centerX - w * 0.22}" y="${centerY - h * 0.13}" width="${w * 0.44}" height="${h * 0.26}" rx="34" fill="#202020"/>
    <path d="M${centerX - w * 0.16} ${centerY - h * 0.02} C${centerX - w * 0.05} ${centerY - h * 0.15}, ${centerX + w * 0.08} ${centerY + h * 0.12}, ${centerX + w * 0.18} ${centerY - h * 0.04}" stroke="#ffb35a" stroke-width="${Math.max(9, w * 0.022)}" fill="none" stroke-linecap="round"/>
    <circle cx="${centerX + w * 0.12}" cy="${centerY + h * 0.02}" r="${Math.min(w, h) * 0.04}" fill="#f25440"/>`;

  const art = { cafe, grill, sushi, pasta, yaki, bistro }[shop.theme] ?? cafe;
  return `<g clip-path="url(#${id})">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rounded}" fill="url(#${shop.theme})"/>
    <circle cx="${x + w * 0.16}" cy="${y + h * 0.15}" r="${w * 0.18}" fill="#fff" opacity=".18"/>
    <circle cx="${x + w * 0.84}" cy="${y + h * 0.1}" r="${w * 0.22}" fill="#fff" opacity=".12"/>
    <rect x="${x + w * 0.04}" y="${y + h * 0.08}" width="${w * 0.92}" height="${h * 0.84}" rx="${rounded - 8}" fill="#000" opacity=".08"/>
    ${art}
    <path d="M${x + w * 0.09} ${y + h * 0.16} C${x + w * 0.34} ${y + h * 0.02}, ${x + w * 0.62} ${y + h * 0.06}, ${x + w * 0.9} ${y + h * 0.24}" stroke="#fff" stroke-width="${Math.max(5, w * 0.012)}" fill="none" opacity=".32" stroke-linecap="round"/>
  </g>
  <clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rounded}"/></clipPath>`;
}

function shopCard(x, y, shop, compact = false) {
  const w = 640;
  const h = compact ? 240 : 560;
  const artH = compact ? 188 : 290;
  const textX = compact ? x + 232 : x + 48;
  const textY = compact ? y + 72 : y + 370;
  return `<g filter="url(#softShadow)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="44" fill="#fff"/>
    ${ambience(x + 18, y + 18, compact ? 184 : 604, artH, shop)}
    <rect x="${x + 460}" y="${y + 42}" width="120" height="42" rx="21" fill="#fff8f3" stroke="#f3d3cc" stroke-width="2"/>
    ${text(x + 520, y + 70, "DEMO", 18, 800, "#f25440", "middle")}
    ${text(textX, textY, shop.name, compact ? 29 : 43, 840, "#171717")}
    ${text(textX, textY + (compact ? 42 : 48), `${shop.category}・${shop.distance}`, compact ? 20 : 25, 760, "#6a5d59")}
    ${text(textX, textY + (compact ? 78 : 88), `${shop.price}・★${shop.rating}・${shop.reviews}`, compact ? 18 : 22, 800, "#f25440")}
    ${compact ? "" : text(textX, textY + 122, `${shop.address}・${shop.hours}`, 20, 760, "#6a5d59")}
    ${compact ? "" : text(textX, textY + 154, shop.note, 20, 760, "#8c7c76")}
  </g>`;
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

function phoneScreen(title, subtitle, body) {
  return `${statusBar()}${back()}${text(128, 88, "GuruMeet", 30, 800)}${text(52, 208, title, 62, 900)}${text(52, 266, subtitle, 28, 800, "#f25440")}${body}`;
}

const screenDefs = [
  {
    file: "01_home_mobile_390.png",
    body: phoneScreen(
      "何食べる？",
      "みんなで決めるルームを作成",
      `${demoBadge(548, 76)}
      <rect x="52" y="330" width="676" height="234" rx="42" fill="#171717"/>
      ${text(92, 402, "今日のメンバー", 30, 800, "#fff")}
      ${text(92, 452, "4人で候補をスワイプ", 23, 700, "#ffffff99")}
      <g>${["Y", "K", "M", "A"].map((n, i) => `<circle cx="${122 + i * 54}" cy="510" r="27" fill="${i % 2 ? "#ff735e" : "#fff"}"/><text x="${122 + i * 54}" y="519" text-anchor="middle" font-family="Arial" font-size="22" font-weight="800" fill="${i % 2 ? "#fff" : "#171717"}">${n}</text>`).join("")}</g>
      <rect x="52" y="628" width="676" height="112" rx="28" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 698, "エリア: Demo Area", 28, 760)}
      <rect x="52" y="770" width="676" height="112" rx="28" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 840, "予算: ¥1,000-4,000", 28, 760)}
      <rect x="52" y="922" width="676" height="248" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 990, "候補プレビュー", 27, 800)}
      ${[shops[0], shops[1], shops[2]].map((s, i) => `<rect x="92" y="${1024 + i * 42}" width="536" height="30" rx="15" fill="${i === 0 ? "#fff4ef" : "#f7efeb"}"/><text x="116" y="${1046 + i * 42}" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#171717">${s.name}</text><text x="604" y="${1046 + i * 42}" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#f25440">★${s.rating}</text>`).join("")}
      <rect x="52" y="1228" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1288, "ルームを作る", 29, 800, "#fff", "middle")}
      ${bottomNav(0)}`,
    ),
  },
  {
    file: "02_create_mobile_390.png",
    body: phoneScreen(
      "条件を選ぶ",
      "候補はデモ店舗で表示",
      `${demoBadge(548, 76)}
      <rect x="52" y="330" width="676" height="118" rx="32" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 384, "現在地から", 23, 800, "#6a5d59")}
      ${text(92, 424, "徒歩10分以内", 31, 850)}
      <rect x="52" y="486" width="676" height="118" rx="32" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 540, "ジャンル", 23, 800, "#6a5d59")}
      ${text(92, 580, "気分でミックス", 31, 850)}
      <rect x="52" y="650" width="676" height="368" rx="42" fill="#171717"/>
      ${text(92, 720, "候補プレビュー", 29, 800, "#fff")}
      ${shopCard(92, 760, shops[1], true)}
      <rect x="52" y="1088" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1148, "招待リンクを作成", 29, 800, "#fff", "middle")}
      ${bottomNav(0)}`,
    ),
  },
  {
    file: "03_invite_mobile_390.png",
    body: phoneScreen(
      "招待する",
      "URLを送るだけ",
      `${demoBadge(548, 76)}
      <rect x="70" y="354" width="640" height="600" rx="54" fill="#171717"/>
      <rect x="150" y="432" width="480" height="430" rx="38" fill="#fff"/>
      ${Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, c) => (r + c) % 3 === 0 ? `<rect x="${188 + c * 58}" y="${470 + r * 50}" width="36" height="36" rx="7" fill="#171717"/>` : "").join("")).join("")}
      ${text(390, 1036, "ROOM-248", 42, 850, "#171717", "middle")}
      ${text(390, 1084, "デモ店舗ルーム", 24, 760, "#756965", "middle")}
      <rect x="86" y="1210" width="292" height="82" rx="41" fill="#f25440"/>
      ${text(232, 1264, "リンクをコピー", 25, 800, "#fff", "middle")}
      <rect x="402" y="1210" width="292" height="82" rx="41" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(548, 1264, "共有する", 25, 800, "#171717", "middle")}
      ${bottomNav(0)}`,
    ),
  },
  {
    file: "04_waiting_mobile_390.png",
    body: phoneScreen(
      "待機中",
      "全員がそろったら開始",
      `${demoBadge(548, 76)}
      <rect x="52" y="322" width="676" height="344" rx="48" fill="#171717"/>
      ${text(92, 394, "参加メンバー", 29, 800, "#fff")}
      ${["Yuka", "Ken", "Mio", "Aki"].map((n, i) => `<rect x="92" y="${430 + i * 54}" width="400" height="38" rx="19" fill="#ffffff14"/><circle cx="112" cy="${449 + i * 54}" r="14" fill="#ff735e"/><text x="140" y="${457 + i * 54}" font-family="Arial" font-size="22" font-weight="800" fill="#fff">${n}</text>`).join("")}
      <rect x="52" y="746" width="676" height="282" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 812, "準備したデモ候補", 28, 800)}
      ${[shops[0], shops[1], shops[2], shops[3]].map((s, i) => `<rect x="92" y="${852 + i * 42}" width="536" height="30" rx="15" fill="#fff4ef"/><text x="116" y="${874 + i * 42}" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#171717">${s.name}</text><text x="604" y="${874 + i * 42}" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#f25440">${s.distance}</text>`).join("")}
      <rect x="52" y="1098" width="676" height="92" rx="46" fill="#f25440"/>
      ${text(390, 1158, "スワイプ開始", 29, 800, "#fff", "middle")}
      ${bottomNav(1)}`,
    ),
  },
  {
    file: "05_swipe_mobile_390.png",
    body: phoneScreen(
      "食べたい？",
      "架空デモ店舗をスワイプ",
      `${demoBadge(548, 76, "DEMO")}
      <rect x="52" y="284" width="676" height="16" rx="8" fill="#fae0d8"/>
      <rect x="52" y="284" width="286" height="16" rx="8" fill="#f25440"/>
      ${shopCard(52, 348, shops[0], false)}
      <circle cx="166" cy="950" r="64" fill="#ffd9d4"/>
      ${text(166, 971, "×", 58, 500, "#9e1010", "middle")}
      <circle cx="614" cy="950" r="64" fill="#f25440"/>
      ${text(614, 971, "♥", 52, 800, "#fff", "middle")}
      <rect x="52" y="1176" width="676" height="84" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(390, 1230, "↶  Undo", 26, 800, "#aaa09c", "middle")}
      ${bottomNav(1)}`,
    ),
  },
  {
    file: "06_voting_complete_mobile_390.png",
    body: phoneScreen(
      "投票完了",
      "全員分を集計しています",
      `${demoBadge(548, 76)}
      <circle cx="390" cy="424" r="142" fill="#f25440"/>
      ${text(390, 454, "✓", 142, 800, "#fff", "middle")}
      ${text(390, 668, "4 / 4 voted", 40, 850, "#171717", "middle")}
      ${text(390, 718, "好みが集まりました", 26, 760, "#6a5d59", "middle")}
      <rect x="86" y="820" width="608" height="28" rx="14" fill="#fae0d8"/>
      <rect x="86" y="820" width="608" height="28" rx="14" fill="#f25440"/>
      <rect x="52" y="950" width="676" height="306" rx="42" fill="#fff" stroke="#efd4cf" stroke-width="2"/>
      ${text(92, 1018, "一致度を計算中", 32, 850)}
      ${[shops[0], shops[2], shops[1]].map((s, i) => `<rect x="92" y="${1064 + i * 50}" width="536" height="36" rx="18" fill="#fff4ef"/><text x="116" y="${1089 + i * 50}" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#171717">${s.name}</text><text x="604" y="${1089 + i * 50}" text-anchor="end" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#f25440">${s.match}</text>`).join("")}
      ${bottomNav(2)}`,
    ),
  },
  {
    file: "07_result_mobile_390.png",
    body: phoneScreen(
      "今日の一軒",
      "みんなの好みが重なりました",
      `${demoBadge(548, 76, "DEMO")}
      ${shopCard(52, 320, shops[0], false)}
      <rect x="52" y="930" width="676" height="392" rx="44" fill="#171717"/>
      ${text(92, 1000, "MATCHED", 22, 850, "#ff735e")}
      ${text(92, 1060, shops[0].name, 44, 900, "#fff")}
      ${text(92, 1112, `一致度 ${shops[0].match} ・ ★${shops[0].rating} ・ ${shops[0].reviews}`, 24, 760, "#ffffffa8")}
      ${text(92, 1158, `${shops[0].address} ・ ${shops[0].hours}`, 21, 760, "#ffffff92")}
      ${[shops[2], shops[1]].map((s, i) => `<rect x="92" y="${1200 + i * 56}" width="536" height="40" rx="20" fill="#ffffff14"/><text x="116" y="${1227 + i * 56}" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#fff">${s.name}</text><text x="600" y="${1227 + i * 56}" text-anchor="end" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#ffb7aa">${s.match}</text>`).join("")}
      ${bottomNav(2)}`,
    ),
  },
];

for (const def of screenDefs) {
  await sharp(svg(780, 1688, def.body)).png().toFile(path.join(screensDir, def.file));
}

console.log("Generated fictional GuruMeet app screens.");
