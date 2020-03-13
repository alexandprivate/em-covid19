import React from "react";
import EmMap from "./map";
import Preloader from "./preloader";
import useStats from "./useStats";
import useCountries from "./useCountries";
import { FiMapPin, FiSearch } from "react-icons/fi";

function Title({ lastUpdate }) {
    let m = new Date(lastUpdate).getMonth() + 1;
    let d = new Date(lastUpdate).getDate();
    let y = new Date(lastUpdate).getFullYear();
    return (
        <div className="py-5 text-gray-700 text-center">
            <h1 className="uppercase text-center uppercase pb-2 text-2xl leading-none text-gray-700">
                COVID19 Stats
            </h1>
            <div className="flex flex-col">
                {/* <span className="font-bold uppercase leading-relaxed text-blue-400 uppercase leading-relaxed text-sm block">
                    <span className="text-gray-600 font-normal">Every</span>
                    mundo
                </span> */}
                <span className="text-xs text-gray-600">
                    Last update: {m}/{d}/{y}
                </span>
            </div>
        </div>
    );
}

function Card({
    type,
    value,
    color = "blue-400",
    percentage = "",
    noBorderRight = false
}) {
    return (
        <div
            className={`w-full p-5 border-t ${noBorderRight ? "" : "border-r"}`}
        >
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
            <span className="text-base flex items-center font-bold">
                <FiMapPin className="text-black mr-1" />
                {provinceState ? <span>{provinceState}, </span> : ""}
                {countryRegion}
            </span>
            <span className="flex items-center justify-between mt-3 block text-left leading-none">
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
    const [filter, setFilter] = React.useState("");

    let filtered = countries.filter(({ countryRegion }) =>
        countryRegion.toLowerCase().includes(filter.toLowerCase())
    );
    console.log({ filtered });

    return (
        <div className="overflow-auto h-full h-auto border-t">
            {loading && <Preloader />}
            <div className="px-5 bg-white flex items-center justify-center py-3 sticky top-0">
                <button className="pointer-events-none h-12 px-2 border-t border-l border-b rounded-l bg-gray-200 text-gray-700">
                    <FiSearch></FiSearch>
                </button>
                <input
                    type="search"
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Search country"
                    className="w-full h-12 px-4 bg-gray-200 border rounded-r text-lg"
                />
            </div>
            {filtered.map(
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
    let { stats, loading } = useStats(null);
    const [sidebar, setSidebar] = React.useState(false);

    if (loading)
        return (
            <div className="h-screen w-full">
                <Preloader />
            </div>
        );

    let { value: confirmed } = stats.confirmed;
    let { value: recovered } = stats.recovered;
    let { value: deaths } = stats.deaths;
    let { lastUpdate } = stats;

    let morbility = ((Number(deaths) * 100) / Number(confirmed)).toFixed(2);
    let recovery = ((Number(recovered) * 100) / Number(confirmed)).toFixed(2);

    return (
        <div className="flex items-start h-screen w-full text-gray-700">
            <div
                className={`h-screen flex flex-col border-r bg-white sidebar ${
                    sidebar ? "open" : ""
                }`}
            >
                <button
                    className="absolute top-0 left-0 text-xl h-8 w-8 close-sidebar"
                    onClick={() => setSidebar(false)}
                >
                    &times;
                </button>
                <Title lastUpdate={lastUpdate} />
                <Card type="Confirmed" value={confirmed} noBorderRight />
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
                        noBorderRight
                    />
                </div>
                <CountryList />
            </div>
            <EmMap sidebar={sidebar} setSidebar={setSidebar} />
        </div>
    );
}
