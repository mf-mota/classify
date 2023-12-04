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
  }