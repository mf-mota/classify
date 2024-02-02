import ListingSteps from "../NewListingSteps/ListingSteps";
import Step0 from '../NewListingSteps/Step0'
import Step1 from '../NewListingSteps/Step1'
import Step2 from '../NewListingSteps/Step2'
import Step3 from '../NewListingSteps/Step3'
import Step4 from '../NewListingSteps/Step4'
import { useParams } from "react-router-dom";
import api from '../../api/apiConn'
import { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JwtAuthContext from '../../context/JwtAuthContext'

export default function ListingFormPage ({mode}) {
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [listing, setListing] = useState({})
  const {listingId} = useParams()
  const [defVals, setDefVals] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listingUpdated, setListingUpdate] = useState(1)
  const {user} = useContext(JwtAuthContext)

  const groupedPropsComplete = {
    locations, setLocations, categories, setCategories, setStep, setListing, loading, defVals, setLoading
  }

  useEffect(() => {

    const getListingAndPermission = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/listings_all/${listingId}`)
        if (res.data.owner.id !== user.user_id) navigate('/profile')
        setDefVals(res.data)
        setLoading(false)
        console.log("defs", res.data)
      }
      catch (e) {
        console.log("Couldnt retrieve listing")
        navigate('/profile')
      }
    }
    if (listingId) getListingAndPermission()
    console.log("Current yser LFP", user)
  }, [listingId, listingUpdated])

  return defVals || mode == "new" ?
   (
    <>
      Curr step: {step+1}
      {console.log(listing)}
      {step === 0 ? <Step0 props={{...groupedPropsComplete}}/> : null}
      {step === 1 ? <Step1 props={{setStep, setListing, listing, defVals, loading}}/> : null }
      {step === 2 ? <Step2 props={{setStep, setListing, defVals, setListingUpdate}}/> : null }
      {step === 3 ? <Step3 props={{setStep, setListing, defVals}}/> : null }
      {step === 4 ? <Step4 props={{setStep, setListing, listing, defVals}}/> : null }
      <ListingSteps activeStep={step} setActiveStep={setStep}/>
    </>
   ) : <p>Loading...</p>
};