import Icon from './Icon';

const Card = ({title, icon, rightTitle = '', otherClasses = '', children}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl py-4 px-5 ${otherClasses}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <Icon icon={icon} otherClasses='text-indigo-500' />}
          <h2 className="text-xl font-medium tracking-tight text-slate-600 dark:text-slate-400">{title}</h2>
        </div>
        {rightTitle && 
        <span className="text-[12px] font-medium">
          {rightTitle}
        </span>}
      </div>
      
      {children}
    </div>
  );
}

export default Card;