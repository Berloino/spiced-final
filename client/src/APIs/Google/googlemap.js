// googlemap.js
// https://developers.google.com/maps/documentation/javascript/overview#js_api_loader_package

import React, { Component } from "react";

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import { formatRelative } from "date-fns"; // date-fns.org/

// STYLES

import mapStyles from "./mapStyles";

import "@reach/combobox/styles.css";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox"; // Accessible combobox (autocomplete or autosuggest) component for React.

const options = {
    styles: mapStyles,
    disableDefaultUI: true, // remove  allUI controls on maps
    zoomControl: true, // adds Zoom control after being previously deleted with disableDefaultUI
};

const mapContainerStyle = {
    width: "100%", //tryvh 100 40
    height: "100%",
};

const googleAPIKey = require("../../../../secrets.json").GOOGLE_API_KEY; // import Google API key from secrets.json
const libraries = ["places"];

// the location of Berlin
const berlin = { lat: 52.520008, lng: 13.404954 }; // https://www.latlong.net/
const center = berlin;

// Google Maps with React
//www.youtube.com/watch?v=WZcxJGmLbSo

// Maps Javascript API
// Places API

export default function Maps() {
    console.log("[googlemap.js] Inside <Maps /> ");

    // the location of Berlin
    const berlin = { lat: 52.520008, lng: 13.404954 }; // https://www.latlong.net/

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleAPIKey,
        libraries, // to avoid to multiple rerenderings
    });

    ///
    const [markers, setMarkers] = React.useState([]); // onClick markers
    const [selected, setSelected] = React.useState(null);

    // retrun (<GoogleMap onClick={onMapClick} /> )

    //Hook
    /// useCallback on a function that shouldnt change unless the properties passed, doesn't trigger a rerender

    const onMapClick = React.useCallback((e) => {
        setMarkers((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            },
        ]);
    }, []);

    // If we move in map

    const mapRef = React.useRef();

    // retrun (<GoogleMap onLoad={onMapLoad} /> )
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    ///

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <div className="mapComponent">
            <h1 id="maptitle">
                Breweries <span role="img" aria-label="brewery"></span>
            </h1>

            <Locate panTo={panTo} />
            <Search panTo={panTo} />

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                style={mapStyles}
                center={berlin}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {markers.map((marker) => (
                    <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => {
                            setSelected(marker);
                        }}
                        icon={{
                            url: `/beer-favicon.ico`,
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                            scaledSize: new window.google.maps.Size(30, 30),
                        }}
                    />
                ))}

                {selected ? (
                    <InfoWindow
                        position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => {
                            setSelected(null);
                        }}
                    >
                        <div>
                            <h2>
                                <span role="img" aria-label="bear">
                                    🐻
                                </span>{" "}
                                Alert
                            </h2>
                            <p>
                                Spotted{" "}
                                {formatRelative(selected.time, new Date())}
                            </p>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}

function Locate({ panTo }) {
    return (
        <button
            className="locate"
            onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => null
                );
            }}
        >
            <img src="/compass.png" alt="compass" />
        </button>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 52.520008, lng: () => 13.404954 }, // prefer locations near Berlin { lat: 52.520008, lng: 13.404954 }
            radius: 100 * 1000,
        },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address }); // will return us some results that we have to await for because it is a promise, reiceved address object
            const { lat, lng } = await getLatLng(results[0]); // getLatLng extracts lat, lng from returned object
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <div className="search">
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready} // disabled if autocomplete is not ready
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && // if status ok map over all suggestions
                            data.map((
                                { id, description } // each suggestion gets passed over an arrrow function
                            ) => (
                                <ComboboxOption key={id} value={description} /> // render out a combobox option with key and value
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}
