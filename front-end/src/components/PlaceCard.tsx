import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Rating, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts/Map";
import axios from 'axios';
import { ChartContainer, BarPlot, BarChart } from '@mui/x-charts';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Stepper, Step, StepLabel } from '@mui/material';

interface PlaceCardProps {
    place: google.maps.places.PlaceResult,
    selectedPlace: string,
    setSelectedPlace: any
}

const PlaceCard = ({ place, selectedPlace, setSelectedPlace }: PlaceCardProps) => {

    const [state, dispatch] = useContext(MapContext);
    const [responseData, setResponseData] = useState({ id: '', phone_number: '', populartimes: [], current_popularity: 0, coordinates: { lat: 0, lng: 0 } });
    const [activeStep, setActiveStep] = useState(0);
    const [timeZoneId, settimeZoneId] = useState('Australia/Melbourne');

    const api = axios.create({
        baseURL: 'http://localhost:5000', // Set the base URL to your Flask backend server
    });

    useEffect(() => {
        console.log(responseData)
        console.log(responseData.populartimes)
        console.log(responseData.current_popularity)
    }, [responseData])

    // useEffect(() => console.log(selectedPlace), [selectedPlace])
    fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${responseData.coordinates.lat},${responseData.coordinates.lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            settimeZoneId(res.timeZoneId);
        })

    const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: timeZoneId, hour12: false });
    console.log(currentTime);
    const hour = currentTime.split(":")[0];
    console.log("hour:", hour)


    // Get the current weekday in the specified time zone
    const currentWeekday = new Date().toLocaleDateString("en-US", { timeZone: timeZoneId, weekday: "long" });

    useEffect(() => {
        // Set the activeStep based on the currentWeekday
        if (currentWeekday === "Friday") {
            setActiveStep(4);
        } else if (currentWeekday === "Saturday") {
            setActiveStep(5);
        } else if (currentWeekday === "Sunday") {
            setActiveStep(6);
        } else if (currentWeekday === "Monday") {
            setActiveStep(0);
        } else if (currentWeekday === "Tuesday") {
            setActiveStep(1);
        } else if (currentWeekday === "Wednesday") {
            setActiveStep(2);
        } else {
            setActiveStep(3);
        }
    }, [currentWeekday]);

    const getCurrentPopularity = () => {
        const currentDay = responseData.populartimes?.find((populartime) => populartime.name === currentWeekday);
        if (currentDay) {
            const currentPopularity = currentDay.data[hour];
            return currentPopularity ? currentPopularity : 0;
        }
        return 0;
    };
    const currentPopularity = getCurrentPopularity();
    const getPopularityMessage = () => {
        const diff = Math.abs(responseData.current_popularity - currentPopularity);
        const diffustion = diff/currentPopularity;
        if (diffustion < 0.1) {
            return "As usualy as it get";
        } else if ((diffustion > 0.1 && diffustion < 0.5) && responseData.current_popularity > currentPopularity) {
            return "A little busy";
        } else if ((diffustion > 0.1 && diffustion < 0.5) && responseData.current_popularity < currentPopularity) {
            return "Not busy";
        } else if ((diffustion > 0.5) && responseData.current_popularity > currentPopularity){
            return "Busier than usual";
        } else if ((diffustion > 0.5) && responseData.current_popularity < currentPopularity){
            return "Less busy than usual";
        }
    };

    return (
        <Card onClick={async () => {
            if (state.map && place.geometry?.location) {
                state.map?.setZoom(17);
                state.map?.panTo(place.geometry?.location);
                try {
                    const response = await api.post("/api/getpopulartime", JSON.stringify({
                        "placeId": place.place_id
                    }), {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    setResponseData(response.data.data);
                    setSelectedPlace(response.data.data.id);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        }>
            <CardMedia
                component="img"
                height="200"
                image={place.photos ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 }) : place.icon}
                alt={place.name}
            />
            <CardContent sx={{
                // height: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly"
            }}>
                <Typography noWrap variant="h5" component="div" fontWeight={"bold"}>
                    {place.name}
                </Typography>
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
                <Collapse in={selectedPlace === place.place_id} timeout="auto" unmountOnExit>
                    <Card>

                        <CardContent>
                            {(responseData.current_popularity && responseData.current_popularity > 0) ? (
                            <div>
                                <tr>
                                    <h3>Currently {responseData.current_popularity}% busy and usually {currentPopularity}% busy
                                    </h3>
                                </tr>
                                <tr>
                                    <h3>{getPopularityMessage()}</h3>
                                </tr>
                            </div>
                            ) : (
                            <div>No Live Feed Data</div>
                            )}
                            {(responseData.populartimes && responseData.populartimes.length > 0) ? (
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {responseData.populartimes.map((populartime, pkey) => (
                                        <Step key={pkey}><StepLabel>{populartime.name}</StepLabel></Step>

                                    ))}
                                </Stepper>
                            ) : (
                                <div>No Popular Time!</div>
                            )}
                            {responseData.populartimes && responseData.populartimes.length > 0 && (
                                <div>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        series={[{ data: responseData.populartimes[activeStep].data, label: responseData.populartimes[activeStep].name, type: 'bar' }]}
                                        xAxis={[{ data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], scaleType: 'band' }]}
                                    >
                                        <BarPlot />
                                    </BarChart>
                                    <div>
                                        <Button
                                            // disabled={activeStep === 0}
                                            onClick={() => setActiveStep(activeStep - 1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            disabled={activeStep === responseData.populartimes.length - 1}
                                            onClick={() => setActiveStep(activeStep + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
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


