// ABN PDF Viewer: lezen, navigeren, zoeken, annoteren en opslaan. Alles draait lokaal in de browser.
import * as pdfjs from '../lib/pdfjs/pdf.min.js';

const BASE = new URL('../', import.meta.url).href;
const STUDIO = 'https://claude.ai/artifact/4FUDvDj7bRJZwsV2x3RpPz';
pdfjs.GlobalWorkerOptions.workerSrc = BASE + 'lib/pdfjs/pdf.worker.min.js';
class DataFactory { // lettertypen en wasm van pdf.js zitten als base64-modules in lib/pdfjs/data
  constructor() {}
  async fetch({ filename }) {
    const m = await import(BASE + 'lib/pdfjs/data/' + filename + '.js');
    const bin = atob(m.default); const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
}
const PDFJS_OPTS = { BinaryDataFactory: DataFactory, useWorkerFetch: false, standardFontDataUrl: BASE + 'lib/pdfjs/data/', wasmUrl: BASE + 'lib/pdfjs/wasm/', isEvalSupported: false };

/* ---------- Taal (NL/EN) ---------- */
// De bronteksten zijn Nederlands; EN koppelt elke tekst aan de Engelse versie. {0}, {1} zijn invulplekken.
const EN = {
'Geel':'Yellow','Cyaan':'Cyan','Groen':'Green','Roze':'Pink','Rood':'Red','Marine':'Navy','Kleur {0}':'Colour {0}',
'Selecteren':'Select','Hand (slepen)':'Hand (drag)','Markeren':'Highlight','Onderstrepen':'Underline','Doorhalen':'Strikethrough','Notitie':'Note','Tekstvak':'Text box','Tekenen':'Draw','Kader':'Rectangle',
'Tekst bewerken':'Edit text','Formulier invullen':'Fill in form','Handtekening zetten':'Add signature','Permanent redigeren':'Redact permanently',"PDF's samenvoegen":'Merge PDFs','PDF splitsen':'Split PDF',"Pagina's ordenen":'Organise pages',"Pagina's roteren":'Rotate pages','Comprimeren':'Compress','Wachtwoord instellen':'Set password','Watermerk':'Watermark',"PDF's vergelijken":'Compare PDFs',"Zoeken in meerdere PDF's":'Search multiple PDFs',
'Hulpmiddelen':'Tools','PDF kiezen':'Choose PDF','Openen':'Open','Opslaan':'Save','Afdrukken':'Print','Documenteigenschappen':'Document properties','Paginanummer':'Page number','Zoom':'Zoom','Passend op breedte':'Fit width','Hele pagina':'Whole page',
'Doorlopend':'Continuous','Enkele pagina':'Single page',"Twee pagina's":'Two pages','Ongedaan maken (Ctrl+Z)':'Undo (Ctrl+Z)','Opnieuw (Ctrl+Y)':'Redo (Ctrl+Y)','Geselecteerde opmerking verwijderen (Del)':'Delete selected comment (Del)',"Donkere pagina's":'Dark pages',
'Werkbalk':'Toolbar','Zijpaneel tonen of verbergen':'Show or hide side panel','Zoeken (Ctrl+F)':'Search (Ctrl+F)','Vorige pagina':'Previous page','Volgende pagina':'Next page','Uitzoomen':'Zoom out','Inzoomen':'Zoom in','Weergave 90° draaien':'Rotate view 90°','Opmerkingen':'Comments',
'Zoek in het document':'Search in the document','Zoeken':'Search','Vorige treffer':'Previous match','Volgende treffer':'Next match','Hoofdlettergevoelig':'Match case','Sluiten':'Close',"Pagina's":'Pages','Bladwijzers':'Bookmarks','Notities':'Notes','Zijpaneel':'Side panel',
'Verwerking gebeurt lokaal in uw browser, er worden geen bestanden verstuurd':'Processing happens locally in your browser; no files are sent anywhere',
'Thema: automatisch (instelling toestel)':'Theme: automatic (device setting)','Thema: licht':'Theme: light','Thema: donker':'Theme: dark',', klik om te wisselen':', click to switch','Taal':'Language',
'Dit is geen PDF-bestand.':'This is not a PDF file.','Niet-opgeslagen opmerkingen':'Unsaved comments','Toch openen':'Open anyway','De opmerkingen in het huidige document gaan verloren als u een ander bestand opent. Gebruik eerst Opslaan als u ze wilt bewaren.':'The comments in the current document are lost if you open another file. Use Save first if you want to keep them.',
'Beveiligde PDF':'Protected PDF','"{0}" is beveiligd met een wachtwoord.':'"{0}" is protected with a password.',' Het wachtwoord was onjuist, probeer opnieuw.':' The password was incorrect, please try again.','Wachtwoord':'Password','Geen wachtwoord opgegeven.':'No password entered.','"{0}" is geen geldige PDF of is beschadigd.':'"{0}" is not a valid PDF or is damaged.',
'1 pagina':'1 page',"{0} pagina's":'{0} pages','Pagina {0}':'Page {0}','Naar bestemming in dit document':'Go to destination in this document','Naar pagina {0}':'Go to page {0}',
'Bladwijzers worden geladen…':'Loading bookmarks…','Dit document bevat geen bladwijzers.':'This document has no bookmarks.','(zonder titel)':'(untitled)','Zoeken… {0}/{1}':'Searching… {0}/{1}','Geen treffers':'No matches','{0} van {1}':'{0} of {1}',
'Opmerking toegevoegd.':'Comment added.','{0} markeringen toegevoegd.':'{0} markings added.','Tekst van de notitie':'Note text','Typ uw opmerking…':'Type your comment…','Verwijderen':'Delete','Klaar':'Done',
'Markering':'Highlight','Onderstreping':'Underline','Doorhaling':'Strikethrough','Tekening':'Drawing',
'Nog geen opmerkingen. Selecteer tekst en kies Markeren, Onderstrepen of Doorhalen, of plaats een notitie, tekstvak, tekening of kader.':'No comments yet. Select text and choose Highlight, Underline or Strikethrough, or place a note, text box, drawing or rectangle.','{0} · pagina {1}':'{0} · page {1}',
'Opslaan mislukt: ':'Saving failed: ','Opgeslagen als {0}':'Saved as {0}',"Beveiligde PDF's kunnen hier niet met opmerkingen worden opgeslagen":'Protected PDFs cannot be saved with comments here',
'Afdrukken voorbereiden…':'Preparing to print…','Afdrukken voorbereiden… pagina {0} van {1}':'Preparing to print… page {0} of {1}','Deze omgeving staat afdrukken vanuit de pagina niet toe. Het bestand wordt opgeslagen, open het in uw PDF-lezer om af te drukken.':'This environment does not allow printing from the page. The file is being saved; open it in your PDF reader to print.','Afdrukken mislukt: ':'Printing failed: ',
'Bestandsnaam':'File name','Bestandsgrootte':'File size','Titel':'Title','Auteur':'Author','Onderwerp':'Subject','Trefwoorden':'Keywords','Gemaakt met':'Created with','PDF-producent':'PDF producer','PDF-versie':'PDF version','Aangemaakt':'Created','Gewijzigd':'Modified',"Aantal pagina's":'Number of pages','Paginaformaat':'Page size','Snelle webweergave':'Fast web view','Formuliervelden':'Form fields','Beveiligd met wachtwoord':'Password protected','Opmerkingen in deze sessie':'Comments in this session','Ja':'Yes','Nee':'No','{0} en {1} andere':'{0} and {1} more',
'Opent het hulpmiddel in ABN PDF Studio in een nieuw tabblad. Sla uw bestand eerst op en sleep het daarna in het hulpmiddel. Het bestand blijft op uw computer.':'Opens the tool in ABN PDF Studio in a new tab. Save your file first, then drag it into the tool. The file stays on your computer.','Alle hulpmiddelen in PDF Studio':'All tools in PDF Studio','Annuleren':'Cancel','Open een PDF om te beginnen':'Open a PDF to get started','Sleep een PDF-bestand hierheen of kies een bestand van uw computer.':'Drag a PDF file here or choose a file from your computer.','Alles blijft op uw computer.':'Everything stays on your computer.','Laat het bestand los om het te openen':'Drop the file to open it',
'Cleanroomklassen in het kort':'Cleanroom classes in brief','Voorbeelddocument voor de ABN PDF Viewer':'Sample document for the ABN PDF Viewer','Voorbeelddocument':'Sample document','Pagina {0} van 3':'Page {0} of 3','Cleanroomklassen in het kort.pdf':'Cleanroom classes in brief.pdf',
'Een cleanroom wordt ingedeeld op de maximale concentratie luchtdeeltjes per kubieke meter lucht. ISO 14644-1 hanteert hiervoor klassen van ISO 1 tot en met ISO 9. Hoe lager het getal, hoe schoner de ruimte.':'A cleanroom is classified by the maximum concentration of airborne particles per cubic metre of air. ISO 14644-1 uses classes from ISO 1 to ISO 9 for this. The lower the number, the cleaner the room.',
'De tabel hieronder toont de maximale concentratie van deeltjes van 0,5 µm en groter voor de klassen die in de praktijk het vaakst voorkomen.':'The table below shows the maximum concentration of particles of 0.5 µm and larger for the classes used most often in practice.',
'Tabel 1. Deeltjesconcentratie per klasse (vanaf 0,5 µm)':'Table 1. Particle concentration per class (0.5 µm and larger)','ISO-klasse':'ISO class','Max. deeltjes per m³ (vanaf 0,5 µm)':'Max. particles per m³ (0.5 µm and larger)','Typische toepassing':'Typical application',
'Aseptische vulling, isolatoren':'Aseptic filling, isolators','Steriele productie, omgeving':'Sterile production, surroundings','Verpakking, laboratorium':'Packaging, laboratory','Ondersteunende ruimten, sassen':'Support areas, airlocks','Omgevingslucht binnen':'Ambient indoor air',
'Bron: ISO 14644-1. Raadpleeg de norm voor alle klassen en deeltjesgroottes.':'Source: ISO 14644-1. See the standard for all classes and particle sizes.',
'GMP-grades volgens EU GMP Annex 1':'GMP grades according to EU GMP Annex 1',
'Voor de productie van steriele geneesmiddelen onderscheidt Annex 1 vier grades, A tot en met D. Grade A is de zone voor kritische handelingen, bijvoorbeeld het vullen van product. Grades B tot en met D vormen de omgeving en de ondersteunende ruimten.':'For the production of sterile medicinal products, Annex 1 distinguishes four grades, A to D. Grade A is the zone for critical operations, for example filling product. Grades B to D form the surroundings and the support areas.',
'Tabel 2. Maximaal toegestane deeltjes per m³ (vanaf 0,5 µm)':'Table 2. Maximum permitted particles per m³ (0.5 µm and larger)','In rust':'At rest','In bedrijf':'In operation','Niet vooraf bepaald':'Not predetermined',
'In rust betekent dat de installatie volledig is opgesteld en draait, zonder personeel. In bedrijf betekent dat het proces in de normale bezetting verloopt. Ook de microbiologische limieten en de drukverschillen tussen de zones maken deel uit van de eisen.':'At rest means the installation is fully set up and running, without personnel. In operation means the process runs with normal staffing. The microbiological limits and the pressure differences between the zones are also part of the requirements.',
'Zo gebruikt u deze viewer':'How to use this viewer','Lezen':'Reading','Zoom met de knoppen, Ctrl en scrollen of via de keuzelijst. Kies een doorlopende, enkele of dubbele paginaweergave.':'Zoom with the buttons, Ctrl and scroll, or the list. Choose a continuous, single or two-page view.',
'Druk op Ctrl+F, typ een woord, bijvoorbeeld grade, en spring met Enter van treffer naar treffer.':'Press Ctrl+F, type a word, for example grade, and jump from match to match with Enter.',
'Selecteer tekst met de muis en kies Markeren, Onderstrepen of Doorhalen. Kies eerst een kleur.':'Select text with the mouse and choose Highlight, Underline or Strikethrough. Pick a colour first.','Plaats een notitie, een tekstvak, een tekening of een kader. Alles blijft te verplaatsen en te verwijderen.':'Place a note, a text box, a drawing or a rectangle. Everything can still be moved and deleted.',
'Opslaan maakt een kopie met uw opmerkingen. Het originele bestand blijft ongewijzigd.':'Save makes a copy with your comments. The original file stays unchanged.','Meer doen':'Do more',"Via Hulpmiddelen opent u ABN PDF Studio om pagina's te ordenen, samen te voegen, te comprimeren of te beveiligen.":'Through Tools you open ABN PDF Studio to organise, merge, compress or protect pages.',
'Het voorbeelddocument kon niet worden geladen. Open een PDF via Openen.':'The sample document could not be loaded. Open a PDF with Open.',
'Opmerkingen ':'Comments ',
'Geopend in uw andere venster':'Opened in your other window','Uw bestand staat als tabblad in het andere ABN PDF Viewer-venster. U kunt dit venster sluiten.':'Your file is open as a tab in the other ABN PDF Viewer window. You can close this window.','De pagina past volledig in beeld. Zoom in om horizontaal te kunnen verschuiven.':'The page fits entirely. Zoom in to scroll horizontally.','Geopende documenten':'Open documents','PDF openen (Ctrl+O)':'Open PDF (Ctrl+O)','PDF openen in een nieuw tabblad':'Open PDF in a new tab','Tabblad sluiten':'Close tab','Tabblad sluiten: {0}':'Close tab: {0}','Toch sluiten':'Close anyway',
'De opmerkingen in "{0}" gaan verloren als u dit tabblad sluit. Gebruik eerst Opslaan als u ze wilt bewaren.':'The comments in "{0}" will be lost if you close this tab. Use Save first if you want to keep them.','"{0}" is al geopend.':'"{0}" is already open.',
};
const detect = () => { const l = ((navigator.languages && navigator.languages[0]) || navigator.language || 'nl').toLowerCase(); return l.startsWith('nl') ? 'nl' : 'en'; };
let LANG = detect(); try { const sv0 = localStorage.getItem('abn-viewer-lang'); if (sv0 === 'nl' || sv0 === 'en') LANG = sv0; } catch {}
document.documentElement.lang = LANG;
function t(nl, ...a) { const s = LANG === 'en' && EN[nl] != null ? EN[nl] : nl; return a.length ? s.replace(/\{(\d)\}/g, (m, i) => a[i]) : s; }
const setDropText = () => document.documentElement.style.setProperty('--drop-text', JSON.stringify(t('Laat het bestand los om het te openen')));
setDropText();
const N = (x) => LANG === 'en' ? x.replace(/\./g, ',') : x; // getallen met duizendtallen

/* ---------- Hulpfuncties ---------- */
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) n.setAttribute(k, '');
    else n.setAttribute(k, v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) n.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return n;
}
function sv(tag, attrs) { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v); return n; }
const ICONS = {
  open: 'M4 7h6l2 2h8v10H4zM4 7V5h6l2 2', save: 'M12 4v12M7 11l5 5 5-5M5 20h14', print: 'M7 9V3h10v6M7 17H4V9h16v8h-3M7 14h10v7H7z',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01', side: 'M4 4h16v16H4zM9 4v16', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  zin: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 11h6M11 8v6', zout: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 11h6',
  up: 'M12 19V5M6 11l6-6 6 6', down: 'M12 5v14M6 13l6 6 6-6', rotate: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  cursor: 'M5 3l6 16 2-7 7-2z', hand: 'M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v8c0 4-2 6-5 6s-4-1-6-4l-2-3a1.5 1.5 0 0 1 2.5-1.5L8 13',
  hl: 'M4 20h16M7 16l9-9 3 3-9 9H7z', ul: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14', st: 'M5 12h14M8 7a4 4 0 0 1 8 0M8 17a4 4 0 0 0 8 0',
  note: 'M4 5h16v11H9l-5 4z', text: 'M4 7V4h16v3M12 4v16M9 20h6', ink: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3', rect: 'M4 6h16v12H4z',
  trash: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
  thumbs: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', mark: 'M7 3h10v18l-5-4-5 4z', tool: 'M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6z',
  cont: 'M7 3h10v8H7zM7 13h10v8H7z', single: 'M7 3h10v18H7z', two: 'M3 5h8v14H3zM13 5h8v14h-8z', inv: 'M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z', auto: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M12 3a9 9 0 0 1 0 18', ext: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6', x: 'M6 6l12 12M18 6L6 18', plus: 'M12 5v14M5 12h14'
};
function icon(name, size = 18) {
  const s = sv('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: name === 'inv' ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
  s.append(sv('path', { d: ICONS[name] || ICONS.info })); return s;
}
function toast(msg, type) { const t = el('div', { class: 'toast' + (type === 'error' ? ' error' : ''), role: type === 'error' ? 'alert' : 'status' }, msg); document.getElementById('toasts').append(t); setTimeout(() => t.remove(), 4500); }
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmtBytes = (n) => n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(0) + ' kB' : (n / 1048576).toFixed(1).replace('.', LANG === 'nl' ? ',' : '.') + ' MB';
const baseName = (n) => n.replace(/\.[^.]+$/, '');
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let dlNs;
async function saveFile(name, data) {
  try { dlNs = dlNs !== undefined ? dlNs : (window.claude && window.claude.use ? await window.claude.use('downloads') : null); } catch { dlNs = null; }
  if (dlNs) {
    try { await dlNs.save({ filename: name, data: new Blob([data], { type: 'application/pdf' }) }); return true; }
    catch (e) { if (e && e.code === 'declined') return false; if (e && e.code !== 'unavailable' && e.code !== 'not_granted') { toast(t('Opslaan mislukt: ') + (e.message || e.code), 'error'); return false; } }
  }
  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
  const a = el('a', { href: url, download: name, style: { display: 'none' } }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000); return true;
}
function modal({ title, body, ok = 'OK', cancel = t('Annuleren'), onOk }) {
  return new Promise((resolve) => {
    const bg = el('div', { class: 'modal-bg' }); const close = (v) => { bg.remove(); resolve(v); };
    const form = el('form', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, el('h2', null, title), body,
      el('div', { class: 'acts' }, cancel ? el('button', { class: 'btn', type: 'button', onclick: () => close(null) }, cancel) : null, el('button', { class: 'btn pri', type: 'submit' }, ok)));
    form.addEventListener('submit', async (e) => { e.preventDefault(); const v = onOk ? await onOk() : true; if (v !== undefined && v !== false) close(v); });
    bg.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(null); });
    bg.addEventListener('mousedown', (e) => { if (e.target === bg) close(null); });
    bg.append(form); document.body.append(bg);
    const f = form.querySelector('input,textarea,button.pri'); if (f) f.focus();
  });
}

