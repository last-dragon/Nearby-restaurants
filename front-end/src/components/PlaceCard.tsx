import { Button, Card, CardContent, CardMedia, Collapse, Grid, Rating, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts/Map";
import { BarPlot, BarChart } from '@mui/x-charts';
import Lottie from 'react-lottie';

import fireAnimationData from './../lottie/fire1.json';
import coldAnimationData from './../lottie/ice.json';

interface PlaceCardProps {
    place: google.maps.places.PlaceResult,
    popular_time: any,
    selectedPlace: string,
    setSelectedPlace: any
}
const fireAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: fireAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const coldAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: coldAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PlaceCard = ({ place, popular_time, selectedPlace, setSelectedPlace }: PlaceCardProps) => {

    const handleCardClick = (placeId: string) => {
        setSelectedPlace((prevSelectedPlace) =>
            prevSelectedPlace === placeId ? null : placeId
        );
    };

    const [state, dispatch] = useContext(MapContext);
    const [activeStep, setActiveStep] = useState(0);
    const [timeZoneId, settimeZoneId] = useState('Australia/Melbourne');

    useEffect(() => {
        fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${popular_time.coordinates.lat},${popular_time.coordinates.lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                settimeZoneId(res.timeZoneId);
            })
    }, [])

    const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: timeZoneId, hour12: false });
    // console.log(currentTime);
    const hour = currentTime.split(":")[0];
    // console.log("hour:", hour)


    // Get the current weekday in the specified time zone
    const currentWeekday = new Date().toLocaleDateString("en-US", { timeZone: timeZoneId, weekday: "long" });

    // console.log(currentWeekday);
    const [selectedDay, setSelectedDay] = useState(activeStep); // Default to Sunday or any other day you prefer

    const handleDayChange = (event) => {
        setSelectedDay(event);
    };

    useEffect(() => {
        // Set the activeStep based on the currentWeekday
        if (currentWeekday === "Fri") {
            setSelectedDay(5);
        } else if (currentWeekday === "Sat") {
            setSelectedDay(6);
        } else if (currentWeekday === "Sun") {
            setSelectedDay(0);
        } else if (currentWeekday === "Mon") {
            setSelectedDay(1);
        } else if (currentWeekday === "Tue") {
            setSelectedDay(2);
        } else if (currentWeekday === "Wed") {
            setSelectedDay(3);
        } else {
            setSelectedDay(4);
        }
    }, [currentWeekday]);

    const xAxisData = ['0', '', '', '3', '', '', '6', '', '', '9', '', '', '12', '', '', '15', '', '', '18', '', '', '21', '', '', ''];

    const secondAxisData = ['0', '', '', '3', '', '', '6', '', '', '9', '', '', '12', '', '', '15', '', '', '18', '', '', '21', '', '', ''];


    const getCurrentPopularity = () => {
        const currentDay = popular_time.populartimes?.find((populartime) => populartime.name === currentWeekday);
        if (currentDay) {
            const currentPopularity = currentDay.data[hour];
            return currentPopularity ? currentPopularity : 0;
        }
        return 0;
    };
    const currentPopularity = getCurrentPopularity();
    const getPopularityMessage = () => {
        const diff = Math.abs(popular_time.current_popularity - currentPopularity);
        const diffustion = diff / currentPopularity;
        if (diffustion < 0.1) {
            return "As usualy as it get";
        } else if ((diffustion > 0.1 && diffustion < 0.5) && popular_time.current_popularity > currentPopularity) {
            return "A little busy";
        } else if ((diffustion > 0.1 && diffustion < 0.5) && popular_time.current_popularity < currentPopularity) {
            return "Not busy";
        } else if ((diffustion > 0.5) && popular_time.current_popularity > currentPopularity) {
            return "Busier than usual";
        } else if ((diffustion > 0.5) && popular_time.current_popularity < currentPopularity) {
            return "Less busy than usual";
        }
    };

    const getAnimationOptions = () => {
        if (popular_time.current_popularity && popular_time.current_popularity > 50) {
            return fireAnimationOptions;
        } else if (popular_time.current_popularity && popular_time.current_popularity < 50) {
            return coldAnimationOptions;
        } else if (!popular_time.current_popularity && currentPopularity > 50) {
            return fireAnimationOptions;
        } else {
            return coldAnimationOptions;
        }
    };

    return (
        <Card onClick={async () => {
            handleCardClick(place.place_id);
            if (state.map && place.geometry?.location) {
                state.map?.setZoom(20);
                state.map?.panTo(place.geometry?.location);
            }
        }
        }>

            <CardMedia
                component="img"
                height="200"
                image={place.photos ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 }) : place.icon}
                alt={place.name}
            />
            <Typography noWrap variant="h5" component="div" fontWeight={"bold"}>
                {place.name}
            </Typography>
            <CardContent sx={{
                // height: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly"
            }}>
                <Card>

                    <CardContent>

                        {(popular_time.current_popularity && popular_time.current_popularity > 0) ? (
                            <div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h3><Lottie options={getAnimationOptions()} height={50} width={50} />Currently {popular_time.current_popularity}% busy and usually {currentPopularity}% busy now
                                                </h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4 style={{ color: 'red' }}>Live Feed : </h4><h3>{getPopularityMessage()}</h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {<h3><Lottie options={getAnimationOptions()} height={50} width={50} />Usually {currentPopularity}% busy now</h3>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h3>No Live Feed Data</h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </CardContent>
                </Card>


                <Collapse in={selectedPlace === place.place_id} timeout="auto" unmountOnExit>
                    <Card>

                        <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Rating name="read-only" value={place.rating} precision={0.1} readOnly sx={{ marginRight: '5px' }} />
                                <span>({place.user_ratings_total})</span>
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary" sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <MapIcon sx={{ marginRight: '5px' }} />
                                <span >{place.vicinity}</span>
                            </Typography>
                            {(popular_time.populartimes && popular_time.populartimes.length > 0) ? (
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <h3 style={{ color: 'green' }}>Popular times</h3>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div>
                                                {daysOfWeek.map((day, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="contained"
                                                        color={selectedDay === index ? "secondary" : "success"}
                                                        sx={{
                                                            fontSize: '0.8rem', // Adjust the font size as needed
                                                            padding: '8px', // Adjust the padding as needed
                                                            width: '10px',
                                                            '@media (max-width: 960px)': { // Apply styles for mobile devices
                                                                fontSize: '0.6rem', // Adjust the font size for mobile devices
                                                                padding: '6px', // Adjust the padding for mobile devices
                                                                width: '5px'
                                                            },
                                                            '@media (max-width: 500px)': { // Apply styles for mobile devices
                                                                fontSize: '0.4rem', // Adjust the font size for mobile devices
                                                                padding: '4px', // Adjust the padding for mobile devices
                                                                width: '3px'
                                                            },
                                                        }}
                                                        onClick={(e) => {
                                                            handleDayChange(index);
                                                            e.stopPropagation()
                                                        }}

                                                    >
                                                        {day}
                                                    </Button>
                                                ))}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            ) : (
                                <div>No Popular Time!</div>
                            )}
                            {popular_time.populartimes && popular_time.populartimes.length > 0 && (
                                <div style={{ width: '100%', height: '300px' }}>
                                    <BarChart
                                        width={270}
                                        height={300}
                                        series={[{ data: popular_time.populartimes[(selectedDay + 6) % 7].data, label: popular_time.populartimes[(selectedDay + 6) % 7].name, type: 'bar' }]}
                                        xAxis={[{ 
                                            data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], scaleType: 'band', tickFontSize: 8 }]}
                                    >
                                        <BarPlot />
                                    </BarChart>
                                </div>
                            )}
                        </CardContent>

                    </Card>
                </Collapse>
            </CardContent>
        </Card>
    )
}

export default PlaceCard;


