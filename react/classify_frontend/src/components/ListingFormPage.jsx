import ListingSteps from "./ListingSteps";
import Step0 from './NewListingSteps/Step0'
import Step1 from './NewListingSteps/Step1'
import Step2 from './NewListingSteps/Step2'
import Step3 from './NewListingSteps/Step3'
import Step4 from './NewListingSteps/Step4'



import { useState } from "react";

export default function ListingFormPage () {
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [listing, setListing] = useState({})

  return (
    <>
      Curr step: {step+1}
      {console.log(listing)}
      {step === 0 ? <Step0 props={{locations, setLocations, categories, setCategories, setStep, setListing}}/> : null}
      {step === 1 ? <Step1 props={{setStep, setListing, listing}}/> : null }
      {step === 2 ? <Step2 props={{setStep, setListing}}/> : null }
      {step === 3 ? <Step3 props={{setStep, setListing}}/> : null }
      {step === 4 ? <Step4 props={{setStep, setListing, listing}}/> : null }
      <ListingSteps activeStep={step} setActiveStep={setStep}/>
    </>
  )
}