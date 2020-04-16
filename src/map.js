import React from "react";
import { Map, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Preloader from "./preloader";
import { FiList } from "react-icons/fi";
import MyGeo from "./geo.json";

function MapContent({ place, cases, recovered, deaths }) {
    return (
        <>
            <span className="text-base w-full mb-0 font-bold uppercase">
                {place}
            </span>
            <span className="border-t pt-2 mt-1 block text-left leading-none">
                <span className="mb-1 block flex items-center ">
                    cases:{" "}
                    <span className="font-bold text-blue-500 text-base ml-1">
                        {cases}
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
        </>
    );
}

function CustomMaker({ country, formatNumber }) {
    const {
        countryInfo: { lat, long },
        cases,
        deaths,
        recovered,
    } = country;

    if (lat === null || long === null) {
        return null;
    }

    const renderColor = () =>
        country.country === "Ecuador" || country.country === "Hong Kong"
            ? "#F6AD55"
            : "#63B3ED";

    let size = () => {
        if (cases >= 100000) return 60;
        if (cases > 10000 && cases < 100000) return 20;
        if (cases > 5000) return 10;
        else return 4;
    };

    return (
        <>
            <CircleMarker
                center={[lat, long]}
                color={renderColor()}
                fillColor={renderColor()}
                fillOpacity={0.5}
                radius={size()}
            >
                <Tooltip direction="top">
                    <MapContent
                        place={country.country}
                        deaths={formatNumber(deaths)}
                        cases={formatNumber(cases)}
                        recovered={formatNumber(recovered)}
                    ></MapContent>
                </Tooltip>
            </CircleMarker>
        </>
    );
}

export default function EmMap({
    sidebar,
    setSidebar,
    countries,
    loading,
    formatNumber,
    NY,
    FL,
}) {
    const hasCountries = countries.length > 0;

    const mapRef = React.useRef(null);

    const mapBounds = () =>
        countries.map((country) => [
            country.countryInfo.lat,
            country.countryInfo.long,
        ]);

    return (
        <>
            <div className="h-screen flex-1 items-center justify-center">
                {loading && <Preloader></Preloader>}
                {hasCountries && (
                    <Map
                        ref={mapRef}
                        bounds={mapBounds()}
                        zoom={3}
                        maxZoom={10}
                        minZoom={3}
                        style={{ background: "#1A202C" }}
                    >
                        <button
                            className="absolute top-0 right-0 bg-white text-black text-base items-center px-3 font-bold sidebar-controler"
                            style={{
                                height: 30,
                                marginTop: 12,
                                marginRight: 10,
                                boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
                                zIndex: 999999,
                                borderRadius: 2,
                            }}
                            onClick={() => setSidebar(true)}
                        >
                            <FiList className="mr-2" />{" "}
                            {sidebar ? "Close" : "Open"} Stats
                        </button>
                        <div
                            className="absolute bottom-0 left-0"
                            style={{
                                marginBottom: 12,
                                marginLeft: 10,
                                boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
                                zIndex: 999999,
                                borderRadius: 2,
                            }}
                        >
                            <span
                                className="flex border-2 rounded border-orange-400 items-center font-bold text-xs text-white px-3 py-2 "
                                style={{
                                    background: "rgba(246, 173, 85, 0.5)",
                                }}
                            >
                                Everymundo office locations
                            </span>
                        </div>
                        <GeoJSON
                            data={MyGeo}
                            clickable={false}
                            interactive={false}
                            bubblingMouseEvents={false}
                            pointerEvents="none"
                            style={{
                                fillColor: "#2D3748",
                                stroke: true,
                                color: "#1A202C",
                                weight: 2,
                                fill: true,
                                fillOpacity: 1,
                            }}
                        />
                        {countries.map((country, index) => (
                            <CustomMaker
                                key={index}
                                country={country}
                                formatNumber={formatNumber}
                            />
                        ))}
                        {NY && (
                            <CircleMarker
                                center={[40.77848, -74.174058]}
                                color="#F6AD55"
                                fillColor="#F6AD55"
                                fillOpacity={0.5}
                                radius={40}
                            >
                                <Tooltip direction="top">
                                    <MapContent
                                        place="New York, USA"
                                        deaths={formatNumber(NY.deaths)}
                                        cases={formatNumber(NY.cases)}
                                        recovered={formatNumber(
                                            NY.cases - NY.active
                                        )}
                                    ></MapContent>
                                </Tooltip>
                            </CircleMarker>
                        )}
                        {FL && (
                            <CircleMarker
                                center={[27.789552, -81.495422]}
                                color="#F6AD55"
                                fillColor="#F6AD55"
                                fillOpacity={0.5}
                                radius={10}
                            >
                                <Tooltip direction="top">
                                    <MapContent
                                        place="Florida, USA"
                                        deaths={formatNumber(FL.deaths)}
                                        cases={formatNumber(FL.cases)}
                                        recovered={formatNumber(
                                            FL.cases - FL.active
                                        )}
                                    ></MapContent>
                                </Tooltip>
                            </CircleMarker>
                        )}
                    </Map>
                )}
            </div>
        </>
    );
}
