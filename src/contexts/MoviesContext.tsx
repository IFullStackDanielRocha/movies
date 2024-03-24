import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "async_hooks"

type Movie = {
    id: number;
    title: string;
    poster_path: string;
    runtime: string;
    release_date: string;
    vote_average: number;
};


type MovieContextData = {
    favoriteMovies: number[];
    allFavoriteMovies: Movie[];
    addFavoriteMovies: (moveId: number) => void;
    removeFavoriteMovies: (moveId: number) => void;
};



export const MovieContext = createContext<MovieContextData>(
    {

        favoriteMovies: [],
        allFavoriteMovies: [],
        addFavoriteMovies: () => { },
        removeFavoriteMovies: () => { }
    }
);


type MovieProviderProps = {
    children: React.ReactNode;

};


export function MovieProvider({ children }: MovieProviderProps) {

    const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
    const [allFavoriteMovies, setAllFavoriteMovies] = useState<Movie[]>([]);

    useEffect(() => {

        async function loadFavoriteMovies() {
            const favoriteMovies = await AsyncStorage.getItem("@FavoriteMovies");
            if (favoriteMovies) {
                setFavoriteMovies(JSON.parse(favoriteMovies))
            }
        }
        loadFavoriteMovies();
    }, []);




    const addFavoriteMovies = useCallback(
        async (movieId: number) => {
            if (!favoriteMovies.includes(movieId)) {
                const newFavoriteMovies = [...favoriteMovies, movieId];
                setFavoriteMovies(newFavoriteMovies);
                await AsyncStorage.setItem("@FavoriteMovies",
                    JSON.stringify(newFavoriteMovies))
            }
        }, [favoriteMovies]
    );

    const removeFavoriteMovies = useCallback(
        async (movieId: number) => {
            const newFavoriteMovies = favoriteMovies.filter(id=>id !== movieId);
            setFavoriteMovies(newFavoriteMovies);
            await AsyncStorage.setItem("@FavoriteMovies",
            JSON.stringify(newFavoriteMovies));
        }, [favoriteMovies]
    );


    const contextData: MovieContextData={
        favoriteMovies,
        allFavoriteMovies,
        addFavoriteMovies,
        removeFavoriteMovies,
    };
    return(
        <MovieContext.Provider value={contextData}>
            {children}
        </MovieContext.Provider>
    );
}