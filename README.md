# Nearby Restaurants

This is a Single Page Application based on React that uses Google Maps APIs to search and display the restaurants within a radius of the user's location.

It displays their information on the left and their positions on the rights thanks to Google Maps API Markers.

Clicking on the restaurant card pans the map to its location And can view popular times for weeks and current live feed if possible.

## API Keys

This project relies on Google Maps API, you have to [create your own API KEY](https://developers.google.com/maps/documentation/javascript/get-api-key), and use it within the project to run it. Please follow the instructions below to add your own API KEY:

* In the root directory, create a new environment file, called .env
* Copy/Paste the following line:

```bash
REACT_APP_GOOGLE_MAPS_API_KEY = " YOUR_API_KEY_HERE " 
```
Make sure to replace YOUR_API_KEY_HERE with your Google Maps API Key!

## Launch

First, You have to run the scraping Flask server on server directory:

```bash
pip install flask, populartimes
python populartime.py
```
It's running on the [https://localhost:5000](http://localhost:5000)

You have to run from the project directory:

```bash
npm install
```

This would install all the required dependencies.

Once it's done, you can run from the project directory:

```bash
npm start
```

To launch the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Inside the App

Openning the site at the first time will result in something like the picture below:

![First Visit](/front-end/assets/Firstpage.png)

By default, the map assumes that the user is located at Melborune, Australia.

After clicking on the position button, it will pan to the user's actual position. After that click the search button, you can see the 20 restaurant near by you that ranked by recommend:

![Nearby Search](/front-end/assets/SearchNearbyme.png.png)

Then you can insert country and city name to find the restaurant.

![Location Search](/front-end/assets/Searchbylocation.png)

And finally, you can click on a restaurant card to pan towrds its location:

![View Popular Times](/front-end/assets/Viewpopuartimes.png)

![View Live Feed](/front-end/assets/ViewLiveFeed.png)

## Conclusion

I enjoyed working on this project, it was fun using the Google Maps API.
