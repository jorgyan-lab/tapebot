// ══════════════════════════════════════════════════════════
// ÁUDIO
// ══════════════════════════════════════════════════════════
let audioMudo = false;

const audioTrilho   = new Audio('audio/andando-no-trilho.mp3');
const audioFita     = new Audio('audio/retirando-da-fita.mp3');
const audioGravando = new Audio('audio/gravando.mp3');

audioTrilho.loop   = true;
audioGravando.loop = true;

audioTrilho.load();
audioFita.load();
audioGravando.load();

function tocarAudio(audio)
{
  if(audioMudo) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function pararAudio(audio)
{
  audio.pause();
  audio.currentTime = 0;
}

function alternarMudo()
{
  audioMudo = !audioMudo;
  const btn = document.getElementById('btn-mudo');
  btn.textContent = audioMudo ? '🔇 Mudo' : '🔊 Som';
  btn.classList.toggle('mudo-ativo', audioMudo);
  if(audioMudo)
  {
    pararAudio(audioTrilho);
    pararAudio(audioGravando);
    pararAudio(audioFita);
  }
}


// ══════════════════════════════════════════════════════════
// TEMA — padrão: claro
// ══════════════════════════════════════════════════════════
let TEMA_ATUAL = 'claro';

function alternarTema()
{
  const html = document.documentElement;
  const novo = TEMA_ATUAL === 'claro' ? 'escuro' : 'claro';
  html.setAttribute('data-tema', novo);
  TEMA_ATUAL = novo;
  document.getElementById('tema-icon').textContent  = novo === 'claro' ? '🌙' : '☀️';
  document.getElementById('tema-label').textContent = novo === 'claro' ? 'Tema Escuro' : 'Tema Claro';
}


// ══════════════════════════════════════════════════════════
// PALETAS DO CANVAS
// ══════════════════════════════════════════════════════════
const PALETAS =
{
  claro:
  {
    bg:'#e6eaef', chassis1:'#cdd2d9', chassis2:'#d8dde5', border:'#9ba5b0',
    panel:'#ffffff', panelBd:'#c8cdd4',
    rail1:'#9baab8', rail2:'#b0beca', railGlow:'rgba(9,105,218,0.18)', railTick:'#9baab8',
    roboFill:'#d0e4f7', roboBd:'#0969da', roboIn:'#e8f1fb', roboInBd:'#0969da33',
    roboGrip:'#0969da', roboGlow:'#0969da',
    drvFill:'#f0f4fa', drvBd:'#c8cdd4', drvGrav:'#fff7ed', drvGravBd:'#bc4c00',
    drvIns:'#e0e8f0', drvInsBd:'#c0cad4', drvNoTape:'#9baab8',
    drvLbl:'#0969da', drvSub:'#57606a',
    psuFill:'#eef1f5', pcbFill:'#e8f5ec', pcbBd:'#8bc4a0', pcbTxt:'#1a7f37', pcbLine:'#8bc4a0',
    wire:'#bc4c00', dot:'rgba(150,160,170,0.22)',
    textSub:'#57606a', textBlue:'#0969da', textGreen:'#1a7f37', ledGreen:'#1a7f37',
    lcd:'#d0e8d8', lcdBd:'#8bc4a0', lcdTxt:'#1a7f37',
    slotFill:'#e8f0f8', slotBd:'#9baab8', slotEmp:'#f0f4fa', slotEmpBd:'#c8cdd4',
    slotEmpTx:'#9baab8', slotEtq:'rgba(255,255,255,0.95)',
    slotBob:'rgba(0,0,0,0.15)', bobSpk:'#9baab8', bobFill2:'#888',
    progBg:'#dde4ec', progGrad1:'#bc4c00', progGrad2:'#cf222e', progTxt:'#bc4c00',
    xLabel:'#0969da33',
  },
  escuro:
  {
    bg:'#0d1117', chassis1:'#1e242c', chassis2:'#1a2030', border:'#404a58',
    panel:'#161b22', panelBd:'#30363d',
    rail1:'#2a3a4a', rail2:'#3a4a5a', railGlow:'rgba(88,166,255,0.30)', railTick:'#2a3a4a',
    roboFill:'#1f2d40', roboBd:'#1f6feb', roboIn:'#162030', roboInBd:'#388bfd33',
    roboGrip:'#388bfd', roboGlow:'#1f6feb',
    drvFill:'#161b22', drvBd:'#30363d', drvGrav:'#1a1208', drvGravBd:'#f0883e',
    drvIns:'#0d1117', drvInsBd:'#21262d', drvNoTape:'#30363d',
    drvLbl:'#58a6ff', drvSub:'#8b949e',
    psuFill:'#1a1f2a', pcbFill:'#0d1f14', pcbBd:'#1a3a2a', pcbTxt:'#3fb950', pcbLine:'#1a3a2a',
    wire:'#f0883e', dot:'rgba(48,54,61,0.35)',
    textSub:'#8b949e', textBlue:'#58a6ff', textGreen:'#3fb950', ledGreen:'#3fb950',
    lcd:'#0a1a10', lcdBd:'#1a3a1a', lcdTxt:'#3fb950',
    slotFill:'#0f1923', slotBd:'#2a3a4a', slotEmp:'#0d1117', slotEmpBd:'#21262d',
    slotEmpTx:'#30363d', slotEtq:'rgba(255,255,255,0.88)',
    slotBob:'rgba(0,0,0,0.4)', bobSpk:'#30363d', bobFill2:'#555',
    progBg:'#21262d', progGrad1:'#f0883e', progGrad2:'#f85149', progTxt:'#f0883e',
    xLabel:'#58a6ff33',
  }
};

function P() { return PALETAS[TEMA_ATUAL]; }


// ══════════════════════════════════════════════════════════
// CANVAS — LAYOUT
// ══════════════════════════════════════════════════════════
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

const FRONT_W = 52;
const MAG_X   = 20 + FRONT_W + 8;
const MAG_W   = 190;
const SLOT_W  = 28, SLOT_H = 46, SLOT_GAP = 4, MAG_PAD = 10;
const CX = 20, CY = 30, CW = W - 40, CH = H - 60;
const MAG_TOP_Y = CY + 10;
const MAG_TOP_H = SLOT_H + MAG_PAD * 2;
const MAG_BOT_Y = CY + CH - MAG_TOP_H - 10;
const MAG_BOT_H = MAG_TOP_H;
const RAIL_Y  = CY + CH / 2;
const RAIL_X1 = MAG_X;
const RAIL_X2 = CX + CW - 220;
const RAIL_H  = 14;

// Área total reservada para os drives (mesma posição anterior)
const DRV_AREA_X = CX + CW - 210;
const DRV_AREA_W = 130;
const DRV_AREA_Y = CY + 15;
const DRV_AREA_H = CH - 30;

const PSU_X = DRV_AREA_X + DRV_AREA_W + 8;
const PSU_W = CX + CW - PSU_X - 5;
const PSU_H = Math.floor((CH - 20) / 2) - 4;
const PSU_Y = CY + 10;
const PCB_X = PSU_X, PCB_W = PSU_W, PCB_H = PSU_H, PCB_Y = PSU_Y + PSU_H + 8;

const COR_LIMPEZA = '#9c5fd6';

// Número atual de drives (atualizado ao aplicar autoloader)
let numDrives = 1;

// Calcula geometria de um drive específico pelo índice
function geomDrive(idx, total)
{
  const gap  = 6;
  const dh   = Math.floor((DRV_AREA_H - gap * (total - 1)) / total);
  const dy   = DRV_AREA_Y + idx * (dh + gap);
  return { x: DRV_AREA_X, y: dy, w: DRV_AREA_W, h: dh };
}


// ══════════════════════════════════════════════════════════
// ESTADO INICIAL — 9 SLOTS + DRIVES
// ══════════════════════════════════════════════════════════
function makeSlots()
{
  const defs = [
    { id:1, mag:'top', i:0, tipo:'dados',   label:'LTO-001', color:'#e05c5c',   cap:12000, usado:4800 },
    { id:2, mag:'top', i:1, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:3, mag:'top', i:2, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:4, mag:'top', i:3, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:5, mag:'top', i:4, tipo:'limpeza', label:'CLN-001', color:COR_LIMPEZA, cap:0,     usado:0    },
    { id:6, mag:'bot', i:0, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:7, mag:'bot', i:1, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:8, mag:'bot', i:2, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
    { id:9, mag:'bot', i:3, tipo:null,      label:null,      color:null,        cap:12000, usado:0    },
  ];
  return defs.map(d =>
  ({
    id: d.id, mag: d.mag,
    x: MAG_X + MAG_PAD + d.i * (SLOT_W + SLOT_GAP),
    y: (d.mag === 'top' ? MAG_TOP_Y : MAG_BOT_Y) + MAG_PAD,
    ocupado: d.tipo !== null, tipo: d.tipo, label: d.label, color: d.color,
    cap: d.cap, usado: d.usado,
  }));
}

let slots = makeSlots();

// Array de drives — cada entrada espelha a estrutura da API
function makeDrives(n)
{
  return Array.from({ length: n }, function(_, i)
  {
    return {
      numero:     i,
      ocupado:    false,
      fitaId:     null,
      fitaColor:  null,
      fitaLabel:  null,
      fitaTipo:   null,
      fitaCap:    0,
      fitaUsado:  0,
      gravando:   false,
      limpando:   false,
      progresso:  0,
    };
  });
}

let drives = makeDrives(1);

let robo =
{
  x: MAG_X + MAG_W + 20, y: RAIL_Y, w: 48, h: 80,
  carregando: false, fitaId: null, fitaColor: null, fitaLabel: null, fitaTipo: null,
  fitaCap: 0, fitaUsado: 0, grip: 'open', armY: 0,
};

let animFrame = 0;


// ══════════════════════════════════════════════════════════
// UTILITÁRIOS DE DESENHO
// ══════════════════════════════════════════════════════════
function rr(x, y, w, h, r, fill, stroke, lw)
{
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
  if(fill)  { ctx.fillStyle=fill; ctx.fill(); }
  if(stroke){ ctx.lineWidth=lw||1; ctx.strokeStyle=stroke; ctx.stroke(); }
}

function t(text, x, y, color, size, bold)
{
  ctx.fillStyle = color||'#8b949e';
  ctx.font = (bold?'bold ':'')+((size||9))+'px "Share Tech Mono",monospace';
  ctx.fillText(text, x, y);
}

function desenharFita(x, y, w, h, color, label, tipo)
{
  const p = P();
  rr(x, y, w, h, 2, color, null);
  ctx.fillStyle = p.slotEtq;
  ctx.fillRect(x+3, y+4, w-6, 10);
  t(label ? label.slice(0,7) : '', x+4, y+13, '#0d1117', 6, true);
  if(tipo === 'limpeza')
  {
    rr(x, y, w, h, 2, null, '#ffd166', 1.5);
    ctx.fillStyle = '#ffd166';
    ctx.font = '9px sans-serif';
    ctx.fillText('🧹', x + w/2 - 5, y + h - 5);
  }
  else
  {
    ctx.beginPath(); ctx.arc(x+w/2, y+h-9, 4, 0, Math.PI*2);
    ctx.fillStyle=p.slotBob; ctx.fill();
    ctx.beginPath(); ctx.arc(x+w/2, y+h-9, 1.5, 0, Math.PI*2);
    ctx.fillStyle=p.bobFill2; ctx.fill();
  }
}


// ══════════════════════════════════════════════════════════
// FUNÇÕES DE DESENHO DA CENA
// ══════════════════════════════════════════════════════════
function desenharFundo()
{
  const p=P();
  ctx.fillStyle=p.bg; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=p.dot;
  for(let gx=18;gx<W;gx+=26) for(let gy=18;gy<H;gy+=26){ctx.beginPath();ctx.arc(gx,gy,1,0,Math.PI*2);ctx.fill();}
  const g=ctx.createLinearGradient(CX,CY,CX,CY+CH);
  g.addColorStop(0,p.chassis1); g.addColorStop(.5,p.chassis2); g.addColorStop(1,p.chassis1);
  rr(CX,CY,CW,CH,10,null,p.border,2); ctx.fillStyle=g; ctx.fill();
  rr(CX,CY,FRONT_W,CH,6,p.panel,p.panelBd,1.5);
  for(let i=0;i<4;i++)
  {
    const algumAtivo = drives.some(function(d) { return d.gravando || d.limpando; });
    const lc=i===0?p.ledGreen:i===1?(algumAtivo&&animFrame%20<10?'#f85149':'#2a1010'):p.textBlue+'33';
    ctx.beginPath(); ctx.arc(CX+18,CY+55+i*16,4,0,Math.PI*2);
    ctx.fillStyle=lc; ctx.shadowColor=lc; ctx.shadowBlur=i<2?8:0; ctx.fill(); ctx.shadowBlur=0;
  }
  rr(CX+5,CY+28,40,20,3,p.lcd,p.lcdBd);
  t('READY',CX+9,CY+41,p.lcdTxt,7);
  ctx.save(); ctx.translate(CX+26,CY+CH/2+28); ctx.rotate(-Math.PI/2);
  t('PAINEL FRONTAL',0,0,p.textBlue,8); ctx.restore();
}

function desenharMagazines()
{
  const p=P();
  rr(MAG_X,MAG_TOP_Y,MAG_W,MAG_TOP_H,6,p.panel,p.panelBd,1.5);
  t('MAGAZINE ESQ. (S1–S5)',MAG_X+4,MAG_TOP_Y-5,p.textBlue,8);
  rr(MAG_X,MAG_BOT_Y,MAG_W,MAG_BOT_H,6,p.panel,p.panelBd,1.5);
  t('MAGAZINE DIR. (S6–S9)',MAG_X+4,MAG_BOT_Y-5,p.textBlue,8);
  slots.forEach(s =>
  {
    rr(s.x,s.y,SLOT_W,SLOT_H,3,s.ocupado?p.slotFill:p.slotEmp,s.ocupado?p.slotBd:p.slotEmpBd);
    if(s.ocupado)
    {
      desenharFita(s.x+2,s.y+2,SLOT_W-4,SLOT_H-4,s.color,s.label,s.tipo);
      // Número do slot em branco no topo da fita
      t('S'+s.id, s.x+2, s.y+10, '#ffffff', 7, true);
    }
    else
    {
      // Slot vazio: número maior e em azul para melhor visibilidade
      t('S'+s.id, s.x+SLOT_W/2-6, s.y+SLOT_H/2+3, p.textBlue, 9, true);
    }
  });
}



function desenharTrilho()
{
  const p=P(), ry=RAIL_Y-RAIL_H/2;
  const g=ctx.createLinearGradient(0,ry,0,ry+RAIL_H);
  g.addColorStop(0,p.rail1); g.addColorStop(.5,p.rail2); g.addColorStop(1,p.rail1);
  rr(RAIL_X1,ry,RAIL_X2-RAIL_X1,RAIL_H,3,null,null); ctx.fillStyle=g; ctx.fill();
  ctx.fillStyle=p.railGlow; ctx.fillRect(RAIL_X1,ry+1,RAIL_X2-RAIL_X1,3);
  for(let mx=RAIL_X1+20;mx<RAIL_X2;mx+=28){ctx.fillStyle=p.railTick;ctx.fillRect(mx,ry+RAIL_H-3,2,3);}
  t('PRECISION RAIL — TRILHO DE PRECISÃO',RAIL_X1+10,RAIL_Y+RAIL_H/2+12,p.textSub,8);
}

// Desenha todos os drives empilhados verticalmente
function desenharDrives()
{
  drives.forEach(function(drv, idx)
  {
    const g  = geomDrive(idx, drives.length);
    const p  = P();
    const dx = g.x, dy = g.y, dw = g.w, dh = g.h;
    const ativo = drv.gravando || drv.limpando;

    ctx.shadowColor = ativo ? p.drvGravBd : p.textBlue;
    ctx.shadowBlur  = ativo ? 14 : 6;
    rr(dx, dy, dw, dh, 6, ativo ? p.drvGrav : p.drvFill, ativo ? p.drvGravBd : p.drvBd, 1.5);
    ctx.shadowBlur = 0;

    const tituloOp = drv.limpando ? 'LIMPEZA' : 'DRIVE-' + idx;
    const corTit   = drv.limpando ? COR_LIMPEZA : p.drvLbl;
    t(tituloOp, dx + 6, dy + 10, corTit, 7, true);

    // Slot de inserção da fita
    const insX = dx + 4, insY = dy + 14, insW = dw - 8, insH = dh - 28;
    rr(insX, insY, insW, insH, 3, p.drvIns, p.drvInsBd);

    if(drv.ocupado)
    {
      desenharFita(insX + 2, insY + 2, insW - 4, insH - 4, drv.fitaColor, drv.fitaLabel, drv.fitaTipo);
    }
    else
    {
      t('NO TAPE', insX + insW / 2 - 16, insY + insH / 2 + 3, p.drvNoTape, 7);
    }

    // Barra de progresso (gravando ou limpando)
    if(ativo)
    {
      const c1 = drv.limpando ? COR_LIMPEZA : p.progGrad1;
      const c2 = drv.limpando ? '#6d28d9'   : p.progGrad2;
      rr(dx + 4, dy + dh - 12, dw - 8, 6, 3, p.progBg, null);
      const pw = (dw - 8) * (drv.progresso / 100);
      const gc = ctx.createLinearGradient(dx + 4, 0, dx + 4 + pw, 0);
      gc.addColorStop(0, c1); gc.addColorStop(1, c2);
      rr(dx + 4, dy + dh - 12, pw, 6, 3, null, null);
      ctx.fillStyle = gc; ctx.fill();
      t(Math.round(drv.progresso) + '%', dx + dw / 2 - 8, dy + dh - 4, c1, 7);
    }

    // LED de status do drive
    const ledC = ativo
      ? (animFrame % 20 < 10 ? '#f85149' : '#400')
      : (drv.ocupado ? '#ffd166' : p.ledGreen);
    ctx.beginPath(); ctx.arc(dx + dw - 10, dy + 10, 4, 0, Math.PI * 2);
    ctx.fillStyle = ledC; ctx.shadowColor = ledC; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
  });
}

function desenharPSU()
{
  const p=P();
  rr(PSU_X,PSU_Y,PSU_W,PSU_H,6,p.psuFill,p.panelBd,1);
  t('FONTE — PSU',PSU_X+6,PSU_Y+12,p.textSub,8);
  for(let i=0;i<3;i++){rr(PSU_X+8+i*18,PSU_Y+20,12,22,2,p.rail1,p.rail2);t('+',PSU_X+12+i*18,PSU_Y+35,p.textBlue,8);}
  const fx=PSU_X+PSU_W-30, fy=PSU_Y+8;
  ctx.beginPath(); ctx.arc(fx+10,fy+12,10,0,Math.PI*2);
  ctx.strokeStyle=p.panelBd; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle=p.chassis2; ctx.fill();
  for(let a=0;a<4;a++)
  {
    const ang=(a/4)*Math.PI*2+animFrame*0.04;
    ctx.beginPath(); ctx.ellipse(fx+10+Math.cos(ang)*4,fy+12+Math.sin(ang)*4,3.5,1.5,ang,0,Math.PI*2);
    ctx.fillStyle=p.rail1; ctx.fill();
  }
}

function desenharPCB()
{
  const p=P();
  rr(PCB_X,PCB_Y,PCB_W,PCB_H,6,p.pcbFill,p.pcbBd,1);
  t('ELECTRONICS — PCB',PCB_X+6,PCB_Y+12,p.pcbTxt,8);
  ctx.strokeStyle=p.pcbLine; ctx.lineWidth=1;
  for(let r=0;r<6;r++){ctx.beginPath();ctx.moveTo(PCB_X+6,PCB_Y+18+r*10);ctx.lineTo(PCB_X+PCB_W-6,PCB_Y+18+r*10);ctx.stroke();}
  for(let i=0;i<2;i++){rr(PCB_X+8+i*28,PCB_Y+24,22,16,2,p.lcd,p.pcbBd);t('IC',PCB_X+13+i*28,PCB_Y+35,p.pcbTxt,7);}
  t('PORTAS E CONEXÕES',PCB_X+6,PCB_Y+PCB_H-14,p.textSub,7);
  for(let i=0;i<3;i++){rr(PCB_X+8+i*20,PCB_Y+PCB_H-12,14,10,2,p.chassis2,p.panelBd);}
  ctx.strokeStyle=p.wire; ctx.lineWidth=1.5; ctx.setLineDash([3,3]);
  ctx.beginPath(); ctx.moveTo(PCB_X+PCB_W,PCB_Y+PCB_H/2); ctx.lineTo(DRV_AREA_X+DRV_AREA_W,DRV_AREA_Y+DRV_AREA_H/2); ctx.stroke();
  ctx.setLineDash([]);
}

function desenharRobo()
{
  const p=P(), rx=robo.x-robo.w/2, armEndY=robo.y+robo.armY;
  ctx.strokeStyle=p.roboBd; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(robo.x,RAIL_Y-RAIL_H/2); ctx.lineTo(robo.x,armEndY); ctx.stroke();
  ctx.shadowColor=p.roboGlow; ctx.shadowBlur=18;
  rr(rx,robo.y-robo.h/2,robo.w,robo.h,8,p.roboFill,p.roboBd,2);
  ctx.shadowBlur=0;
  rr(rx+6,robo.y-robo.h/2+10,robo.w-12,robo.h-20,4,p.roboIn,p.roboInBd);
  const stTxt=robo.carregando?(robo.fitaTipo==='limpeza'?'CLN':'LOADED'):'IDLE';
  const stClr=robo.carregando?(robo.fitaTipo==='limpeza'?COR_LIMPEZA:p.textGreen):p.textBlue;
  ctx.fillStyle=stClr; ctx.font='bold 7px "Share Tech Mono",monospace'; ctx.fillText(stTxt,rx+4,robo.y+4);
  const gx=rx-18, gy=armEndY-22, gOpen=robo.grip==='open';
  ctx.fillStyle=p.roboGrip;
  ctx.fillRect(gx,gy,16,gOpen?7:10);
  ctx.fillRect(gx,gy+(gOpen?22:12),16,gOpen?7:10);
  if(robo.carregando) desenharFita(gx-2,gy+(gOpen?2:0),20,20,robo.fitaColor,robo.fitaLabel,robo.fitaTipo);
  t('X:'+Math.round(robo.x),rx,robo.y+robo.h/2+12,p.xLabel,7);
}

function desenharCena()
{
  ctx.clearRect(0,0,W,H);
  desenharFundo(); desenharMagazines(); desenharTrilho();
  desenharDrives(); desenharPSU(); desenharPCB(); desenharRobo();
  animFrame++;
}

(function loop(){ desenharCena(); requestAnimationFrame(loop); })();


// ══════════════════════════════════════════════════════════
// MOVIMENTAÇÃO
// ══════════════════════════════════════════════════════════
function animarBraco(ty)
{
  return new Promise(res =>
  {
    function step()
    {
      const d=ty-robo.armY;
      if(Math.abs(d)<2){robo.armY=ty;res();}
      else{robo.armY+=Math.sign(d)*3;requestAnimationFrame(step);}
    }
    step();
  });
}

function moverX(tx)
{
  // Limita o destino X aos limites físicos do trilho
  const txLimitado = Math.min(Math.max(tx, RAIL_X1), RAIL_X2);
  return new Promise(res =>
  {
    tocarAudio(audioTrilho);
    function step()
    {
      const d = txLimitado - robo.x;
      if(Math.abs(d) < 5)
      {
        robo.x = txLimitado;
        pararAudio(audioTrilho);
        res();
      }
      else { robo.x += Math.sign(d) * 6; requestAnimationFrame(step); }
    }
    step();
  });
}


function esperar(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function pegarFitaSlot(slot)
{
  const armOff=slot.y-RAIL_Y+SLOT_H/2;
  await moverX(slot.x+SLOT_W/2);
  await animarBraco(armOff);
  robo.grip='closed';
  tocarAudio(audioFita);
  await esperar(360);
  robo.carregando=true; robo.fitaId=slot.id;
  robo.fitaColor=slot.color; robo.fitaLabel=slot.label; robo.fitaTipo=slot.tipo;
  robo.fitaCap=slot.cap; robo.fitaUsado=slot.usado;
  slot.ocupado=false; slot.tipo=null; slot.label=null; slot.color=null; slot.cap=0; slot.usado=0;
  gerarBotoes();
  await animarBraco(0);
}

async function depositarFitaSlot(slot)
{
  const armOff=slot.y-RAIL_Y+SLOT_H/2;
  await moverX(slot.x+SLOT_W/2);
  await animarBraco(armOff);
  tocarAudio(audioFita);
  await esperar(360);
  slot.ocupado=true; slot.tipo=robo.fitaTipo; slot.label=robo.fitaLabel; slot.color=robo.fitaColor;
  slot.cap=robo.fitaCap; slot.usado=robo.fitaUsado;
  robo.carregando=false; robo.grip='open';
  robo.fitaId=null; robo.fitaColor=null; robo.fitaLabel=null; robo.fitaTipo=null; robo.fitaCap=0; robo.fitaUsado=0;
  gerarBotoes();
  await animarBraco(0);
}

// Calcula a posição Y central do drive para o braço do robô
function armYParaDrive(idx)
{
  const g = geomDrive(idx, drives.length);
  return g.y + g.h / 2 - RAIL_Y;
}


// ══════════════════════════════════════════════════════════
// MODAL SELEÇÃO DE DRIVE
// ══════════════════════════════════════════════════════════
// Armazena o slotId pendente enquanto aguarda escolha do drive
let slotPendente = null;

function abrirModalDrive(slotId)
{
  const livres = drives.filter(function(d) { return !d.ocupado; });
  if(livres.length === 0)
  {
    log('ERRO: nenhum drive disponível', 'warn');
    return;
  }

  // Atribui antes de qualquer coisa
  slotPendente = slotId;

  const lista = document.getElementById('drive-lista');
  lista.innerHTML = '';

  livres.forEach(function(d)
  {
    const btn     = document.createElement('button');
    const dNumero = d.numero; // ← captura antes do closure
    btn.className = 'slot-btn';
    btn.textContent = 'DRIVE-' + dNumero;
    btn.addEventListener('click', function()
    {
      const sid = slotPendente; // ← lê antes de fechar
      fecharModalDrive();
      carregarParaGravar(sid, dNumero);
    });
    lista.appendChild(btn);
  });

  document.getElementById('modal-drive-titulo').textContent = '▶ Selecionar Drive';
  document.getElementById('modal-drive').classList.add('aberto');
}


function fecharModalDrive()
{
  document.getElementById('modal-drive').classList.remove('aberto');
  slotPendente = null;
}

document.getElementById('modal-drive').addEventListener('click', function(e)
{
  if(e.target === this) fecharModalDrive();
});


// ══════════════════════════════════════════════════════════
// OPERAÇÕES
// ══════════════════════════════════════════════════════════
let roboBusy = false;

async function carregarParaGravar(slotId, driveIdx)
{
  const slot = slots.find(s => s.id === slotId);
  const drv  = drives[driveIdx];

  if(!slot || !slot.ocupado) { log('ERRO: slot ' + slotId + ' vazio', 'warn');  return; }
  if(!drv  || drv.ocupado)   { log('ERRO: drive já ocupado', 'warn');           return; }
  if(roboBusy)               { log('ERRO: robô em uso', 'warn');                return; }

  roboBusy = true; bloquear(true);
  const isLimpeza  = slot.tipo === 'limpeza';
  // Salva o label ANTES de pegarFitaSlot zerar o slot
  const labelSalvo = slot.label;

  log((isLimpeza ? '🧹 ' : '') + 'Carregando ' + labelSalvo + ' → DRIVE-' + driveIdx, 'info');

  if(autoloaderAtual)
  {
    try
    {
      const corpo = new URLSearchParams();
      corpo.append('dispositivo', autoloaderAtual);
      corpo.append('slot',        slotId);
      corpo.append('drive',       drv.numero);

      const res   = await fetch('/api/carregar-fita-slot-driver.php', { method: 'POST', body: corpo });
      const dados = await res.json();

      if(!dados.sucesso)
      {
        log('ERRO do servidor: ' + dados.erro, 'warn');
        roboBusy = false; bloquear(false);
        return;
      }

      log('✅ ' + dados.mensagem, 'ok');
    }
    catch(err)
    {
      log('ERRO de rede: ' + err.message, 'warn');
      roboBusy = false; bloquear(false);
      return;
    }
  }

  await pegarFitaSlot(slot);

  const g      = geomDrive(driveIdx, drives.length);
  const armDrv = armYParaDrive(driveIdx);
  await moverX(g.x + g.w / 2);
  await animarBraco(armDrv);
  robo.grip = 'closed';

  tocarAudio(audioFita);
  await esperar(420);

  drv.ocupado   = true;
  drv.fitaId    = robo.fitaId;
  drv.fitaColor = robo.fitaColor;
  drv.fitaLabel = robo.fitaLabel;
  drv.fitaTipo  = robo.fitaTipo;
  drv.fitaCap   = robo.fitaCap;
  drv.fitaUsado = robo.fitaUsado;
  robo.carregando = false; robo.grip = 'open'; robo.fitaId = null;
  await animarBraco(0);

  if(isLimpeza)
  {
    log('🧹 Limpeza em andamento...', 'clean');
    drv.limpando = true; drv.progresso = 0;
    await new Promise(res =>
    {
      const iv = setInterval(function()
      {
        drv.progresso += 2;
        if(drv.progresso >= 100) { drv.progresso = 100; clearInterval(iv); res(); }
      }, 60);
    });
    drv.limpando = false;
    log('🧹 Limpeza concluída!', 'ok');
  }
  else
  {
    // Usa labelSalvo pois slot já foi zerado por pegarFitaSlot
    log('✅ ' + labelSalvo + ' inserida no DRIVE-' + driveIdx, 'ok');
  }

  roboBusy = false; bloquear(false);
  document.getElementById('btnUnload').disabled = !drives.some(function(d) { return d.ocupado; });
}




// Abre modal para escolher de qual drive ejetar
function abrirModalEjetar()
{
  const ocupados = drives.filter(function(d) { return d.ocupado && !d.gravando && !d.limpando; });
  if(ocupados.length === 0) { log('ERRO: nenhum drive disponível para ejetar', 'warn'); return; }

  // Se só há um drive ocupado, ejeta direto sem modal
  if(ocupados.length === 1)
  {
    ejetarFita(ocupados[0].numero);
    return;
  }

  const lista = document.getElementById('drive-lista');
  lista.innerHTML = '';
  slotPendente = null;

  ocupados.forEach(function(d)
  {
    const btn = document.createElement('button');
    btn.className = 'slot-btn';
    btn.textContent = 'DRIVE-' + d.numero + ' — ' + (d.fitaLabel || '?');
    btn.addEventListener('click', function()
    {
      fecharModalDrive();
      ejetarFita(d.numero);
    });
    lista.appendChild(btn);
  });

  document.getElementById('modal-drive-titulo').textContent = '⏏ Selecionar Drive para Ejetar';
  document.getElementById('modal-drive').classList.add('aberto');
}

async function ejetarFita(driveIdx)
{
  const drv = drives[driveIdx];
  if(!drv || !drv.ocupado || drv.gravando || drv.limpando)
  {
    log('ERRO: drive indisponível', 'warn');
    return;
  }

  const slotOrig = slots.find(function(s) { return s.id === drv.fitaId; });
  if(!slotOrig)
  {
    log('ERRO: slot de origem não encontrado para a fita ' + drv.fitaLabel, 'warn');
    return;
  }

  roboBusy = true; bloquear(true);
  log('Ejetando ' + drv.fitaLabel + ' do DRIVE-' + driveIdx, 'info');

  // Confirma com o servidor antes de animar
  if(autoloaderAtual)
  {
    try
    {
      const corpo = new URLSearchParams();
      corpo.append('dispositivo', autoloaderAtual);
      corpo.append('slot',        slotOrig.id);
      corpo.append('drive',       drv.numero);

      const res   = await fetch('/api/ejetar-fita-drive.php', { method: 'POST', body: corpo });
      const dados = await res.json();

      if(!dados.sucesso)
      {
        log('ERRO do servidor: ' + dados.erro, 'warn');
        roboBusy = false; bloquear(false);
        return;
      }

      log('✅ ' + dados.mensagem, 'ok');
    }
    catch(err)
    {
      log('ERRO de rede: ' + err.message, 'warn');
      roboBusy = false; bloquear(false);
      return;
    }
  }

  // Anima o robô indo até o drive
  const g      = geomDrive(driveIdx, drives.length);
  const armDrv = armYParaDrive(driveIdx);
  await moverX(g.x + g.w / 2);
  await animarBraco(armDrv);
  robo.grip = 'closed';

  // Toca áudio de retirada e aguarda
  tocarAudio(audioFita);
  await esperar(360);

  // Transfere a fita do drive para o robô
  robo.carregando = true;
  robo.fitaId     = drv.fitaId;
  robo.fitaColor  = drv.fitaColor;
  robo.fitaLabel  = drv.fitaLabel;
  robo.fitaTipo   = drv.fitaTipo;
  robo.fitaCap    = drv.fitaCap;
  robo.fitaUsado  = drv.fitaUsado;
  drv.ocupado   = false; drv.fitaId    = null; drv.fitaLabel = null;
  drv.fitaColor = null;  drv.fitaTipo  = null;
  await animarBraco(0);

  // Deposita a fita de volta no slot original
  await depositarFitaSlot(slotOrig);
  await moverX(MAG_X + MAG_W + 20);
  log('Fita devolvida ao slot ' + slotOrig.id, 'ok');
  roboBusy = false; bloquear(false);
  document.getElementById('btnUnload').disabled = !drives.some(function(d) { return d.ocupado; });
}


async function moverSlotParaSlot(origemId, destinoId)
{
  const origem  = slots.find(function(s) { return s.id === origemId;  });
  const destino = slots.find(function(s) { return s.id === destinoId; });

  if(!origem  || !origem.ocupado)  { log('ERRO: origem vazia', 'warn');                  return; }
  if(!destino || destino.ocupado)  { log('ERRO: destino ocupado', 'warn');               return; }
  if(origemId === destinoId)       { log('ERRO: origem = destino', 'warn');              return; }
  if(roboBusy)                     { log('ERRO: robô em uso', 'warn');                   return; }
  if(!autoloaderAtual)             { log('ERRO: nenhum autoloader selecionado', 'warn'); return; }

  roboBusy = true; bloquear(true);
  log('Movendo ' + origem.label + ' (S' + origemId + ' → S' + destinoId + ')', 'info');

  const corpo = new URLSearchParams();
  corpo.append('dispositivo', autoloaderAtual);
  corpo.append('origem',      origemId);
  corpo.append('destino',     destinoId);

  try
  {
    const res   = await fetch('/api/mover-entre-slots.php', { method: 'POST', body: corpo });
    const dados = await res.json();

    if(!dados.sucesso)
    {
      log('ERRO do servidor: ' + dados.erro, 'warn');
      roboBusy = false; bloquear(false);
      return;
    }

    await pegarFitaSlot(origem);
    await depositarFitaSlot(destino);
    await moverX(MAG_X + MAG_W + 20);
    log('✅ ' + dados.mensagem, 'ok');
    await sincronizarEstadoAutoloader();
  }
  catch(err)
  {
    log('ERRO de rede: ' + err.message, 'warn');
  }

  roboBusy = false; bloquear(false);
}

async function sincronizarEstadoAutoloader()
{
  if(!autoloaderAtual) return;
  try
  {
    const res   = await fetch('/api/detalhes-robo.php?dispositivo=' + encodeURIComponent(autoloaderAtual));
    const dados = await res.json();
    if(!dados.sucesso)
    {
      log('Aviso: não foi possível sincronizar — ' + dados.erro, 'warn');
      return;
    }

    const porMagazine = Math.ceil(dados.slots.length / 2);
    slots = dados.slots.map(function(s, i)
    {
      const mag  = i < porMagazine ? 'top' : 'bot';
      const idx  = i < porMagazine ? i : i - porMagazine;
      const tipo = s.ocupado ? detectarTipoFita(s.etiqueta) : null;
      return {
        id:      s.numero,
        mag:     mag,
        x:       MAG_X + MAG_PAD + idx * (SLOT_W + SLOT_GAP),
        y:       (mag === 'top' ? MAG_TOP_Y : MAG_BOT_Y) + MAG_PAD,
        ocupado: s.ocupado,
        tipo:    tipo,
        label:   s.ocupado ? s.etiqueta : null,
        color:   s.ocupado ? corPorTipo(tipo) : null,
        cap:     12000,
        usado:   0,
      };
    });

    gerarBotoes();
    log('🔄 Estado sincronizado com ' + autoloaderAtual, 'info');
  }
  catch(err)
  {
    log('Aviso: falha ao sincronizar estado — ' + err.message, 'warn');
  }
}



// ══════════════════════════════════════════════════════════
// MODAL MOVER
// ══════════════════════════════════════════════════════════
function abrirModalMover()
{
  if(roboBusy){ log('ERRO: robô em uso','warn'); return; }
  const selO=document.getElementById('sel-origem');
  const selD=document.getElementById('sel-destino');
  selO.innerHTML='<option value="">— Origem —</option>';
  selD.innerHTML='<option value="">— Destino —</option>';
  slots.forEach(s =>
  {
    if(s.ocupado)
    {
      const o=document.createElement('option');
      o.value=s.id;
      o.textContent='S'+s.id+': '+s.label+(s.tipo==='limpeza'?' 🧹':'');
      selO.appendChild(o);
    }
    else
    {
      const d=document.createElement('option');
      d.value=s.id;
      d.textContent='S'+s.id+': (vazio)';
      selD.appendChild(d);
    }
  });
  document.getElementById('modal-mover').classList.add('aberto');
}

function fecharModalMover()
{
  document.getElementById('modal-mover').classList.remove('aberto');
}

function confirmarMoverSlot()
{
  const oId=parseInt(document.getElementById('sel-origem').value);
  const dId=parseInt(document.getElementById('sel-destino').value);
  if(!oId||!dId){ log('ERRO: selecione origem e destino','warn'); return; }
  fecharModalMover();
  moverSlotParaSlot(oId, dId);
}

document.getElementById('modal-mover').addEventListener('click', function(e){ if(e.target===this) fecharModalMover(); });


// ══════════════════════════════════════════════════════════
// UI
// ══════════════════════════════════════════════════════════
function log(msg, tipo)
{
  const box=document.getElementById('log-box');
  const ts=new Date().toLocaleTimeString('pt-BR');
  const el=document.createElement('div');
  el.className='le '+(tipo||'info');
  el.textContent='['+ts+'] '+msg;
  box.appendChild(el);
  box.scrollTop=box.scrollHeight;
}

function gerarBotoes()
{
  const c = document.getElementById('btn-slots');
  c.innerHTML = '';
  slots.forEach(s =>
  {
    const b       = document.createElement('button');
    const sid     = s.id; // ← captura o id antes do closure
    b.id          = 'bs' + sid;
    const isClean = s.tipo === 'limpeza';
    b.className   = 'slot-btn' + (isClean ? ' cleaner' : '');
    b.style.borderLeft = '3px solid ' + (s.ocupado ? (isClean ? COR_LIMPEZA : s.color) : '#ccc');
    b.textContent = (isClean ? '🧹 ' : '') + 'S' + sid + (s.label ? ' — ' + s.label : '');
    b.title       = s.label || 'Slot ' + sid + ' (vazio)';
    b.disabled    = !s.ocupado || drives.every(function(d) { return d.ocupado; }) || roboBusy;
    b.addEventListener('click', function() { abrirModalDrive(sid); }); // ← usa sid
    c.appendChild(b);
  });
}

gerarBotoes();


function bloquear(v)
{
  document.querySelectorAll('#btn-slots button').forEach(function(b){ b.disabled=v; });
  document.getElementById('btnUnload').disabled = v ? true : !drives.some(function(d){ return d.ocupado; });
  document.getElementById('btn-abrir-mover').disabled=v;
}

document.getElementById('btnUnload').addEventListener('click', abrirModalEjetar);


// ══════════════════════════════════════════════════════════
// AUTOLOADER ATUAL
// ══════════════════════════════════════════════════════════
let autoloaderAtual = null;

function abrirModalAutoloader()
{
  const modal = document.getElementById('modal-autoloader');
  modal.classList.add('aberto');
  document.getElementById('al-loading').style.display = 'block';
  document.getElementById('al-lista').style.display   = 'none';
  document.getElementById('al-erro').style.display    = 'none';

  fetch('/api/robos.php')
    .then(function(res)
    {
      if(!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(dados)
    {
      document.getElementById('al-loading').style.display = 'none';
      if(!dados.sucesso || dados.total === 0)
      {
        mostrarErroAutoloader('Nenhum autoloader detectado no servidor.');
        return;
      }
      renderizarListaAutoloaders(dados.robos);
    })
    .catch(function(err)
    {
      document.getElementById('al-loading').style.display = 'none';
      mostrarErroAutoloader('Falha ao contatar /api/robos.php: ' + err.message);
    });
}

function mostrarErroAutoloader(msg)
{
  const el = document.getElementById('al-erro');
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
}

function fecharModalAutoloader()
{
  document.getElementById('modal-autoloader').classList.remove('aberto');
}

function renderizarListaAutoloaders(robos)
{
  const lista = document.getElementById('al-lista');
  lista.innerHTML = '';

  robos.forEach(function(roboItem)
  {
    const card = document.createElement('div');
    card.className = 'al-card' + (roboItem.dispositivo === autoloaderAtual ? ' al-ativo' : '');

    const badgeAtivo = roboItem.dispositivo === autoloaderAtual
      ? ' <span class="al-badge ativo">EM USO</span>' : '';

    card.innerHTML =
      '<div class="al-icon">🤖</div>' +
      '<div class="al-info">' +
        '<div class="al-titulo">' + roboItem.marca + ' ' + roboItem.modelo + badgeAtivo + '</div>' +
        '<div class="al-sub">' +
          '<span>📍 ' + roboItem.endereco + '</span>' +
          '<span>💾 ' + roboItem.dispositivo + '</span>' +
          '<span>🔖 Rev. ' + roboItem.revisao + '</span>' +
          '<span class="al-badge" id="badge-slots-'  + roboItem.dispositivo.replace(/\//g,'-') + '">... SLOTS</span>' +
          '<span class="al-badge verde" id="badge-drives-' + roboItem.dispositivo.replace(/\//g,'-') + '">... DRIVES</span>' +
        '</div>' +
      '</div>';

    lista.appendChild(card);
    buscarDetalhesCard(roboItem, card);

    card.addEventListener('click', function()
    {
      if(roboBusy) { log('ERRO: robô em uso, aguarde antes de trocar o autoloader.', 'warn'); return; }
      carregarEAplicarAutoloader(roboItem);
    });
  });

  lista.style.display = 'block';
}

function buscarDetalhesCard(roboItem, card)
{
  const idSlots  = 'badge-slots-'  + roboItem.dispositivo.replace(/\//g, '-');
  const idDrives = 'badge-drives-' + roboItem.dispositivo.replace(/\//g, '-');

  fetch('/api/detalhes-robo.php?dispositivo=' + encodeURIComponent(roboItem.dispositivo))
    .then(function(res) { return res.json(); })
    .then(function(dados)
    {
      if(!dados.sucesso) return;
      const elSlots  = document.getElementById(idSlots);
      const elDrives = document.getElementById(idDrives);
      if(elSlots)  elSlots.textContent  = dados.resumo.totalSlots  + ' SLOTS';
      if(elDrives) elDrives.textContent = dados.resumo.totalDrives + ' DRIVE(S)';
    })
    .catch(function() {});
}

function carregarEAplicarAutoloader(roboItem)
{
  document.getElementById('al-loading').style.display = 'block';
  document.getElementById('al-lista').style.display   = 'none';

  fetch('/api/detalhes-robo.php?dispositivo=' + encodeURIComponent(roboItem.dispositivo))
    .then(function(res)
    {
      if(!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(dados)
    {
      document.getElementById('al-loading').style.display = 'none';
      if(!dados.sucesso)
      {
        document.getElementById('al-lista').style.display = 'block';
        mostrarErroAutoloader('Falha ao obter detalhes: ' + dados.erro);
        return;
      }
      aplicarAutoloader(roboItem, dados);
    })
    .catch(function(err)
    {
      document.getElementById('al-loading').style.display = 'none';
      document.getElementById('al-lista').style.display   = 'block';
      mostrarErroAutoloader('Erro ao contatar /api/detalhes-robo.php: ' + err.message);
    });
}

function aplicarAutoloader(roboItem, dados)
{
  fecharModalAutoloader();
  autoloaderAtual = roboItem.dispositivo;
  const resumo = dados.resumo;

  document.querySelector('.header-info h1').textContent =
    roboItem.marca + ' ' + roboItem.modelo + ' — ' + roboItem.dispositivo;
  document.querySelector('.header-info span').textContent =
    resumo.totalSlots + ' SLOTS (' + resumo.slotsOcupados + ' ocupados) | ' +
    resumo.totalDrives + ' DRIVE(S) | ' + roboItem.endereco;

  const porMagazine = Math.ceil(dados.slots.length / 2);
  slots = dados.slots.map(function(s, i)
  {
    const mag = i < porMagazine ? 'top' : 'bot';
    const idx = i < porMagazine ? i : i - porMagazine;
    const tipo = s.ocupado ? detectarTipoFita(s.etiqueta) : null;
    return {
      id:      s.numero,
      mag:     mag,
      x:       MAG_X + MAG_PAD + idx * (SLOT_W + SLOT_GAP),
      y:       (mag === 'top' ? MAG_TOP_Y : MAG_BOT_Y) + MAG_PAD,
      ocupado: s.ocupado,
      tipo:    tipo,
      label:   s.ocupado ? s.etiqueta : null,
      color:   s.ocupado ? corPorTipo(tipo) : null,
      cap:     12000,
      usado:   0,
    };
  });

  numDrives = dados.drives.length || 1;
  drives = dados.drives.map(function(d)
  {
    return {
      numero:    d.numero,
      ocupado:   d.ocupado,
      fitaId:    d.slotOrigem  || null,
      fitaLabel: d.etiqueta    || null,
      fitaColor: d.ocupado ? corPorTipo(detectarTipoFita(d.etiqueta)) : null,
      fitaTipo:  d.ocupado ? detectarTipoFita(d.etiqueta) : null,
      fitaCap:   12000,
      fitaUsado: 0,
      gravando:  false,
      limpando:  false,
      progresso: 0,
    };
  });

  robo.x = MAG_X + MAG_W + 20; robo.y = RAIL_Y;
  robo.carregando = false; robo.fitaId = null;
  robo.fitaLabel = null; robo.fitaColor = null; robo.fitaTipo = null;

  gerarBotoes();
  document.getElementById('btnUnload').disabled = !drives.some(function(d){ return d.ocupado; });
  
  log('🔄 Autoloader: ' + roboItem.marca + ' ' + roboItem.modelo + ' (' + roboItem.dispositivo + ')', 'info');
  log('📦 ' + resumo.totalSlots + ' slots | ' + resumo.slotsOcupados + ' com fita | ' + resumo.totalDrives + ' drive(s).', 'ok');

  if(drives.some(function(d){ return d.ocupado; }))
  {
    drives.filter(function(d){ return d.ocupado; }).forEach(function(d)
    {
      log('⚠️ DRIVE-' + d.numero + ' já contém fita: ' + d.fitaLabel + ' — use Ejetar para devolvê-la.', 'warn');
    });
  }
}


// Detecta o tipo da fita pelo padrão da etiqueta
function detectarTipoFita(etiqueta)
{
  if (!etiqueta) return 'desconhecido';
  if (/^CLN/i.test(etiqueta)) return 'limpeza';
  const match = etiqueta.match(/L(\d+)$/i);
  if (match) return 'LTO-' + match[1];
  return 'desconhecido';
}

// Retorna cor fixa por tipo de fita
function corPorTipo(tipo)
{
  const cores =
  {
    'LTO-8':        '#2563eb',
    'LTO-7':        '#7c3aed',
    'LTO-6':        '#059669',
    'LTO-5':        '#d97706',
    'LTO-4':        '#dc2626',
    'limpeza':      '#9c5fd6',
    'desconhecido': '#6b7280',
  };
  return cores[tipo] || '#6b7280';
}

// Mantida pois é chamada em vários lugares — agora delega para corPorTipo
function gerarCorEtiqueta(etiqueta)
{
  if (!etiqueta) return '#6b7280';
  return corPorTipo(detectarTipoFita(etiqueta));
}


document.getElementById('modal-autoloader').addEventListener('click', function(e)
{
  if(e.target === this) fecharModalAutoloader();
});


// ══════════════════════════════════════════════════════════
// LISTAGEM DE ARQUIVOS — /var/www/html/data
// ══════════════════════════════════════════════════════════
function carregarListaDados()
{
  document.getElementById('dados-loading').style.display = 'block';
  document.getElementById('dados-lista').style.display   = 'none';
  document.getElementById('dados-erro').style.display    = 'none';

  fetch('/api/listar-dados.php')
    .then(function(res) { return res.json(); })
    .then(function(dados)
    {
      document.getElementById('dados-loading').style.display = 'none';

      if(!dados.sucesso)
      {
        const el       = document.getElementById('dados-erro');
        el.textContent = '⚠️ ' + dados.erro;
        el.style.display = 'block';
        return;
      }

      renderizarListaDados(dados.itens);
    })
    .catch(function(err)
    {
      document.getElementById('dados-loading').style.display = 'none';
      const el       = document.getElementById('dados-erro');
      el.textContent = '⚠️ Erro de rede: ' + err.message;
      el.style.display = 'block';
    });
}

// Item atualmente selecionado na lista de dados
let itemSelecionado = null;

// Drive selecionado para gravação
let driveGravarIdx = null;

function renderizarListaDados(itens)
{
  const lista     = document.getElementById('dados-lista');
  lista.innerHTML = '';

  if(!itens || itens.length === 0)
  {
    lista.innerHTML     = '<span style="font-size:0.78rem;color:var(--text-sub);">Nenhum item encontrado.</span>';
    lista.style.display = 'flex';
    return;
  }

  itens.forEach(function(item)
  {
    const btn       = document.createElement('button');
    btn.className   = 'slot-btn';
    const icone     = item.tipo === 'diretorio' ? '📁' : '📄';
    const tamanho   = item.tamanho !== null ? ' (' + formatarBytes(item.tamanho) + ')' : '';
    btn.textContent = icone + ' ' + item.nome + tamanho;
    btn.title       = item.caminho;

    btn.addEventListener('click', function()
    {
      // Remove destaque de todos os botões
      lista.querySelectorAll('button').forEach(function(b) { b.classList.remove('selecionado'); });

      // Marca este como selecionado
      btn.classList.add('selecionado');
      itemSelecionado = { nome: item.nome, caminho: item.caminho, tipo: item.tipo };

      // Habilita o botão de gravar
      document.getElementById('btn-gravar-drive').disabled = false;
    });

    lista.appendChild(btn);
  });

  lista.style.display = 'flex';
}


function formatarBytes(bytes)
{
  if(bytes === 0)           return '0 B';
  if(bytes < 1024)          return bytes + ' B';
  if(bytes < 1024 * 1024)   return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function abrirModalConfirmarGravar()
{
  const drv = drives.find(function(d) { return d.numero === driveGravarIdx; });
  const icone = itemSelecionado.tipo === 'diretorio' ? '📁' : '📄';

  document.getElementById('confirmar-gravar-txt').innerHTML =
    'Gravar <strong>' + icone + ' ' + itemSelecionado.nome + '</strong>' +
    ' no <strong>DRIVE-' + driveGravarIdx + '</strong>' +
    ' (fita <strong>' + (drv ? drv.fitaLabel : '?') + '</strong>)?';

  document.getElementById('modal-confirmar-gravar').classList.add('aberto');
}

function fecharModalConfirmarGravar()
{
  document.getElementById('modal-confirmar-gravar').classList.remove('aberto');
  driveGravarIdx = null;
}

document.getElementById('modal-confirmar-gravar').addEventListener('click', function(e)
{
  if(e.target === this) fecharModalConfirmarGravar();
});


// Carrega ao iniciar a página
carregarListaDados();


// Valida drive disponível ao clicar em Gravar no Drive
document.getElementById('btn-gravar-drive').addEventListener('click', function()
{
  if(!itemSelecionado) { log('ERRO: nenhum item selecionado', 'warn'); return; }

  const disponiveis = drives.filter(function(d)
  {
    return d.ocupado && !d.gravando && !d.limpando;
  });

  if(disponiveis.length === 0)
  {
    log('ERRO: nenhum drive com fita disponível para gravação', 'warn');
    return;
  }

  if(disponiveis.length === 1)
  {
    driveGravarIdx = disponiveis[0].numero;
    abrirModalConfirmarGravar();
    return;
  }

  // Mais de um drive — abre seleção primeiro
  const lista     = document.getElementById('drive-lista');
  lista.innerHTML = '';

  disponiveis.forEach(function(d)
  {
    const btn       = document.createElement('button');
    btn.className   = 'slot-btn';
    btn.textContent = 'DRIVE-' + d.numero + ' — ' + (d.fitaLabel || '?');
    btn.addEventListener('click', function()
    {
      driveGravarIdx = d.numero;
      fecharModalDrive();
      abrirModalConfirmarGravar();
    });
    lista.appendChild(btn);
  });

  document.getElementById('modal-drive-titulo').textContent = '⏺ Selecionar Drive para Gravar';
  document.getElementById('modal-drive').classList.add('aberto');
});
