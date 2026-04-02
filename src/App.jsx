import { useState, useEffect, useRef } from "react";

// ── utils ──────────────────────────────────────────────────
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b));
const pick = arr => arr[randInt(0, arr.length)];

// ── constants ──────────────────────────────────────────────
const GLITCH_CHARS = "!@#$%^&*<>?/|\\[]{}~`0123456789ABCDEF";
const BOOT_LINES = [
  "BIRTHDAY_OS v2025.04.02 — booting...",
  "Loading confetti modules.............. ✓",
  "Calibrating cake sensors.............. ✓",
  "Checking Rik's grumpiness level....... WARNING",
  "Grumpiness: 94% (within normal range)",
  "Overriding khadus.exe................. ✓",
  "Injecting good vibes.................. ✓",
  "Installing birthday.dll............... ✓",
  "All systems go. Happy Birthday, Rik!",
];

const ROAST_LINES = [
  { delay: 0,    text: "> scanning personality profile..." },
  { delay: 800,  text: "> result: certified khadus™" },
  { delay: 1600, text: "> checking grumpiness index... 94/100" },
  { delay: 2400, text: "> ERROR: too much attitude detected" },
  { delay: 3200, text: "> attempting fix... failed." },
  { delay: 4000, text: "> scrap that. we love you anyway." },
  { delay: 4800, text: "> initiating birthday sequence... 🎂" },
];

const CANDLES = 5;

// ── GlitchText ─────────────────────────────────────────────
function GlitchText({ text, style, glitching }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (!glitching) { setDisplay(text); return; }
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      if (tick > 18) { setDisplay(text); clearInterval(id); return; }
      setDisplay(
        text.split("").map((c, i) =>
          Math.random() < 0.35 ? pick(GLITCH_CHARS) : c
        ).join("")
      );
    }, 60);
    return () => clearInterval(id);
  }, [glitching, text]);

  return <span style={style}>{display}</span>;
}

// ── Scanlines overlay ───────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
      mixBlendMode: "multiply",
    }} />
  );
}

// ── CRT flicker ─────────────────────────────────────────────
function CRTFlicker() {
  return (
    <style>{`
      @keyframes crtFlicker {
        0%,100% { opacity: 1; }
        92% { opacity: 1; }
        93% { opacity: 0.85; }
        94% { opacity: 1; }
        96% { opacity: 0.9; }
        97% { opacity: 1; }
      }
      .crt { animation: crtFlicker 5s infinite; }

      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      .cursor::after {
        content: '█';
        animation: blink 1s step-end infinite;
        margin-left: 2px;
        font-size: 0.9em;
      }

      @keyframes glitchShift {
        0%,100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
        20% { clip-path: inset(30% 0 50% 0); transform: translateX(-6px); }
        40% { clip-path: inset(10% 0 70% 0); transform: translateX(6px); }
        60% { clip-path: inset(60% 0 20% 0); transform: translateX(-3px); }
        80% { clip-path: inset(80% 0 5% 0); transform: translateX(3px); }
      }
      @keyframes cakeWobble {
        0%,100% { transform: rotate(-2deg) scale(1); }
        50%      { transform: rotate(2deg) scale(1.03); }
      }
      @keyframes candleFlame {
        0%,100% { transform: scaleY(1) scaleX(1) translateX(0); }
        25%  { transform: scaleY(1.12) scaleX(0.88) translateX(-1px); }
        75%  { transform: scaleY(0.88) scaleX(1.12) translateX(1px); }
      }
      @keyframes floatUp {
        0%   { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
      }
      @keyframes revealCard {
        0%   { opacity: 0; transform: perspective(800px) rotateX(20deg) translateY(60px); }
        100% { opacity: 1; transform: perspective(800px) rotateX(0deg) translateY(0); }
      }
      @keyframes screenIn {
        from { opacity: 0; transform: scale(1.04); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes progressFill {
        from { width: 0%; }
        to   { width: 100%; }
      }
      @keyframes pulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(0,255,136,0.4); }
        50%      { box-shadow: 0 0 0 10px rgba(0,255,136,0); }
      }
      @keyframes confettiFall {
        0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
      @keyframes starPop {
        0%   { transform: scale(0) rotate(0deg); opacity: 0; }
        60%  { transform: scale(1.3) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
      }
    `}</style>
  );
}

