import React from "react";
import { Map, GeoJSON, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Preloader from "./preloader";
import { FiList } from "react-icons/fi";
import MyGeo from "./geo.json";

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

function CustomMaker({ country, formatNumber }) {
    const {
        provinceState,
        countryRegion,
        lat,
        long,
        confirmed,
        deaths,
        recovered
    } = country;

    let getColor = () => {
        return countryRegion === "Ecuador" ||
            provinceState === "Hong Kong" ||
            provinceState === "New York" ||
            provinceState === "Florida"
            ? "#F6AD55"
            : "#63B3ED";
    };
    return (
        <CircleMarker
            center={[lat, long]}
            color={getColor()}
            fillColor={getColor()}
            fillOpacity={0.6}
            radius={6}
        >
            <Popup>
                <MapContent
                    deaths={formatNumber(deaths)}
                    confirmed={formatNumber(confirmed)}
                    recovered={formatNumber(recovered)}
                    countryRegion={countryRegion}
                    provinceState={provinceState}
                ></MapContent>
            </Popup>
            <Tooltip direction="top">
                <MapContent
                    stats={false}
                    deaths={formatNumber(deaths)}
                    confirmed={formatNumber(confirmed)}
                    recovered={formatNumber(recovered)}
                    countryRegion={countryRegion}
                    provinceState={provinceState}
                ></MapContent>
            </Tooltip>
        </CircleMarker>
    );
}

export default function EmMap({
    sidebar,
    setSidebar,
    countries,
    loading,
    formatNumber
}) {
    let hasCountries = countries.length > 0;

    return (
        <>
            <div className="h-screen flex-1 items-center justify-center">
                {loading && <Preloader></Preloader>}
                {hasCountries && (
                    <Map
                        center={[40.456974, -3.763064]}
                        zoom={3}
                        maxZoom={10}
                        minZoom={3}
                        style={{ background: "#2D3748" }}
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
                        <div
                            className="absolute bottom-0 left-0 bg-white text-black text-sm px-3 py-2"
                            style={{
                                marginBottom: 12,
                                marginLeft: 10,
                                boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
                                zIndex: 999999,
                                borderRadius: 2
                            }}
                        >
                            <span className="flex items-center uppercase text-xs">
                                <span className="h-3 w-3 mr-2 rounded-full bg-orange-400"></span>
                                Everymundo Offices
                            </span>
                        </div>
                        <GeoJSON
                            data={MyGeo}
                            clickable={false}
                            interactive={false}
                            bubblingMouseEvents={false}
                            pointerEvents="none"
                            style={{
                                fillColor: "#1A202C",
                                stroke: true,
                                color: "#2D3748",
                                weight: 2,
                                fill: true,
                                fillOpacity: 1
                            }}
                        />
                        {countries.map((country, index) => (
                            <CustomMaker
                                key={index}
                                country={country}
                                formatNumber={formatNumber}
                            />
                        ))}
                    </Map>
                )}
            </div>
        </>
    );
}
