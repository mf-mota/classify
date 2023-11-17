import { useParams } from "react-router-dom"



export default function Listing() {
    const {id} = useParams()
    return (
        <>
        <div>This is a listing component w/ id: {id} </div>
        </>
    )
}