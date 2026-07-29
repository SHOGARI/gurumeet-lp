"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Heart,
  Menu,
  X,
  XIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "./phone-frame";

const APP_URL = "#experience";

const FOOD_IMAGES = {
  hero: "/mock/hero.png",
  cafe: "/mock/cafe.png",
  grill: "/mock/grill.png",
  sushi: "/mock/sushi.png",
  pasta: "/mock/pasta.png",
  yaki: "/mock/yaki.png",
  bistro: "/mock/bistro.png",
  table: "/mock/table.png",
  restaurant: "/mock/restaurant.png",
};

const screens = [
  { name: "ホーム", note: "条件を決める", src: "/screens/01_home_mobile_390.png" },
  { name: "ルーム作成", note: "10秒で準備", src: "/screens/02_create_mobile_390.png" },
  { name: "招待", note: "URLをシェア", src: "/screens/03_invite_mobile_390.png" },
  { name: "待機", note: "みんなで参加", src: "/screens/04_waiting_mobile_390.png" },
  { name: "スワイプ", note: "本音で選ぶ", src: "/screens/05_swipe_mobile_390.png" },
  { name: "投票完了", note: "好みを集計", src: "/screens/06_voting_complete_mobile_390.png" },
  { name: "結果", note: "今日の一軒", src: "/screens/07_result_mobile_390.png" },
];

const swipeCards = [
  {
    name: "Luna Cafe",
    meta: "Cafe · ¥1,000-2,000 · Demo Ave 1-2",
    image: FOOD_IMAGES.cafe,
    score: "4.8",
    reviews: "128 reviews",
    hours: "11:00-21:00",
  },
  {
    name: "Grill House",
    meta: "Grill · ¥2,000-3,500 · Sample St 3-4",
    image: FOOD_IMAGES.grill,
    score: "4.6",
    reviews: "96 reviews",
    hours: "17:00-23:00",
  },
  {
    name: "YAKI DINING",
    meta: "Yaki · ¥2,500-4,000 · Imaginary Pl 8",
    image: FOOD_IMAGES.yaki,
    score: "4.9",
    reviews: "142 reviews",
    hours: "16:00-23:30",
  },
];

const chatMessages = [
  { text: "何食べる？", side: "left" },
  { text: "なんでもいい", side: "right" },
  { text: "焼肉？", side: "left" },
  { text: "昨日食べた", side: "right" },
  { text: "じゃあラーメン？", side: "left" },
  { text: "気分じゃない", side: "right" },
];

const steps = [
  { number: "01", title: "ルームをつくる", copy: "場所と予算を選ぶ。" },
  { number: "02", title: "みんなでスワイプ", copy: "写真を見て、直感で。" },
  { number: "03", title: "今日の一軒が決まる", copy: "好みが重なる店を発表。" },
];

