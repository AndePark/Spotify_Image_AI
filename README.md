# Spotify_Image_AI

# NOTES
- Axios returns JSON data in property called data on the response object 

- Higher-order functions are functions that operate on other functions, either by taking them as arguments or by returning them 
    - EX. our higher-order function takes our async function (fetchData()) as an argument and wraps our asynchronous code in a try/catch for us 
    - DONT USE THIS utils.js file... causes problems with our getCurrentUserProfile()

- react-router-dom is installed in our client directory 
    - NOTE: might want to upgrade to v6 of react-router-dom, BUT this doesn't have <Switch> and instead has <Routes>


- When a <Switch> os rendered, it searched through its children <Route> elements to find one whose path matches the current URL 
    - When it finds one, it renders that <Route> and ignores all others... this means you should put <Route> elements with more specific (typically longer) paths before less-specific ones 
    - EX. we need to declare the /playlists/:id route BEFORE /playlists route because if we don't, navigating to a URL like /playlists/abc123 will render the /playlists route since it is technically a match  
    
- Easiest way to test if we set up our router properly is to simply visit all the routes in our browser 

- Functional Update is if the new state is computed using the previous state, you can then pass a funciton to setState
    - The function will receive the previous value and return an updated value 

- useMemo() hook returns a memoized value... think of memoization as caching a value so that it does not need to be recalculated 
    - useMemo hook only runs when one of its dependencies update 