// ── SCREEN 1: Boot ──────────────────────────────────────────
function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => { setDone(true); setTimeout(onDone, 700); }, 600);
        }
      }, i * 420 + 300);
    });
  }, []);

  return (
    <div className="crt" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "clamp(2rem, 6vw, 4rem)",
      animation: "screenIn 0.5s ease",
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(11px, 2vw, 15px)",
        color: "#00ff88",
        maxWidth: 680,
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{
          fontSize: "clamp(22px, 5vw, 36px)",
          fontWeight: 700,
          color: "#00ff88",
          marginBottom: "2.5rem",
          letterSpacing: 2,
          textShadow: "0 0 20px rgba(0,255,136,0.6)",
        }}>
          BIRTHDAY_OS
          <span style={{ fontSize: "0.4em", color: "rgba(0,255,136,0.5)", marginLeft: 12 }}>v2025</span>
        </div>

        <div style={{ minHeight: "clamp(200px, 40vh, 320px)" }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              marginBottom: "0.5rem",
              color: l.includes("WARNING") || l.includes("ERROR") ? "#ff6b6b"
                   : l.includes("✓") ? "#00ff88"
                   : l.includes("Happy Birthday") ? "#FFD93D"
                   : "rgba(0,255,136,0.65)",
              textShadow: l.includes("Happy Birthday") ? "0 0 12px rgba(255,217,61,0.5)" : "none",
            }}>{l}</div>
          ))}
          {lines.length > 0 && lines.length < BOOT_LINES.length && (
            <div className="cursor" style={{ color: "rgba(0,255,136,0.5)" }} />
          )}
        </div>

        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "rgba(0,255,136,0.5)" }}>
            <span>LOADING</span><span>{progress}%</span>
          </div>
          <div style={{ background: "rgba(0,255,136,0.1)", borderRadius: 3, height: 6, overflow: "hidden", border: "1px solid rgba(0,255,136,0.2)" }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00ff88, #00e5ff)",
              borderRadius: 3,
              transition: "width 0.4s ease",
              boxShadow: "0 0 10px rgba(0,255,136,0.5)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: Glitch Reveal ─────────────────────────────────
function GlitchReveal({ onDone }) {
  const [phase, setPhase] = useState(0);
  // 0=glitching name, 1=settled, 2=out

  useEffect(() => {
    setTimeout(() => setPhase(1), 1800);
    setTimeout(() => { setPhase(2); setTimeout(onDone, 500); }, 3200);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1.5rem",
      animation: "screenIn 0.4s ease",
      opacity: phase === 2 ? 0 : 1,
      transition: "opacity 0.5s ease",
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(48px, 14vw, 120px)",
        fontWeight: 900,
        letterSpacing: -2,
        lineHeight: 1,
        color: "#00ff88",
        textShadow: "0 0 40px rgba(0,255,136,0.4), 4px 0 #ff006e, -4px 0 #00e5ff",
        position: "relative",
        userSelect: "none",
      }}>
        <GlitchText text="RIK" glitching={phase === 0} style={{}} />
        {/* Glitch layers */}
        {phase === 0 && <>
          <span style={{
            position: "absolute", inset: 0, color: "#ff006e", opacity: 0.6,
            animation: "glitchShift 0.4s steps(1) infinite",
            pointerEvents: "none",
          }}>RIK</span>
          <span style={{
            position: "absolute", inset: 0, color: "#00e5ff", opacity: 0.6,
            animation: "glitchShift 0.4s steps(1) 0.13s infinite",
            pointerEvents: "none",
          }}>RIK</span>
        </>}
      </div>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(13px, 2.5vw, 18px)",
        color: phase === 1 ? "#FFD93D" : "rgba(255,217,61,0)",
        letterSpacing: 6,
        textTransform: "uppercase",
        transition: "color 0.8s ease, letter-spacing 0.8s ease",
        letterSpacing: phase === 1 ? "6px" : "20px",
        textShadow: "0 0 16px rgba(255,217,61,0.5)",
      }}>
        birthday mode: ON
      </div>
    </div>
  );
}

