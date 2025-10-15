import style from './Header.module.css'
import colors from '../../data/colors.json'

export default function Header(){
    const defColors = colors.default

    return <div style={{
        backgroundColor: defColors.mainBackground,
        color: defColors.textColor
    }} className={style['header-container']}>
        <h1 className={style.logo}>WeatherReportApp</h1>
    </div>
}