// googlemap.js
// https://developers.google.com/maps/documentation/javascript/overview#js_api_loader_package

import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

/// Console
//npm install react-redux
//npm install --save-dev redux-devtools
// npm install uuid     // To create a random UUID... https://www.npmjs.com/package/uuid
// npm install react-router-dom     // https://reactrouter.com/web/guides/quick-start
// npm install semantic-ui-react semantic-ui-css // https://react.semantic-ui.com/usage/

import { connect } from "react-redux";

import { saveMapCoords } from "./redux/actions/index";
import { Redirect } from "react-router-dom";
import { Button } from "semantic-ui-react";
import InfoWindowEx from "./infoWIndowEx";

// import "./styles/navbar.scss";

import { Loader } from "@googlemaps/js-api-loader";

import { v1 as uuidv1 } from "uuid"; // to create random uuid

// Google Maps with React

// https://www.npmjs.com/package/google-maps-react
// dev.to/jessicabetts/how-to-use-google-maps-api-and-react-js-26c2

// the location of Berlin
const berlin = { lat: 52.520008, lng: 13.404954 }; // https://www.latlong.net/

function Map() {
    return ( <GoogleMap 
                defaultZoom={8} 
                defaultCenter = {berlin} 
            />
    );
}




export default function Maps(props) {
    // https://developers.google.com/maps/documentation/javascript/overview#javascript

    // [START maps_programmatic_load]

    let map;
    const Loader = google.maps.plugins.loader.Loader;
    const additionalOptions = {};



    const loader = new Loader({
        // apiKey = require("/Users/Aleksey/Desktop/CODING/adobo-finalproject/secrets.json").API_KEY, // import GOOGLE API KEY
        apiKey: "AIzaSyDLiM5wZTmGqDKPLK5jMp27Uem0TexGYQE",
        version: "weekly",
        ...additionalOptions,
    });

    loader.load().then(() => {

        // the location of Berlin
        const berlin = { lat: 52.52, lng: 13.4050 };
        // The Map Object
        map = new google.maps.Map(document.getElementById('map'), {
            center: berlin,     
            zoom: 8 // city level
        });
    });

    // [END maps_programmatic_load_promise]
    // [END maps_programmatic_load]



    // Initialize and add the map
    function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
    }



    render() {
        return (
            <Map
                google={this.props.google}
                zoom={8}
                style={mapStyles}
                initialCenter={{ lat: 47.444, lng: -122.176 }}
            >
                <Marker position={{ lat: 48.0, lng: -122.0 }} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDLiM5wZTmGqDKPLK5jMp27Uem0TexGYQE",
})(Maps);

const mapStyles = {
    width: "70%",
    height: "70%",
};



//////////https://github.com/titivermeesch/neighborapp-front/blob/master/src/components/Maps.js

