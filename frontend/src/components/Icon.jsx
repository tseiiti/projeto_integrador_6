const Icon = ({icon = 'ads_click', fill = "'FILL' 1", otherClasses = ''}) => {
  return <span className={`material-symbols-outlined ${otherClasses}`}
    style={{fontVariationSettings: fill}}>{icon}</span>;
}

export default Icon;