const finalists = [
  { rank: "01", name: "Luna Cafe", score: "92%", votes: 4 },
  { rank: "02", name: "YAKI DINING", score: "89%", votes: 4 },
  { rank: "03", name: "Grill House", score: "78%", votes: 3 },
  { rank: "04", name: "Sushi Atelier", score: "65%", votes: 2 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      variants={fadeUp}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startedAt = performance.now();
    const duration = 900;
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["使い方", "#solution"],
    ["画面", "#screens"],
    ["機能", "#features"],
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="section-shell flex h-[72px] items-center justify-between sm:h-20" aria-label="メインナビゲーション">
        <motion.a
          href="#top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="brand-mark"
          aria-label="GuruMeet トップ"
        >
          <span>G</span>
          GuruMeet
        </motion.a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="nav-link">
              {label}
            </a>
          ))}
          <a href={APP_URL} className="button button-dark !h-11 !px-5 !text-sm">
            今すぐ試す
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="icon-button md:hidden"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass section-shell rounded-2xl p-2 md:hidden"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-between rounded-xl px-3 text-sm font-semibold"
              >
                {label}
                <ChevronRight size={16} />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SwipeCard({ onSwipe }: { onSwipe: (direction: "left" | "right") => void }) {
  const [active, setActive] = useState(0);
  const card = swipeCards[active];

  const completeSwipe = (direction: "left" | "right") => {
    onSwipe(direction);
    window.setTimeout(() => setActive((value) => (value + 1) % swipeCards.length), 140);
  };

  return (
    <div className="hero-swipe-card" aria-label="飲食店カードのスワイプデモ">
      <motion.div
        key={card.name}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 70) completeSwipe(info.offset.x > 0 ? "right" : "left");
        }}
        whileDrag={{ scale: 1.025, rotate: 1.5 }}
        className="relative h-full cursor-grab overflow-hidden active:cursor-grabbing"
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          priority
          sizes="(max-width: 768px) 82vw, 400px"
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,8,8,.82)_100%)]" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-bold text-black backdrop-blur">
            徒歩 5分
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            ★ {card.score}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-xl font-bold">{card.name}</p>
          <p className="mt-1 text-xs font-medium text-white/68">{card.meta}</p>
          <p className="mt-1 text-xs font-medium text-white/68">{card.reviews} · {card.hours}</p>
        </div>
      </motion.div>
      <div className="absolute -bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        <button type="button" onClick={() => completeSwipe("left")} className="swipe-action" aria-label="この店は選ばない">
          <XIcon size={19} />
        </button>
        <button type="button" onClick={() => completeSwipe("right")} className="swipe-action swipe-action-like" aria-label="この店を食べたいにする">
          <Heart size={19} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [swipeLabel, setSwipeLabel] = useState<"SKIP" | "EAT">("EAT");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [0, -2.5]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 32]);

  return (
    <section id="top" ref={sectionRef} className="hero-section">
      <div className="hero-photo" aria-hidden="true">
        <Image
          src={FOOD_IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="section-shell hero-grid">
        <motion.div style={{ y: copyY }} className="relative z-10 pt-24 sm:pt-28 lg:pt-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="micro-label"
          >
            Swipe to decide
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            「何食べる？」
            <br />
            を<span>10秒</span>で終わらせる。
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.17 }}
            className="hero-copy"
          >
            みんなでスワイプ。
            <br />
            好みが重なる、今日の一軒へ。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26 }}
            className="mt-7 flex flex-wrap gap-3 sm:mt-9"
          >
            <a href={APP_URL} className="button button-accent">
              今すぐ試す
              <ArrowRight size={17} />
            </a>
            <a href="#experience" className="button button-light">
              体験を見る
              <ArrowDown size={15} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: stageY, rotate: stageRotate }} className="hero-stage">
          <motion.div
            initial={{ opacity: 0, x: 36, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 3.5 }}
            transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hero-phone"
          >
            <PhoneFrame
              src="/screens/05_swipe_mobile_390.png"
              alt="GuruMeetで飲食店をスワイプして選んでいる画面"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -28, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -4.5 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hero-card-wrap"
          >
            <SwipeCard onSwipe={(direction) => setSwipeLabel(direction === "right" ? "EAT" : "SKIP")} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.span
              key={swipeLabel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`hero-stamp ${swipeLabel === "EAT" ? "hero-stamp-like" : ""}`}
            >
              {swipeLabel}
            </motion.span>
          </AnimatePresence>
          <div className="hero-participants glass">
            <div className="avatar-stack">
              <span>Y</span>
              <span>K</span>
              <span>M</span>
            </div>
            <p><strong>4人</strong>が参加中</p>
          </div>
        </motion.div>
      </div>
      <a href="#problem" className="scroll-cue" aria-label="次のセクションへ">
        Scroll
        <ArrowDown size={14} />
      </a>
    </section>
  );
}