/*

export class Maps extends Component {
    state = {
        data: [],
        loc_x: 0,
        loc_y: 0,
        locRendered: false,
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        redirect: false,
        redirectId: 0,
    };

    getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }
    };

    showPosition = (position) => {
        this.setState({
            loc_x: position.coords.latitude,
            loc_y: position.coords.longitude,
            locRendered: true,
        });
    };

    fetchRequestLocations = () => {
        fetch(`https://neighborapp-backend.herokuapp.com/requests/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-User-Email": localStorage.getItem("email"),
                "X-User-Token": localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ data: data.data });
                setTimeout(() => {
                    this.fetchRequestLocations();
                }, 20000);
            });
    };

    saveCoords = (mapProps, map, clickEven) => {
        if (window.location.pathname === "/c/request") {
            this.props.saveMapCoords(
                clickEven.latLng.lat(),
                clickEven.latLng.lng()
            );
            document.querySelector(".custom-modal").style.visibility =
                "visible";
            document.querySelector(".fader").style.visibility = "visible";
        }
    };

    openContribution = (id) => {
        document.querySelector(".fader").style.visibility = "visible";
        this.setState({
            redirect: true,
            redirectId: id,
            showingInfoWindow: false,
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={`/c/contribution/${this.state.redirectId}`} />;
        }
    };

    centerMoved = (mapProps, map) => {
        this.setState({
            loc_x: map.center.lat(),
            loc_y: map.center.lng(),
        });
    };

    componentWillMount() {
        this.getUserLocation();
    }

    componentDidMount() {
        this.fetchRequestLocations();
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                {this.state.locRendered ? (
                    <Map
                        google={this.props.google}
                        zoom={14}
                        styles={this.props.mapStyles}
                        disableDefaultUI={true}
                        onClick={this.saveCoords}
                        onDragend={this.centerMoved}
                        initialCenter={{
                            lat: this.state.loc_x,
                            lng: this.state.loc_y,
                        }}
                    >
                        {this.state.data.map((m) => {
                            if (m.status === "open") {
                                if (m.request_type === "normal") {
                                    return (
                                        <Marker
                                            key={uuidv1()}
                                            position={{ lat: m.x, lng: m.y }}
                                            title={m.title}
                                            data={m}
                                            onClick={this.onMarkerClick}
                                            icon={{
                                                url:
                                                    "../../data/welfareroom.png",
                                                anchor: new this.props.google.maps.Point(
                                                    48,
                                                    48
                                                ),
                                                scaledSize: new this.props.google.maps.Size(
                                                    48,
                                                    48
                                                ),
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <Marker
                                            key={uuidv1()}
                                            position={{ lat: m.x, lng: m.y }}
                                            title={m.title}
                                            data={m}
                                            onClick={this.onMarkerClick}
                                            icon={{
                                                url:
                                                    "../../data/tortillas1.png",
                                                anchor: new this.props.google.maps.Point(
                                                    48,
                                                    48
                                                ),
                                                scaledSize: new this.props.google.maps.Size(
                                                    48,
                                                    48
                                                ),
                                            }}
                                        />
                                    );
                                }
                            }
                        })}
                        <InfoWindowEx
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                        >
                            <div>
                                <h1>{this.state.selectedPlace.title}</h1>
                                <div>
                                    {this.state.selectedPlace.description}
                                </div>
                                <br />
                                <Button
                                    onClick={() =>
                                        this.openContribution(
                                            this.state.selectedPlace.id
                                        )
                                    }
                                >
                                    Read more
                                </Button>
                            </div>
                        </InfoWindowEx>
                    </Map>
                ) : null}
            </div>
        );
    }

    onMarkerClick = (props, marker) => {
        this.setState({
            selectedPlace: props.data,
            activeMarker: marker,
            showingInfoWindow: true,
            redirect: false,
        });
    };
}

Maps.defaultProps = {
    mapStyles: [
        {
            elementType: "geometry",
            stylers: [
                {
                    color: "#242f3e",
                },
            ],
        },
        {
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#746855",
                },
            ],
        },
        {
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#242f3e",
                },
            ],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#d59563",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#d59563",
                },
            ],
        },
        {
            featureType: "poi.business",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
                {
                    color: "#263c3f",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#6b9a76",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {
                    color: "#38414e",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#212a37",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#9ca5b3",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
                {
                    color: "#746855",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#1f2835",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#f3d19c",
                },
            ],
        },
        {
            featureType: "road.local",
            elementType: "labels",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
                {
                    color: "#2f3948",
                },
            ],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#d59563",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [
                {
                    color: "#17263c",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#515c6d",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#17263c",
                },
            ],
        },
    ],
};

function mapStateToProps(state) {
    return {
        x: state.x,
        y: state.y,
    };
}

export default connect(mapStateToProps, { saveMapCoords })(
    GoogleApiWrapper({
        apiKey: "AIzaSyDLiM5wZTmGqDKPLK5jMp27Uem0TexGYQE",
    })(Maps)
);

*/
