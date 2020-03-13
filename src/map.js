import React from "react";
import useCountries from "./useCountries";
import { Map, GeoJSON, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Preloader from "./preloader";
import { FiList } from "react-icons/fi";

function MapContent({
    provinceState,
    countryRegion,
    confirmed,
    recovered,
    deaths,
    stats = true
}) {
    return (
        <>
            <span className="text-sm">
                {provinceState ? <span>{provinceState}, </span> : ""}
                {countryRegion}
            </span>
            {stats && (
                <span className="mt-2 block text-left leading-none">
                    <span className="mb-1 block flex items-center ">
                        Confirmed:{" "}
                        <span className="font-bold text-blue-500 text-base ml-1">
                            {confirmed}
                        </span>
                    </span>
                    <span className="mb-1 block flex items-center ">
                        Recovered:{" "}
                        <span className="font-bold text-green-500 text-base ml-1">
                            {recovered}
                        </span>
                    </span>
                    <span className="block flex items-center ">
                        Deaths:{" "}
                        <span className="font-bold text-red-500 text-base ml-1">
                            {deaths}
                        </span>
                    </span>
                </span>
            )}
        </>
    );
}

function CustomMaker({ country }) {
    const {
        provinceState,
        countryRegion,
        lat,
        long,
        confirmed,
        deaths,
        recovered
    } = country;
    return (
        <CircleMarker
            center={[lat, long]}
            color="none"
            fillColor="#2A4365"
            fillOpacity={1}
            radius={7}
        >
            <Popup>
                <MapContent
                    deaths={deaths}
                    confirmed={confirmed}
                    recovered={recovered}
                    countryRegion={countryRegion}
                    provinceState={provinceState}
                ></MapContent>
            </Popup>
            <Tooltip direction="top">
                <MapContent
                    stats={false}
                    deaths={deaths}
                    confirmed={confirmed}
                    recovered={recovered}
                    countryRegion={countryRegion}
                    provinceState={provinceState}
                ></MapContent>
            </Tooltip>
        </CircleMarker>
    );
}

export default function EmMap({ sidebar, setSidebar }) {
    const { countries, loading } = useCountries();
    const [geo, setGeo] = React.useState(null);
    let hasCountries = countries.length > 0;

    let getGEOJSON = () => {
        fetch(
            "https://em-frontend-assets.airtrfx.com/assets/map-tiles/world-countries-usa-states.json"
        )
            .then(res => res.json())
            .then(res => setGeo(res))
            .catch(e => console.log("Error loading map:", e));
    };

    React.useEffect(() => {
        getGEOJSON();
    }, []);
    return (
        <>
            {hasCountries && geo ? (
                <div className="h-screen flex-1">
                    <Map
                        center={[40.456974, -3.763064]}
                        zoom={3}
                        maxZoom={10}
                        minZoom={3}
                        style={{ background: "#63B3ED" }}
                    >
                        <button
                            className="absolute top-0 right-0 bg-white text-black text-base items-center px-3 font-bold sidebar-controler"
                            style={{
                                height: 30,
                                marginTop: 12,
                                marginRight: 10,
                                boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
                                zIndex: 999999,
                                borderRadius: 2
                            }}
                            onClick={() => setSidebar(true)}
                        >
                            <FiList className="mr-2" />{" "}
                            {sidebar ? "Close" : "Open"} Stats
                        </button>
                        <GeoJSON
                            data={geo}
                            clickable={false}
                            interactive={false}
                            bubblingMouseEvents={false}
                            pointerEvents="none"
                            style={{
                                stroke: true,
                                color: "#2B6CB0",
                                weight: 2,
                                fill: true,
                                fillColor: "#3182CE",
                                fillOpacity: 1
                            }}
                        />
                        {countries.map((country, index) => (
                            <CustomMaker key={index} country={country} />
                        ))}
                    </Map>
                </div>
            ) : loading ? (
                <Preloader />
            ) : null}
        </>
    );
}