function Problem() {
  return (
    <section id="problem" className="problem-section">
      <div className="section-shell problem-grid">
        <Reveal className="problem-copy">
          <p className="micro-label text-white/45">The endless conversation</p>
          <h2>決まらない夜に、<br />もう付き合わない。</h2>
          <div className="problem-time">
            <span><CountUp value={20} /></span>
            <div>
              <strong>min.</strong>
              <p>「なんでもいい」で<br />消えていく平均時間</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="chat-window">
          <div className="chat-topbar">
            <div className="avatar-stack">
              <span>Y</span><span>K</span><span>M</span>
            </div>
            <p>今日どこ行く？</p>
            <span className="online-dot" />
          </div>
          <div className="space-y-2.5">
            {chatMessages.map((message, index) => (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.32 }}
                className={`flex ${message.side === "right" ? "justify-end" : ""}`}
              >
                <p className={`chat-bubble ${message.side === "right" ? "chat-bubble-me" : ""}`}>
                  {message.text}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 border-t border-black/7 pt-5 text-center text-xs font-semibold text-black/35">
            19:42　まだ決まらない
          </p>
        </Reveal>
      </div>
      <Reveal className="section-shell problem-answer">
        <p>GuruMeetなら</p>
        <h3>会話の代わりに、<br className="sm:hidden" />全員でスワイプ。</h3>
      </Reveal>
    </section>
  );
}

function Solution() {
  return (
    <section id="solution" className="solution-section">
      <div className="section-shell solution-layout">
        <div className="solution-copy">
          <Reveal>
            <p className="micro-label">How it works</p>
            <h2 className="section-title">迷う工程を、<br />3つにした。</h2>
          </Reveal>
          <div className="step-list">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <article className="step-row">
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="solution-stage">
          <div className="solution-note">
            <span className="online-dot" />
            リアルタイムで同期
          </div>
          <div className="solution-phone solution-phone-back">
            <PhoneFrame src="/screens/04_waiting_mobile_390.png" alt="GuruMeetの待機画面" />
          </div>
          <div className="solution-phone solution-phone-front">
            <PhoneFrame src="/screens/07_result_mobile_390.png" alt="GuruMeetの結果画面" />
          </div>
          <div className="match-note glass">
            <span><Check size={14} strokeWidth={3} /></span>
            <div>
              <small>MATCHED</small>
              <strong>全員の好みが一致</strong>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Screens() {
  return (
    <section id="screens" className="screens-section">
      <div className="section-shell screens-heading">
        <Reveal>
          <p className="micro-label text-white/45">Inside the product</p>
          <h2>触れる前から、<br />使い方がわかる。</h2>
        </Reveal>
        <Reveal delay={0.08} className="screens-index">
          <span>01</span>
          <div />
          <span>07</span>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="section-shell screens-disclaimer">
        ※画面は開発中のイメージです。店舗名・画像・住所・評価・レビュー数・営業時間はすべてデモ用のダミーデータです。
      </Reveal>
      <div className="screen-scroller">
        {screens.map((screen, index) => (
          <motion.figure
            key={screen.name}
            initial={{ opacity: 0.42, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.62 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className={`screen-item ${index === 4 ? "screen-item-featured" : ""}`}
          >
            <PhoneFrame src={screen.src} alt={`GuruMeetの${screen.name}画面`} />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{screen.name}</strong>
                <small>{screen.note}</small>
              </div>
            </figcaption>
          </motion.figure>
        ))}
        <div className="w-4 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-shell">
        <Reveal className="features-heading">
          <p className="micro-label">Built for the group</p>
          <h2 className="section-title">決める人を、<br />ひとりにしない。</h2>
        </Reveal>
        <div className="bento-grid">
          <Reveal className="bento bento-live">
            <div className="bento-copy">
              <span>LIVE</span>
              <h3>全員の「食べたい」が、<br />その場で集まる。</h3>
              <p>リアルタイム投票</p>
            </div>
            <div className="vote-visual">
              <div className="vote-row">
                <div className="avatar-stack"><span>Y</span><span>K</span><span>M</span></div>
                <strong>3 / 4 voted</strong>
              </div>
              <div className="vote-bars">
                <i style={{ width: "84%" }} />
                <i style={{ width: "62%" }} />
                <i style={{ width: "42%" }} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="bento bento-map">
            <Image
              src={FOOD_IMAGES.restaurant}
              alt="現在地から近いレストラン"
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className="object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03)_30%,rgba(0,0,0,.78)_100%)]" />
            <div className="map-pin">現在地から 800m</div>
            <div className="bento-copy absolute bottom-0 text-white">
              <h3>近い。予算内。<br />ちゃんと食べたい。</h3>
              <p className="!text-white/60">距離・予算検索</p>
            </div>
          </Reveal>

          <Reveal className="bento bento-ranking">
            <div className="bento-copy">
              <span>TOP MATCH</span>
              <h3>好みの重なりを、<br />ランキングで。</h3>
            </div>
            <ol className="ranking-list">
              <li><b>01</b><span>Luna Cafe</span><strong>92%</strong></li>
              <li><b>02</b><span>YAKI DINING</span><strong>89%</strong></li>
              <li><b>03</b><span>Grill House</span><strong>78%</strong></li>
            </ol>
          </Reveal>

          <Reveal delay={0.05} className="bento bento-detail">
            <div className="detail-phone">
              <PhoneFrame src="/screens/06_voting_complete_mobile_390.png" alt="投票完了画面" />
            </div>
            <div className="bento-copy">
              <h3>接戦なら、<br />最後の一票。</h3>
              <p>決選投票</p>
            </div>
          </Reveal>

          <Reveal className="bento bento-maps-link">
            <div className="route-line" aria-hidden="true"><i /><i /><i /></div>
            <div className="bento-copy">
              <span>GO</span>
              <h3>決まったら、<br />そのままお店へ。</h3>
              <p>Google Maps連携</p>
            </div>
            <ArrowRight size={22} className="absolute right-7 top-7" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="section-shell experience-layout">
        <Reveal className="experience-copy">
          <p className="micro-label">The moment</p>
          <h2>決まる瞬間まで、<br />画面が主役になる。</h2>
          <p>
            食べたい店だけが自然に残って、最後は全員が納得できる一軒へ。
            プレゼンでも、スマホでも、動きだけで伝わる体験です。
          </p>
        </Reveal>
        <Reveal delay={0.07} className="experience-stage">
          <div className="experience-photo">
            <Image
              src={FOOD_IMAGES.table}
              alt="友人と食事を囲むテーブル"
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              className="object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
          <motion.div
            className="experience-phone"
            whileInView={{ y: [18, 0], rotate: [-3.2, -1.2] }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhoneFrame src="/screens/07_result_mobile_390.png" alt="GuruMeetで決まったお店の結果画面" />
          </motion.div>
          <div className="match-panel glass">
            <span>RESULT</span>
            <strong>全員一致</strong>
            <p>Luna Cafe</p>
          </div>
          <div className="finalist-panel">
            {finalists.map((item, index) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.16 + index * 0.09, duration: 0.48 }}
                className="finalist-row"
              >
                <b>{item.rank}</b>
                <span>{item.name}</span>
                <strong>{item.score}</strong>
                <i style={{ width: `${item.votes * 23}%` }} />
              </motion.div>
            ))}
          </div>
          <div className="decision-strip">
            <span>4 people</span>
            <span>12 cards</span>
            <span>1 place</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="section-shell">
        <Reveal>
          <p className="micro-label text-white/45">Tonight, decided.</p>
          <h2>今日のご飯、<br />もう迷わない。</h2>
          <a href={APP_URL} className="button button-white">
            GuruMeetを試す
            <ArrowRight size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-main">
          <div>
            <p className="brand-mark"><span>G</span>GuruMeet</p>
            <p className="mt-4 text-sm text-black/45">「何食べる？」を、みんなのスワイプで決める。</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/" target="_blank" rel="noreferrer"><Code2 size={15} />GitHub</a>
            <a href="https://talent.supporterz.jp/geekcamp/" target="_blank" rel="noreferrer">技育CAMP</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GuruMeet.</p>
          <p>Made for better nights out.</p>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Screens />
      <Features />
      <Experience />
      <FinalCta />
      <Footer />
    </main>
  );
}
