"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Heart,
  LocateFixed,
  Map,
  Menu,
  MousePointer2,
  Play,
  Plus,
  Radio,
  Sparkles,
  Trophy,
  Users,
  X,
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

const FOOD_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=85",
  demo:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=85",
};

const APP_URL = "#demo";
const DEMO_VIDEO_URL = "";

const screens = [
  { name: "ホーム", src: "/screens/01_home_mobile_390.png" },
  { name: "ルーム作成", src: "/screens/02_create_mobile_390.png" },
  { name: "招待", src: "/screens/03_invite_mobile_390.png" },
  { name: "待機", src: "/screens/04_waiting_mobile_390.png" },
  { name: "スワイプ", src: "/screens/05_swipe_mobile_390.png" },
  { name: "投票完了", src: "/screens/06_voting_complete_mobile_390.png" },
  { name: "結果", src: "/screens/07_result_mobile_390.png" },
];

const steps = [
  {
    number: "01",
    title: "ルームを作る",
    description: "人数とエリア、予算を選ぶだけ。URLを送れば全員すぐに参加できます。",
    icon: Plus,
    accent: "bg-[#ffe3dc] text-[#d83e2b]",
  },
  {
    number: "02",
    title: "店をスワイプ",
    description: "写真を見て、直感で左右にスワイプ。遠慮なしの本音が集まります。",
    icon: MousePointer2,
    accent: "bg-[#dfece3] text-[#296849]",
  },
  {
    number: "03",
    title: "みんなの好みで決定",
    description: "全員の「食べたい」が重なる一軒を、GuruMeetがその場で発表します。",
    icon: Trophy,
    accent: "bg-[#f7e8bd] text-[#7b5a09]",
  },
];

