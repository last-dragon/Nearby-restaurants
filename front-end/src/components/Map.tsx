import React, { useContext, useEffect, useRef } from 'react';
import { createCustomEqual, deepEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { MapContext } from '../contexts/Map';

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}



const Map: React.FC<MapProps> = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useContext(MapContext);

  const panToUser = () => {
    navigator?.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        // console.log(position);
        dispatch({
          type: "updateLocation",
          userLat: position.coords.latitude,
          userLong: position.coords.longitude
        });
        state?.map?.setZoom(15);
        state?.map?.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
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
          state.map.setZoom(15);
          state.map.panTo(location);
        }

        const request = {
          location: location,
          radius: state.radius * 1000,
          type: 'restaurant',
          rankBy: google.maps.places.RankBy.PROMINENCE
        };

        const callback = (places: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            dispatch({ type: "updatePlaces", places: places });
            // console.log(places);
          } else {
            dispatch({ type: "updatePlaces", places: [] });
          }
        };

        if (state?.service) {
          state.service.nearbySearch(request, callback);
        } else {
          dispatch({ type: "updatePlaces", places: [] });
        }
      } else {
        dispatch({ type: "updatePlaces", places: [] });
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
          state.map.setZoom(15);
          state.map.panTo(location);
        }

        const request = {
          location: location,
          radius: state.radius * 1000,
          type: 'restaurant',
          keyword: restaurant,
          rankBy: google.maps.places.RankBy.PROMINENCE
        };

        const callback = (places: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            dispatch({ type: "updatePlaces", places: places });
            // console.log(places);
          } else {
            dispatch({ type: "updatePlaces", places: [] });
          }
        };

        if (state?.service) {
          state.service.nearbySearch(request, callback);
        } else {
          dispatch({ type: "updatePlaces", places: [] });
        }
      } else {
        dispatch({ type: "updatePlaces", places: [] });
      }
    });
  };

  const searchNearby = () => {

    const request = {
      location: { lat: state.userLat, lng: state.userLong },
      radius: state.radius * 1000,
      type: 'restaurant',
      rankBy: google.maps.places.RankBy.PROMINENCE
    };

    const callback = (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(results)
        dispatch({ type: "updatePlaces", places: results })
      } else {
        dispatch({ type: "updatePlaces", places: [] })
      }
    }

    if (state?.service) {
      state.service.nearbySearch(request, callback);
    } else {
      dispatch({ type: "updatePlaces", places: [] })
    }
  }

  useEffect(() => {
    if (state?.pan) {
      panToUser()
    }
    if (state?.search) {
      searchNearby()
    }
    if (state?.ccsearch) {
      searchCountryCity(state.country, state.city)
    }
    if (state?.rsearch) {
      searchrestaurant(state.country, state.city, state.restaurant)
    }
  }, [state])

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