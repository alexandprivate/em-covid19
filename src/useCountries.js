import React from "react";

// const URL = "https://covid19.mathdro.id/api/confirmed";
const URL = "https://corona.lmao.ninja/v2/countries?yesterday=false&sort=cases";

export default function useStats() {
    const [countries, setCountries] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    let getData = async () => {
        try {
            let data = await fetch(URL).then((res) => res.json());
            setCountries(data);
        } catch {}
        setLoading(false);
    };
    React.useEffect(() => {
        getData();
    }, []);
    return { countries, loading };
}
