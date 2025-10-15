import style from './Footer.module.css'
import colors from '../../data/colors.json'

export default function Footer(){
    const defColors = colors.default

    return <div style={{
        backgroundColor: defColors.mainBackground
    }} className={style['footer-container']}>

    </div>
}