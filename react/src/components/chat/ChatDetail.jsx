import Modal from '../Modal';
import { KEYS, set, get, qs, showToast, pasteText } from '../../services/util';

const ChatDetail = ({ detail, setDetail }) => {
  if (!detail) return null;

  return (
    <Modal isOpen={detail != null} onClose1={() => setDetail(null)} title='Detalhes'>
      <div className="pr-1 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl mb-0 uppercase">ID: {detail.id}</h3>
        <p className="mb-8">{detail.model}</p>

        <h4 className="mt-8 mb-2 font-bold">Mensagem</h4>
        <p className="text-justify">{detail.content}</p>

        <h4 className="mt-8 mb-2 font-bold">Contextos</h4>
        <table className="w-full table-auto border-collapse text-sm contexts">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-1 sm:p-2 lg:p-4">
                Score
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Calculado
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Conteúdo
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Tamanho
              </th>
            </tr>
          </thead>
          <tbody>
            {detail.contexts.map((ct, idx) => {
              return (
                <tr key={`context-${idx}`} className="border-b border-slate-200 dark:border-slate-700">
                  <th scope="row" className="p-1 sm:p-2 lg:p-4">
                    {ct.score.toFixed(5)}
                  </th>
                  <td className="p-1 sm:p-2 lg:p-4 text-center">
                    {Math.round(-ct.score * 100) + 180}
                  </td>
                  <td className="p-1 sm:p-2 lg:p-4 text-justify group relative inline-block">
                    {ct.content}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-100 dark:bg-slate-800 text-sm rounded p-3 pt-2 border border-slate-200 dark:border-slate-700 whitespace-nowrap shadow-lg">
                      categoria: {ct.category}<br />
                      arquivo: {ct.file}<br />
                      página: {ct.page}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-400"></div>
                    </div>
                  </td>
                  <td className="p-1 sm:p-2 lg:p-4 text-center">
                    {ct.content.length}
                  </td>
                </tr>);
            })}
          </tbody>
        </table>

        <h4 className="mt-8 mb-2 font-bold">Transferências (tokens)</h4>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-1 sm:p-2 lg:p-4">
                Envidados
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Recebidos
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Taxa de Transferência
              </th>
            </tr>
          </thead>
          <tbody>
            {(
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-1 sm:p-2 lg:p-4">
                  {detail.up_tokens}
                </td>
                <td className="p-1 sm:p-2 lg:p-4">
                  {detail.dw_tokens}
                </td>
                <td className="p-1 sm:p-2 lg:p-4">
                  {((detail.up_tokens + detail.dw_tokens) * 1000 / (detail.times.finish_at - detail.times.context_at)).toFixed(2)} tokens / segundo
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h4 className="mt-8 mb-2 font-bold">Tempos</h4>
        <table className="w-full table-auto border-collapse text-sm times">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-1 sm:p-2 lg:p-4">
                Início
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Contexto
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Pensamento
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Exibição
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Término
              </th>
              <th className="p-1 sm:p-2 lg:p-4">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-1 sm:p-2 lg:p-4">
                {(new Date(detail.times.context_at)).toLocaleString()}
              </td>
              <td className="p-1 sm:p-2 lg:p-4">
                {((detail.times.think_at - detail.times.context_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="p-1 sm:p-2 lg:p-4">
                {((detail.times.created_at - detail.times.think_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="p-1 sm:p-2 lg:p-4">
                {((detail.times.finish_at - detail.times.created_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="p-1 sm:p-2 lg:p-4">
                {(new Date(detail.times.finish_at)).toLocaleString()}
              </td>
              <td className="p-1 sm:p-2 lg:p-4">
                {((detail.times.finish_at - detail.times.context_at) / 1000).toFixed(2)} segundos
              </td>
            </tr>
          </tbody>
        </table>
        
        <h4 className="mt-8 mb-2 font-bold">Filtros</h4>
        <table>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Pergunta:</td>
              <td className="p-2 text-lg font-normal italic pl-2">{detail.prompt}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Categoria:</td>
              <td className="p-2 font-normal italic pl-2">{detail.file}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Quantidade:</td>
              <td className="p-2 font-normal italic pl-2">{detail.quantity}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Relações:</td>
              <td className="p-2 font-normal italic pl-2">{detail.influence}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Score:</td>
              <td className="p-2 font-normal italic pl-2">{Math.round(-detail.score * 100) + 180}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Thinking:</td>
              <td className="p-2 font-normal italic pl-2">{detail.thinking.toString()}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Lembranças:</td>
              <td className="p-2 font-normal italic pl-2">{detail.memory}</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-2 text-xs font-bold">Temperatura:</td>
              <td className="p-2 font-normal italic pl-2">{detail.temperature}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default ChatDetail;