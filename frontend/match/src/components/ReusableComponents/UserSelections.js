import React, {useEffect, useRef, useState} from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

//handleChange needs to be useCallback
function UserSelections({handleChange, classNames, type, country, defaultValue}) {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const prevCountry = useRef('');

    useEffect(() => {
        setIsLoaded(false);
        if (type === 'country') {
            const retrieveCountriesFetch = async () => {

                try {
                    const response = await fetch(`${baseUrl}countries`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response.ok) {
                        const errorMessage = await response.text();
                        throw new Error(errorMessage || 'Something went wrong');
                    }
                    const data = await response.json();
                    setCountries(data);
                    setIsLoaded(true);
                } catch (error) {
                    console.error(error);
                }
            }
            void retrieveCountriesFetch();
        }
        if (type === 'city' && country) {
            if (prevCountry.current && prevCountry.current !== country) {
                handleChange({target: {name: 'city', value: ''}});
            }
            prevCountry.current = country;
            const retrieveCitiesFetch = async () => {
                try {
                    const response = await fetch(`${baseUrl}countries/${country}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response.ok) {
                        const errorMessage = await response.text();
                        throw new Error(errorMessage || 'Something went wrong');
                    }
                    const data = await response.json();
                    setCities(data);
                    setIsLoaded(true);
                } catch (error) {
                    console.error(error);
                }
            }
            void retrieveCitiesFetch(country);
        } else {
            setCities([]);
        }

    }, [country, type, handleChange]);
    if (type === 'gender') {
        return (
            <select className={classNames} name="gender"
                    onChange={handleChange} defaultValue={defaultValue}>
                <option value="" hidden>Choose Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        )
    } else if (type === 'country') {
        if (!isLoaded) return (<div className={classNames}>Loading...</div>);
        return (
            <select className={classNames} name="country"
                    onChange={(e) => {
                        handleChange(e);
                    }} defaultValue={defaultValue}>
                <option value="" hidden>Choose Country</option>
                {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                ))}
            </select>
        )
    } else if (type === 'city') {
        if (!isLoaded) return (<div className={classNames}>Loading...</div>);
        return (
            <select className={classNames} name="city"
                    defaultValue={defaultValue} onChange={handleChange}>
                <option value="" hidden>Choose City</option>
                {cities.length > 0 ?
                    cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        )
                    ) : (<option value="" disabled>Choose a Country first</option>)}
            </select>
        )
    } else if (type === 'purpose') {
        return (
            <select className={classNames} name="purpose"
                    onChange={handleChange} defaultValue={defaultValue}>
                <option value="" hidden>Choose Purpose</option>
                <option value="friendship">Friendship</option>
                <option value="relationship">Relationship</option>
                <option value="business">Business</option>
            </select>
        )
    } else {
        return <div className={classNames}>Error</div>;
    }

}

export default React.memo(UserSelections);