/* ---------- Toestand ---------- */
const COLORS = [['Geel', '#FFD60A'], ['Cyaan', '#00C7E5'], ['Groen', '#5FD08A'], ['Roze', '#FF6FA3'], ['Rood', '#E5383B'], ['Marine', '#004974']];
const S = {
  pdf: null, bytes: null, name: '', size: 0, password: null, gen: 0, sizes: [], els: [], rot: 0,
  zoomMode: 1, zoom: 1, isSample: false, sc: 1.333, view: 'cont', cur: 1, tool: 'select', color: COLORS[0][1], invert: false,
  annots: [], sel: null, undo: [], redo: [], dirty: false, nextId: 1,
  texts: [], hits: [], hitIdx: -1, q: '', searchRun: 0, pendingHit: null
};
const $ = {}; // vaste knooppunten

/* ---------- Opbouw van de pagina ---------- */
const TOOLS = [['select', 'cursor', 'Selecteren'], ['hand', 'hand', 'Hand (slepen)'], ['hl', 'hl', 'Markeren'], ['ul', 'ul', 'Onderstrepen'], ['st', 'st', 'Doorhalen'],
  ['note', 'note', 'Notitie'], ['text', 'text', 'Tekstvak'], ['ink', 'ink', 'Tekenen'], ['rect', 'rect', 'Kader']];
const STUDIO_TOOLS = [['edit-text', 'Tekst bewerken'], ['fill-form', 'Formulier invullen'], ['edit-sign', 'Handtekening zetten'], ['edit-redact', 'Permanent redigeren'], ['merge', "PDF's samenvoegen"], ['split', 'PDF splitsen'],
  ['organize', "Pagina's ordenen"], ['rotate', "Pagina's roteren"], ['compress', 'Comprimeren'], ['protect', 'Wachtwoord instellen'], ['watermark', 'Watermerk'], ['compare', "PDF's vergelijken"], ['search', "Zoeken in meerdere PDF's"]];

const langSwitch = () => el('div', { class: 'lang-switch', role: 'group', 'aria-label': t('Taal') }, ['nl', 'en'].map((l) => el('button', { class: 'lang-opt', type: 'button', id: 'lang-' + l, lang: l, 'aria-pressed': String(LANG === l), onclick: () => setLang(l) }, l.toUpperCase())));
async function setLang(l) {
  if (l === LANG) return; LANG = l; try { localStorage.setItem('abn-viewer-lang', l); } catch {} document.documentElement.lang = l; setDropText();
  const had = S.pdf, side = !$.side.classList.contains('closed'), sOpen = !$.searchbar.hidden, q = $.q.value, cnt = $.cnt.textContent; closeMenu(); closeNote(); build();
  if (side) $.side.classList.remove('closed'); if (sOpen) { $.searchbar.hidden = false; $.q.value = q; $.cnt.textContent = cnt; }
  if (!had) return;
  buildPages(); updateHeader(); buildThumbs(); buildOutline(); buildNotesList(); renderUndo(); goTo(S.cur);
}

