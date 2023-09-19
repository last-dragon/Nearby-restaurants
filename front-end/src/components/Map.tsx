import React, { useContext, useEffect, useRef } from 'react';
import { createCustomEqual, deepEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { MapContext } from '../contexts/Map';
import axios from 'axios';

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}



const Map: React.FC<MapProps> = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useContext(MapContext);

  const {
    pan: statePan,
    search: stateSearch,
    ccsearch: stateCcsearch,
    rsearch: stateRsearch,
    country: stateCountry,
    city: stateCity,
    restaurant: stateRestaurant
  } = state;

  const api = axios.create({
    baseURL: 'https://223.165.6.87:5000', // Set the base URL to your Flask backend server
  });

  const panToUser = () => {
    navigator?.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        // console.log(position);
        dispatch({
          type: "updateLocation",
          userLat: position.coords.latitude,
          userLong: position.coords.longitude
        });
        setTimeout(() => {
          state?.map?.setZoom(18);
          state?.map?.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
        }, 3000);
      }
    );
  }

  const searchCountryCity = (city: string, country: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: `${city}, ${country}` }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;

        if (state?.map) {
          dispatch({
            type: "updateLocation",
            userLat: Number(location.lat),
            userLong: Number(location.lng)
          });
          setTimeout(() => {
            state.map?.setZoom(18);
            state.map?.panTo(location);
          }, 3000);
        }

        const request = {
          location: location,
          // radius: state.radius * 1000,
          type: 'restaurant',
          rankBy: google.maps.places.RankBy.DISTANCE
        };
        // console.log(state.country, state.city);

        const callback = async (places: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            // console.log(places);
            let popular_times = []
            for (let index = 0; index < places.length; index++) {
              const place = places[index];
              const response = await api.post("/api/getpopulartime", JSON.stringify({
                "placeId": place.place_id
              }), {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              popular_times.push(response.data.data)
            }
            // console.log(popular_times)
            dispatch({ type: "updatePlaces", places: places, popular_times: popular_times });
            if (state?.map) {
              setTimeout(() => {
                state.map?.setZoom(18);
                state.map?.panTo(location);
              }, 3000);
            }
          } else {
            dispatch({ type: "updatePlaces", places: [], popular_times: [] });
          }
        };

        if (state?.service) {
          state.service.nearbySearch(request, callback);
        } else {
          dispatch({ type: "updatePlaces", places: [], popular_times: [] });
        }
      }
    });
  };

  const searchrestaurant = (city: string, country: string, restaurant: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: `${city}, ${country},${restaurant}` }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;

        if (state?.map) {
          dispatch({
            type: "updateLocation",
            userLat: Number(location.lat),
            userLong: Number(location.lng)
          });
          setTimeout(() => {
            state.map?.setZoom(18);
            state.map?.panTo(request.location);
          }, 3000);
        }

        const request = {
          location: location,
          radius: state.radius * 1000,
          type: 'restaurant',
          keyword: restaurant,
          rankBy: google.maps.places.RankBy.PROMINENCE
        };

        const callback = async (places: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            let popular_times = []
            // console.log(places);
            for (let index = 0; index < places.length; index++) {
              const place = places[index];
              const response = await api.post("/api/getpopulartime", JSON.stringify({
                "placeId": place.place_id
              }), {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              popular_times.push(response.data.data)
            }
            // console.log(popular_times);
            dispatch({ type: "updatePlaces", places: places, popular_times: popular_times });
            if (state?.map) {
              setTimeout(() => {
                state.map?.setZoom(18);
                state.map?.panTo(request.location);
              }, 3000);
            }
          }
          else {
            dispatch({ type: "updatePlaces", places: [], popular_times: [] });
          }
        };

        if (state?.service) {
          state.service.nearbySearch(request, callback);
        } else {
          dispatch({ type: "updatePlaces", places: [], popular_times: [] });
        }
      }
    });
  };

  const searchNearby = () => {

    const request = {
      location: { lat: state.userLat, lng: state.userLong },
      // radius: state.radius * 1000,
      type: 'restaurant',
      rankBy: google.maps.places.RankBy.DISTANCE
    };

    const callback = async (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // console.log(results)
        let popular_times = []
        for (let index = 0; index < results.length; index++) {
          const place = results[index];
          const response = await api.post("/api/getpopulartime", JSON.stringify({
            "placeId": place.place_id
          }), {
            headers: {
              "Content-Type": "application/json",
            },
          });
          popular_times.push(response.data.data)
        }
        // console.log(popular_times);
        dispatch({ type: "updatePlaces", places: results, popular_times: popular_times })
        if (state?.map) {
          setTimeout(() => {
            state.map?.setZoom(18);
            state.map?.panTo(request.location);
          }, 3000);
        }
      } else {
        dispatch({ type: "updatePlaces", places: [], popular_times: [] })
      }
    }

    if (state?.service) {
      state.service.nearbySearch(request, callback);
    } else {
      dispatch({ type: "updatePlaces", places: [], popular_times: [] })
    }
  }

  useEffect(() => {
    if (statePan) {
      panToUser()
    }
  }, [statePan])
  useEffect(() => {
    if (stateSearch) {
      searchNearby()
    }
  }, [stateSearch])
  useEffect(() => {
    if (stateCcsearch) {
      searchCountryCity(stateCountry, stateCity)
    }
  }, [stateCcsearch, stateCountry, stateCity])
  useEffect(() => {
    if (stateRsearch) {
      searchrestaurant(stateCountry, stateCity, stateRestaurant)
    }
  }, [stateRestaurant, stateCountry, stateCity])

  useEffect(() => {
    if (ref.current && !state?.map) {
      dispatch({ type: "loadMap", map: new window.google.maps.Map(ref.current, {}) });
    }
  }, [ref, state]);

  useDeepCompareEffectForMaps(() => {
    if (state?.map) {
      state?.map.setOptions(options);
    }
  }, [state, options]);

  useEffect(() => {
    if (state?.map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(state?.map!, eventName)
      );

      if (onClick) {
        state?.map.addListener("click", onClick);
      }

      if (onIdle) {
        state?.map.addListener("idle", () => onIdle(state?.map!));
      }
    }
  }, [state, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map: state?.map });
        }
      })}
    </>
  );
}

const deepCompareEqualsForMaps = createCustomEqual(() => ({
  areObjectsEqual: (a, b) => {
    if (isLatLngLiteral(a) || a instanceof google.maps.LatLng || isLatLngLiteral(b) || b instanceof google.maps.LatLng) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    return deepEqual(a, b);
  },
}));

const useDeepCompareMemoize = (value: any) => {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

const useDeepCompareEffectForMaps = (callback: React.EffectCallback, dependencies: any[]) => {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default Map;