// ── SCREEN 3: Roast Terminal ────────────────────────────────
function RoastTerminal({ onDone }) {
  const [visible, setVisible] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    ROAST_LINES.forEach(({ delay, text }, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, text]);
        if (i === ROAST_LINES.length - 1) {
          setTimeout(() => { setDone(true); setTimeout(onDone, 800); }, 1000);
        }
      }, delay);
    });
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "clamp(2rem, 6vw, 4rem)",
      animation: "screenIn 0.5s ease",
    }}>
      <div style={{
        maxWidth: 640, margin: "0 auto", width: "100%",
        background: "rgba(0,255,136,0.03)",
        border: "1px solid rgba(0,255,136,0.15)",
        borderRadius: 12,
        padding: "2rem",
        fontFamily: "'Courier New', monospace",
      }}>
        <div style={{
          display: "flex", gap: 8, marginBottom: "1.5rem", alignItems: "center",
        }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(0,255,136,0.3)", letterSpacing: 2 }}>
            rik_profile.sh
          </span>
        </div>

        <div style={{ minHeight: 240 }}>
          {visible.map((line, i) => (
            <div key={i} style={{
              fontSize: "clamp(12px, 2vw, 15px)",
              marginBottom: "0.6rem",
              color: line.includes("ERROR") ? "#ff6b6b"
                   : line.includes("certified") || line.includes("khadus") ? "#FF9A3C"
                   : line.includes("we love") ? "#FFD93D"
                   : line.includes("🎂") ? "#FF6FC8"
                   : "rgba(0,255,136,0.8)",
              textShadow: line.includes("we love") ? "0 0 10px rgba(255,217,61,0.4)" : "none",
            }}>{line}</div>
          ))}
          {!done && visible.length > 0 && visible.length < ROAST_LINES.length && (
            <div className="cursor" style={{ color: "rgba(0,255,136,0.4)", fontSize: 13 }} />
          )}
        </div>

        {done && (
          <div style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(0,255,136,0.1)",
            fontSize: 12,
            color: "rgba(0,255,136,0.35)",
            letterSpacing: 1,
          }}>
            process completed — exit code 🎉
          </div>
        )}
      </div>
    </div>
  );
}

// ── SCREEN 4: Cake ──────────────────────────────────────────
function CakeScreen({ onDone }) {
  const [blown, setBlown] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [showNext, setShowNext] = useState(false);

  const blowCandles = () => {
    if (blown) return;
    setBlown(true);
    const newSparks = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: rand(30, 70),
      vy: rand(-160, -60),
      vx: rand(-80, 80),
      color: pick(["#FFD93D","#FF6FC8","#00ff88","#00e5ff","#FF9A3C","#C77DFF"]),
    }));
    setSparks(newSparks);
    setTimeout(() => { setShowNext(true); }, 1200);
    setTimeout(() => onDone(), 2800);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "2rem",
      animation: "screenIn 0.5s ease",
      padding: "2rem",
    }}>
      {/* Sparks */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
        {sparks.map(s => (
          <div key={s.id} style={{
            position: "absolute", left: `${s.x}%`, bottom: "45%",
            width: 8, height: 8, borderRadius: "50%", background: s.color,
            animation: `floatUp 1.2s cubic-bezier(.2,.6,.4,1) forwards`,
            "--vy": `${s.vy}px`, "--vx": `${s.vx}px`,
            boxShadow: `0 0 6px ${s.color}`,
          }} />
        ))}
      </div>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(12px, 2.5vw, 16px)",
        color: "#00ff88",
        letterSpacing: 3,
        textAlign: "center",
      }}>
        {blown ? (
          <span style={{ color: "#FFD93D", textShadow: "0 0 20px rgba(255,217,61,0.5)", fontSize: "clamp(18px,4vw,28px)", letterSpacing: 4 }}>
            🎉 WISH REGISTERED 🎉
          </span>
        ) : "MAKE A WISH"}
      </div>

      {/* Cake */}
      <div
        onClick={blowCandles}
        style={{
          cursor: blown ? "default" : "pointer",
          animation: blown ? "none" : "cakeWobble 2.5s ease-in-out infinite",
          userSelect: "none",
          filter: blown ? "brightness(0.7)" : "none",
          transition: "filter 0.5s ease",
        }}
      >
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Plate */}
          <ellipse cx="110" cy="200" rx="90" ry="12" fill="#1a1a2e" stroke="rgba(0,255,136,0.3)" strokeWidth="1" />
          {/* Bottom tier */}
          <rect x="28" y="148" width="164" height="50" rx="14" fill="#1a0533" stroke="rgba(0,255,136,0.4)" strokeWidth="1.5" />
          <rect x="28" y="148" width="164" height="18" rx="14" fill="rgba(0,255,136,0.08)" />
          {/* Frosting blobs bottom */}
          {[42,65,88,111,134,157,172].map((x,i)=>(
            <ellipse key={i} cx={x} cy={150} rx={10} ry={7} fill="#0d001a" stroke="rgba(0,255,136,0.25)" strokeWidth={1} />
          ))}
          {/* Pearl dots */}
          {[40,55,70,85,100,115,130,145,160,175].map((x,i)=>(
            <circle key={i} cx={x} cy={193} r={4} fill="rgba(0,255,136,0.3)" />
          ))}
          {/* Top tier */}
          <rect x="55" y="96" width="110" height="54" rx="12" fill="#10002b" stroke="rgba(0,255,136,0.4)" strokeWidth="1.5" />
          <rect x="55" y="96" width="110" height="16" rx="12" fill="rgba(0,255,136,0.07)" />
          {/* Frosting blobs top */}
          {[64,82,100,118,136,154].map((x,i)=>(
            <ellipse key={i} cx={x} cy={98} rx={8} ry={6} fill="#0d001a" stroke="rgba(0,255,136,0.2)" strokeWidth={1} />
          ))}
          {/* Candles */}
          {[72, 88, 110, 132, 148].map((x, i) => (
            <g key={i}>
              <rect x={x-4} y={60} width={8} height={38} rx={3}
                fill={["#FF6B6B","#FFD93D","#00ff88","#4D96FF","#FF6FC8"][i]}
                opacity={blown ? 0.3 : 0.9}
              />
              {/* Flame */}
              {!blown && (
                <g style={{ transformOrigin: `${x}px 60px`, animation: "candleFlame 0.6s ease-in-out infinite alternate" }}>
                  <ellipse cx={x} cy={54} rx={5} ry={8} fill="#FFD93D" opacity={0.9} />
                  <ellipse cx={x} cy={56} rx={3} ry={5} fill="#FF9A3C" opacity={0.8} />
                  <ellipse cx={x} cy={58} rx={1.5} ry={2.5} fill="white" opacity={0.6} />
                </g>
              )}
              {blown && <line x1={x} y1={56} x2={x} y2={62} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="2 2" />}
            </g>
          ))}
        </svg>
      </div>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(10px, 2vw, 13px)",
        color: "rgba(0,255,136,0.35)",
        letterSpacing: 2,
        textAlign: "center",
        animation: blown ? "none" : "blink 2s step-end infinite",
      }}>
        {blown ? "" : "[ click to blow candles ]"}
      </div>
    </div>
  );
}