function build() {
  const tbtn = (id, ic, label, on, extra) => el('button', { class: 'tbtn', type: 'button', id, title: label, 'aria-label': label, onclick: on, ...extra }, icon(ic));
  $.name = el('span', { class: 'docname' });
  $.themeBtn = el('button', { class: 'btn ghost icon', type: 'button', id: 'theme', onclick: cycleTheme });
  $.toolsBtn = el('button', { class: 'btn', type: 'button', id: 'tools-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', onclick: toggleToolsMenu }, icon('tool'), t('Hulpmiddelen'));
  $.file = el('input', { type: 'file', accept: '.pdf,application/pdf', class: 'sr', id: 'file-in', multiple: true, 'aria-label': t('PDF kiezen'), onchange: (e) => { const fs = [...e.target.files]; e.target.value = ''; if (fs.length) openFiles(fs); } });
  $.tabsList = el('div', { class: 'dtabs', role: 'tablist', 'aria-label': t('Geopende documenten') });
  $.tabsList.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { $.tabsList.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  $.tabbar = el('div', { class: 'tabbar', hidden: !TABS.length }, $.tabsList,
    el('button', { class: 'dnew', type: 'button', id: 'tab-new', title: t('PDF openen (Ctrl+O)'), 'aria-label': t('PDF openen in een nieuw tabblad'), onclick: () => $.file.click() }, icon('plus', 16)));
  const top = el('header', { class: 'top' },
    el('img', { class: 'logo', src: BASE + 'logo.png', alt: 'ABN Cleanroom Technology' }), el('div', { class: 'sep' }), el('span', { class: 'app' }, 'PDF Viewer'), $.name, el('div', { class: 'sp' }),
    el('button', { class: 'btn', type: 'button', id: 'open', onclick: () => $.file.click() }, icon('open'), t('Openen')),
    el('button', { class: 'btn pri', type: 'button', id: 'save', onclick: save }, icon('save'), t('Opslaan')),
    el('button', { class: 'btn ghost icon', type: 'button', id: 'print', title: t('Afdrukken'), 'aria-label': t('Afdrukken'), onclick: printDoc }, icon('print', 20)),
    el('button', { class: 'btn ghost icon', type: 'button', id: 'props', title: t('Documenteigenschappen'), 'aria-label': t('Documenteigenschappen'), onclick: showProps }, icon('info', 20)),
    $.toolsBtn, langSwitch(), $.themeBtn, $.file);

  $.pageIn = el('input', { class: 'pgin', id: 'page-in', type: 'text', inputmode: 'numeric', 'aria-label': t('Paginanummer'), value: '1', onchange: () => goTo(parseInt($.pageIn.value, 10) || S.cur), onkeydown: (e) => e.stopPropagation() });
  $.pageOf = el('span', { class: 'pgof' }, '/ 1');
  $.zoomSel = el('select', { class: 'zsel', id: 'zoom', 'aria-label': t('Zoom'), onchange: (e) => setZoom(e.target.value) },
    el('option', { value: 'fitw' }, t('Passend op breedte')), el('option', { value: 'fitp' }, t('Hele pagina')), [50, 75, 100, 125, 150, 200, 300, 400].map((z) => el('option', { value: z / 100 }, z + '%')), el('option', { value: 'custom', hidden: true }, ''));
  $.viewBtns = [['cont', 'cont', 'Doorlopend'], ['single', 'single', 'Enkele pagina'], ['two', 'two', "Twee pagina's"]].map(([id, ic, label]) => tbtn('view-' + id, ic, t(label), () => setView(id), { 'aria-pressed': String(S.view === id) }));
  $.toolBtns = TOOLS.map(([id, ic, label]) => tbtn('tool-' + id, ic, t(label), () => setTool(id), { 'aria-pressed': String(S.tool === id) }));
  $.swatches = COLORS.map(([name, hex]) => el('button', { class: 'sw', type: 'button', title: t(name), 'aria-label': t('Kleur {0}', t(name)), 'aria-pressed': String(S.color === hex), style: { background: hex }, onclick: () => setColor(hex) }));
  $.undoBtn = tbtn('undo', 'undo', t('Ongedaan maken (Ctrl+Z)'), undo); $.redoBtn = tbtn('redo', 'redo', t('Opnieuw (Ctrl+Y)'), redo);
  $.delBtn = tbtn('del', 'trash', t('Geselecteerde opmerking verwijderen (Del)'), deleteSel);
  $.invBtn = tbtn('invert', 'inv', t("Donkere pagina's"), () => { S.invert = !S.invert; $.stage.classList.toggle('inv', S.invert); $.invBtn.setAttribute('aria-pressed', String(S.invert)); }, { 'aria-pressed': String(S.invert) });
  const bar = el('div', { class: 'bar', role: 'toolbar', 'aria-label': t('Werkbalk') },
    el('div', { class: 'grp' }, tbtn('side-toggle', 'side', t('Zijpaneel tonen of verbergen'), toggleSide), tbtn('search-toggle', 'search', t('Zoeken (Ctrl+F)'), () => toggleSearch(true))),
    el('div', { class: 'grp' }, tbtn('prev', 'up', t('Vorige pagina'), () => goTo(S.cur - 1)), $.pageIn, $.pageOf, tbtn('next', 'down', t('Volgende pagina'), () => goTo(S.cur + 1))),
    el('div', { class: 'grp' }, tbtn('zout', 'zout', t('Uitzoomen'), () => stepZoom(-1)), $.zoomSel, tbtn('zin', 'zin', t('Inzoomen'), () => stepZoom(1))),
    el('div', { class: 'grp' }, ...$.viewBtns, tbtn('rot', 'rotate', t('Weergave 90° draaien'), rotateView), $.invBtn),
    el('div', { class: 'grp', role: 'group', 'aria-label': t('Opmerkingen') }, ...$.toolBtns, el('div', { class: 'swgrp' }, ...$.swatches), $.undoBtn, $.redoBtn, $.delBtn));

  $.q = el('input', { type: 'search', id: 'q', placeholder: t('Zoek in het document'), autocomplete: 'off', 'aria-label': t('Zoeken'), onkeydown: (e) => { e.stopPropagation(); if (e.key === 'Enter') { if (e.shiftKey) stepHit(-1); else if ($.q.value === S.q && S.hits.length) stepHit(1); else runSearch(); } if (e.key === 'Escape') toggleSearch(false); } });
  $.case = el('input', { type: 'checkbox', id: 'q-case', onchange: () => runSearch() });
  $.cnt = el('span', { class: 'cnt', role: 'status' }, '');
  $.searchbar = el('div', { class: 'searchbar', hidden: true }, $.q, el('button', { class: 'btn sm pri', type: 'button', onclick: () => runSearch() }, t('Zoeken')),
    el('button', { class: 'btn sm', type: 'button', 'aria-label': t('Vorige treffer'), onclick: () => stepHit(-1) }, icon('up', 16)), el('button', { class: 'btn sm', type: 'button', 'aria-label': t('Volgende treffer'), onclick: () => stepHit(1) }, icon('down', 16)),
    el('label', { for: 'q-case' }, $.case, t('Hoofdlettergevoelig')), $.cnt, el('button', { class: 'btn sm ghost', type: 'button', onclick: () => toggleSearch(false) }, t('Sluiten')));

  $.tabBtns = [['thumbs', 'thumbs', 'Pagina\'s'], ['marks', 'mark', 'Bladwijzers'], ['notes', 'note', 'Notities']].map(([id, ic, label]) =>
    el('button', { class: 'tab', type: 'button', role: 'tab', id: 'tab-' + id, 'aria-selected': String(id === 'thumbs'), onclick: () => setTab(id) }, icon(ic, 16), t(label)));
  $.pThumbs = el('div', { class: 'panel thumbs', role: 'tabpanel' }); $.pMarks = el('div', { class: 'panel', role: 'tabpanel', hidden: true }); $.pNotes = el('div', { class: 'panel', role: 'tabpanel', hidden: true });
  $.side = el('aside', { class: 'side closed', 'aria-label': t('Zijpaneel') }, el('div', { class: 'tabs', role: 'tablist' }, ...$.tabBtns), $.pThumbs, $.pMarks, $.pNotes);
  $.pages = el('div', { class: 'pages cont' });
  $.start = el('div', { class: 'start', hidden: !!S.pdf }, el('div', { class: 'card' },
    el('img', { class: 'slogo', src: BASE + 'logo.png', alt: 'ABN Cleanroom Technology' }), el('h1', null, t('Open een PDF om te beginnen')),
    el('p', null, t('Sleep een PDF-bestand hierheen of kies een bestand van uw computer.')),
    el('button', { class: 'btn pri', type: 'button', id: 'start-open', onclick: () => $.file.click() }, icon('open'), t('PDF kiezen')),
    el('p', { class: 'hint' }, t('Alles blijft op uw computer.'))));
  $.stage = el('div', { class: 'stage' + (S.invert ? ' inv' : ''), id: 'stage', 'data-tool': S.tool, tabindex: '-1' }, $.pages, $.start);
  $.status = el('footer', { class: 'status' }, el('span', { id: 'st-info' }), el('span', null, t('Verwerking gebeurt lokaal in uw browser, er worden geen bestanden verstuurd')));
  document.getElementById('app').replaceChildren(top, $.tabbar, bar, $.searchbar, el('div', { class: 'main' }, $.side, $.stage), $.status);
  paintTheme(); wireStage(); syncZoomUI(); updateHeader(); renderTabs();
}

/* ---------- Thema ---------- */
const THEMES = ['auto', 'light', 'dark']; let theme = 'auto';
try { theme = localStorage.getItem('abn-viewer-theme') || 'auto'; } catch {}
if (!THEMES.includes(theme)) theme = 'auto';
const themeLabel = () => t({ auto: 'Thema: automatisch (instelling toestel)', light: 'Thema: licht', dark: 'Thema: donker' }[theme]);
function paintTheme() {
  if (theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme;
  const label = themeLabel(); $.themeBtn.title = label; $.themeBtn.setAttribute('aria-label', label + t(', klik om te wisselen'));
  $.themeBtn.replaceChildren(icon(theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'auto', 20));
}
function cycleTheme() { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; try { localStorage.setItem('abn-viewer-theme', theme); } catch {} paintTheme(); toast(themeLabel()); }

/* ---------- Document laden ---------- */
async function openFiles(files) { for (const f of files) await openFile(f); }
async function openFile(file) {
  if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { toast(t('Dit is geen PDF-bestand.'), 'error'); return; }
  const dup = TABS.find((x) => { const d = x === activeTab ? S : x.d; return d.name === file.name && d.size === file.size; });
  if (dup) { activateTab(dup); toast(t('"{0}" is al geopend.', file.name)); return; }
  await loadBytes(new Uint8Array(await file.arrayBuffer()), file.name);
}
async function loadBytes(bytes, name) {
  let task = pdfjs.getDocument({ ...PDFJS_OPTS, data: bytes.slice() }); let pw = null;
  task.onPassword = async (cb, reason) => {
    const inp = el('input', { type: 'password', id: 'pw-in', autocomplete: 'off' });
    const v = await modal({ title: t('Beveiligde PDF'), ok: t('Openen'), body: el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, el('p', { class: 'empty' }, t('"{0}" is beveiligd met een wachtwoord.', name) + (reason === 2 ? t(' Het wachtwoord was onjuist, probeer opnieuw.') : '')), el('label', { for: 'pw-in' }, t('Wachtwoord')), inp), onOk: () => inp.value });
    if (v == null) { task.destroy(); return; } pw = v; cb(v);
  };
  let pdf;
  try { pdf = await task.promise; } catch (e) { toast(e && e.name === 'PasswordException' ? t('Geen wachtwoord opgegeven.') : t('"{0}" is geen geldige PDF of is beschadigd.', name), 'error'); return; }
  // elk document krijgt een eigen tabblad met een eigen toestand
  const d = { pdf, bytes, name, size: bytes.length, password: pw, sizes: [], rot: 0, zoomMode: 1, zoom: 1, sc: S.sc, view: S.view, cur: 1, annots: [], sel: null, undo: [], redo: [], dirty: false, nextId: 1, texts: [], hits: [], hitIdx: -1, q: '' };
  const sizeOf = async (i) => { const p = await pdf.getPage(i); const v = p.getViewport({ scale: 1 }); return { w: v.width, h: v.height }; };
  d.sizes[1] = await sizeOf(1);
  for (let i = 2; i <= pdf.numPages; i++) d.sizes[i] = d.sizes[1];
  addTab(d);
  (async () => { // werkelijke paginaformaten nalopen (ook als de gebruiker intussen van tabblad wisselt)
    try {
      for (let i = 2; i <= pdf.numPages; i += 20) {
        const chunk = await Promise.all(Array.from({ length: Math.min(20, pdf.numPages - i + 1) }, (_, k) => sizeOf(i + k)));
        chunk.forEach((sz, k) => { d.sizes[i + k] = sz; });
      }
    } catch { return; } // tabblad intussen gesloten
    if (S.pdf === pdf) layout(true);
  })();
}
function updateHeader() {
  $.name.replaceChildren(el('b', null, S.name), S.dirty ? ' ●' : '');
  $.pageOf.textContent = '/ ' + (S.pdf ? S.pdf.numPages : 0); $.pageIn.value = String(S.cur);
  document.title = (S.name ? S.name + ' · ' : '') + 'ABN PDF Viewer';
  if (activeTab) paintTab(activeTab);
  $.status.firstChild.textContent = S.pdf ? `${S.pdf.numPages === 1 ? t('1 pagina') : t("{0} pagina's", S.pdf.numPages)} · ${fmtBytes(S.size)} · ${Math.round(S.sc * 75)}%` : '';
}

/* ---------- Indeling en rendering ---------- */
let io;
function buildPages() {
  io && io.disconnect(); $.pages.replaceChildren(); S.els = [];
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const n = +e.target.dataset.n;
      if (e.isIntersecting) renderPage(n); else if (S.view !== 'single') freePage(n);
    }
  }, { root: $.stage, rootMargin: '700px 0px 700px 0px' });
  for (let n = 1; n <= S.pdf.numPages; n++) {
    const pg = el('div', { class: 'pg', 'data-n': n, id: 'page-' + n }, el('div', { class: 'cvw' }), el('div', { class: 'ph-label' }, t('Pagina {0}', n)));
    S.els[n] = pg; $.pages.append(pg); io.observe(pg);
  }
  setView(S.view, true);
}
function visSize(n) { const s = S.sizes[n]; return S.rot % 180 ? { w: s.h, h: s.w } : { w: s.w, h: s.h }; }
function computeScale() {
  if (typeof S.zoomMode === 'number') return S.zoomMode * 96 / 72;
  const cs = getComputedStyle($.pages); const padX = parseFloat(cs.paddingLeft) * 2, padY = parseFloat(cs.paddingTop) * 2;
  const per = S.view === 'two' ? 2 : 1; const v = visSize(S.cur);
  const aw = ($.stage.clientWidth - padX - 14 * (per - 1)) / per - 2, ah = $.stage.clientHeight - padY - 2;
  const fw = aw / v.w; return Math.max(0.1, S.zoomMode === 'fitp' ? Math.min(fw, ah / v.h) : fw);
}
function layout(keep) {
  if (!S.pdf) return;
  const ratio = keep ? $.stage.scrollTop / Math.max(1, $.stage.scrollHeight) : 0;
  S.sc = computeScale();
  for (let n = 1; n <= S.pdf.numPages; n++) { const v = visSize(n); const pg = S.els[n]; pg.style.width = Math.floor(v.w * S.sc) + 'px'; pg.style.height = Math.floor(v.h * S.sc) + 'px'; }
  if (S.view !== 'single' && keep) $.stage.scrollTop = ratio * $.stage.scrollHeight;
  syncZoomUI(); updateHeader();
  S.els.forEach((pg, n) => { if (pg && pg._key && pg._key !== keyFor()) renderPage(n); });
}
const keyFor = () => `${S.gen}|${S.rot}|${S.sc.toFixed(4)}`;
function syncZoomUI() {
  const pct = Math.round(S.sc * 75);
  if (typeof S.zoomMode === 'number') { const opt = [...$.zoomSel.options].find((o) => o.value !== 'custom' && o.value !== 'fitw' && o.value !== 'fitp' && Math.abs(+o.value - S.zoomMode) < 0.001); if (opt) $.zoomSel.value = opt.value; else { const c = $.zoomSel.querySelector('[value=custom]'); c.textContent = pct + '%'; c.hidden = false; $.zoomSel.value = 'custom'; } }
  else $.zoomSel.value = S.zoomMode;
}
function setZoom(v) { S.zoomMode = v === 'fitw' || v === 'fitp' ? v : parseFloat(v); layout(true); }
function stepZoom(d) {
  const steps = [.25, .5, .75, 1, 1.25, 1.5, 2, 3, 4]; const cur = S.sc * 72 / 96;
  const next = d > 0 ? steps.find((s) => s > cur + 0.01) || 4 : [...steps].reverse().find((s) => s < cur - 0.01) || .25;
  S.zoomMode = next; layout(true);
}
function setView(v, silent) {
  S.view = v; $.pages.className = 'pages ' + v;
  $.viewBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(['cont', 'single', 'two'][i] === v)));
  S.els.forEach((pg, n) => pg && pg.classList.toggle('cur', n === S.cur));
  layout(false); if (!silent) goTo(S.cur);
}
function rotateView() { if (!S.pdf) return; S.rot = (S.rot + 90) % 360; S.els.forEach((pg) => { pg._key = null; }); layout(true); S.els.forEach((pg, n) => { if (pg && pg._vis) renderPage(n); }); }
function freePage(n) {
  const pg = S.els[n]; if (!pg || !pg._key) return; if (pg._task) { try { pg._task.cancel(); } catch {} }
  pg._key = null; pg._vis = false; pg.replaceChildren(el('div', { class: 'cvw' }), el('div', { class: 'ph-label' }, t('Pagina {0}', n)));
}
async function renderPage(n) {
  const pg = S.els[n]; if (!pg || !S.pdf) return; const key = keyFor(); if (pg._key === key) return; pg._key = key; pg._vis = true;
  if (pg._task) { try { pg._task.cancel(); } catch {} }
  const gen = S.gen, sc = S.sc;
  try {
    const page = await S.pdf.getPage(n); if (pg._key !== key) return;
    const rotation = (page.rotate + S.rot) % 360, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vp = page.getViewport({ scale: sc, rotation }), vpHi = page.getViewport({ scale: sc * dpr, rotation });
    const c = el('canvas'); c.width = Math.floor(vpHi.width); c.height = Math.floor(vpHi.height); c.style.width = Math.floor(vp.width) + 'px'; c.style.height = Math.floor(vp.height) + 'px';
    pg._task = page.render({ canvas: c, viewport: vpHi }); await pg._task.promise;
    if (pg._key !== key || gen !== S.gen) return;
    const cvw = el('div', { class: 'cvw' }, c); const tl = el('div', { class: 'tl' }), ll = el('div', { class: 'll' }), ah = el('div', { class: 'ah' }), cap = el('div', { class: 'cap' }), al = sv('svg', { class: 'al', width: Math.floor(vp.width), height: Math.floor(vp.height) });
    pg.replaceChildren(cvw, al, tl, ll, ah, cap); pg._tl = tl; pg._ah = ah; pg._al = al; wireCapture(pg, cap, n);
    drawAnnots(n);
    buildText(n, page, vp, tl); buildLinks(n, page, vp, ll);
  } catch (e) { if (e && e.name !== 'RenderingCancelledException') console.warn(e); }
}
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const mctx = document.createElement('canvas').getContext('2d');
async function buildText(n, page, vp, tl) {
  const content = await page.getTextContent(); if (!tl.isConnected) return;
  if (!S.texts[n]) S.texts[n] = content.items.filter((i) => typeof i.str === 'string').map((i) => i.str);
  const frag = document.createDocumentFragment(); let k = 0;
  for (const it of content.items) {
    if (typeof it.str !== 'string') continue; const idx = k++; if (!it.str.trim() && !it.str) continue;
    const tx = mul(vp.transform, it.transform), fh = Math.hypot(tx[2], tx[3]); if (!fh) continue;
    const ang = Math.atan2(tx[1], tx[0]); mctx.font = `${fh}px sans-serif`; const w = mctx.measureText(it.str).width;
    const target = it.width * vp.scale; const sx = w > 0 && target > 0 ? target / w : 1;
    const sp = el('span', { 'data-i': idx, style: { left: tx[4] + 'px', top: tx[5] + 'px', fontSize: fh + 'px', transform: `rotate(${ang}rad) scaleX(${sx}) translateY(-0.82em)` } }, it.str);
    sp._s = it.str; frag.append(sp);
  }
  tl.append(frag); markHits(n);
}
async function buildLinks(n, page, vp, ll) {
  let anns = []; try { anns = await page.getAnnotations({ intent: 'display' }); } catch {} if (!ll.isConnected) return;
  for (const a of anns) {
    if (a.subtype !== 'Link' || !(a.url || a.dest || a.unsafeUrl)) continue;
    const r = vp.convertToViewportRectangle(a.rect); const x = Math.min(r[0], r[2]), y = Math.min(r[1], r[3]);
    const url = a.url || a.unsafeUrl;
    const link = el('a', { style: { left: x + 'px', top: y + 'px', width: Math.abs(r[2] - r[0]) + 'px', height: Math.abs(r[3] - r[1]) + 'px' }, title: url || t('Naar bestemming in dit document'), ...(url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: '#', onclick: (e) => { e.preventDefault(); gotoDest(a.dest); } }) });
    ll.append(link);
  }
}
async function gotoDest(dest) {
  try { const d = typeof dest === 'string' ? await S.pdf.getDestination(dest) : dest; if (!d) return; const ref = d[0]; const i = typeof ref === 'object' ? await S.pdf.getPageIndex(ref) : ref; goTo(i + 1); } catch {}
}

