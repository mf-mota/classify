import './App.css'
import ListingsList from './components/ListingsList';
function App() {
  const apiUrl = "http://127.0.0.1:8000/api/listings";
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => console.log(data))
  return (
      <ListingsList />
  )
}

export default App
