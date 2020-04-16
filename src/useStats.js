import React from "react";

const URL = "https://corona.lmao.ninja/v2/all";

export default function useStats() {
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    let getData = async () => {
        try {
            let data = await fetch(URL).then((res) => res.json());
            setStats(data);
        } catch {}
        setLoading(false);
    };
    React.useEffect(() => {
        getData();
    }, []);
    return { stats, loading };
}