/* ---------- Navigatie ---------- */
function goTo(n) {
  if (!S.pdf) return; n = clamp(Math.round(n), 1, S.pdf.numPages); S.cur = n;
  S.els.forEach((pg, i) => pg && pg.classList.toggle('cur', i === n));
  if (S.view === 'single') { layout(false); $.stage.scrollTop = 0; renderPage(n); }
  else { const pg = S.els[n]; $.stage.scrollTop = pg.offsetTop - 12; }
  markCurrent(); updateHeader();
}
function markCurrent() {
  $.pThumbs.querySelectorAll('.th').forEach((t) => t.setAttribute('aria-current', String(+t.dataset.n === S.cur)));
  const t = $.pThumbs.querySelector(`.th[data-n="${S.cur}"]`); if (t && !$.side.classList.contains('closed')) t.scrollIntoView({ block: 'nearest' });
}
let scrollRaf = 0;
function onScroll() {
  if (S.view === 'single' || !S.pdf || scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0; const mid = $.stage.scrollTop + $.stage.clientHeight / 2; let best = S.cur, bd = Infinity;
    for (let n = 1; n <= S.pdf.numPages; n++) { const pg = S.els[n]; const d = Math.abs(pg.offsetTop + pg.offsetHeight / 2 - mid); if (d < bd) { bd = d; best = n; } else if (d > bd && pg.offsetTop > mid) break; }
    if (best !== S.cur) { S.cur = best; S.els.forEach((pg, i) => pg && pg.classList.toggle('cur', i === best)); markCurrent(); updateHeader(); }
  });
}
let hintAt = 0;
function wireStage() {
  $.stage.addEventListener('scroll', onScroll, { passive: true });
  $.stage.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); stepZoom(e.deltaY < 0 ? 1 : -1); return; }
    // Horizontaal scrollen: duimwiel (bv. Logitech MX Master 3S), horizontale touchpad-beweging of Shift + muiswiel
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    if (dx && (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))) {
      const k = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? $.stage.clientWidth : 1;
      const before = $.stage.scrollLeft; $.stage.scrollLeft += dx * k;
      if ($.stage.scrollLeft !== before) e.preventDefault();
      else if ($.stage.scrollWidth <= $.stage.clientWidth + 1 && Date.now() - hintAt > 5000) { hintAt = Date.now(); toast(t('De pagina past volledig in beeld. Zoom in om horizontaal te kunnen verschuiven.')); }
    }
  }, { passive: false });
  let drag = null;
  $.stage.addEventListener('pointerdown', (e) => { if (S.tool !== 'hand' || e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, l: $.stage.scrollLeft, t: $.stage.scrollTop }; $.stage.classList.add('grabbing'); $.stage.setPointerCapture(e.pointerId); });
  $.stage.addEventListener('pointermove', (e) => { if (!drag) return; $.stage.scrollLeft = drag.l - (e.clientX - drag.x); $.stage.scrollTop = drag.t - (e.clientY - drag.y); });
  const end = () => { drag = null; $.stage.classList.remove('grabbing'); };
  $.stage.addEventListener('pointerup', end); $.stage.addEventListener('pointercancel', end);
  new ResizeObserver(() => { if (S.pdf && typeof S.zoomMode === 'string') layout(true); }).observe($.stage);
  // tekstmarkering omzetten in markeringen
  $.stage.addEventListener('pointerup', () => { if (['hl', 'ul', 'st'].includes(S.tool)) setTimeout(() => markupFromSelection(S.tool), 0); });
  $.stage.addEventListener('pointerdown', (e) => { if (!e.target.closest('.note,.txt,.npop,.hit') && S.sel != null && S.tool === 'select') { S.sel = null; redrawAll(); } });
}
function setTab(id) {
  $.tabBtns.forEach((b) => b.setAttribute('aria-selected', String(b.id === 'tab-' + id)));
  $.pThumbs.hidden = id !== 'thumbs'; $.pMarks.hidden = id !== 'marks'; $.pNotes.hidden = id !== 'notes';
}
function toggleSide() { $.side.classList.toggle('closed'); if (S.pdf && typeof S.zoomMode === 'string') requestAnimationFrame(() => layout(true)); }
function buildThumbs() {
  $.pThumbs.replaceChildren(); const n = S.pdf.numPages; const gen = S.gen;
  const tio = new IntersectionObserver((es) => es.forEach(async (e) => {
    if (!e.isIntersecting) return; tio.unobserve(e.target); const t = e.target; const num = +t.dataset.n;
    try {
      const page = await S.pdf.getPage(num); if (gen !== S.gen) return; const v1 = page.getViewport({ scale: 1 }); const vp = page.getViewport({ scale: 132 / v1.width });
      const c = el('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height); await page.render({ canvas: c, viewport: vp }).promise; t.querySelector('.ph').replaceWith(c);
    } catch {}
  }), { root: $.pThumbs, rootMargin: '300px' });
  for (let i = 1; i <= n; i++) {
    const s = S.sizes[i]; const tb = el('button', { class: 'th', type: 'button', 'data-n': i, 'aria-label': t('Naar pagina {0}', i), 'aria-current': String(i === S.cur), onclick: () => goTo(i) }, el('div', { class: 'ph', style: { width: '132px', height: Math.round(132 * s.h / s.w) + 'px' } }), String(i));
    $.pThumbs.append(tb); tio.observe(tb);
  }
}
async function buildOutline() {
  $.pMarks.replaceChildren(el('p', { class: 'empty' }, t('Bladwijzers worden geladen…'))); const gen = S.gen; let out = null;
  try { out = await S.pdf.getOutline(); } catch {} if (gen !== S.gen) return;
  if (!out || !out.length) { $.pMarks.replaceChildren(el('p', { class: 'empty' }, t('Dit document bevat geen bladwijzers.'))); return; }
  const tree = (items) => el('ul', null, items.map((it) => el('li', null, el('button', { type: 'button', onclick: () => it.dest ? gotoDest(it.dest) : it.url && window.open(it.url, '_blank') }, it.title || t('(zonder titel)')), it.items && it.items.length ? tree(it.items) : null)));
  const root = tree(out); root.className = 'tree'; $.pMarks.replaceChildren(root);
}

/* ---------- Zoeken ---------- */
function toggleSearch(open) { $.searchbar.hidden = !open; if (open) { $.q.focus(); $.q.select(); } else { clearHits(); } if (S.pdf && typeof S.zoomMode === 'string') requestAnimationFrame(() => layout(true)); }
function clearHits() { S.hits = []; S.hitIdx = -1; S.q = ''; $.cnt.textContent = ''; S.els.forEach((pg, n) => pg && pg._tl && markHits(n)); }
async function runSearch() {
  if (!S.pdf) return; const q = $.q.value; if (!q.trim()) { clearHits(); return; }
  const run = ++S.searchRun; S.q = q; S.hits = []; S.hitIdx = -1; const cs = $.case.checked; const needle = cs ? q : q.toLowerCase();
  for (let n = 1; n <= S.pdf.numPages; n++) {
    if (run !== S.searchRun) return;
    if (!S.texts[n]) { const page = await S.pdf.getPage(n); const c = await page.getTextContent(); S.texts[n] = c.items.filter((i) => typeof i.str === 'string').map((i) => i.str); }
    S.texts[n].forEach((s, i) => { const hay = cs ? s : s.toLowerCase(); let from = 0, at; while ((at = hay.indexOf(needle, from)) !== -1) { S.hits.push({ n, i, at, len: needle.length }); from = at + Math.max(1, needle.length); } });
    if (n % 10 === 0) $.cnt.textContent = t('Zoeken… {0}/{1}', n, S.pdf.numPages);
  }
  $.cnt.textContent = S.hits.length ? '' : t('Geen treffers'); if (S.hits.length) stepHit(1, true);
  S.els.forEach((pg, n) => pg && pg._tl && markHits(n));
}
function stepHit(d, first) {
  if (!S.hits.length) return; S.hitIdx = first ? 0 : (S.hitIdx + d + S.hits.length) % S.hits.length;
  const h = S.hits[S.hitIdx]; $.cnt.textContent = t('{0} van {1}', S.hitIdx + 1, S.hits.length); S.pendingHit = h;
  if (S.cur !== h.n || S.view === 'single') goTo(h.n); else if (!S.els[h.n]._tl) goTo(h.n);
  S.els.forEach((pg, n) => pg && pg._tl && markHits(n));
}
function markHits(n) {
  const pg = S.els[n]; if (!pg || !pg._tl) return; const spans = pg._tl.children; const mine = S.hits.filter((h) => h.n === n);
  const by = new Map(); mine.forEach((h) => { (by.get(h.i) || by.set(h.i, []).get(h.i)).push(h); });
  for (const sp of spans) {
    const list = by.get(+sp.dataset.i); const had = sp.querySelector('mark');
    if (!list && !had) continue;
    if (!list) { sp.textContent = sp._s; continue; }
    let html = '', pos = 0; for (const h of list) { html += esc(sp._s.slice(pos, h.at)) + `<mark${S.hits[S.hitIdx] === h ? ' class="cur"' : ''}>` + esc(sp._s.slice(h.at, h.at + h.len)) + '</mark>'; pos = h.at + h.len; }
    sp.innerHTML = html + esc(sp._s.slice(pos));
  }
  if (S.pendingHit && S.pendingHit.n === n) { const m = pg._tl.querySelector('mark.cur'); if (m) { S.pendingHit = null; m.scrollIntoView({ block: 'center', inline: 'center' }); } }
}

/* ---------- Opmerkingen: model, tekenen, bewerken ---------- */
function snap() { S.undo.push(JSON.stringify(S.annots)); if (S.undo.length > 60) S.undo.shift(); S.redo = []; S.dirty = true; renderUndo(); updateHeader(); }
function restore(json) { S.annots = JSON.parse(json); if (!S.annots.some((a) => a.id === S.sel)) S.sel = null; redrawAll(); buildNotesList(); renderUndo(); updateHeader(); }
function undo() { if (!S.undo.length) return; S.redo.push(JSON.stringify(S.annots)); restore(S.undo.pop()); S.dirty = true; updateHeader(); }
function redo() { if (!S.redo.length) return; S.undo.push(JSON.stringify(S.annots)); restore(S.redo.pop()); S.dirty = true; updateHeader(); }
function renderUndo() { if (!$.undoBtn) return; $.undoBtn.disabled = !S.undo.length; $.redoBtn.disabled = !S.redo.length; $.delBtn.disabled = S.sel == null; }
function addAnnot(a) { snap(); a.id = S.nextId++; S.annots.push(a); redrawPage(a.p); buildNotesList(); return a; }
function deleteSel() { if (S.sel == null) return; const a = S.annots.find((x) => x.id === S.sel); if (!a) return; snap(); S.annots = S.annots.filter((x) => x.id !== S.sel); S.sel = null; closeNote(); redrawPage(a.p); buildNotesList(); renderUndo(); }
function redrawPage(n) { drawAnnots(n); }
function redrawAll() { S.els.forEach((pg, n) => pg && pg._al && drawAnnots(n)); renderUndo(); }
function geo(n) { const s = S.sizes[n]; const r = ((S.rot % 360) + 360) % 360; const W = s.w, H = s.h, k = S.sc;
  return { fwd: (x, y) => (r === 0 ? [x, y] : r === 90 ? [H - y, x] : r === 180 ? [W - x, H - y] : [y, W - x]).map((v) => v * k),
    inv: (px, py) => { const u = px / k, v = py / k; return r === 0 ? [u, v] : r === 90 ? [v, H - u] : r === 180 ? [W - u, H - v] : [W - v, u]; }, r, k }; }
function bbox(a) { if (a.type === 'ink') { const xs = a.pts.map((p) => p[0]), ys = a.pts.map((p) => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; } if (a.type === 'note') return { x: a.x, y: a.y, w: 20, h: 20 }; return { x: a.x, y: a.y, w: a.w, h: a.h }; }
function pxRect(g, b) { const p = g.fwd(b.x, b.y), q = g.fwd(b.x + b.w, b.y + b.h); return { x: Math.min(p[0], q[0]), y: Math.min(p[1], q[1]), w: Math.abs(q[0] - p[0]), h: Math.abs(q[1] - p[1]) }; }
function drawAnnots(n) {
  const pg = S.els[n]; if (!pg || !pg._al) return; const g = geo(n), al = pg._al, ah = pg._ah; al.replaceChildren(); ah.replaceChildren();
  for (const a of S.annots) {
    if (a.p !== n) continue; const sel = a.id === S.sel;
    if (a.type === 'hl' || a.type === 'ul' || a.type === 'st') {
      const r = pxRect(g, a);
      if (a.type === 'hl') al.append(sv('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: a.color, 'fill-opacity': .4, style: 'mix-blend-mode:multiply' }));
      else { const y = a.type === 'ul' ? r.y + r.h - 1 : r.y + r.h / 2; al.append(sv('line', { x1: r.x, x2: r.x + r.w, y1: y, y2: y, stroke: a.color, 'stroke-width': Math.max(1.5, g.k * 1.2) })); }
      if (sel) al.append(sv('rect', { x: r.x - 2, y: r.y - 2, width: r.w + 4, height: r.h + 4, fill: 'none', stroke: '#00C7E5', 'stroke-width': 2, 'stroke-dasharray': '5 3' }));
    } else if (a.type === 'rect') {
      const r = pxRect(g, a); const e = sv('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: 'none', stroke: a.color, 'stroke-width': Math.max(1, g.k * 1.6), class: 'hit', 'data-id': a.id }); al.append(e); hookDrag(e, a, n);
      if (sel) al.append(sv('rect', { x: r.x - 3, y: r.y - 3, width: r.w + 6, height: r.h + 6, fill: 'none', stroke: '#00C7E5', 'stroke-width': 2, 'stroke-dasharray': '5 3' }));
    } else if (a.type === 'ink') {
      const pts = a.pts.map((p) => g.fwd(p[0], p[1]).join(',')).join(' '); const e = sv('polyline', { points: pts, fill: 'none', stroke: a.color, 'stroke-width': Math.max(1, g.k * 2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'hit', 'data-id': a.id }); al.append(e); hookDrag(e, a, n);
      if (sel) { const r = pxRect(g, bbox(a)); al.append(sv('rect', { x: r.x - 4, y: r.y - 4, width: r.w + 8, height: r.h + 8, fill: 'none', stroke: '#00C7E5', 'stroke-width': 2, 'stroke-dasharray': '5 3' })); }
    } else if (a.type === 'note') {
      const p = g.fwd(a.x, a.y); const b = el('button', { class: 'note' + (sel ? ' sel' : ''), type: 'button', title: a.text || t('Notitie'), 'aria-label': t('Notitie'), style: { left: p[0] + 'px', top: p[1] + 'px', background: a.color } }, icon('note', 14));
      ah.append(b); b.addEventListener('click', (e) => { e.stopPropagation(); selectAnnot(a.id); openNote(a, n); }); hookDrag(b, a, n);
    } else if (a.type === 'text') {
      const p = g.fwd(a.x, a.y); const d = el('div', { class: 'txt' + (sel ? ' sel' : ''), contenteditable: 'false', spellcheck: 'false', style: { left: p[0] + 'px', top: p[1] + 'px', width: a.w * g.k + 'px', fontSize: a.fs * g.k + 'px', color: a.color, transform: `rotate(${g.r}deg)` } }, a.text);
      ah.append(d); hookDrag(d, a, n);
      d.addEventListener('dblclick', () => editText(d, a, n)); if (a._new) { delete a._new; setTimeout(() => editText(d, a, n), 0); }
    }
  }
}
function editText(d, a, n) {
  d.contentEditable = 'plaintext-only'; d.focus(); const r = document.createRange(); r.selectNodeContents(d); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  const done = () => { d.removeEventListener('blur', done); d.contentEditable = 'false'; const t = d.innerText.replace(/\n$/, ''); if (!t.trim()) { S.annots = S.annots.filter((x) => x.id !== a.id); if (S.sel === a.id) S.sel = null; S.dirty = true; } else if (t !== a.text) { snap(); a.text = t; a.h = Math.max(1, d.offsetHeight / geo(n).k); } else a.h = Math.max(1, d.offsetHeight / geo(n).k); drawAnnots(n); buildNotesList(); renderUndo(); updateHeader(); };
  d.addEventListener('blur', done); d.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') d.blur(); });
}
function selectAnnot(id) { S.sel = id; redrawAll(); buildNotesList(); }
function hookDrag(node, a, n) {
  node.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || S.tool !== 'select' || node.isContentEditable) return; e.stopPropagation(); if (S.sel !== a.id) { S.sel = a.id; renderUndo(); }
    const g = geo(n); const start = g.inv(e.clientX - node.closest('.pg').getBoundingClientRect().left, e.clientY - node.closest('.pg').getBoundingClientRect().top); let moved = false; const orig = JSON.stringify(a);
    const move = (ev) => {
      const r = node.closest('.pg') ? node.closest('.pg').getBoundingClientRect() : S.els[n].getBoundingClientRect(); const p = g.inv(ev.clientX - r.left, ev.clientY - r.top); const dx = p[0] - start[0], dy = p[1] - start[1];
      if (!moved && Math.hypot(dx, dy) * g.k < 3) return; if (!moved) { moved = true; S.undo.push(JSON.stringify(S.annots)); S.redo = []; }
      const o = JSON.parse(orig); if (a.type === 'ink') a.pts = o.pts.map((q) => [q[0] + dx, q[1] + dy]); else { a.x = o.x + dx; a.y = o.y + dy; } drawAnnots(n);
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); if (moved) { S.dirty = true; renderUndo(); updateHeader(); } else drawAnnots(n); buildNotesList(); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); drawAnnots(n);
  });
}
function wireCapture(pg, cap, n) {
  cap.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return; const rect = () => pg.getBoundingClientRect(); const g = geo(n); const at = (ev) => g.inv(ev.clientX - rect().left, ev.clientY - rect().top);
    const [x, y] = at(e); closeNote();
    if (S.tool === 'note') { const a = addAnnot({ type: 'note', p: n, x, y, color: S.color, text: '' }); S.sel = a.id; drawAnnots(n); openNote(a, n); setTool('select'); return; }
    if (S.tool === 'text') { const a = addAnnot({ type: 'text', p: n, x, y, w: 180, h: 20, fs: 12, color: S.color === '#FFD60A' ? '#004974' : S.color, text: '', _new: true }); S.sel = a.id; drawAnnots(n); setTool('select'); return; }
    if (S.tool === 'rect' || S.tool === 'ink') {
      cap.setPointerCapture(e.pointerId); const pts = [[x, y]]; const live = sv(S.tool === 'rect' ? 'rect' : 'polyline', { fill: 'none', stroke: S.color, 'stroke-width': S.tool === 'rect' ? Math.max(1, g.k * 1.6) : Math.max(1, g.k * 2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); pg._al.append(live);
      const move = (ev) => { const p = at(ev); if (S.tool === 'ink') { pts.push(p); live.setAttribute('points', pts.map((q) => g.fwd(q[0], q[1]).join(',')).join(' ')); } else { const r = pxRect(g, { x: Math.min(x, p[0]), y: Math.min(y, p[1]), w: Math.abs(p[0] - x), h: Math.abs(p[1] - y) }); ['x', 'y', 'width', 'height'].forEach((k, i) => live.setAttribute(k, [r.x, r.y, r.w, r.h][i])); } };
      const up = (ev) => { cap.removeEventListener('pointermove', move); cap.removeEventListener('pointerup', up); live.remove(); const p = at(ev);
        if (S.tool === 'ink' && pts.length > 1) { addAnnot({ type: 'ink', p: n, color: S.color, pts }); } else if (S.tool === 'rect' && Math.abs(p[0] - x) > 3 && Math.abs(p[1] - y) > 3) addAnnot({ type: 'rect', p: n, color: S.color, x: Math.min(x, p[0]), y: Math.min(y, p[1]), w: Math.abs(p[0] - x), h: Math.abs(p[1] - y) });
        drawAnnots(n); };
      cap.addEventListener('pointermove', move); cap.addEventListener('pointerup', up);
    }
  });
}
function markupFromSelection(type) {
  const sel = getSelection(); if (!sel || sel.isCollapsed || !sel.rangeCount) return; const range = sel.getRangeAt(0); const added = [];
  for (const pg of S.els) {
    if (!pg || !pg._tl || !range.intersectsNode(pg._tl)) continue; const n = +pg.dataset.n; const g = geo(n); const pr = pg.getBoundingClientRect(); const lines = [];
    for (const sp of pg._tl.children) {
      if (!range.intersectsNode(sp)) continue; const r = document.createRange(); r.selectNodeContents(sp); const sub = range.cloneRange();
      if (sub.compareBoundaryPoints(Range.START_TO_START, r) < 0) sub.setStart(r.startContainer, r.startOffset); if (sub.compareBoundaryPoints(Range.END_TO_END, r) > 0) sub.setEnd(r.endContainer, r.endOffset);
      for (const c of sub.getClientRects()) if (c.width > 1 && c.height > 1) lines.push({ l: c.left - pr.left, t: c.top - pr.top, r: c.right - pr.left, b: c.bottom - pr.top });
    }
    // regels samenvoegen
    lines.sort((a, b) => a.t - b.t || a.l - b.l); const merged = [];
    for (const l of lines) { const m = merged.find((q) => Math.abs(q.t - l.t) < 4 && l.l <= q.r + 6 && l.l >= q.l - 6 || (Math.abs(q.t - l.t) < 4 && Math.abs(q.b - l.b) < 4 && l.l <= q.r + 6)); if (m) { m.l = Math.min(m.l, l.l); m.r = Math.max(m.r, l.r); m.t = Math.min(m.t, l.t); m.b = Math.max(m.b, l.b); } else merged.push({ ...l }); }
    for (const m of merged) { const p = g.inv(m.l, m.t), q = g.inv(m.r, m.b); added.push({ type, p: n, color: S.color, x: Math.min(p[0], q[0]), y: Math.min(p[1], q[1]), w: Math.abs(q[0] - p[0]), h: Math.abs(q[1] - p[1]) }); }
  }
  if (!added.length) return; snap(); added.forEach((a) => { a.id = S.nextId++; S.annots.push(a); }); sel.removeAllRanges();
  new Set(added.map((a) => a.p)).forEach(redrawPage); buildNotesList(); toast(added.length === 1 ? t('Opmerking toegevoegd.') : t('{0} markeringen toegevoegd.', added.length));
}
let notePop = null;
function closeNote() { if (notePop) { notePop.remove(); notePop = null; } }
function openNote(a, n) {
  closeNote(); const pg = S.els[n]; const g = geo(n); const p = g.fwd(a.x, a.y);
  const ta = el('textarea', { 'aria-label': t('Tekst van de notitie'), placeholder: t('Typ uw opmerking…') }); ta.value = a.text || ''; ta.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') finish(); });
  const finish = () => { if (ta.value !== (a.text || '')) { snap(); a.text = ta.value; } closeNote(); drawAnnots(n); buildNotesList(); };
  notePop = el('div', { class: 'npop', style: { left: clamp(p[0], 4, Math.max(4, pg.clientWidth - 248)) + 'px', top: p[1] + 30 + 'px' } }, ta, el('div', { class: 'row' }, el('button', { class: 'btn sm danger', type: 'button', onclick: () => { closeNote(); S.sel = a.id; deleteSel(); } }, t('Verwijderen')), el('button', { class: 'btn sm pri', type: 'button', onclick: finish }, t('Klaar'))));
  pg.append(notePop); notePop.addEventListener('pointerdown', (e) => e.stopPropagation()); ta.focus();
}
function setTool(t) { S.tool = t; $.stage.dataset.tool = t; $.toolBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(TOOLS[i][0] === t))); if (['hl', 'ul', 'st'].includes(t)) { markupFromSelection(t); } }
function setColor(hex) { S.color = hex; $.swatches.forEach((b, i) => b.setAttribute('aria-pressed', String(COLORS[i][1] === hex))); const a = S.annots.find((x) => x.id === S.sel); if (a && a.color !== hex) { snap(); a.color = hex; drawAnnots(a.p); buildNotesList(); } }
const KIND = { hl: 'Markering', ul: 'Onderstreping', st: 'Doorhaling', rect: 'Kader', ink: 'Tekening', note: 'Notitie', text: 'Tekstvak' };
function buildNotesList() {
  if (!$.pNotes) return; if (!S.annots.length) { $.pNotes.replaceChildren(el('p', { class: 'empty' }, t('Nog geen opmerkingen. Selecteer tekst en kies Markeren, Onderstrepen of Doorhalen, of plaats een notitie, tekstvak, tekening of kader.'))); return; }
  const list = el('div', { class: 'alist' });
  [...S.annots].sort((a, b) => a.p - b.p || a.y - b.y).forEach((a) => list.append(el('div', { class: 'aitem', 'aria-current': String(a.id === S.sel) },
    el('span', { class: 'dot', style: { background: a.color } }), el('button', { class: 'go', type: 'button', onclick: () => { goTo(a.p); selectAnnot(a.id); } }, el('span', { class: 't' }, a.text ? a.text : t(KIND[a.type])), el('span', { class: 'm' }, t('{0} · pagina {1}', t(KIND[a.type]), a.p))),
    el('button', { class: 'btn ghost icon sm', type: 'button', 'aria-label': t('Verwijderen'), onclick: () => { S.sel = a.id; deleteSel(); } }, icon('trash', 16)))));
  $.pNotes.replaceChildren(list); renderUndo();
}

