import React from "react";

const URL = "https://corona.lmao.ninja/v2/states/";

export default function useStats(countyName) {
    const [county, setCounty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    let getData = async () => {
        try {
            let data = await fetch(
                `${URL}${countyName}?yesterday=false`
            ).then((res) => res.json());
            setCounty(data);
        } catch {}
        setLoading(false);
    };
    React.useEffect(() => {
        getData();
    }, []);
    return { county, loading };
}
