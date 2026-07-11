import { KEYS, qs, get, set } from './util';

// var LAST_UPD;
// var MODELS;

// const load = async () => {
//   if (LAST_UPD + 60000 < Date.now() && MODELS) return MODELS;

//   // carrega lista de modelos
//   await fetch(KEYS.API_TAGS_URL)
//   .then(response => { return response.json(); })
//   .then(json => {
//     LAST_UPD = Date.now();
//     MODELS = json.models.filter(m => !m.capabilities.includes('embedding')).sort(
//       (a, b) => a.name.localeCompare(b.name)
//     ); })
//   .catch(error => ce(error));
// }

// const current = async () => {
//   await load();
//   get(KEYS.C_MODEL,
//     MODELS.filter(m => m.model.includes('gemma3:1b'))[0]?.model || MODELS[0]?.model);
// }

const handleSave = () => {
  clearTimeout(savId);

  let toast = qs('#success-toast');
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-90');
  
  savId = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-90');
  }, 1000);
}
var savId;

export {
  KEYS,
  get, 
  set, 
  handleSave
}