/* ---------- Opslaan, afdrukken, eigenschappen, Studio ---------- */
function visualBox(page) { const box = page.getCropBox(); const r = ((page.getRotation().angle % 360) + 360) % 360; return { ...box, r, VW: r % 180 ? box.height : box.width, VH: r % 180 ? box.width : box.height }; }
function v2p(b, vx, vy) { const { x, y, width: W, height: H, r } = b; if (r === 90) return { x: x + W - vy, y: y + vx }; if (r === 180) return { x: x + W - vx, y: y + H - vy }; if (r === 270) return { x: x + vy, y: y + H - vx }; return { x: x + vx, y: y + vy }; }
async function buildAnnotatedPdf() {
  const L = window.PDFLib; const doc = await L.PDFDocument.load(S.bytes, { updateMetadata: false, ...(S.password ? { password: S.password } : {}) }); const font = await doc.embedFont(L.StandardFonts.Helvetica); const pages = doc.getPages();
  const rgbOf = (hex) => { const m = hex.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16) / 255); return L.rgb(m[0], m[1], m[2]); };
  const safe = (t) => { let o = ''; for (const ch of t) { try { font.encodeText(ch); o += ch; } catch { o += ch === '’' || ch === '‘' ? "'" : ch === '“' || ch === '”' ? '"' : '?'; } } return o; };
  const corners = (b, x, y, w, h) => { const p = v2p(b, x, b.VH - (y + h)), q = v2p(b, x + w, b.VH - y); return { x: Math.min(p.x, q.x), y: Math.min(p.y, q.y), w: Math.abs(q.x - p.x), h: Math.abs(q.y - p.y) }; };
  for (const a of S.annots) {
    const page = pages[a.p - 1]; if (!page) continue; const b = visualBox(page); const color = rgbOf(a.color);
    if (a.type === 'hl') { const c = corners(b, a.x, a.y, a.w, a.h); page.drawRectangle({ x: c.x, y: c.y, width: c.w, height: c.h, color, opacity: .4, blendMode: L.BlendMode.Multiply }); }
    else if (a.type === 'ul' || a.type === 'st') { const yy = a.type === 'ul' ? a.y + a.h - 1 : a.y + a.h / 2; const p1 = v2p(b, a.x, b.VH - yy), p2 = v2p(b, a.x + a.w, b.VH - yy); page.drawLine({ start: p1, end: p2, thickness: 1.2, color }); }
    else if (a.type === 'rect') { const c = corners(b, a.x, a.y, a.w, a.h); page.drawRectangle({ x: c.x, y: c.y, width: c.w, height: c.h, borderColor: color, borderWidth: 1.6, opacity: 0, borderOpacity: 1 }); }
    else if (a.type === 'ink') { for (let i = 1; i < a.pts.length; i++) page.drawLine({ start: v2p(b, a.pts[i - 1][0], b.VH - a.pts[i - 1][1]), end: v2p(b, a.pts[i][0], b.VH - a.pts[i][1]), thickness: 2, color, lineCap: L.LineCapStyle.Round }); }
    else if (a.type === 'text') {
      const maxW = a.w - 6; const lines = []; for (const para of safe(a.text).split('\n')) { let cur = ''; for (const word of para.split(' ')) { const t = cur ? cur + ' ' + word : word; if (font.widthOfTextAtSize(t, a.fs) > maxW && cur) { lines.push(cur); cur = word; } else cur = t; } lines.push(cur); }
      lines.forEach((ln, i) => { const p = v2p(b, a.x + 3, b.VH - (a.y + 2 + a.fs * 1.0 + i * a.fs * 1.2)); page.drawText(ln, { x: p.x, y: p.y, size: a.fs, font, color, rotate: L.degrees(b.r) }); });
    } else if (a.type === 'note') {
      const c = corners(b, a.x, a.y, 20, 20); const ctx = doc.context;
      const annot = ctx.obj({ Type: 'Annot', Subtype: 'Text', Rect: [c.x, c.y, c.x + c.w, c.y + c.h], Contents: L.PDFHexString.fromText(a.text || ''), Name: 'Note', C: [...[a.color.slice(1, 3), a.color.slice(3, 5), a.color.slice(5, 7)].map((x) => parseInt(x, 16) / 255)], F: 4, Open: false, T: L.PDFHexString.fromText('ABN PDF Viewer') });
      page.node.addAnnot(ctx.register(annot));
    }
  }
  return doc.save();
}
async function save() {
  if (!S.pdf) return; const base = baseName(S.name);
  if (!S.annots.length) { await saveFile(S.name, S.bytes); return; }
  try { const out = await buildAnnotatedPdf(); if (await saveFile(base + (LANG === 'en' ? '_annotated.pdf' : '_geannoteerd.pdf'), out)) { S.dirty = false; updateHeader(); toast(t('Opgeslagen als {0}', base + (LANG === 'en' ? '_annotated.pdf' : '_geannoteerd.pdf'))); } }
  catch (e) { console.error(e); toast(t('Opslaan mislukt: ') + (e.message || e) + (S.password ? ' (' + t("Beveiligde PDF's kunnen hier niet met opmerkingen worden opgeslagen") + ')' : ''), 'error'); }
}
let printing = false;
async function printDoc() {
  if (!S.pdf || printing) return; printing = true; const note = el('div', { class: 'toast' }, t('Afdrukken voorbereiden…')); document.getElementById('toasts').append(note);
  let root = null, style = null, doc = S.pdf, own = false;
  const cleanup = () => { root && root.remove(); style && style.remove(); if (own) { try { doc.destroy(); } catch {} } window.removeEventListener('afterprint', cleanup); printing = false; };
  try {
    if (S.annots.length) { const out = await buildAnnotatedPdf(); doc = await pdfjs.getDocument({ ...PDFJS_OPTS, data: out }).promise; own = true; }
    root = el('div', { id: 'printroot', 'aria-hidden': 'true' }); style = el('style'); let css = '@page{margin:0}';
    for (let n = 1; n <= doc.numPages; n++) {
      note.textContent = t('Afdrukken voorbereiden… pagina {0} van {1}', n, doc.numPages);
      const page = await doc.getPage(n); const v1 = page.getViewport({ scale: 1 }); const sc = Math.min(150 / 72, 3600 / Math.max(v1.width, v1.height)); const vp = page.getViewport({ scale: sc });
      const c = el('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height); await page.render({ canvas: c, viewport: vp }).promise;
      const wmm = (v1.width * 25.4 / 72).toFixed(2), hmm = (v1.height * 25.4 / 72).toFixed(2);
      css += `@page p${n}{size:${wmm}mm ${hmm}mm;margin:0}.pp${n}{page:p${n};width:${wmm}mm;height:${hmm}mm}`;
      const img = el('img', { src: c.toDataURL('image/jpeg', 0.92), alt: '' }); c.width = c.height = 0;
      root.append(el('div', { class: 'pp pp' + n }, img));
    }
    style.textContent = css; document.head.append(style); document.body.append(root);
    await Promise.all([...root.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
    let started = false; const mark = () => { started = true; }; window.addEventListener('beforeprint', mark, { once: true }); window.addEventListener('afterprint', cleanup, { once: true });
    note.remove(); window.print();
    await new Promise((r) => setTimeout(r, 1500));
    if (!started) { // het afdrukvenster is niet geopend (de omgeving blokkeert afdrukken)
      cleanup(); window.removeEventListener('beforeprint', mark);
      toast(t('Deze omgeving staat afdrukken vanuit de pagina niet toe. Het bestand wordt opgeslagen, open het in uw PDF-lezer om af te drukken.'), 'error'); await save();
    }
  } catch (e) { console.error(e); note.remove(); cleanup(); toast(t('Afdrukken mislukt: ') + (e.message || e), 'error'); }
}
const pdate = (s) => { const m = /^D:(\d{4})(\d\d)?(\d\d)?(\d\d)?(\d\d)?(\d\d)?/.exec(s || ''); return m ? new Date(+m[1], (+m[2] || 1) - 1, +m[3] || 1, +m[4] || 0, +m[5] || 0).toLocaleString(LANG === 'en' ? 'en-GB' : 'nl-BE', { dateStyle: 'medium', timeStyle: 'short' }) : (s || '-'); };
async function showProps() {
  if (!S.pdf) return; let meta = { info: {} }; try { meta = await S.pdf.getMetadata(); } catch {}
  const i = meta.info || {}; const pages = S.pdf.numPages; const mm = (pt) => Math.round(pt * 25.4 / 72);
  const fmt = (s) => { const w = mm(s.w), h = mm(s.h), [a, b] = [Math.min(w, h), Math.max(w, h)]; const name = [['A5', 148, 210], ['A4', 210, 297], ['A3', 297, 420], ['A2', 420, 594], ['A1', 594, 841], ['A0', 841, 1189]].find(([, x, y]) => Math.abs(a - x) <= 2 && Math.abs(b - y) <= 2); return `${w} × ${h} mm${name ? ' (' + name[0] + ')' : ''}`; };
  const uniq = [...new Set(S.sizes.slice(1).map(fmt))];
  const yn = (v) => t(v ? 'Ja' : 'Nee');
  const rows = [[t('Bestandsnaam'), S.name], [t('Bestandsgrootte'), fmtBytes(S.size)], [t('Titel'), i.Title], [t('Auteur'), i.Author], [t('Onderwerp'), i.Subject], [t('Trefwoorden'), i.Keywords], [t('Gemaakt met'), i.Creator], [t('PDF-producent'), i.Producer], [t('PDF-versie'), i.PDFFormatVersion],
    [t('Aangemaakt'), pdate(i.CreationDate)], [t('Gewijzigd'), pdate(i.ModDate)], [t("Aantal pagina's"), String(pages)], [t('Paginaformaat'), uniq.length > 3 ? t('{0} en {1} andere', uniq.slice(0, 3).join(', '), uniq.length - 3) : uniq.join(', ')], [t('Snelle webweergave'), yn(i.IsLinearized)], [t('Formuliervelden'), yn(i.IsAcroFormPresent)], [t('Beveiligd met wachtwoord'), yn(S.password != null)], [t('Opmerkingen in deze sessie'), String(S.annots.length)]];
  const dl = el('dl', { class: 'props' }); rows.filter((r) => r[1]).forEach(([k, v]) => dl.append(el('dt', null, k), el('dd', null, String(v))));
  modal({ title: t('Documenteigenschappen'), body: dl, ok: t('Sluiten'), cancel: null });
}
let menu = null;
function toggleToolsMenu() {
  if (menu) { closeMenu(); return; }
  const r = $.toolsBtn.getBoundingClientRect();
  menu = el('div', { class: 'menu', role: 'menu', style: { top: r.bottom + 6 + 'px', right: Math.max(8, innerWidth - r.right) + 'px', position: 'fixed' } },
    el('p', { class: 'note' }, t('Opent het hulpmiddel in ABN PDF Studio in een nieuw tabblad. Sla uw bestand eerst op en sleep het daarna in het hulpmiddel. Het bestand blijft op uw computer.')),
    ...STUDIO_TOOLS.map(([id, label]) => el('a', { role: 'menuitem', href: `${STUDIO}#${id}`, target: '_blank', rel: 'noopener', onclick: closeMenu }, icon('ext', 16), t(label))), el('hr'),
    el('a', { role: 'menuitem', href: STUDIO, target: '_blank', rel: 'noopener', onclick: closeMenu }, icon('thumbs', 16), t('Alle hulpmiddelen in PDF Studio')));
  document.body.append(menu); $.toolsBtn.setAttribute('aria-expanded', 'true'); setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
}
function outside(e) { if (menu && !menu.contains(e.target) && !$.toolsBtn.contains(e.target)) closeMenu(); }
function closeMenu() { if (menu) { menu.remove(); menu = null; } $.toolsBtn.setAttribute('aria-expanded', 'false'); document.removeEventListener('pointerdown', outside, true); }

/* ---------- Tabbladen (meerdere PDF's tegelijk) ---------- */
// Per document bewaren we de toestand in het tabblad; S bevat altijd de toestand van het actieve tabblad.
const DOC_KEYS = ['pdf', 'bytes', 'name', 'size', 'password', 'sizes', 'rot', 'zoomMode', 'zoom', 'sc', 'view', 'cur', 'annots', 'sel', 'undo', 'redo', 'dirty', 'nextId', 'texts', 'hits', 'hitIdx', 'q'];
const TABS = []; let activeTab = null, tabSeq = 0, dragTab = null;
const tabDoc = (tab) => (tab === activeTab ? S : tab.d);
function snapshotTab() {
  if (!activeTab) return;
  DOC_KEYS.forEach((k) => { activeTab.d[k] = S[k]; });
  Object.assign(activeTab, { scroll: $.stage.scrollTop, query: $.q.value, cnt: $.cnt.textContent, cs: $.case.checked });
}
function addTab(d) { const tab = { id: ++tabSeq, d, scroll: 0, query: '', cnt: '', cs: false }; TABS.push(tab); activateTab(tab); }
function activateTab(tab, force) {
  if (tab === activeTab && !force) return;
  closeNote(); snapshotTab();
  activeTab = tab; Object.assign(S, tab.d); S.gen++; S.pendingHit = null; S.searchRun++; S.els = [];
  $.q.value = tab.query || ''; $.cnt.textContent = tab.cnt || ''; $.case.checked = !!tab.cs; $.start.hidden = true;
  buildPages(); updateHeader(); buildThumbs(); buildOutline(); buildNotesList(); renderUndo(); syncZoomUI(); renderTabs();
  requestAnimationFrame(() => { if (activeTab !== tab) return; if (S.view === 'cont') $.stage.scrollTop = tab.scroll || 0; else goTo(S.cur); });
}
function showEmpty() {
  activeTab = null; S.gen++; S.searchRun++; io && io.disconnect();
  Object.assign(S, { pdf: null, bytes: null, name: '', size: 0, password: null, sizes: [], els: [], rot: 0, zoomMode: 1, cur: 1, annots: [], sel: null, undo: [], redo: [], dirty: false, hits: [], hitIdx: -1, q: '', texts: [], pendingHit: null });
  $.pages.replaceChildren(); $.pThumbs.replaceChildren(); $.pMarks.replaceChildren(); $.pNotes.replaceChildren(); $.q.value = ''; $.cnt.textContent = ''; $.start.hidden = false;
  updateHeader(); renderUndo(); renderTabs();
}
async function closeTab(tab) {
  const d = tabDoc(tab);
  if (d.dirty && !(await modal({ title: t('Niet-opgeslagen opmerkingen'), ok: t('Toch sluiten'), body: el('p', { class: 'empty' }, t('De opmerkingen in "{0}" gaan verloren als u dit tabblad sluit. Gebruik eerst Opslaan als u ze wilt bewaren.', d.name)) }))) return;
  const i = TABS.indexOf(tab); if (i < 0) return;
  const was = tab === activeTab; TABS.splice(i, 1);
  if (!was) { try { tab.d.pdf.destroy(); } catch {} renderTabs(); return; }
  const pdf = S.pdf; activeTab = null; const next = TABS[i] || TABS[i - 1];
  if (next) activateTab(next, true); else showEmpty();
  try { pdf.destroy(); } catch {}
}
function cycleTab(dir) { if (TABS.length < 2) return; const i = TABS.indexOf(activeTab); activateTab(TABS[(i + dir + TABS.length) % TABS.length]); $.tabsList.querySelector('.dtab.on')?.focus(); }
function paintTab(tab) {
  if (!tab.btn) return; const d = tabDoc(tab); tab.btn.classList.toggle('dirty', !!d.dirty);
  tab.btn.title = d.name + (d.dirty ? ' ●' : '');
}
function renderTabs() {
  if (!$.tabbar) return; $.tabbar.hidden = !TABS.length; $.tabsList.replaceChildren();
  TABS.forEach((tab, i) => {
    const on = tab === activeTab; const d = tabDoc(tab);
    const b = el('div', { class: 'dtab' + (on ? ' on' : '') + (d.dirty ? ' dirty' : ''), role: 'tab', 'aria-selected': String(on), tabindex: on ? '0' : '-1', title: d.name + (d.dirty ? ' ●' : ''), draggable: 'true' },
      el('span', { class: 'dname' }, d.name), el('span', { class: 'ddot', 'aria-hidden': 'true' }, '●'),
      el('button', { class: 'dclose', type: 'button', tabindex: '-1', title: t('Tabblad sluiten'), 'aria-label': t('Tabblad sluiten: {0}', d.name), onclick: (e) => { e.stopPropagation(); closeTab(tab); } }, icon('x', 14)));
    b.addEventListener('click', () => activateTab(tab));
    b.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });
    b.addEventListener('auxclick', (e) => { if (e.button === 1) { e.preventDefault(); closeTab(tab); } });
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(tab); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); const n = TABS[(i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length]; activateTab(n); $.tabsList.querySelector('.dtab.on')?.focus(); }
      else if (e.key === 'Delete') { e.preventDefault(); closeTab(tab); }
    });
    b.addEventListener('dragstart', (e) => { dragTab = tab; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', d.name); } catch {} b.classList.add('dragging'); });
    b.addEventListener('dragend', () => { dragTab = null; $.tabsList.querySelectorAll('.dragging,.dragover').forEach((n) => n.classList.remove('dragging', 'dragover')); });
    b.addEventListener('dragover', (e) => { if (!dragTab || dragTab === tab) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; b.classList.add('dragover'); });
    b.addEventListener('dragleave', () => b.classList.remove('dragover'));
    b.addEventListener('drop', (e) => { if (!dragTab || dragTab === tab) return; e.preventDefault(); e.stopPropagation(); const from = TABS.indexOf(dragTab), to = TABS.indexOf(tab); TABS.splice(from, 1); TABS.splice(to, 0, dragTab); dragTab = null; renderTabs(); });
    tab.btn = b; $.tabsList.append(b);
  });
  activeTab && activeTab.btn && activeTab.btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
window.addEventListener('beforeunload', (e) => { if (TABS.some((x) => tabDoc(x).dirty)) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- Toetsenbord en slepen ---------- */
document.addEventListener('keydown', (e) => {
  const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable; const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'f') { e.preventDefault(); toggleSearch(true); return; }
  if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); return; }
  if (mod && e.key.toLowerCase() === 'p') { e.preventDefault(); printDoc(); return; }
  if (mod && e.key.toLowerCase() === 'o') { e.preventDefault(); $.file.click(); return; }
  if (e.ctrlKey && (e.key === 'Tab' || e.key === 'PageDown' || e.key === 'PageUp') && TABS.length > 1) { e.preventDefault(); cycleTab(e.key === 'PageUp' || (e.key === 'Tab' && e.shiftKey) ? -1 : 1); return; }
  if (e.key === 'Escape') { closeMenu(); closeNote(); if (S.sel != null) { S.sel = null; redrawAll(); } return; }
  if (typing) return;
  if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
  if (mod && (e.key === '+' || e.key === '=')) { e.preventDefault(); stepZoom(1); return; }
  if (mod && e.key === '-') { e.preventDefault(); stepZoom(-1); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') { if (S.sel != null) { e.preventDefault(); deleteSel(); } return; }
  if (!S.pdf) return;
  const step = S.view === 'two' ? 2 : 1;
  if (e.key === 'ArrowRight' || (e.key === 'PageDown' && S.view !== 'cont') || (e.key === 'ArrowDown' && S.view === 'single')) { e.preventDefault(); goTo(S.cur + step); }
  else if (e.key === 'ArrowLeft' || (e.key === 'PageUp' && S.view !== 'cont') || (e.key === 'ArrowUp' && S.view === 'single')) { e.preventDefault(); goTo(S.cur - step); }
  else if (e.key === 'Home') { e.preventDefault(); goTo(1); } else if (e.key === 'End') { e.preventDefault(); goTo(S.pdf.numPages); }
});
['dragenter', 'dragover'].forEach((t) => document.addEventListener(t, (e) => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); document.body.classList.add('drop-over'); } }));
document.addEventListener('dragleave', (e) => { if (!e.relatedTarget) document.body.classList.remove('drop-over'); });
document.addEventListener('drop', (e) => { e.preventDefault(); document.body.classList.remove('drop-over'); const fs = [...(e.dataTransfer?.files || [])]; if (fs.length) openFiles(fs); });

