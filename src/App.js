import React from "react";
import EmMap from "./map";
import Preloader from "./preloader";
import useStats from "./useStats";
import useCountries from "./useCountries";
import { FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import useCounty from "./useCounty";

function Title({ lastUpdate }) {
    let m = new Date(lastUpdate).getMonth() + 1;
    let d = new Date(lastUpdate).getDate();
    let y = new Date(lastUpdate).getFullYear();
    let h = new Date(lastUpdate).getHours();
    let mm = new Date(lastUpdate).getMinutes();

    return (
        <div className="py-2 text-center">
            <h1 className="uppercase text-center uppercase pb-2 text-xl leading-none">
                <strong>COVID-19</strong> Worldwide Stats
            </h1>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 flex items-center justify-center">
                    <FiCalendar className="ml-2 mr-1" /> {m}/{d}/{y}{" "}
                    <FiClock className="ml-2 mr-1" /> {h}:{mm}
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
    noBorderRight = false,
    sm = false,
}) {
    return (
        <div
            className={`w-full border-gray-800 p-3 border-t ${
                noBorderRight ? "" : "border-r"
            }`}
        >
            <p
                className={`${
                    sm ? "text-xl" : "text-6xl"
                } font-bold leading-none text-${color}`}
            >
                {value}
            </p>
            <p className={`text-lg leading-none mt-2`}>
                {type}{" "}
                <span className="font-bold block mt-1">{percentage}</span>
            </p>
        </div>
    );
}

function CountryListItem({ cases, recovered, deaths, country }) {
    return (
        <>
            <span className="text-base flex items-center font-bold">
                <FiMapPin className="text-gray-500 mr-1" />
                {country}
            </span>
            <span className="flex items-center justify-between mt-3 block text-left leading-none">
                <span className="mb-1 block text-sm  flex-1">
                    cases
                    <span className="font-bold block text-blue-500 text-base mt-1">
                        {cases}
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

function CountryList({ countries, loading, formatNumber }) {
    const [filter, setFilter] = React.useState("");

    const filtered = countries.filter(({ country }) =>
        country.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="overflow-auto h-full h-auto border-t border-gray-800">
            {loading && <Preloader />}
            <div className="px-5 bg-gray-900 flex items-center justify-center py-3">
                <input
                    type="search"
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search country"
                    className="w-full h-12 px-4 border-gray-700 bg-gray-800 border text-lg focus:outline-none"
                />
            </div>
            {filtered.map(({ deaths, cases, recovered, country }, index) => (
                <div
                    className="w-full border-b border-gray-800 px-5 py-3"
                    key={index}
                >
                    <CountryListItem
                        country={country}
                        deaths={formatNumber(deaths)}
                        cases={formatNumber(cases)}
                        recovered={formatNumber(recovered)}
                    />
                </div>
            ))}
        </div>
    );
}

export default function App() {
    const { stats, loading } = useStats();
    const { county: FL, loading: loadingFL } = useCounty("Florida");
    const { county: NY, loading: loadingNY } = useCounty("New York");
    const { countries, loading: loadingCountries } = useCountries();
    const [sidebar, setSidebar] = React.useState(false);

    if (loading)
        return (
            <div className="h-screen w-full">
                <Preloader />
            </div>
        );

    const {
        cases,
        deaths,
        recovered,
        updated: lastUpdate,
        active: activeCases,
    } = stats;

    const morbility = ((Number(deaths) * 100) / Number(cases)).toFixed(2);
    const recovery = ((Number(recovered) * 100) / Number(cases)).toFixed(2);

    const stillSick = ((Number(activeCases) * 100) / Number(cases)).toFixed(2);

    const formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    return (
        <div className="flex items-start bg-gray-900 h-screen w-full text-gray-500">
            <div
                className={`h-screen flex flex-col border-r border-gray-800 bg-gray-900 sidebar ${
                    sidebar ? "open" : ""
                }`}
            >
                <button
                    className="mx-auto text-sm h-12 close-sidebar flex items-center"
                    onClick={() => setSidebar(false)}
                >
                    <MdClose className="mr-2 inline-block" />
                    Close
                </button>
                <Title lastUpdate={lastUpdate} />
                <Card
                    type="Confirmed"
                    value={formatNumber(cases)}
                    noBorderRight
                />
                <div className="flex items-stretch">
                    <Card
                        color="green-400"
                        spaced
                        type="Recovered"
                        value={formatNumber(recovered)}
                        percentage={`${recovery}%`}
                        sm
                    />
                    <Card
                        sm
                        color="orange-400"
                        spaced
                        type="Still Sick"
                        value={formatNumber(activeCases)}
                        percentage={`${stillSick}%`}
                    />
                    <Card
                        color="red-400"
                        type="Deaths"
                        value={formatNumber(deaths)}
                        percentage={`${morbility}%`}
                        noBorderRight
                        sm
                    />
                </div>
                <CountryList
                    formatNumber={formatNumber}
                    countries={countries}
                    loading={loadingCountries}
                />
            </div>
            <EmMap
                FL={FL}
                NY={NY}
                formatNumber={formatNumber}
                sidebar={sidebar}
                setSidebar={setSidebar}
                countries={countries}
                loading={loading}
            />
        </div>
    );
}
