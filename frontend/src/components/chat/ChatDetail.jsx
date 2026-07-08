import Modal from '../Modal';
import { KEYS, set, get, qs, showToast, pasteText } from '../../services/util';

const ChatDetail = ({ detail, setDetail }) => {
  if (!detail) return null;

  return (
    <Modal isOpen={detail != null} onClose={() => setDetail(null)} title='Detalhes'>
      <div className="pr-2">
        <h3 className="text-2xl mb-0 uppercase">ID: {detail.id}</h3>
        <p className="text-gray-500 mb-8">{detail.model}</p>

        <h4 className="mt-8 mb-2 font-bold text-gray-600">Mensagem</h4>
        <p className="text-justify">{detail.content}</p>

        <h4 className="mt-8 mb-2 font-bold text-gray-600">Contextos</h4>
        <table className="w-full table-auto border-collapse text-sm contexts">
          <thead>
            <tr>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Score
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Calculado
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Conteúdo
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Tamanho
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {detail.contexts.map((ct, idx) => {
              return (
                <tr key={`context-${idx}`}>
                  <th scope="row" className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                    {ct.score.toFixed(5)}
                  </th>
                  <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500 text-center">
                    {Math.round(-ct.score * 100) + 180}
                  </td>
                  <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500 text-justify group relative inline-block">
                    {ct.content}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-sm rounded p-3 pt-2 border border-slate-300 whitespace-nowrap shadow-lg">
                      categoria: {ct.category}<br />
                      arquivo: {ct.file}<br />
                      página: {ct.page}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-gray-400"></div>
                    </div>
                  </td>
                  <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500 text-center">
                    {ct.content.length}
                  </td>
                </tr>);
            })}
          </tbody>
        </table>

        <h4 className="mt-8 mb-2 font-bold text-gray-600">Transferências (tokens)</h4>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Envidados
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Recebidos
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Taxa de Transferência
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {(
              <tr>
                <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                  {detail.up_tokens}
                </td>
                <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                  {detail.dw_tokens}
                </td>
                <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                  {((detail.up_tokens + detail.dw_tokens) * 1000 / (detail.times.finish_at - detail.times.context_at)).toFixed(2)} tokens / segundo
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h4 className="mt-8 mb-2 font-bold text-gray-600">Tempos</h4>
        <table className="w-full table-auto border-collapse text-sm times">
          <thead>
            <tr>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Início
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Contexto
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Pensamento
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Exibição
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Término
              </th>
              <th className="border-b border-gray-200 text-left p-1 sm:p-2 lg:p-4 text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {(new Date(detail.times.context_at)).toLocaleString()}
              </td>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {((detail.times.think_at - detail.times.context_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {((detail.times.created_at - detail.times.think_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {((detail.times.finish_at - detail.times.created_at) / 1000).toFixed(2)} segundos
              </td>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {(new Date(detail.times.finish_at)).toLocaleString()}
              </td>
              <td className="border-b border-gray-100 p-1 sm:p-2 lg:p-4 text-gray-500">
                {((detail.times.finish_at - detail.times.context_at) / 1000).toFixed(2)} segundos
              </td>
            </tr>
          </tbody>
        </table>
        
        <h4 className="mt-8 mb-2 font-bold text-gray-600">Filtros</h4>
        <table className="">
          <tbody className="bg-white">
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Pergunta:</td>
              <td className="p-2 text-lg font-normal text-gray-800 italic pl-2">{detail.prompt}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Categoria:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.file}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Quantidade:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.quantity}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Relações:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.influence}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Score:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{Math.round(-detail.score * 100) + 180}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Thinking:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.thinking.toString()}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Lembranças:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.memory}</td>
            </tr>
            <tr className="border-b border-gray-100 text-gray-500">
              <td className="p-2 text-sm font-bold">Temperatura:</td>
              <td className="p-2 font-normal text-gray-800 italic pl-2">{detail.temperature}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default ChatDetail;