// ── SCREEN 4.5: Heart Game ──────────────────────────────────
function HeartGame() {
  const NUM_HEARTS = 10;
  const winner = useRef(randInt(0, NUM_HEARTS)).current;
  const [clicked, setClicked] = useState({});
  const [popups, setPopups] = useState({});

  const handleClick = (idx) => {
    if (clicked[idx]) return;
    setClicked(prev => ({ ...prev, [idx]: true }));
    setPopups(prev => ({ ...prev, [idx]: true }));

    if (idx !== winner) {
      setTimeout(() => {
        setPopups(prev => ({ ...prev, [idx]: false }));
      }, 750);
    }
  };

  return (
    <div style={{ marginBottom: "2rem", width: "100%", maxWidth: 300, margin: "0 auto 2rem" }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        color: "rgba(0,255,136,0.6)",
        marginBottom: "1rem",
        letterSpacing: 2
      }}>
        // find me
      </div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
      }}>
        {Array.from({ length: NUM_HEARTS }).map((_, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "28px",
                cursor: "pointer",
                filter: clicked[i] ? (i === winner ? "none" : "grayscale(80%) opacity(0.5)") : "drop-shadow(0 0 8px rgba(255,0,110,0.5))",
                transform: clicked[i] && i === winner ? "scale(1.2)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleClick(i)}
            >
              ❤️
            </div>
            {popups[i] && (
              <div style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                background: i === winner ? "#00ff88" : "#ff6b6b",
                color: "black",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "'Courier New', monospace",
                fontWeight: "bold",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                marginBottom: "6px",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                animation: "screenIn 0.3s cubic-bezier(.2,.8,.3,1)",
                opacity: 1,
                transition: "opacity 0.3s ease"
              }}>
                {i === winner ? "You are the best!" : "Try again!"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCREEN 5: Final Message ─────────────────────────────────
function FinalScreen({ onRestart }) {
  const [stars, setStars] = useState([]);
  const [confetti] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: rand(0, 100),
      color: pick(["#FFD93D","#FF6FC8","#00ff88","#00e5ff","#FF9A3C","#C77DFF","#FF6B6B"]),
      size: rand(6, 14),
      duration: rand(2, 5),
      delay: rand(0, 3),
      rotate: rand(0, 360),
    }))
  );

  useEffect(() => {
    const s = Array.from({ length: 8 }, (_, i) => ({
      id: i, delay: i * 120,
    }));
    setTimeout(() => setStars(s), 400);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
      animation: "screenIn 0.6s ease",
      position: "relative", overflowX: "hidden", minHeight: "100vh"
    }}>
      {/* Confetti rain */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {confetti.map(c => (
          <div key={c.id} style={{
            position: "absolute",
            left: `${c.x}%`, top: -20,
            width: c.size, height: c.size * 0.6,
            borderRadius: 2,
            background: c.color,
            animation: `confettiFall ${c.duration}s linear ${c.delay}s infinite`,
            transform: `rotate(${c.rotate}deg)`,
            opacity: 0.85,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 560, width: "100%" }}>
        {/* Stars animation */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem" }}>
          {stars.map(s => (
            <div key={s.id} style={{
              fontSize: 22,
              animation: `starPop 0.5s cubic-bezier(.2,.8,.3,1) ${s.delay}ms both`,
            }}>⭐</div>
          ))}
        </div>

        {/* Main message card */}
        <div style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: 24,
          padding: "clamp(2rem, 6vw, 3rem)",
          animation: "revealCard 0.7s cubic-bezier(.2,.8,.3,1) 0.2s both",
          boxShadow: "0 0 60px rgba(0,255,136,0.08), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(11px, 2vw, 13px)",
            color: "rgba(0,255,136,0.4)",
            letterSpacing: 4,
            marginBottom: "1.5rem",
          }}>// HAPPY BIRTHDAY</div>

          <h1 style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(52px, 13vw, 96px)",
            fontWeight: 700,
            lineHeight: 0.95,
            margin: "0 0 1.5rem",
            background: "linear-gradient(135deg, #00ff88 0%, #00e5ff 40%, #FFD93D 70%, #FF6FC8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(0,255,136,0.3))",
          }}>Rik</h1>

          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)",
            margin: "0 auto 1.5rem",
          }} />

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
            Happy Birthday to someone who is not just my best friend, but also a mentor I truly admire 🎉✨
          </p>

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
            To others, you might come off as a little strict or serious… but I’ve been lucky enough to see the real you someone kind, genuine, and incredibly supportive. And honestly, that’s what makes you so special to me.
          </p>

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
            Your dedication towards your goals, your discipline, and the way you carry yourself inspires me more than you probably realize. You don’t just teach lessons… you set an example.
          </p>

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
            I’m grateful for every piece of advice, every laugh, and every moment we’ve shared. No matter how “grumpy” you act with the world, I know the amazing person you are behind it 😄
          </p>

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>
            Wishing you a year full of success, happiness, and everything you’ve been working so hard for. You truly deserve it.
          </p>

          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic" }}>
            And don’t worry… I’ll still be the one who annoys you the most 😌
          </p>

          <HeartGame />

          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(16px, 3.5vw, 22px)",
            color: "#FFD93D",
            textShadow: "0 0 20px rgba(255,217,61,0.5)",
            letterSpacing: 1,
            marginBottom: "2.5rem",
          }}>
            Happy Birthday once again 🎂🔥
          </div>

          <button
            onClick={onRestart}
            style={{
              fontFamily: "'Courier New', monospace",
              background: "transparent",
              border: "1px solid rgba(0,255,136,0.3)",
              color: "rgba(0,255,136,0.5)",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 12,
              letterSpacing: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
            }}
            onMouseEnter={e => {
              e.target.style.color = "#00ff88";
              e.target.style.borderColor = "rgba(0,255,136,0.7)";
              e.target.style.boxShadow = "0 0 20px rgba(0,255,136,0.15)";
            }}
            onMouseLeave={e => {
              e.target.style.color = "rgba(0,255,136,0.5)";
              e.target.style.borderColor = "rgba(0,255,136,0.3)";
              e.target.style.boxShadow = "none";
            }}
          >
            [ restart ]
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ────────────────────────────────────────────────────
const SCREENS_ORDER = ["boot","glitch","roast","cake","final"];

export default function App() {
  const [screen, setScreen] = useState("boot");

  const next = (to) => setScreen(to);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d001a",
      color: "white",
      overflowX: "hidden",
      position: "relative",
    }}>
      <CRTFlicker />
      <Scanlines />

      {/* Ambient grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,136,0.05), transparent 60%)",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {screen === "boot"   && <BootScreen   onDone={() => next("glitch")} />}
        {screen === "glitch" && <GlitchReveal onDone={() => next("roast")} />}
        {screen === "roast"  && <RoastTerminal onDone={() => next("cake")} />}
        {screen === "cake"   && <CakeScreen   onDone={() => next("final")} />}
        {screen === "final"  && <FinalScreen  onRestart={() => next("boot")} />}
      </div>
    </div>
  );
}