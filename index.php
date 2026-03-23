<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TapeBot Splash</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal:       #1a7a6e;
    --teal-glow:  rgba(26,122,110,0.35);
    --amber:      #c47d10;
    --amber-glow: rgba(196,125,16,0.45);
    --bg:         #f0f4f3;
    --bg-card:    #ffffff;
    --grid:       rgba(26,122,110,0.07);
    --text-main:  #1a2826;
    --text-sub:   rgba(26,122,110,0.55);
    --border:     rgba(26,122,110,0.18);
  }

  body {
    background: var(--bg);
    width: 100vw; height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Share Tech Mono', monospace;
  }

  .grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(var(--grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: gridScroll 6s linear infinite;
  }
  @keyframes gridScroll {
    from { background-position: 0 0; }
    to   { background-position: 48px 48px; }
  }

  .scanlines {
    position: fixed; inset: 0; z-index: 1;
    background: repeating-linear-gradient(
      to bottom, transparent 0px, transparent 3px,
      rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px
    );
    pointer-events: none;
  }

  .vignette {
    position: fixed; inset: 0; z-index: 2;
    background: radial-gradient(ellipse at center, transparent 45%, rgba(180,200,196,0.55) 100%);
    pointer-events: none;
  }

  .splash {
    position: relative; z-index: 10;
    display: flex; flex-direction: column;
    align-items: center; gap: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 36px 24px;
    box-shadow: 0 4px 32px rgba(26,122,110,0.10), 0 1px 4px rgba(0,0,0,0.06);
  }

  .text-block {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    margin-bottom: 10px;
    animation: fadeDown 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .app-title {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 1.6rem;
    letter-spacing: 0.14em;
    color: var(--teal);
    text-shadow: 0 0 10px var(--teal-glow);
    line-height: 1;
  }
  .app-title span { color: var(--amber); text-shadow: 0 0 10px var(--amber-glow); }
  .tagline { font-size: 0.65rem; letter-spacing: 0.24em; color: var(--text-sub); text-transform: uppercase; }

  .robot-stage {
    width: 120px; height: 200px;
    position: relative;
    animation: stageEntrance 1s 0.05s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes stageEntrance {
    from { transform: translateX(-300px); opacity: 0; }
    to   { transform: translateX(0);      opacity: 1; }
  }

  .floor-shadow {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 70px; height: 10px;
    background: radial-gradient(ellipse, rgba(26,122,110,0.22) 0%, transparent 70%);
    border-radius: 50%;
    animation: shadowPulse 0.3s ease-in-out infinite alternate;
  }
  @keyframes shadowPulse {
    from { width: 55px; opacity: 0.5; }
    to   { width: 80px; opacity: 1.0; }
  }

  #robot-body-group {
    animation: passinhoBody 0.3s ease-in-out infinite alternate;
    transform-origin: 60px 120px;
  }
  @keyframes passinhoBody {
    0%   { transform: translateY(0px) scaleY(1); }
    40%  { transform: translateY(7px) scaleY(0.97); }
    100% { transform: translateY(3px) scaleY(0.99); }
  }

  #robot-head {
    animation: passinhoHead 0.6s ease-in-out infinite alternate;
    transform-origin: 60px 52px;
  }
  @keyframes passinhoHead {
    from { transform: rotate(-3deg) translateY(1px); }
    to   { transform: rotate(3deg) translateY(-1px); }
  }

  #eye-left, #eye-right {
    animation: eyeBlink 3.5s ease-in-out infinite;
    transform-origin: center;
  }
  @keyframes eyeBlink {
    0%, 90%, 100% { transform: scaleY(1); }
    95%           { transform: scaleY(0.1); }
  }

  #arm-left {
    animation: passinhoArmLeft 0.3s ease-in-out infinite alternate;
    transform-origin: 22px 100px;
  }
  @keyframes passinhoArmLeft {
    from { transform: rotate(-30deg); }
    to   { transform: rotate(10deg); }
  }

  #arm-right {
    animation: passinhoArmRight 0.3s ease-in-out infinite alternate;
    transform-origin: 98px 100px;
  }
  @keyframes passinhoArmRight {
    from { transform: rotate(10deg); }
    to   { transform: rotate(-30deg); }
  }

  #leg-left {
    animation: passinhoLegLeft 0.3s steps(2, end) infinite;
    transform-origin: 48px 148px;
  }
  @keyframes passinhoLegLeft {
    0%   { transform: rotate(-22deg) translateY(-4px); }
    50%  { transform: rotate(14deg)  translateY(2px); }
    100% { transform: rotate(-22deg) translateY(-4px); }
  }

  #leg-right {
    animation: passinhoLegRight 0.3s steps(2, end) infinite;
    transform-origin: 72px 148px;
    animation-delay: 0.15s;
  }
  @keyframes passinhoLegRight {
    0%   { transform: rotate(14deg)  translateY(2px); }
    50%  { transform: rotate(-22deg) translateY(-4px); }
    100% { transform: rotate(14deg)  translateY(2px); }
  }

  #antenna {
    animation: passinhoAntenna 0.15s ease-in-out infinite alternate;
    transform-origin: 60px 22px;
  }
  @keyframes passinhoAntenna {
    from { transform: rotate(-6deg); }
    to   { transform: rotate(6deg); }
  }

  #reel-left, #reel-right {
    animation: reelSpin 0.4s linear infinite;
    transform-origin: center;
  }
  #reel-right { animation-direction: reverse; }
  @keyframes reelSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── LOADER ── */
  .loader-wrap {
    margin-top: 26px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    animation: fadeUp 0.9s 1s cubic-bezier(0.22,1,0.36,1) both;
    transition: opacity 0.4s;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .loader-label {
    font-size: 0.60rem; letter-spacing: 0.2em;
    color: var(--text-sub); text-transform: uppercase;
    width: 200px; text-align: center;
  }

  .loader-bar {
    width: 200px; height: 6px;
    background: rgba(26,122,110,0.10);
    border: 1px solid var(--border);
    border-radius: 4px; overflow: hidden;
    position: relative;
  }

  .loader-fill {
    height: 100%;
    width: 0%;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--teal), #2ab89e);
    box-shadow: 0 0 8px var(--teal-glow);
  }

  .loader-percent {
    font-size: 0.58rem; letter-spacing: 0.15em;
    color: var(--teal);
    width: 200px; text-align: right;
    min-height: 1em;
  }

  /* ── FORMULÁRIO DE LOGIN ── */
  .login-wrap {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    width: 200px;
    animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .login-wrap.visivel { display: flex; }

  .login-input {
    width: 100%;
    padding: 9px 12px;
    background: rgba(26,122,110,0.05);
    border: 1px solid var(--border);
    border-radius: 7px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-main);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.08em;
  }
  .login-input::placeholder { color: var(--text-sub); }
  .login-input:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px var(--teal-glow);
  }

  .login-btn {
    width: 100%;
    padding: 9px 0;
    background: var(--teal);
    border: none;
    border-radius: 7px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: #ffffff;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    text-transform: uppercase;
    box-shadow: 0 2px 10px var(--teal-glow);
  }
  .login-btn:hover  { background: #1f9080; box-shadow: 0 0 14px var(--teal-glow); }
  .login-btn:active { transform: translateY(1px); }

  .login-aviso {
    font-size: 0.52rem;
    letter-spacing: 0.10em;
    color: var(--text-sub);
    text-align: center;
    line-height: 1.6;
    border-top: 1px solid var(--border);
    padding-top: 8px;
    width: 100%;
  }
  .login-aviso strong { color: var(--teal); }

  .login-erro {
    font-size: 0.58rem;
    color: #c0392b;
    letter-spacing: 0.08em;
    text-align: center;
    min-height: 1em;
  }

  .corner { position: fixed; width: 50px; height: 50px; opacity: 0.18; z-index: 5; }
  .corner::before, .corner::after { content: ''; position: absolute; background: var(--teal); }
  .corner::before { width: 100%; height: 2px; top: 0; left: 0; }
  .corner::after  { width: 2px; height: 100%; top: 0; left: 0; }
  .corner-tl { top: 18px; left: 18px; }
  .corner-tr { top: 18px; right: 18px; transform: scaleX(-1); }
  .corner-bl { bottom: 18px; left: 18px; transform: scaleY(-1); }
  .corner-br { bottom: 18px; right: 18px; transform: scale(-1); }

  .version { position: fixed; bottom: 22px; right: 24px; font-size: 0.55rem; letter-spacing: 0.18em; color: var(--text-sub); z-index: 10; }
</style>
</head>
<body>

<div class="grid-bg"></div>
<div class="scanlines"></div>
<div class="vignette"></div>
<div class="corner corner-tl"></div>
<div class="corner corner-tr"></div>
<div class="corner corner-bl"></div>
<div class="corner corner-br"></div>

<div class="splash">

  <div class="text-block">
    <div class="app-title">TAPE<span>BOT</span></div>
    <div class="tagline">Backup System &bull; LTO-8 &bull; v2.0</div>
  </div>

  <div class="robot-stage">
    <div class="floor-shadow"></div>

    <svg id="robot-svg" viewBox="0 0 120 200" width="120" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#c8dcd8"/>
          <stop offset="40%"  stop-color="#b0ccc8"/>
          <stop offset="100%" stop-color="#90b0ac"/>
        </linearGradient>
        <linearGradient id="metalHead" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%"   stop-color="#d8ecea"/>
          <stop offset="50%"  stop-color="#bcdad6"/>
          <stop offset="100%" stop-color="#9ac0bc"/>
        </linearGradient>
        <linearGradient id="vhsBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#e8f0ee"/>
          <stop offset="100%" stop-color="#d0dedd"/>
        </linearGradient>
        <radialGradient id="jointGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#f5a623"/>
          <stop offset="100%" stop-color="#c47d10"/>
        </radialGradient>
        <radialGradient id="eyeGlow" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stop-color="#ffe080"/>
          <stop offset="60%"  stop-color="#e8a020"/>
          <stop offset="100%" stop-color="#8a5010"/>
        </radialGradient>
        <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#a8c4c0"/>
          <stop offset="100%" stop-color="#90b0ac"/>
        </linearGradient>
        <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#1a7a6e"/>
          <stop offset="100%" stop-color="#0f5048"/>
        </linearGradient>
        <filter id="tealGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="amberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g id="robot-body-group">

        <g id="leg-left">
          <rect x="41" y="148" width="11" height="22" rx="4" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="46" cy="170" r="4.5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
          <rect x="42" y="169" width="9" height="18" rx="3" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <ellipse cx="46" cy="188" rx="9" ry="5" fill="url(#shoeGrad)" stroke="#0f5048" stroke-width="0.8"/>
          <ellipse cx="49" cy="186" rx="5" ry="3" fill="#2a9a8a" opacity="0.4"/>
        </g>

        <g id="leg-right">
          <rect x="68" y="148" width="11" height="22" rx="4" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="74" cy="170" r="4.5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
          <rect x="69" y="169" width="9" height="18" rx="3" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <ellipse cx="74" cy="188" rx="9" ry="5" fill="url(#shoeGrad)" stroke="#0f5048" stroke-width="0.8"/>
          <ellipse cx="77" cy="186" rx="5" ry="3" fill="#2a9a8a" opacity="0.4"/>
        </g>

        <circle cx="48" cy="150" r="5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
        <circle cx="72" cy="150" r="5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>

        <rect x="22" y="95" width="76" height="56" rx="6" fill="url(#vhsBody)" stroke="#a8c4c0" stroke-width="1.2"/>
        <rect x="26" y="95" width="68" height="5" rx="3" fill="#dce8e6" stroke="#a8c4c0" stroke-width="0.5"/>
        <rect x="28" y="143" width="64" height="5" rx="2" fill="#c8dcd8"/>

        <rect x="30" y="103" width="60" height="28" rx="3" fill="#e8f2f0" stroke="#a8c4c0" stroke-width="0.8"/>
        <rect x="31" y="104" width="58" height="5" rx="2" fill="rgba(255,255,255,0.5)"/>

        <g id="reel-left" style="transform-origin: 47px 117px">
          <circle cx="47" cy="117" r="9" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="47" cy="117" r="5" fill="#d8ecea"/>
          <circle cx="47" cy="117" r="2" fill="#a0c0bc"/>
          <line x1="47" y1="109" x2="47" y2="112" stroke="#88aeaa" stroke-width="1"/>
          <line x1="47" y1="122" x2="47" y2="125" stroke="#88aeaa" stroke-width="1"/>
          <line x1="39" y1="117" x2="42" y2="117" stroke="#88aeaa" stroke-width="1"/>
          <line x1="52" y1="117" x2="55" y2="117" stroke="#88aeaa" stroke-width="1"/>
        </g>
        <g id="reel-right" style="transform-origin: 73px 117px">
          <circle cx="73" cy="117" r="9" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="73" cy="117" r="5" fill="#d8ecea"/>
          <circle cx="73" cy="117" r="2" fill="#a0c0bc"/>
          <line x1="73" y1="109" x2="73" y2="112" stroke="#88aeaa" stroke-width="1"/>
          <line x1="73" y1="122" x2="73" y2="125" stroke="#88aeaa" stroke-width="1"/>
          <line x1="65" y1="117" x2="68" y2="117" stroke="#88aeaa" stroke-width="1"/>
          <line x1="78" y1="117" x2="81" y2="117" stroke="#88aeaa" stroke-width="1"/>
        </g>
        <path d="M 47 126 Q 60 131 73 126" stroke="#6a3010" stroke-width="2" fill="none"/>

        <rect x="32" y="133" width="56" height="12" rx="2" fill="#1a7a6e" opacity="0.9"/>
        <rect x="33" y="134" width="54" height="10" rx="1.5" fill="#2a9a8a"/>
        <text x="60" y="141.5" text-anchor="middle" font-family="'Share Tech Mono', monospace" font-size="4" fill="#ffffff" font-weight="bold">BACKUP TAPE · LTO-8</text>

        <circle cx="27" cy="102" r="2" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.5"/>
        <circle cx="93" cy="102" r="2" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.5"/>
        <circle cx="27" cy="144" r="2" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.5"/>
        <circle cx="93" cy="144" r="2" fill="#c0d8d4" stroke="#88aeaa" stroke-width="0.5"/>

        <circle cx="22" cy="100" r="5.5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
        <circle cx="98" cy="100" r="5.5" fill="url(#jointGlow)" filter="url(#amberGlow)"/>

        <g id="arm-left">
          <rect x="9" y="96" width="14" height="9" rx="4" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="13" cy="110" r="4" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
          <rect x="9" y="108" width="9" height="18" rx="3" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <ellipse cx="14" cy="128" rx="6" ry="5" fill="#b0ccc8" stroke="#88aeaa" stroke-width="0.8"/>
          <rect x="10" y="124" width="4" height="7" rx="2" fill="#c0dcd8"/>
          <rect x="14" y="124" width="4" height="7" rx="2" fill="#c0dcd8"/>
          <rect x="18" y="122" width="3" height="5" rx="1.5" fill="#c0dcd8"/>
        </g>

        <g id="arm-right">
          <rect x="97" y="96" width="14" height="9" rx="4" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <circle cx="107" cy="110" r="4" fill="url(#jointGlow)" filter="url(#amberGlow)"/>
          <rect x="102" y="108" width="9" height="18" rx="3" fill="url(#legGrad)" stroke="#88aeaa" stroke-width="0.8"/>
          <ellipse cx="106" cy="128" rx="6" ry="5" fill="#b0ccc8" stroke="#88aeaa" stroke-width="0.8"/>
          <rect x="102" y="124" width="4" height="7" rx="2" fill="#c0dcd8"/>
          <rect x="106" y="124" width="4" height="7" rx="2" fill="#c0dcd8"/>
        </g>

        <rect x="53" y="82" width="14" height="16" rx="4" fill="#c0d8d4" stroke="#a0c0bc" stroke-width="0.8"/>
        <rect x="55" y="84" width="10" height="3" rx="1.5" fill="#a8c8c4"/>
        <rect x="55" y="90" width="10" height="3" rx="1.5" fill="#a8c8c4"/>

        <g id="robot-head">
          <g id="antenna">
            <line x1="60" y1="22" x2="60" y2="10" stroke="#88aeaa" stroke-width="2" stroke-linecap="round"/>
            <circle cx="60" cy="8" r="4" fill="#e03030" filter="url(#tealGlow)"/>
            <circle cx="59" cy="7" r="1.5" fill="#ff6060" opacity="0.7"/>
            <circle cx="60" cy="8" r="4" fill="none" stroke="#ff4040" stroke-width="1" opacity="0.5">
              <animate attributeName="r" values="4;7;4" dur="0.3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0;0.5" dur="0.3s" repeatCount="indefinite"/>
            </circle>
          </g>

          <ellipse cx="60" cy="52" rx="28" ry="25" fill="url(#metalHead)" stroke="#a0c4c0" stroke-width="1.2"/>
          <ellipse cx="52" cy="40" rx="10" ry="6" fill="rgba(255,255,255,0.35)" transform="rotate(-15,52,40)"/>

          <circle cx="33" cy="52" r="6" fill="#c0d8d4" stroke="#88aeaa" stroke-width="1"/>
          <circle cx="33" cy="52" r="3" fill="#a8c8c4"/>
          <circle cx="87" cy="52" r="6" fill="#c0d8d4" stroke="#88aeaa" stroke-width="1"/>
          <circle cx="87" cy="52" r="3" fill="#a8c8c4"/>

          <g id="eye-left" style="transform-origin: 50px 52px">
            <circle cx="50" cy="52" r="9" fill="#f0f8f6" stroke="#88aeaa" stroke-width="1"/>
            <circle cx="50" cy="52" r="7" fill="url(#eyeGlow)" filter="url(#amberGlow)"/>
            <circle cx="47" cy="49" r="2.5" fill="rgba(255,255,200,0.6)"/>
            <circle cx="50" cy="52" r="3" fill="#2a1800"/>
            <circle cx="49" cy="51" r="1" fill="rgba(255,255,200,0.9)"/>
          </g>
          <g id="eye-right" style="transform-origin: 70px 52px">
            <circle cx="70" cy="52" r="9" fill="#f0f8f6" stroke="#88aeaa" stroke-width="1"/>
            <circle cx="70" cy="52" r="7" fill="url(#eyeGlow)" filter="url(#amberGlow)"/>
            <circle cx="67" cy="49" r="2.5" fill="rgba(255,255,200,0.6)"/>
            <circle cx="70" cy="52" r="3" fill="#2a1800"/>
            <circle cx="69" cy="51" r="1" fill="rgba(255,255,200,0.9)"/>
          </g>

          <path d="M 48 66 Q 60 76 72 66" stroke="#1a7a6e" stroke-width="2" fill="none" stroke-linecap="round"/>

          <rect x="46" y="72" width="28" height="5" rx="2" fill="#c0d8d4" stroke="#a0c0bc" stroke-width="0.6"/>

          <rect x="38" y="60" width="44" height="3" rx="1.5" fill="rgba(26,122,110,0.08)" stroke="rgba(26,122,110,0.25)" stroke-width="0.5"/>
          <rect x="40" y="60.5" width="8" height="2" rx="1" fill="rgba(26,180,150,0.8)">
            <animate attributeName="opacity" values="1;0.15;1" dur="0.3s" repeatCount="indefinite"/>
          </rect>
          <rect x="52" y="60.5" width="8" height="2" rx="1" fill="rgba(26,180,150,0.6)">
            <animate attributeName="opacity" values="0.15;1;0.15" dur="0.3s" repeatCount="indefinite"/>
          </rect>
          <rect x="64" y="60.5" width="8" height="2" rx="1" fill="rgba(26,180,150,0.8)">
            <animate attributeName="opacity" values="1;0.15;1" dur="0.3s" repeatCount="indefinite"/>
          </rect>
          <rect x="74" y="60.5" width="6" height="2" rx="1" fill="rgba(26,180,150,0.5)">
            <animate attributeName="opacity" values="0.15;1;0.15" dur="0.3s" repeatCount="indefinite"/>
          </rect>
        </g>

      </g>
    </svg>
  </div>

  <!-- ── LOADER ── -->
  <div class="loader-wrap" id="loader-wrap">
    <div class="loader-label" id="loader-label">Inicializando...</div>
    <div class="loader-bar">
      <div class="loader-fill" id="loader-fill"></div>
    </div>
    <div class="loader-percent" id="loader-percent">0%</div>
  </div>

  <!-- ── FORMULÁRIO DE LOGIN ── -->
  <form class="login-wrap" id="login-wrap" onsubmit="submeterLogin(event)">
    <input type="text" name="siape" id="siape" class="login-input" placeholder="SIAPE" autocomplete="username" maxlength="7" required>
    <input type="password" name="senha" id="senha" class="login-input" placeholder="Senha de rede" autocomplete="current-password" required>
    <div class="login-erro" id="login-erro"></div>
    <button type="submit" class="login-btn">▶ Entrar</button>
    <div class="login-aviso">
      🔒 Acesso restrito a servidores da<br>
      <strong>CGTI — CEFOR</strong><br>
      Uso exclusivo em rede local autorizada.
    </div>
  </form>

</div>

<div class="version">BUILD 2026.03</div>

<script>
  (function ()
  {
    var duracao     = 1000;
    var delayInicio = 1000;

    var mensagens =
    [
      { pct:   0, texto: "Inicializando..."       },
      { pct:  25, texto: "Carregando módulos..."   },
      { pct:  55, texto: "Montando fitas LTO-8..."  },
      { pct:  80, texto: "Verificando backup..."   },
      { pct: 100, texto: "Pronto!"                 }
    ];

    var elFill    = document.getElementById("loader-fill");
    var elLabel   = document.getElementById("loader-label");
    var elPercent = document.getElementById("loader-percent");
    var elLoader  = document.getElementById("loader-wrap");
    var elLogin   = document.getElementById("login-wrap");

    function obterMensagem(pct)
    {
      var texto = mensagens[0].texto;
      for (var i = 0; i < mensagens.length; i++)
      {
        if (pct >= mensagens[i].pct) texto = mensagens[i].texto;
      }
      return texto;
    }

    function exibirLogin()
    {
      elLoader.style.opacity    = "0";
      elLoader.style.transition = "opacity 0.4s";
      setTimeout(function ()
      {
        elLoader.style.display = "none";
        elLogin.classList.add("visivel");
        document.getElementById("siape").focus();
      }, 400);
    }

    function iniciarProgresso()
    {
      var inicio = performance.now();

      function tick(agora)
      {
        var decorrido = agora - inicio;
        var progresso = Math.min(decorrido / duracao, 1);
        var pct       = Math.floor(progresso * 100);

        elFill.style.width    = pct + "%";
        elPercent.textContent = pct + "%";
        elLabel.textContent   = obterMensagem(pct);

        if (progresso < 1)
        {
          requestAnimationFrame(tick);
        }
        else
        {
          elFill.style.width    = "100%";
          elPercent.textContent = "100%";
          elLabel.textContent   = obterMensagem(100);
          setTimeout(exibirLogin, 700);
        }
      }

      requestAnimationFrame(tick);
    }

    setTimeout(iniciarProgresso, delayInicio);
  })();

  function submeterLogin(evento)
  {
    evento.preventDefault();

    var siape  = document.getElementById("siape").value.trim();
    var senha  = document.getElementById("senha").value;
    var elErro = document.getElementById("login-erro");

    elErro.textContent = "";

    if (!siape || !senha)
    {
      elErro.textContent = "⚠ Preencha todos os campos.";
      return;
    }

    var corpo = new URLSearchParams();
    corpo.append("siape", siape);
    corpo.append("senha", senha);

    fetch("/api/login.php", { method: "POST", body: corpo })
      .then(function (res) { return res.json(); })
      .then(function (dados)
      {
        if (dados.sucesso)
        {
          window.location.href = "../simulador/simulador.html";
        }
        else
        {
          elErro.textContent = "⚠ " + (dados.erro || "Credenciais inválidas.");
        }
      })
      .catch(function ()
      {
        elErro.textContent = "⚠ Falha ao contatar o servidor.";
      });
  }
</script>

</body>
</html>
