import Card from "./Card/Card";
import Filter from "./Filter/Filter";
import styles from "./Match.module.css";
import {useState, useContext, useEffect, useCallback} from "react";
import {AuthContext} from "../Context/AuthProvider";
const baseUrl = process.env.REACT_APP_API_BASE_URL;



function Match() {
    const {user} = useContext(AuthContext);

    const [filterData, setFilterData] = useState({
        purpose: user.purpose,
        gender: "all",
        minAge: "",
        maxAge: "",
        country: user.country,
        radius: "10",
        location: "global"
    })

    const [cardsData, setCardsData] = useState([]);

    const onFilterSubmit = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}match`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filterData),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Server error: ${errorMessage || 'Unknown issue'}`);
            }
            const data = await response.json();
            console.log(data);
            setCardsData(data);
        } catch (error) {
            console.error(`Filter submit failed: ${error.message}`);
        }
    }, [filterData]);

    useEffect(() => {
        void onFilterSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Ignore ESLint warning

    return (
        <div className={styles.matchMainDiv}>
            <div className={styles.cardsDiv}>
                {cardsData.length > 0 ? (
                    cardsData.map((user) => <Card key={user.id} user={user}/>)
                ): <p>Users not found</p>}
            </div>

            <Filter {...{filterData, setFilterData, onFilterSubmit}}/>
        </div>
    )
}

export default Match;