/* ---------- Start ---------- */
build();
// Als geïnstalleerde app (PWA) kan de viewer als standaardprogramma voor .pdf worden gekozen: Windows/macOS geeft het bestand dan door via de launchQueue.
/* ---------- Eén venster voor alle PDF's ----------
   Dubbelklikt u een PDF in Verkenner terwijl de viewer al open is, dan hoort het bestand als nieuw tabblad in dat venster te komen.
   1) Het manifest vraagt dat via launch_handler (focus-existing). 2) Als Windows toch een tweede venster start, geeft dat venster
   zijn bestanden door aan het eerste venster (BroadcastChannel) en sluit zichzelf. */
const WIN_ID = Math.random().toString(36).slice(2); let handingOff = false;
const CH = 'BroadcastChannel' in window ? new BroadcastChannel('abn-pdf-viewer') : null;
if (CH) CH.onmessage = async (ev) => {
  const m = ev.data; if (!m || m.from === WIN_ID) return;
  if (m.type === 'ping' && !handingOff) CH.postMessage({ type: 'pong', from: WIN_ID, to: m.from });
  else if (m.type === 'open' && m.to === WIN_ID && Array.isArray(m.files)) { try { window.focus(); } catch {} await openFiles(m.files); }
};
const findPeer = () => new Promise((res) => { if (!CH) return res(null); const h = (ev) => { const m = ev.data; if (m && m.type === 'pong' && m.to === WIN_ID) { CH.removeEventListener('message', h); clearTimeout(tm); res(m.from); } }; const tm = setTimeout(() => { CH.removeEventListener('message', h); res(null); }, 450); CH.addEventListener('message', h); CH.postMessage({ type: 'ping', from: WIN_ID }); });
// Als geïnstalleerde app (PWA) kan de viewer als standaardprogramma voor .pdf worden gekozen: Windows/macOS geeft het bestand dan door via de launchQueue.
if ('launchQueue' in window && window.launchQueue.setConsumer) window.launchQueue.setConsumer(async (params) => {
  if (!params.files || !params.files.length) return;
  try {
    const files = []; for (const h of params.files) files.push(await h.getFile());
    handingOff = true; const peer = await findPeer();
    if (peer) { // er is al een viewer-venster: bestanden daarheen sturen en dit extra venster sluiten
      CH.postMessage({ type: 'open', from: WIN_ID, to: peer, files });
      await new Promise((r) => setTimeout(r, 250)); try { window.close(); } catch {}
      setTimeout(() => { $.start.querySelector('h1').textContent = t('Geopend in uw andere venster'); $.start.querySelector('p').textContent = t('Uw bestand staat als tabblad in het andere ABN PDF Viewer-venster. U kunt dit venster sluiten.'); }, 400);
      return;
    }
    handingOff = false; await openFiles(files);
  } catch (e) { handingOff = false; console.warn(e); toast(t('Dit is geen PDF-bestand.'), 'error'); }
});
window.__viewer = { S, TABS, activateTab, closeTab, openFiles, loadBytes, goTo, setZoom, setView, setTool, buildAnnotatedPdf };
