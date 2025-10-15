import { useEffect, useState } from 'react'
import style from './WeatherReport.module.css'
import conditions from '../../data/conditions.json'

export default function WeatherReport({setter}){
    const [cities, setCities] = useState(localStorage.getItem('weather') || null)
    const [currentCity, setCurrentCity] = useState('Moscow')

    const errorWindow = error =>{
        console.log(error)
    }

    useEffect(()=>{
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=094321c7a5d84f43b6d72446251510&q=${currentCity}&lang=en`
        let currentStorage = localStorage.getItem('weather') || null
        fetch(apiUrl)
            .then((response) => response.json())
            .then(data => {
                localStorage.setItem('weather', JSON.stringify({
                    ...currentStorage,
                    data
                }))
                setCities(localStorage.getItem('weather'))
            })
            .catch(error => errorWindow(error))
    }, [currentCity])

    return <div className={style['report-container']}>
    </div>
}