import Icon from './Icon';

const Input = (props) => {
  const typeNumber = () => {
    return (
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-4 rounded-xl border border-slate-300 dark:border-slate-500">
        <div className="flex items-center gap-2 lg:gap-4">
          {props.icon && <div className="px-2 pt-1.5 bg-slate-200 dark:bg-slate-400 rounded-lg border border-slate-400 text-slate-600">
            <Icon icon={props.icon} fill='' />
          </div>}
          <p className="text-sm font-medium dark:text-slate-300">{props.title}</p>
          <p className="text-[12px] dark:text-slate-400">{props.description}</p>
        </div>

        <input type={props.type} id={props.id} min={props.min} max={props.max} value={props.value} onChange={props.onChange} className="p-2 sm:pr-0 bg-white border border-slate-300 dark:border-slate-500 rounded-md text-sm shadow-sm placeholder-slate-400 max-w-10 text-right focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
      </div>
    );
  }

  const typeRange = () => {
    return (
      <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl border border-slate-300 dark:border-slate-500">
        <div className="flex justify-between items-center gap-2 lg:gap-4">
          {props.icon && <div className="px-2 pt-1.5 bg-slate-200 dark:bg-slate-400 rounded-lg border border-slate-400 text-slate-600">
            <Icon icon={props.icon} fill='' />
          </div>}
          <label className="text-sm font-medium dark:text-slate-300" htmlFor={props.id}>{props.title}</label>
          <p className="text-[12px] dark:text-slate-400">{props.description}</p>
          <span className="bg-indigo-400 text-sm text-white font-semibold px-2 py-1 rounded" id={`span-${props.id}`}>{props.value}</span>
        </div>

        <input type={props.type} id={props.id} min={props.min} max={props.max} step={props.step} defaultValue={props.value} onChange={props.onChange} className="w-full h-1 bg-slate-400 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
        <div className="flex justify-between text-[11px] text-slate-700">
          <span className="italic">{props.minDesc}</span>
          <span className="italic">{props.maxDesc}</span>
        </div>
      </div>
    );
  }

  const typeCheckBox = () => {
    return (
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-4 rounded-xl border border-slate-300 dark:border-slate-500">
        <div className="flex items-center gap-2 lg:gap-4">
          {props.icon && <div className="px-2 pt-1.5 bg-slate-200 dark:bg-slate-400 rounded-lg border border-slate-400 text-slate-600">
            <Icon icon={props.icon} fill='' />
          </div>}
          <p className="text-sm font-medium dark:text-slate-300">{props.title}</p>
          <p className="text-[12px] dark:text-slate-400">{props.description}</p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input className="sr-only peer" type={props.type} id={props.id} checked={props.value} onChange={props.onChange} />
          <div className="w-11 h-6 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500">
          </div>
        </label>
      </div>
    );
  }

  return (<>
    { props.type == 'number' && typeNumber() }
    { props.type == 'range' && typeRange() }
    { props.type == 'checkbox' && typeCheckBox() }
  </>);
}

export default Input;