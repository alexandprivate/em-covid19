import React from "react";
import MapBoxGLLayer from "./mapHoc";
import useCountries from "./useCountries";
import { Map, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapJson from "./mapstyles/style.json";

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
            fillColor="black"
            fillOpacity={0.5}
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

export default function EmMap() {
    const { countries, loading } = useCountries();
    let hasCountries = countries.length > 0;
    return (
        <>
            {hasCountries ? (
                <div className="h-screen flex-1 shadow-xl">
                    <Map
                        center={[40.456974, -3.763064]}
                        zoom={3}
                        maxZoom={10}
                        minZoom={3}
                    >
                        <MapBoxGLLayer
                            url={process.env.REACT_APP_MAPBOX_URL}
                            accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                            style={mapJson}
                        />
                        {countries.map((country, index) => (
                            <CustomMaker key={index} country={country} />
                        ))}
                    </Map>
                </div>
            ) : loading ? (
                <p>Loading ...</p>
            ) : null}
        </>
    );
}
