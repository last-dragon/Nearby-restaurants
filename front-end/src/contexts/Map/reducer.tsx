import { MapAction, MapReducer, MapState } from "./interface";

export const initialState = {
  map: null,
  searchstr: '',
  userLat: -37.8136,
  userLong: 144.9631, 
  pan: false,
  service: null,
  search: false,
  ccsearch: false,
  rsearch: false,
  places: [],
  popular_times: [],
  radius: 5
};

export const reducer: MapReducer = (state: MapState, action: MapAction) => {
    switch (action.type) {
      case "updateLocation":
        return {
          ...state,
          userLat: action.userLat,
          userLong: action.userLong,
          pan: false
        }
    
      case "loadMap":
        const service = new google.maps.places.PlacesService(action.map!);
        return {
            ...state,
            map: action.map,
            service: service
        }
      
      case "panToUser":
        return {
          ...state,
          pan: true
        }
      
      case "searchNearby":
        return {
          ...state,
          search: true
        }

      case "updatesearchstr":
      return {
        ...state,
        searchstr: action.searchstr
      }
      
      case "searchrestaurant":
        return{
          ...state,
          rsearch:true
        }
      
      case "updatePlaces":
        return {
          ...state,
          places: action.places,
          popular_times: action.popular_times,
          search: false,
          ccsearch: false,
          rsearch: false
        }
      
      case "updateRadius":
        return {
          ...state,
          radius: action.radius
        }

      default:
        return state
    }
  }