const features = [
  {
    title: "リアルタイム投票",
    description: "みんなのスワイプをその場で集計。",
    icon: Radio,
  },
  {
    title: "距離検索",
    description: "今いる場所から行きやすい店だけ表示。",
    icon: LocateFixed,
  },
  {
    title: "予算検索",
    description: "全員が納得できる価格帯で絞り込み。",
    icon: CircleDollarSign,
  },
  {
    title: "Google Maps連携",
    description: "決まったら迷わず、そのままお店へ。",
    icon: Map,
  },
  {
    title: "ランキング表示",
    description: "人気の理由までひと目でわかる。",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "決選投票",
    description: "接戦の候補は最後の一票で決める。",
    icon: Sparkles,
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
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
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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
      <nav
        className="section-shell flex h-20 items-center justify-between"
        aria-label="メインナビゲーション"
      >
        <motion.a
          href="#top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-[22px] font-bold text-[#f4563f]"
          aria-label="GuruMeet トップ"
        >
          GuruMeet
        </motion.a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-semibold text-[#514945] transition-colors hover:text-[#f4563f]"
            >
              {label}
            </a>
          ))}
          <a
            href={APP_URL}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#201d1b] px-5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
          >
            今すぐ試す
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-black/10 bg-white/70 md:hidden"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass section-shell rounded-[20px] p-3 md:hidden"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-between rounded-[14px] px-3 text-sm font-bold"
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

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 55]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[760px] overflow-hidden pb-12 pt-28 lg:min-h-[860px] lg:pb-20 lg:pt-24"
    >
      <motion.div
        style={{ y: backdropY }}
        className="absolute -right-[10%] top-[8%] h-[72%] w-[72%] opacity-25 blur-[5px] lg:right-[-2%] lg:w-[56%]"
        aria-hidden="true"
      >
        <Image
          src={FOOD_IMAGES.hero}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 72vw, 56vw"
          className="rounded-[48px] object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffaf7_0%,rgba(255,250,247,.96)_42%,rgba(255,250,247,.22)_100%)] lg:bg-[linear-gradient(90deg,#fffaf7_0%,rgba(255,250,247,.97)_42%,rgba(255,250,247,.25)_72%,rgba(255,250,247,.6)_100%)]" />
      <div className="grain" />

      <div className="section-shell relative grid items-center gap-12 lg:min-h-[740px] lg:grid-cols-[1.04fr_.96fr]">
        <div className="relative z-10 pt-6 lg:pt-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            Swipe. Match. Eat.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[clamp(48px,7vw,94px)] font-[740] leading-[1.04]"
          >
            <span className="block">「何食べる？」</span>
            <span className="block">を<span className="text-[#f4563f]">10秒</span>で</span>
            <span className="block">終わらせる。</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-[560px] text-base leading-8 text-[#655a55] sm:text-lg"
          >
            もう「なんでもいい」で迷わない。
            <br className="hidden sm:block" />
            グループ全員でスワイプして、その場で今日の一軒が決まる。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              href={APP_URL}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f4563f] px-7 font-bold text-white shadow-[0_12px_32px_rgba(244,86,63,.24)]"
            >
              今すぐ試す
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-7 font-bold backdrop-blur"
            >
              <Play size={17} fill="currentColor" />
              デモを見る
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          style={{ y: phoneY }}
          className="relative mx-auto h-[550px] w-full max-w-[520px] sm:h-[650px] lg:h-[720px]"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-1.2, -0.3, -1.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 w-[258px] -translate-x-1/2 -translate-y-1/2 sm:w-[300px] lg:w-[322px]"
          >
            <PhoneFrame
              src="/screens/05_swipe_mobile_390.png"
              alt="GuruMeetで飲食店をスワイプして選んでいる画面"
              priority
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute right-[-4px] top-[16%] z-10 rounded-[20px] px-4 py-3 sm:right-[-18px] lg:right-[-20px]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-[#ffe2dc] text-[#f4563f]">
                <Users size={18} />
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#8a7c76]">参加中</p>
                <p className="text-sm font-bold">4人でスワイプ</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.8, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute bottom-[12%] left-[-2px] z-10 rounded-[20px] p-3 sm:left-[-22px]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#f4563f] text-white">
                <Heart size={20} fill="currentColor" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#8a7c76]">MATCH!</p>
                <p className="text-sm font-bold">全員が食べたい</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#problem"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8e817b] lg:flex"
      >
        Scroll
        <ArrowDown size={15} />
      </motion.a>
    </section>
  );
}

