import axios from 'axios'

export const api= axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params:{
        api_key:'986e036fec76e6eaf2c818cb98f79e71',
        language: "pt-BR",
        include_adults: true,


    },
})