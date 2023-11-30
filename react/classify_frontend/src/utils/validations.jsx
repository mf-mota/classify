export const signUpOptions = {
    firstName: { 
        required: "First Name cannot be blank",
        minLength: {
            value: 3,
            message: "First Name is too short"
        },
        pattern: {
            value: /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\'-]+$/,
            message: "Invalid characters in the first name!"
        },
        maxLength: {
            value: 30,
            message: "First Name is too long"
        },
     },
     lastName: { 
        required: "Last Name cannot be blank",
        minLength: {
            value: 3,
            message: "Last Name is too short"
        },
        pattern: {
            value: /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\'-]+$/,
            message: "Invalid characters in the first name!"
        },
        maxLength: {
            value: 30,
            message: "Last Name is too long"
        },
     },
    username: {
        required: {
            value: true,
            message: "Username is required"
        },
        minLength: {
            value: 5,
            message: "Username is too short"
        },
        maxLength: {
            value: 30,
            message: "Last Name is too long"
        },
    },
    email: { 
        required: "Email cannot be blank",
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address"
        },
        maxLength: {
            value: 150,
            message: "Invalid email address"
        }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
  }