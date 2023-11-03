import { Box, TextField, Button, CircularProgress, Grid, Typography } from "@mui/material";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useContext, useState, useRef } from "react";
import { MapContext } from "../contexts/Map";
import PlaceCard from "./PlaceCard";

const SideBar = () => {

    const [state, dispatch] = useContext(MapContext);
    const [selectedPlace, setSelectedPlace] = useState('');

    const searchstrRef = useRef(null);

    const restaurantSearch = () => {

        dispatch({
            type: "updatesearchstr",
            searchstr: searchstrRef.current?.value || ""
        });
        dispatch({ type: "searchrestaurant" });
    };

    return (
        <Box sx={{
            flex: '1',
            minHeight: state.places.length === 0 ? '7%' : 'auto',
            height: state.places.length === 0 ? 'auto' : '100%',
            width: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            padding: '10px',
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            // Set different widths based on screen size
            '@media (min-width: 500px)': { // md and above
                width: '50%',
            },
            '@media (min-width: 960px)': { // lg and above
                width: '30%',
            },
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: 'calc(100% - 20px)',
                minHeight: '7%',
                padding: '',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'primary.main',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderRadius: '5px',
                '&:hover': {
                    borderWidth: '1px',
                },
                bgcolor: 'white',
                marginTop: '10px', // Add margin top
                marginBottom: '10px', // Add margin bottom
            }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>
                        <p>Nearest Bar</p>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '25%',
                                height: '25%',
                                marginRight: '20%'
                            }}
                            onClick={() => dispatch({ type: "searchNearby" })}>
                            <SearchOutlinedIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            sx={{
                                width: '25%',
                                height: '25%',
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
                width: 'calc(100% - 20px)',
                minHeight: '7%',
                padding: '',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'primary.main',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderRadius: '5px',
                '&:hover': {
                    borderWidth: '1px',
                },
                bgcolor: 'white'
            }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.7}>
                        <p>Your Bar</p>
                    </Grid>
                    <Grid item xs={6.3} sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }} >
                        <TextField id="searchstr" label="Search" variant="outlined" inputRef={searchstrRef} />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '50%',
                                height: '50%',
                                marginRight: '20%'
                            }}
                            onClick={() => { restaurantSearch() }}>
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
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            {state.places.map((place, id) =>
                                <Grid item key={place.place_id} xs={10} alignItems="center" justifyContent="center">
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