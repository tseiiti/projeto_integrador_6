import { KEYS, get, set, ce, bottomToast, initLoad } from './util';

const getTitle = async (msg) => {
  let tit;

  try {
    const res = await fetch(KEYS.API_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: get('config').current,
        think: false,
        stream: false,
        messages: [{
          role: 'user',
          content: `Crie um título criativo para o conteúdo abaixo. em português. NÃO INCLUA MAIS NADA, SOMENTE O TÍTULO.

"""
${msg}
"""`
        }]
      })
    });
    
    if (res.ok) {
      const json = await res.json();
      tit = json.message?.content?.trim();
    }
  } catch (e) {
    ce(e);
  } finally {
    return tit;
  }
}

export {
  KEYS, 
  get, 
  set, 
  getTitle, 
  bottomToast, 
  initLoad, 
}
