
export const listingOptions = {
    title: { 
        required: {
            value: true,
            message: "Title is required"
        },
        minLength: {
            value: 5,
            message: "Title is too short"
        },
        pattern: {
            value: /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\'-]+$/,
            message: "Invalid characters in the  title!"
        },
        maxLength: {
            value: 30,
            message: "Title is too long"
        },
     },
     price: { 
        required: {
            value: true,
            message: "Please enter a price"
        },
        min: {
            value: 0,
            message: "Price must be >= 0 PLN"
        },
        max: {
            value: 50000000,
            message: "Price must be <= 50M PLN"
        }
     },
     Engine: {
        required:  {
            value: true,
            message: "Please enter an engine type"
        },
        minLength: {
            value: 3,
            message: "Engine: too short"
        },
        maxLength: {
            value: 10,
            message: "Engine: too long"
        },
        pattern: {
            value: /[0-9][A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\.'-]+$/,
            message: "Engine: Invalid Charachters!"
        },
     },
     Fuel: {
        required: {
            value: true,
            message: "Fuel Required"
        },
        pattern: {
            value: /^(Diesel|Petrol|Hybrid|Electric)$/,
            message: "Fuel must be: Diesel, Petrol, Hybrid or Electric"
        },
     },
     Year: {
        required: {
            value: true,
            message: "Year of make is required"
        },
        pattern: {
            value: /^\d{4}$/,
            message: "Year not valid"
        },
        max: {
            value: 2050,
            message: "Invalud Year",
        },
        min: {
            value: 1900,
            message: "Year must be >= 1900",
        }
     },
     Mileage: {
        required: {
            value: true,
            message: "Mileage is required"
        },
        pattern: {
            value: /^(?:[0-9]|[1-9][0-9]{1,5}|[1-9][0-9]{0,4}[0-9])$/,
            message: "Mileage must be between 0 and 999 999 km"
        },
        min: {
            value: 0,
            message: "Mileage must be between 0 and 999 999 km"
        },
        max: {
            value: 999999,
            message: "Mileage must be between 0 and 999 999 km"
        }
     },
     "Heating Type": {
        required: {
            value: true,
            message: "Heating type is required"
        },
        minLength: 5,
        maxLength: 20
     },
     Rooms: {
        required: {
            value: true,
            message: "Enter a number of rooms"
        },
        min: 0,
        max: 50,
        pattern: {
            value: /^(?:[0-9]|[1-4][0-9]|50)$/,
            message: "No. of rooms is not valid"
        }
     },
     Area: {
        required: {
            value: true,
            message: "Area is required"
        },
        min: 0,
        max: 20000,
        pattern: {
            value: /^(?:[0-9]|[1-9][0-9]{1,4}|10000|20000)$/,
            message: "Area must be a whole number between 0 and 20000"
        }

     }

  }