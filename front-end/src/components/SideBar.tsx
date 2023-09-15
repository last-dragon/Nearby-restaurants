import { Box, TextField, Button, CircularProgress, Grid, Typography } from "@mui/material";
import DistanceSlider from "./DistanceSlider";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useContext, useState, useRef } from "react";
import { MapContext } from "../contexts/Map";
import PlaceCard from "./PlaceCard";
import { getValue } from "@testing-library/user-event/dist/utils";
import { idText } from "typescript";

const SideBar = () => {

    const [state, dispatch] = useContext(MapContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState('');

    const cardsPerPage = 20;
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = state.places.slice(indexOfFirstCard, indexOfLastCard);

    const countryRef = useRef(null);
    const cityRef = useRef(null);

    const handleSearch = () => {
        const countryValue = countryRef.current?.value || '';
        const cityValue = cityRef.current?.value || '';

        dispatch({
            type: "updateCountry",
            country: countryRef.current?.value || ""
        });
        dispatch({
            type: "updateCity",
            city: cityRef.current?.value || ""
        });
        dispatch({ type: "searchCountryCity" });
    };

    return (
        <Box sx={{
            flex: '1',
            maxHeight: '100vh',
            padding: '10px',
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'scroll'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '95%',
                minHeight: '100px',
                padding: '0px 10px',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'primary.main',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderRadius: '5px',
                '&:hover': {
                    borderWidth: '1px',
                },
            }}>
                {/* <DistanceSlider
                    aria-label="distance slider"
                    valueLabelDisplay="on"
                    max={100}
                    min={1}
                    step={1}
                    value={state?.radius}
                    onChange={(ev, newValue) => {
                        const value = Array.isArray(newValue) ? newValue[0] : newValue;
                        dispatch({ type: "updateRadius", radius: value })
                    }
                    }
                    sx={{
                        marginRight: '15px',
                        transform: 'translateY(40%)',
                    }}
                /> */}
                <Grid container spacing={1}>
                <Grid item xs={4}>
                        <h3>Search Nearest Restaurant</h3>
                </Grid>
                <Grid item xs={4}>
                <Button
                    variant="contained"
                    sx={{
                        width: '45px',
                        height: '45px',
                        marginRight: '15px'
                    }}
                    onClick={() => dispatch({ type: "searchNearby" })}>
                    <SearchOutlinedIcon />
                </Button>
                </Grid>
                <Grid item xs={4}>
                <Button
                    variant="outlined"
                    sx={{
                        width: '45px',
                        height: '45px',
                    }}
                    onClick={() => dispatch({ type: "panToUser" })}>
                    <MyLocationOutlinedIcon />
                </Button>
                </Grid>
                </Grid>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '95%',
                minHeight: '100px',
                padding: '0px 10px',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'primary.main',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderRadius: '5px',
                '&:hover': {
                    borderWidth: '1px',
                },
            }}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <h3>Search by Area</h3>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="country" label="Country or State" variant="outlined" inputRef={countryRef}  />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="city" label="City or Suburb" variant="outlined" inputRef={cityRef} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '45px',
                                height: '45px',
                                marginRight: '15px'
                            }}
                            onClick={() => {handleSearch()}}>
                            <SearchOutlinedIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '95%',
                minHeight: '100px',
                padding: '0px 10px',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'primary.main',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderRadius: '5px',
                '&:hover': {
                    borderWidth: '1px',
                },
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <h3>Search Your Restaurant</h3>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="restaurant" label="Restaurant Name" variant="outlined" value={state.restaurant}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch({ type: "updaterestaurant", restaurant: event.target.value })
                            }
                            } />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '45px',
                                height: '45px',
                                marginRight: '15px'
                            }}
                            onClick={() => dispatch({ type: "searchrestaurant" })}>
                            <SearchOutlinedIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                flexGrow: '1',
                width: '100%',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center",
            }}>
                {state.search ?
                    <CircularProgress size={100} /> :
                    state.places.length > 0 ?
                        <Grid container spacing={2}>
                            {state.places.map((place, id) =>
                                <Grid item key={place.place_id} xs={10}>
                                    <PlaceCard place={place} popular_time={state.popular_times[id]} selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
                                </Grid>
                            )}
                        </Grid> :
                        <Typography variant="h5" component="div">
                            Click on the search button
                        </Typography>
                }
            </Box>
        </Box >
    )
}

export default SideBar;