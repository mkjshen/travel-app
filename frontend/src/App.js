import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const currentUser = "worried";
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [pins, setPins] = useState([]);
  const [viewState, setViewState] = useState({
    latitude: 48.137154,
    longitude: 11.576124,
    zoom: 4.5,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({
      ...viewState,
      longitude: long,
      latitude: lat,
    });
  };

  const handleAddClick = (e) => {
    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;

    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}>
        {pins.map((p) => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              offsetLeft={-2.5 * viewState.zoom}
              offsetTop={-5 * viewState.zoom}>
              <Room
                style={{
                  cursor: "pointer",
                  fontSize: 5 * viewState.zoom,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}>
                <div className="card">
                  <label>Place</label>
                  <h3 className="place">{p.title}</h3>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array.from({ length: p.rating }, (_, index) => (
                      <Star key={index} className="star" />
                    ))}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Popup
              longitude={newPlace.long}
              latitude={newPlace.lat}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setNewPlace(null)}>
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Review</label>
                  <textarea
                    placeholder="Tell us something about this place!"
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" type="submit">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        <button className="button logout">Log Out</button>
        <div className="buttons">
          <button className="button login">Log In</button>
          <button className="button register">Register</button>
        </div>
      </Map>
    </div>
  );
}

export default App;
