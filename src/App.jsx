import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import WeatherReport from './components/WeatherReport/WeatherReport'
import './App.css'
import colors from './data/colors.json'
import { useState } from 'react'

export default function App(){
    const [backgroundWeather, setBackgroundWeather] = useState(colors.default.secondaryBackground)

    return (
        <div style={{
            backgroundColor: backgroundWeather
        }} className='main-container'>
            <Header/>
            <WeatherReport setter={setBackgroundWeather}/>
            <Footer/>
        </div>
    )
}