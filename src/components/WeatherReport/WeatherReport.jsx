import { useEffect, useRef, useState } from 'react'
import style from './WeatherReport.module.css'
import conditions from '../../data/conditions.json'
import colors from '../../data/colors.json'

export default function WeatherReport({setter}){
    const inputRef = useRef()
    const [cities, setCities] = useState(() => {
        const saved = localStorage.getItem('weather')
        return saved ? JSON.parse(saved) : {}
    })
    const [currentCity, setCurrentCity] = useState('Moscow')
    const [error, setError] = useState('')

    const getBackground = text => {
        const found = Object.entries(conditions).find(([_, item]) => 
            item.texts.includes(text)
        )
        return found ? found[0] : null
    }

    const handleDeleteCity = (cityKey) => {
        const updatedCities = { ...cities }
        delete updatedCities[cityKey]
        localStorage.setItem('weather', JSON.stringify(updatedCities))
        setCities(updatedCities)
    }

    const handleSearch = () => {
        if (Object.keys(cities).length < 5) {
            setCurrentCity(inputRef.current.value)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    useEffect(()=>{
        if (Object.keys(cities).length >= 5) {
            return
        }
        
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=094321c7a5d84f43b6d72446251510&q=${currentCity}&lang=en`
        
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('City not found')
                }
                return response.json()
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message)
                }
                const updatedCities = {
                    ...cities,
                    [currentCity]: data
                }
                
                if (Object.keys(updatedCities).length <= 5) {
                    localStorage.setItem('weather', JSON.stringify(updatedCities))
                    setCities(updatedCities)
                    setError('')
                }
            })
            .catch(error => {
                setError(error.message)
            })
    }, [currentCity])

    return <div className={style['report-container']}>
        <div className={style['input-container']}>
            <button onClick={handleSearch} style={{
                backgroundColor: colors.default.buttonBackground,
                color: colors.default.textColor
            }}>{'>'}</button>
            <input 
                ref={inputRef} 
                onKeyPress={handleKeyPress}
                style={{
                    backgroundColor: colors.default.inputBackground,
                }} 
                maxLength={20} 
                type="text" 
                placeholder='City'
            />
            {Object.keys(cities).length >= 5 && (
                <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>
                    Maximum 5 cities reached
                </p>
            )}
            {error && (
                <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>
                    {error}
                </p>
            )}
        </div>
        <div className={style['weather-card-container']}>
            {Object.entries(cities).map(([key, value], index)=>{
                return <div 
                    onClick={() => handleDeleteCity(key)}
                    onMouseLeave={()=> setter(colors.default.secondaryBackground)} 
                    onMouseEnter={()=>{
                        setter(colors[getBackground(value.current.condition.text)].lighterBackground)
                    }} 
                    style={{
                        backgroundColor: colors[getBackground(value.current.condition.text)].background,
                        color: colors[getBackground(value.current.condition.text)].lighterBackground,
                        cursor: 'pointer'
                    }} 
                    key={index} 
                    className={style['weather-card']}
                >
                    <div className={style['unskewed-card']}>
                        <div className={style['card-main-container']}>
                            <h1>{key}</h1>
                            <h4>Last Update:</h4>
                            <h4>{Intl.DateTimeFormat('en-EN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }).format(new Date(value.current['last_updated']))}</h4>
                        </div>
                        <div className={style['card-second-container']}>
                            <h1>Temperature</h1>
                            <h1>{value.current['temp_c']}°C</h1>
                            <h2>{value.current.condition.text}</h2>
                        </div>
                        <div className={style['card-last-container']}>
                            <h5>{value.current['wind_kph']} kph</h5>
                            <h5>{value.current['feelslike_c']}°C</h5>
                            <h5>{value.current['humidity']}</h5>
                            <h5>{value.current['pressure_mb']} MBar</h5>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}