function Problem() {
  return (
    <section id="problem" className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="section-shell grid items-center gap-16 lg:grid-cols-[.92fr_1.08fr]">
        <Reveal>
          <span className="eyebrow">The problem</span>
          <h2 className="display-heading !text-[clamp(38px,4.5vw,68px)]">
            毎回こんな会話、
            <br />
            していませんか？
          </h2>
          <p className="body-copy mt-6 max-w-[510px]">
            みんなの好みを聞くほど、候補は増えて、決める人だけが疲れていく。
          </p>
          <div className="mt-9 flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#fff0ec] text-[#f4563f]">
              <Clock3 size={22} />
            </span>
            <div>
              <p className="text-3xl font-bold">
                <CountUp value={20} />
                <span className="ml-1 text-lg">分</span>
              </p>
              <p className="text-sm font-semibold text-[#8a7c76]">決まらないまま過ぎる時間</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto max-w-[560px] rounded-[24px] border border-black/8 bg-[#f6f7f8] p-4 shadow-[0_24px_70px_rgba(32,29,27,.07)] sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-black/7 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[#dbe8df]">
                  <Users size={19} />
                </span>
                <div>
                  <p className="text-sm font-bold">今日どこ行く？</p>
                  <p className="text-[11px] font-semibold text-[#8e8480]">メンバー 4人</p>
                </div>
              </div>
              <span className="size-2 rounded-full bg-[#5cc47d]" />
            </div>
            <div className="space-y-3" aria-label="よくあるグループチャット">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={message.text}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.35 }}
                  className={`flex ${message.side === "right" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-[18px] px-4 py-3 text-sm font-semibold ${
                      message.side === "right"
                        ? "rounded-tr-[5px] bg-[#8ad568] text-[#1b3119]"
                        : "rounded-tl-[5px] bg-white shadow-[0_3px_12px_rgba(0,0,0,.04)]"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-7 border-t border-black/7 pt-6 text-center">
              <p className="text-sm font-bold text-[#9b8e88]">そして、時間だけが過ぎる。</p>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal className="section-shell mt-20 text-center sm:mt-28">
        <p className="text-sm font-bold text-[#f4563f]">GuruMeetなら</p>
        <p className="mt-3 text-[clamp(34px,5vw,64px)] font-[730] leading-tight">
          全員でスワイプするだけ。
        </p>
      </Reveal>
    </section>
  );
}

function Solution() {
  return (
    <section id="solution" className="py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <Reveal className="max-w-[800px]">
          <span className="eyebrow">How it works</span>
          <h2 className="display-heading">決めるまで、たった3ステップ。</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.1}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-black/8 bg-white p-7 shadow-[0_12px_40px_rgba(44,30,24,.05)] sm:p-9"
                >
                  <span className="absolute right-5 top-2 text-[80px] font-bold text-black/[.035]">
                    {step.number}
                  </span>
                  <div className={`grid size-14 place-items-center rounded-[18px] ${step.accent}`}>
                    <Icon size={25} />
                  </div>
                  <p className="mt-14 text-xs font-bold tracking-[.14em] text-[#9a8d87]">
                    STEP {step.number}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#766a64]">{step.description}</p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-12 grid grid-cols-3 divide-x divide-black/10 rounded-[24px] border border-black/8 bg-white py-7 sm:mt-16 sm:py-9">
          {[
            [10, "秒で決定"],
            [3, "ステップ"],
            [0, "円で使える"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-[#f4563f] sm:text-5xl">
                <CountUp value={Number(value)} />
                {value === 0 ? "円" : ""}
              </p>
              <p className="mt-2 text-[11px] font-bold text-[#857872] sm:text-sm">{label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Screens() {
  return (
    <section id="screens" className="overflow-hidden bg-[#201d1b] py-24 text-white sm:py-32 lg:py-40">
      <div className="section-shell">
        <Reveal>
          <span className="eyebrow !text-[#ff806c]">Inside GuruMeet</span>
          <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <h2 className="max-w-[780px] text-[clamp(38px,5.2vw,74px)] font-[720] leading-[1.08]">
              迷いが、期待に変わる。
            </h2>
            <p className="max-w-[370px] text-sm leading-7 text-white/55 sm:text-base">
              作る、誘う、選ぶ、決まる。
              <br />
              すべての瞬間を、気持ちよく。
            </p>
          </div>
        </Reveal>
      </div>
      <div className="screen-scroller mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(20px,calc((100vw-1180px)/2))] pb-12 sm:gap-9 lg:mt-20">
        {screens.map((screen, index) => (
          <motion.figure
            key={screen.name}
            initial={{ opacity: 0.45, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.58 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-[246px] shrink-0 snap-center sm:w-[286px]"
          >
            <PhoneFrame src={screen.src} alt={`GuruMeetの${screen.name}画面`} />
            <figcaption className="mt-5 flex items-center justify-between px-2">
              <span className="text-sm font-bold">{screen.name}</span>
              <span className="text-xs font-bold text-white/35">
                {String(index + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </motion.figure>
        ))}
        <div className="w-2 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <Reveal className="max-w-[820px]">
          <span className="eyebrow">Everything you need</span>
          <h2 className="display-heading">全員が「これならいい」と思える仕組み。</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={(index % 3) * 0.06}>
                <motion.article
                  whileHover={{ y: -5, borderColor: "rgba(244,86,63,.28)" }}
                  className="group min-h-[210px] rounded-[22px] border border-black/8 bg-[#fffdfb] p-7 transition-shadow hover:shadow-[0_18px_50px_rgba(45,31,26,.07)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-[16px] bg-[#f3efec] text-[#403a37] transition-colors group-hover:bg-[#ffe4de] group-hover:text-[#f4563f]">
                      <Icon size={23} />
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-black/20 transition-transform group-hover:translate-x-1 group-hover:text-[#f4563f]"
                    />
                  </div>
                  <h3 className="mt-8 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#776b65]">{feature.description}</p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="demo" className="py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <Reveal className="text-center">
          <span className="eyebrow">Live demo</span>
          <h2 className="display-heading mx-auto">見ると、10秒でわかる。</h2>
          <p className="body-copy mx-auto mt-5 max-w-[600px]">
            ルームを作ってから今日の一軒が決まるまでを、短いデモで。
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-12 sm:mt-16">
          <div className="relative aspect-video overflow-hidden rounded-[24px] bg-[#24201e] shadow-[0_30px_90px_rgba(43,29,23,.15)]">
            {DEMO_VIDEO_URL && playing ? (
              <iframe
                src={DEMO_VIDEO_URL}
                title="GuruMeet デモ動画"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src={FOOD_IMAGES.demo}
                  alt="友人と食事を囲むテーブル"
                  fill
                  sizes="(max-width: 1220px) calc(100vw - 40px), 1180px"
                  className="object-cover opacity-65"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                {playing ? (
                  <div className="glass absolute left-1/2 top-1/2 w-[min(86%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[20px] p-6 text-center text-[#201d1b]">
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#ffe4de] text-[#f4563f]">
                      <Play size={20} fill="currentColor" />
                    </span>
                    <p className="mt-4 text-lg font-bold">デモ動画をここに埋め込めます</p>
                    <p className="mt-2 text-sm leading-6 text-[#766a64]">
                      URLを設定すると、このエリアでそのまま再生されます。
                    </p>
                    <a
                      href="#screens"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#d93f2c]"
                    >
                      アプリ画面を見る
                      <ArrowRight size={16} />
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#201d1b] shadow-2xl transition-transform hover:scale-105 sm:size-24"
                    aria-label="デモ動画を再生"
                  >
                    <Play size={28} fill="currentColor" className="translate-x-0.5" />
                  </button>
                )}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-white/60">
                      GuruMeet in 30 sec
                    </p>
                    <p className="mt-2 text-lg font-bold sm:text-2xl">今日の一軒が決まるまで</p>
                  </div>
                  <span className="hidden rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-bold backdrop-blur sm:block">
                    DEMO PLACEHOLDER
                  </span>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] bg-[#f4563f] px-6 py-20 text-center text-white sm:px-12 sm:py-28 lg:py-32">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-white/70">
              Ready to eat?
            </p>
            <h2 className="relative mt-5 text-[clamp(42px,7vw,90px)] font-[740] leading-[1.08]">
              今日のご飯、
              <br />
              もう迷わない。
            </h2>
            <motion.a
              href={APP_URL}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="relative mt-10 inline-flex h-16 items-center gap-3 rounded-full bg-white px-8 font-bold text-[#d93f2c] shadow-[0_16px_45px_rgba(124,31,18,.2)]"
            >
              GuruMeetを試す
              <ArrowRight size={19} />
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white pb-10 pt-16">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-10 border-t border-black/10 pt-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-2xl font-bold text-[#f4563f]">GuruMeet</p>
            <p className="mt-3 max-w-[390px] text-sm leading-6 text-[#7c706a]">
              「何食べる？」を、みんなのスワイプで決める。
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-bold">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-[#f4563f]"
            >
              <Code2 size={17} />
              GitHub
            </a>
            <a
              href="https://talent.supporterz.jp/geekcamp/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#f4563f]"
            >
              技育CAMP
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 text-xs font-semibold text-[#a1948e] sm:flex-row">
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
      <Demo />
      <FinalCta />
      <Footer />
    </main>
  );
}
