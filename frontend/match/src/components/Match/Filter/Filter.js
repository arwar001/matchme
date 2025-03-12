import styles from './Filter.module.css'
import UserSelections from "../../ReusableComponents/UserSelections";
import {useCallback} from "react";

function Filter({filterData, setFilterData, onFilterSubmit}) {
    const handleLocation = (e) => {
        setFilterData({
            ...filterData,
            location: e.target.value
        });

    }
    const handleRadius = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ``);
        if (value === "") {
            value = 0;
        }
        if (value.length > 1 && value[0] === "0") {
            value = value.substring(1);
        }
        if (value > 999) {
            value = 999;
        }
        setFilterData({
            ...filterData,
            radius: value
        });
    }

    const handleChange = useCallback((e) => {
        const name = e.target.name;
        let value = e.target.value;

        if (name === 'minAge' || name === 'maxAge') {
            value = value.replace(/[^0-9]/g, ``);
            if (value.length > 2) {
                value = value.substring(0, 2);
            }
        }

        setFilterData(prev => ({...prev, [name]:value}));

    }, [setFilterData])


    return (
        <div className={styles.filterMain}>
            <h2>Filter</h2>
            <div className={styles.filterOptions}>

                <p>Age</p>
                <div className={styles.ageRange}>
                    <input
                        className={styles.ageRangeInput}
                        type="text"
                        id="ageFrom"
                        name="minAge"
                        placeholder="From"
                        onChange={handleChange}
                        value={filterData.minAge}
                    />

                    <input
                        className={styles.ageRangeInput}
                        type="text"
                        id="ageTo"
                        name="maxAge"
                        placeholder="To"
                        onChange={handleChange}
                        value={filterData.maxAge}
                    />
                </div>

                <p>Gender</p>

                <select className={styles.filterSelectMenu} name="gender" defaultValue={filterData.gender}
                        onChange={handleChange}>
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <p>Purpose</p>
                <select className={styles.filterSelectMenu} name="purpose" defaultValue={filterData.purpose}
                        onChange={handleChange}>
                    <option value="business">Business</option>
                    <option value="friendship">Friendship</option>
                    <option value="relationship">Relationship</option>
                </select>

                <p>Location</p>
                <select className={styles.filterSelectMenu} name="location" defaultValue="global"
                        onChange={handleLocation}>
                    <option value="global">Global</option>
                    <option value="radius">Radius (km)</option>
                    <option value="country">Country</option>
                </select>

                {filterData.location === "radius" && (
                    <div className={styles.filterSelectMenu}>
                        <input onChange={handleRadius} type="range" min="10" max="999" value={filterData.radius}
                               className={styles.radiusslider}/>
                        <input className={styles.radiusbox} value={filterData.radius} onChange={handleRadius}/>
                    </div>
                )}
                {filterData.location === "country" && (
                    <UserSelections type='country'
                                    handleChange={handleChange}
                                    classNames={styles.filterSelectMenu}
                                    defaultValue={filterData.country}
                    />
                )}
                {filterData.location === "global" && (
                    <div className={styles.filterSelectMenu}>
                    </div>
                )}

            </div>
            <button onClick={onFilterSubmit} className={styles.filterSubmitButton}>Refresh</button>
        </div>
    )
}

export default Filter;