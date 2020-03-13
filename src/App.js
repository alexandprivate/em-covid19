import React from "react";
import EmMap from "./map";
import useStats from "./useStats";
import useCountries from "./useCountries";

function Title({ lastUpdate }) {
    let m = new Date(lastUpdate).getMonth() + 1;
    let d = new Date(lastUpdate).getDate();
    let y = new Date(lastUpdate).getFullYear();
    return (
        <h1 className="text-center mt-5 pb-5 text-2xl leading-none text-gray-700">
            Covid-19 Worldwide Stats
            <br />
            <span className="font-bold leading-relaxed mt-1 text-blue-400 uppercase leading-relaxed text-sm block">
                Everymundo
            </span>
            <p className="text-xs text-gray-500">
                last update: {m}/{d}/{y}
            </p>
        </h1>
    );
}

function Card({ type, value, color = "blue-400", percentage = "" }) {
    return (
        <div className={`w-full p-5 border-t border-r`}>
            <p className={`text-4xl font-bold leading-none text-${color}`}>
                {value}
            </p>
            <p className={`text-xl leading-none mt-2`}>
                {type}{" "}
                <span className="font-bold block mt-1">{percentage}</span>
            </p>
        </div>
    );
}

function CountryListItem({
    provinceState,
    countryRegion,
    confirmed,
    recovered,
    deaths
}) {
    return (
        <>
            <span className="text-base">
                {provinceState ? <span>{provinceState}, </span> : ""}
                {countryRegion}
            </span>
            <span className="flex items-center justify-between mt-2 block text-left leading-none">
                <span className="mb-1 block text-sm  flex-1">
                    Confirmed
                    <span className="font-bold block text-blue-500 text-base mt-1">
                        {confirmed}
                    </span>
                </span>
                <span className="mb-1 block text-sm  flex-1">
                    Recovered
                    <span className="font-bold block text-green-500 text-base mt-1">
                        {recovered}
                    </span>
                </span>
                <span className="block  text-sm flex-1">
                    Deaths
                    <span className="font-bold text-red-500 block text-base mt-1">
                        {deaths}
                    </span>
                </span>
            </span>
        </>
    );
}

function CountryList() {
    const { countries, loading } = useCountries();
    return (
        <div className="overflow-auto h-auto border-t">
            {loading && <p>Loading...</p>}
            {countries.map(
                (
                    {
                        deaths,
                        confirmed,
                        recovered,
                        countryRegion,
                        provinceState
                    },
                    index
                ) => (
                    <div className="w-full border-b px-5 py-3" key={index}>
                        <CountryListItem
                            deaths={deaths}
                            confirmed={confirmed}
                            recovered={recovered}
                            countryRegion={countryRegion}
                            provinceState={provinceState}
                        />
                    </div>
                )
            )}
        </div>
    );
}

export default function App() {
    let { stats, loading } = useStats();
    const { loading: mapLoading } = useCountries();

    if (loading) return <p>Loading...</p>;
    let { value: confirmed } = stats.confirmed;
    let { value: recovered } = stats.recovered;
    let { value: deaths } = stats.deaths;
    let { lastUpdate } = stats;

    let morbility = ((Number(deaths) * 100) / Number(confirmed)).toFixed(2);
    let recovery = ((Number(recovered) * 100) / Number(confirmed)).toFixed(2);

    if (mapLoading) return <p>Loading...</p>;

    return (
        <div className="flex items-start h-screen w-full text-gray-700">
            <div className="h-screen flex flex-col" style={{ width: 350 }}>
                <Title lastUpdate={lastUpdate} />
                <Card type="Confirmed" value={confirmed} />
                <div className="flex items-center">
                    <Card
                        color="green-400"
                        spaced
                        type="Recovered"
                        value={recovered}
                        percentage={`${recovery}%`}
                    />
                    <Card
                        color="red-400"
                        type="Deaths"
                        value={deaths}
                        percentage={`${morbility}%`}
                    />
                </div>
                <CountryList />
            </div>
            <EmMap />
        </div>
    );
}
