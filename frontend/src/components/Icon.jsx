const Icon = ({icon = 'ads_click', fontVariation = "'FILL' 1", otherClasses = ''}) => {
  return <span className={`material-symbols-outlined ${otherClasses}`}
    style={{fontVariationSettings: fontVariation}}>{icon}</span>;
}

export default Icon;