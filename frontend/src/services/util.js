import showdown from 'showdown';
import { KEYS } from './data';

/******************************************************************************
 * Definições e Funções básicas
 ******************************************************************************/
const ONLOG = true;
const ONALERT = false;
const cl = arg => { if (ONLOG) console.log(arg); };
const ce = error => { console.error(error); if (ONALERT) alert(error); }
const qs = arg => document.querySelector(arg);
const qsa = arg => document.querySelectorAll(arg);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// funções de armazenamento
const get = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

class StorageArray {
  constructor(key, init = []) {
    this.key = key;
    this.init = init;
  }

  lst() {
    return get(this.key, this.init);
  }

  add(e, id) {
    let es = this.lst();
    let i = es.findIndex(e => e.id === id);
    if (i !== -1) {
      e = this.upd(id, e);
    } else {
      e = this.ins(e);
    }
    return e;
  }

  ins(e) {
    let es = this.lst();
    let times = e.times;
    e = {
      ...e,
      id: Math.random().toString(36).substring(2),
      times: {
        ...times,
        created_at: (new Date()).toLocaleString(),
      }
    };
    es.push(e);
    set(this.key, es);
    return e;
  }

  get(id) {
    return this.lst().find(e => e.id === id);
  }

  upd(id, e) {
    let es = this.lst();
    let i = es.findIndex(e => e.id === id);
    if (i !== -1) {
      es[i] = {...es[i], ...e};
      set(this.key, es);
    }
    return this.lst()[i];
  }

  del(id) {
    let es = this.lst();
    let e = es.find(e => e.id == id);
    es = es.filter(e => e.id != id);
    set(this.key, es);
    return e;
  }

  clr() {
    set(this.key, this.init);
  }
}

const showToast = (title = '', text = '', time = 3) => {
  clearTimeout(time_id);

  if (title.length == 0 || text.length == 0) return;
  const toast = qs('#toast');
  if (!toast) return;

  toast.querySelector('h1').innerHTML = title;
  toast.querySelector('p').innerHTML = text;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-80');
  
  time_id = setTimeout(() => {
    toast.classList.remove('opacity-80');
    toast.classList.add('opacity-0');
  }, time * 1000);
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    if (text.length > 50) text = `${text.substring(0, 47).trim()}...`
    showToast('Copiado!', `Texto: "${text}"`);
  } catch (error) {
    ce(error);
  }
};

const pasteText = async (arg) => {
  const e = qs(arg);
  try {
    let text = await navigator.clipboard.readText();
    e.value = text;
    if (text.length > 50) text = `${text.substring(0, 47).trim()}...`
    showToast('Colado!', `Texto: "${text}"`, 2);
    e.focus();
  } catch (error) {
    ce(error);
  }
};

const markdown = (text) => {
  // trata latex
  text = text.replace(/\$+(.*?)\$+/g,  (match, value) => {
    let html = value
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)')
      .replace(/\\text\{(.*?)\}/g, '$1')
      .replace(/\\times/g, '*')
      .replace(/\s\\%/g, '%');
    return '<i>' + html + '</i>';
  });

  const converter = new showdown.Converter({optionKey: 'value'});
  return converter.makeHtml(text);
}

var time_id;

export {
  KEYS,
  cl, 
  ce, 
  qs, 
  qsa, 
  sleep, 
  get, 
  set, 
  showToast, 
  copyText, 
  pasteText, 
  markdown,
}