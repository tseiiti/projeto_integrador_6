import Icon from './Icon';

const Card = ({title, icon = 'ads_click', rightTitle = '', children}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl py-4 px-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon icon={icon} otherClasses='text-blue-500' />
          <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        </div>
        {rightTitle && 
        <span className="text-[12px] font-medium text-gray-600">
          {rightTitle}
        </span>}
      </div>
      
      {children}
    </div>
  );
}

export default Card;